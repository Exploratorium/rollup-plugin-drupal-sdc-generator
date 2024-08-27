import { jest } from '@jest/globals';
import { describe, expect, test } from '@jest/globals';

import drupalSdcGenerator from './index.js';

describe('drupalSdcGenerator', () => {
  test('plugin has a name', () => {
    const instance = drupalSdcGenerator();

    expect(instance).toHaveProperty('name');
  });

  test('generates a bundle', async () => {
    const instance = {
      ...console,
      debug: () => {},
      ...drupalSdcGenerator(),
    };
    instance.emitFile = jest.fn();

    const options = {
      // eslint-disable-next-line no-undef
      dir: process.cwd(),
    };

    const bundle = {
      'baz.js': { isEntry: true, name: 'baz', type: 'chunk' },
      'styles.css': { isEntry: undefined, name: 'styles.css', type: 'asset' },
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
