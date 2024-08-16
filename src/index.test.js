import { exec } from 'node:child_process';
import { readFile, rm, stat } from 'node:fs/promises';

import { jest } from '@jest/globals';

import drupalSdcGenerator from './index.js';

describe('drupalSdcGenerator', () => {
  test('plugin has a name', () => {
    const instance = drupalSdcGenerator();
    expect(instance).toHaveProperty('name');
  });

  test('generates a bundle', async () => {
    const instance = drupalSdcGenerator();
    instance.emitFile = jest.fn();

    const options = {
      // eslint-disable-next-line no-undef
      dir: process.cwd(),
    };

    const bundle = {
      'baz.js': { isEntry: true, name: 'baz', type: 'chunk' },
    };

    await instance.generateBundle(options, bundle);

    expect(instance.emitFile).toHaveBeenCalledTimes(2);

    ['baz.component.yml', 'baz.twig'].forEach((fileName) => {
      expect(instance.emitFile).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'asset',
          fileName,
          source: expect.any(String),
        }),
      );
    });
  });
});

describe('examples', () => {
  const beforeEachGroup = (group) => {
    beforeEach(async () => {
      await new Promise((resolve, reject) => {
        exec(`npm install && npm run build`, (error) => {
          if (error) {
            reject(error);
          }
          resolve();
        });
      });

      const nodeModules = `examples/${group}/node_modules`;
      try {
        await stat(nodeModules);
        await rm(nodeModules, { recursive: true });
      } catch (error) {
        if (error.code !== 'ENOENT') {
          throw error;
        }
      }

      const packageLock = `examples/${group}/package-lock.json`;
      try {
        await stat(nodeModules);
        await rm(packageLock);
      } catch (error) {
        if (error.code !== 'ENOENT') {
          throw error;
        }
      }
    });
  };

  const testCanBuild = (group) => {
    test(`can build the "${group}" example`, async () => {
      await new Promise((resolve, reject) => {
        exec(
          `cd examples/${group} && npm install && npm run build`,
          (error) => {
            if (error) {
              reject(error);
            }
            resolve();
          },
        );
      });

      const sdc = `examples/${group}/components/my-component`;
      expect(async () => await stat(sdc)).not.toThrow();

      expect(
        async () => await stat(`${sdc}/my-component.component.yml`),
      ).not.toThrow();
      expect(async () => await stat(`${sdc}/my-component.js`)).not.toThrow();
      expect(async () => await stat(`${sdc}/my-component.twig`)).not.toThrow();

      const yamlFilePath = `${sdc}/my-component.component.yml`;
      const content = await readFile(yamlFilePath, 'utf8');
      expect(content).toMatch(/\n\s*name:\s+My Component\n/);
    });
  };

  describe('react', () => {
    beforeEachGroup('react');
    testCanBuild('react');
  });

  describe('vanilla', () => {
    beforeEachGroup('vanilla');
    testCanBuild('vanilla');
  });
});
