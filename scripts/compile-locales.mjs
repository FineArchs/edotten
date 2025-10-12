import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import yaml from 'js-yaml';

const localesDir = 'locales';
const outputDir = 'public/locales';

async function compileLocales() {
  try {
    // Ensure output directory exists
    await mkdir(outputDir, { recursive: true });

    const files = await readdir(localesDir);

    for (const file of files) {
      if (path.extname(file) === '.yaml' || path.extname(file) === '.yml') {
        const filePath = path.join(localesDir, file);
        const fileContents = await readFile(filePath, 'utf8');
        const data = yaml.load(fileContents);

        const outputFileName = `${path.basename(file, path.extname(file))}.json`;
        const outputFilePath = path.join(outputDir, outputFileName);

        await writeFile(outputFilePath, JSON.stringify(data, null, 2));
        console.log(`Compiled ${filePath} to ${outputFilePath}`);
      }
    }
  } catch (err) {
    console.error('Error compiling locales:', err);
    process.exit(1);
  }
}

compileLocales();
