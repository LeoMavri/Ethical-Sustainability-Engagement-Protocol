import { readdir } from 'fs';
import KeyWords from './keywords.js';

import { PdfReader } from 'pdfreader';

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
        console.warn(`Skipping file: ${file}`);
        continue;
      }
      console.log(`Reading file: ${file}`);

      reader.parseFileItems(`./pdfs/${file}`, async (err, item) => {
        if (err) {
          console.error('Error reading file', err);
          return;
        }

        if (!item) {
          // end of file
          return;
        }

        if (!item.text) {
          // empty item
          return;
        }

        for (const [category, keywords] of Object.entries(KeyWords)) {
          for (const keyword of keywords) {
            if (item.text.includes(keyword)) {
              console.log(`Found keyword '${keyword}' in category '${category}'`);
            }
          }
        }
      });
    }
  });
}

main();
