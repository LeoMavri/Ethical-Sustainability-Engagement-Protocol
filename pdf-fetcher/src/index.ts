import type { FullTextRetrieval } from './full-text-types.js';
import type { SearchResults } from './search-types.js';

import Constants from './constants.js';

import get from 'axios';
import Bottleneck from 'bottleneck';
import { writeFile } from 'node:fs/promises';
import axios from 'axios';

const limiter = new Bottleneck({
  minTime: 750, // Minimum time between job starts is 500ms
});

const { ApiKey, QueryString, ItemsPerQuery, UpperLimit } = Constants;

const SavedItems: {
  doi: string;
  year: number;
}[] = [];

let VariableCount = ItemsPerQuery;

// add middleware to axios in case it errors

axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 429) {
      console.log('Rate limit exceeded, waiting for 2 seconds');
      await new Promise(resolve => setTimeout(resolve, 2_000));
      return axios.request(error.config);
    }

    if (error.response?.status === 400) {
      VariableCount -= 10;
      console.log(`Reducing items per query to ${VariableCount}`);
      console.debug(error.response.data);
      const url = new URL(error.config.url);
      url.searchParams.set('count', VariableCount.toString());
      error.config.url = url.toString();
      console.log(url.toString());
      return await limiter.schedule(() => axios.request(error.config));
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

  while (currentCount <= UpperLimit) {
    url.searchParams.set('start', currentCount.toString());

    const response = await limiter.schedule(() => get<SearchResults>(url.toString()));

    const { data } = response;
    const result = data['search-results'];

    console.log(`Got ${result.entry.length.toLocaleString()} results on this page`);

    for (const entry of result.entry) {
      const doi = entry['prism:doi'];
      const date = new Date(entry['prism:coverDate']);
      const year = date.getFullYear();

      SavedItems.push({ doi, year });
    }

    if (parseInt(result['opensearch:totalResults']) <= currentCount + VariableCount) {
      console.log(`Fetched all ${SavedItems.length.toLocaleString()} items`);
      break;
    }

    currentCount += VariableCount;
  }

  console.log(`Fetched ${SavedItems.length.toLocaleString()} items`);

  const time = Date.now();

  await writeFile(
    `./result/${time}-${SavedItems.length}-${QueryString}.json`,
    JSON.stringify(SavedItems, null, 2),
    'utf-8'
  );

  console.log(`Saved to ./result/${time}-${SavedItems.length}-${QueryString}.json`);
}

process.on('unhandledRejection', (reason, promise) => {
  console.error(reason);
  process.exit(1);
});

process.on('uncaughtException', error => {
  console.error(error);
  process.exit(1);
});

main();
