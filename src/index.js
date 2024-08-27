import { readdir, readFile } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const FILE_PATH = fileURLToPath(import.meta.url);
const DIRECTORY_NAME = dirname(FILE_PATH);

function drupalSdcGenerator({ directory: _directory } = {}) {
  const directory = _directory || join(DIRECTORY_NAME, '../templates');

  return {
    name: 'rollup-plugin-drupal-sdc-generator',
    async generateBundle(options, bundle) {
      for (const fileName in bundle) {
        const { isEntry, name, type } = bundle[fileName];
        this.debug(
          `Working on ${fileName} isEntry=${isEntry}, name=${name}, type=${type}`,
        );

        if (fileName === 'style.css') {
          this.debug({
            message: `Renaming ${fileName} to ${basename(options.dir)}.css`,
          });
          bundle[fileName].fileName = `${basename(options.dir)}.css`;
          continue;
        }

        if (type !== 'chunk' || !isEntry) {
          this.debug({ message: `Skipping ${fileName}` });
          continue;
        }

        const templateDirectory =
          typeof directory === 'object' ? directory[name] : directory;
        const files = await readdir(templateDirectory);

        await Promise.all(
          files.map(async (file) => {
            const source = await readFile(
              join(templateDirectory, file),
              'utf8',
            );

            const emittedFileName = join(
              dirname(fileName),
              file.replace('[name]', name),
            );

            const emittedSource = source
              .replaceAll(/(?<!\[)\[name](?!])/g, name)
              .replaceAll(/\[\[name]]/g, '[name]');

            const emittedFile = {
              type: 'asset',
              fileName: emittedFileName,
              source: emittedSource,
            };

            this.debug({
              message: `Emitting ${fileName} => ${emittedFile.fileName}`,
            });
            this.emitFile(emittedFile);
          }),
        );
      }
    },
  };
}

export default drupalSdcGenerator;
