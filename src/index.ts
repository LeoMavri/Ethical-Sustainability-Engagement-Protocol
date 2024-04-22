import { readdir } from 'fs';
import KeyWords from './keywords.js';

import { PdfReader } from 'pdfreader';

async function readContent(file: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new PdfReader({ debug: false });
    let text = '';

    reader.parseFileItems(file, async (err, item) => {
      if (err) {
        reject(err);
        return;
      }

      if (!item) {
        // end of file
        resolve(text);
        return;
      }

      if (!item.text) {
        // empty item
        return;
      }

      text += `${item.text} `;
    });
  });
}

async function main() {
  const reader = new PdfReader({ debug: false });

  // make all of the keywords lowercase for more performance
  for (const [category, keywords] of Object.entries(KeyWords)) {
    KeyWords[category] = keywords.map(keyword => keyword.toLowerCase());
  }

  readdir('./pdfs', async (err, files) => {
    if (err) {
      console.error('Could not list the directory.', err);
      process.exit(1);
    }

    if (files.length === 0) {
      console.error('No PDF files found in the directory.');
      process.exit(1);
    }

    for (const file of files) {
      if (!file.endsWith('.pdf')) {
        console.warn(`Skipping file: '${file}'`);
        continue;
      }
      console.log(`Reading file: '${file}'`);

      const content = await readContent(`./pdfs/${file}`);

      console.log(`Read ${content.length.toLocaleString()} characters from file '${file}'`);

      console.log(content);

      for (const [category, keywords] of Object.entries(KeyWords)) {
        for (const keyword of keywords) {
          if (content.includes(keyword)) {
            console.log(`Found keyword '${keyword}' in category '${category}'`);
          }
        }
      }
    }
  });
}

main();
