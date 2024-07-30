import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

function vitePluginDrupalSdcGenerator({ directory: _directory } = {}) {
  // eslint-disable-next-line no-undef
  const directory = _directory || join(__dirname, 'templates');

  return {
    name: 'vite-plugin-drupal-sdc-generator',
    generateBundle(options, bundle) {
      for (const fileName in bundle) {
        if (bundle[fileName].type !== 'chunk') {
          continue;
        }
        if (bundle[fileName].isEntry) {
          const { name } = bundle[fileName];
          const files = readdirSync(directory);

          files.forEach((file) => {
            const source = readFileSync(join(directory, file), 'utf8');

            let emittedFile = {
              type: 'asset',
              fileName: join(dirname(fileName), file.replace('[name]', name)),
              source,
            };
            this.emitFile(emittedFile);
          });
        }
      }
    },
  };
}

export default vitePluginDrupalSdcGenerator;
