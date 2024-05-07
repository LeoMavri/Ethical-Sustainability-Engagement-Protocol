import { readFile, readdir, writeFile } from 'node:fs/promises';
import Bottleneck from 'bottleneck';

import Constants from './constants.js';
import axios from 'axios';
import { FullTextRetrieval } from './full-text-types';

const { ApiKey } = Constants;

const limiter = new Bottleneck({
  minTime: 110,
});

axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 429) {
      console.log('Rate limit exceeded, waiting for 1 second');
      await new Promise(resolve => setTimeout(resolve, 1_000));
      return axios.request(error.config);
    }

    throw error;
  }
);

async function main(): Promise<void> {
  const files = await readdir('./result');

  for (const file of files) {
    const content = await readFile(`./result/${file}`, 'utf-8');
    const year = parseInt(file.split('-')[3], 10);

    console.log(`Extracting text for year ${year}`);

    const YearResult: {
      doi: string;
      title: string;
      year: number;
      content: string | '';
      description: string;
    }[] = [];

    const json: {
      doi: string;
      title: string;
      year: number;
    }[] = JSON.parse(content);

    let counter = 0;
    let closedAccess = 0;

    await Promise.all(
      json.map(async article => {
        const { doi, title, year } = article;

        const url = new URL(`https://api.elsevier.com/content/article/doi/${doi}`);
        url.searchParams.append('apiKey', ApiKey);
        url.searchParams.append('httpAccept', 'application/json');

        let response = null;
        try {
          response = await limiter.schedule(() => axios.get<FullTextRetrieval>(url.toString()));
        } catch (err) {
          console.error(`[${doi}] ${err.message}`);
          return;
        }

        console.log(`[${++counter}] Fetched article ${doi} from ${year}`);

        const d: FullTextRetrieval = response.data;
        const data = d['full-text-retrieval-response'];

        if (typeof data['originalText'] !== 'string') {
          console.log(`[${doi}] ${data.coredata.openaccess}`);
          console.log('Article is not open access, skipping\n');
          ++closedAccess;

          YearResult.push({
            doi,
            title,
            year,
            content: '',
            description: data['dc:description'],
          });
        } else {
          const content = data['originalText'];

          YearResult.push({
            doi,
            title,
            year,
            content,
            description: data['dc:description'],
          });

          console.log(`[${doi}] Fetched ${content.length.toLocaleString()} characters\n`);
        }
      })
    );

    await writeFile(`./full-text/${year}.json`, JSON.stringify(YearResult, null, 2), 'utf-8');
    console.log(`Finished extracting text for year ${year}\n`);
    console.log(
      `Closed access articles: ${closedAccess.toLocaleString()} / ${json.length.toLocaleString()} (${((closedAccess / json.length) * 100).toFixed(2)}%)\n`
    );
  }
}

main();
