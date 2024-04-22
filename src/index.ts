import { readdir } from 'fs';
import KeyWords, { PointsGiven } from './keywords';

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

const { FirstFind, OtherFind, MoreThanThree, CategoryNeeded } = PointsGiven;

async function main() {
  for (const [category, keywords] of Object.entries(KeyWords)) {
    KeyWords[category] = keywords.map(kw => kw.toLowerCase());
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

    const foundKeywords = new Set<string>();
    const pointsPerCategory = new Map<string, number>();

    for (const file of files) {
      console.log();
      if (!file.endsWith('.pdf')) {
        console.warn(`Skipping file: '${file}'`);
        continue;
      }
      console.log(`Reading file: '${file}'`);

      const content = await readContent(`./pdfs/${file}`);

      console.log(`Read ${content.length.toLocaleString()} characters from file '${file}'\n`);

      for (const categoryName of Object.keys(KeyWords)) {
        pointsPerCategory.set(categoryName, 0);
      }

      for (const kw of foundKeywords) {
        foundKeywords.delete(kw);
      }

      for (const [category, keywords] of Object.entries(KeyWords)) {
        for (const keyword of keywords) {
          let count = (content.match(new RegExp(keyword, 'gi')) || []).length;

          if (count === 0) {
            continue;
          }

          console.log(`Found keyword '${keyword}' in category '${category}' ${count} times`);

          if (count >= 3) {
            pointsPerCategory.set(category, pointsPerCategory.get(category)! + MoreThanThree);
          }

          pointsPerCategory.set(category, pointsPerCategory.get(category)! + FirstFind);
          --count;

          if (count > 0) {
            pointsPerCategory.set(category, pointsPerCategory.get(category)! + count * OtherFind);
          }
        }

        if (pointsPerCategory.get(category) >= CategoryNeeded) {
          console.log(
            `Category '${category}' has received ${pointsPerCategory.get(category)} points, thus it matched`
          );
        } else {
          console.debug(`Category '${category}' has ${pointsPerCategory.get(category)} points\n`);
        }
      }
    }
  });
}

main();
