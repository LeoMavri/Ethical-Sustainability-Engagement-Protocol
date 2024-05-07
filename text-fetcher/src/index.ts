import type { FullTextRetrieval } from './full-text-types.js';
import type { SearchResults } from './search-types.js';

import Constants from './constants.js';

import get from 'axios';
import Bottleneck from 'bottleneck';
import { writeFile } from 'node:fs/promises';
import axios from 'axios';

const limiter = new Bottleneck({
  minTime: 550, // Minimum time between job starts is 550ms
});

const { ApiKey, QueryString, ItemsPerQuery, UpperLimit, StartYear, EndYear } = Constants;

const SavedItems: {
  doi: string;
  year: number;
  title: string;
}[] = [];

axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 429) {
      console.log('Rate limit exceeded, waiting for 2 seconds');
      await new Promise(resolve => setTimeout(resolve, 2_000));
      return axios.request(error.config);
    }

    throw error;
  }
);

async function main() {
  if (!ApiKey) {
    console.error('API key is missing');
    process.exit(1);
  }

  if (ItemsPerQuery > 100) {
    console.error('Items per query cannot be more than 100');
    process.exit(1);
  }

  if (!QueryString) {
    console.error('Query string is missing');
    process.exit(1);
  }

  let currentCount = 0;

  const url = new URL('https://api.elsevier.com/content/search/sciencedirect');
  url.searchParams.append('query', QueryString);
  url.searchParams.append('apiKey', ApiKey);
  url.searchParams.append('httpAccept', 'application/json');
  url.searchParams.append('count', ItemsPerQuery.toString());

  if (StartYear === EndYear) {
    url.searchParams.append('date', `${StartYear}`);
    console.log(`Fetching items from ${StartYear} only.`);
  } else {
    url.searchParams.append('date', `${StartYear}-${EndYear}`);
    console.log(`Fetching items from ${StartYear} to ${EndYear}.`);
  }

  const time = Date.now();
  let count = 0;

  console.log(`Fetching items from ${currentCount} to ${UpperLimit}...`);
  console.debug(`URL: ${url.toString()}`);

  while (currentCount <= UpperLimit) {
    url.searchParams.set('start', currentCount.toString());

    let response = null;

    try {
      response = await limiter.schedule(() => get<SearchResults>(url.toString()));
    } catch (err) {
      console.error(`Failed to fetch items: ${err.message}`);

      await writeFile(
        `./result/${time}-${SavedItems.length}-${StartYear}-${EndYear}-Partial.json`,
        JSON.stringify(SavedItems, null, 2),
        'utf-8'
      );

      return;
    }

    const { data } = response;
    const result = data['search-results'];

    console.log(
      `[${++count}] Got ${result.entry.length.toLocaleString()} (${result['opensearch:totalResults']}) results on this page`
    );

    for (const entry of result.entry) {
      const doi = entry['prism:doi'];
      const title = entry['dc:title'];
      const date = new Date(entry['prism:coverDate']);
      const year = date.getFullYear();

      SavedItems.push({ doi, year, title });
    }

    if (parseInt(result['opensearch:totalResults']) <= currentCount + ItemsPerQuery) {
      console.log(`Fetched all ${SavedItems.length.toLocaleString()} items`);
      break;
    }

    currentCount += ItemsPerQuery;
  }

  console.log(`Fetched ${SavedItems.length.toLocaleString()} items`);

  await writeFile(
    `./result/${time}-${SavedItems.length}-${StartYear}-${EndYear}.json`,
    JSON.stringify(SavedItems, null, 2),
    'utf-8'
  );

  console.log(`Saved to ./result/${time}-${SavedItems.length}-${StartYear}-${EndYear}.json`);
}

process.on('unhandledRejection', (reason, promise) => {
  console.error(reason);
  console.error(promise);
  process.exit(1);
});

process.on('uncaughtException', error => {
  console.error(error);
  process.exit(1);
});

main();
