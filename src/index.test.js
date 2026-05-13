import { jest } from '@jest/globals';

import drupalSdcGenerator from './index.js';

describe('drupalSdcGenerator', () => {
  const options = {
    dir: 'baz',
  };

  const bundle = {
    'baz.js': { isEntry: true, name: 'baz', type: 'chunk' },
    'style.css': {
      isEntry: undefined,
      name: 'style.css',
      type: 'asset',
    },
  };

  describe('plugin configuration', () => {
    test('plugin has a name', () => {
      const instance = {
        ...console,
        debug: () => {},
        ...drupalSdcGenerator(),
      };
      expect(instance).toHaveProperty('name');
      expect(instance.name).toBe('rollup-plugin-drupal-sdc-generator');
    });
  });

  describe('default behavior', () => {
    test('uses default label "My Component" when no label option provided', async () => {
      const instance = {
        ...console,
        debug: () => {},
        emitFile: jest.fn(),
        ...drupalSdcGenerator(),
      };

      await instance.generateBundle(options, bundle);

      expect(instance.emitFile).toHaveBeenCalledWith(
        expect.objectContaining({
          source: expect.stringContaining('My Component'),
        }),
      );
    });

    ['baz.component.yml', 'baz.twig'].forEach((fileName) => {
      test(`generateBundle emits ${fileName}`, async () => {
        const instance = {
          ...console,
          debug: () => {},
          emitFile: jest.fn(),
          ...drupalSdcGenerator(),
        };

        await instance.generateBundle(options, bundle);

        expect(instance.emitFile).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'asset',
            fileName,
            source: expect.any(String),
          }),
        );
      });
    });

    test('generateBundle renames style.css to {component_name}.css', async () => {
      const instance = {
        ...console,
        debug: () => {},
        emitFile: jest.fn(),
        ...drupalSdcGenerator(),
      };

      await instance.generateBundle(options, bundle);

      expect(bundle['style.css'].fileName).toEqual('baz.css');
    });
  });

  describe('label option', () => {
    test('uses custom label when label is a string', async () => {
      const customLabel = 'Best SDC ever!';
      const instance = {
        ...console,
        debug: () => {},
        emitFile: jest.fn(),
        ...drupalSdcGenerator({ label: customLabel }),
      };

      await instance.generateBundle(options, bundle);

      expect(instance.emitFile).toHaveBeenCalledWith(
        expect.objectContaining({
          source: expect.stringContaining(customLabel),
        }),
      );
    });

    test('uses component-specific label when label is an object', async () => {
      const labelMap = {
        baz: 'Baz Component',
        foo: 'Foo Component',
      };
      const instance = {
        ...console,
        debug: () => {},
        emitFile: jest.fn(),
        ...drupalSdcGenerator({ label: labelMap }),
      };

      await instance.generateBundle(options, bundle);

      expect(instance.emitFile).toHaveBeenCalledWith(
        expect.objectContaining({
          source: expect.stringContaining('Baz Component'),
        }),
      );
    });

    test('handles multiple components with different labels', async () => {
      const labelMap = {
        baz: 'Baz Component',
        qux: 'Qux Component',
      };
      const multiBundle = {
        'baz.js': { isEntry: true, name: 'baz', type: 'chunk' },
        'qux.js': { isEntry: true, name: 'qux', type: 'chunk' },
      };
      const instance = {
        ...console,
        debug: () => {},
        emitFile: jest.fn(),
        ...drupalSdcGenerator({ label: labelMap }),
      };

      await instance.generateBundle(options, multiBundle);

      const calls = instance.emitFile.mock.calls;
      const bazCalls = calls.filter((call) => call[0].fileName.includes('baz'));
      const quxCalls = calls.filter((call) => call[0].fileName.includes('qux'));

      expect(bazCalls.some((c) => c[0].source.includes('Baz Component'))).toBe(
        true,
      );
      expect(quxCalls.some((c) => c[0].source.includes('Qux Component'))).toBe(
        true,
      );
    });
  });

  describe('template variable replacement', () => {
    test('replaces [name] with component name in file content', async () => {
      const instance = {
        ...console,
        debug: () => {},
        emitFile: jest.fn(),
        ...drupalSdcGenerator(),
      };

      await instance.generateBundle(options, bundle);

      expect(instance.emitFile).toHaveBeenCalledWith(
        expect.objectContaining({
          source: expect.stringContaining('baz.js'),
        }),
      );
    });

    test('replaces [label] with label value in file content', async () => {
      const instance = {
        ...console,
        debug: () => {},
        emitFile: jest.fn(),
        ...drupalSdcGenerator({ label: 'Custom Label' }),
      };

      await instance.generateBundle(options, bundle);

      expect(instance.emitFile).toHaveBeenCalledWith(
        expect.objectContaining({
          source: expect.stringContaining('Custom Label'),
        }),
      );
    });

    test('replaces [name] in filename tokens', async () => {
      const instance = {
        ...console,
        debug: () => {},
        emitFile: jest.fn(),
        ...drupalSdcGenerator(),
      };

      await instance.generateBundle(options, bundle);

      expect(instance.emitFile).toHaveBeenCalledWith(
        expect.objectContaining({
          fileName: 'baz.component.yml',
        }),
      );
      expect(instance.emitFile).toHaveBeenCalledWith(
        expect.objectContaining({
          fileName: 'baz.twig',
        }),
      );
    });
  });

  describe('directory option', () => {
    test('uses custom directory when directory is a string', async () => {
      const customDir = 'examples/vanilla/vite/my-component';
      const customBundle = {
        'my-component.js': {
          isEntry: true,
          name: 'my-component',
          type: 'chunk',
        },
      };
      const instance = {
        ...console,
        debug: () => {},
        emitFile: jest.fn(),
        ...drupalSdcGenerator({ directory: customDir }),
      };

      await instance.generateBundle(options, customBundle);

      // Should emit files from the custom directory
      expect(instance.emitFile).toHaveBeenCalledWith(
        expect.objectContaining({
          fileName: 'my-component.component.yml',
        }),
      );

      // Custom directory has different content than default templates
      const ymlCall = instance.emitFile.mock.calls.find((call) =>
        call[0].fileName.includes('.component.yml'),
      );
      expect(ymlCall[0].source).toMatch(/10\.1\.x/);
    });

    test('uses component-specific directory when directory is an object', async () => {
      const directoryMap = {
        baz: 'templates',
        'my-component': 'examples/vanilla/vite/my-component',
      };
      const multiBundle = {
        'baz.js': { isEntry: true, name: 'baz', type: 'chunk' },
        'my-component.js': {
          isEntry: true,
          name: 'my-component',
          type: 'chunk',
        },
      };
      const instance = {
        ...console,
        debug: () => {},
        emitFile: jest.fn(),
        ...drupalSdcGenerator({ directory: directoryMap }),
      };

      await instance.generateBundle(options, multiBundle);

      // Should emit both components
      expect(instance.emitFile).toHaveBeenCalledWith(
        expect.objectContaining({
          fileName: 'baz.component.yml',
        }),
      );
      expect(instance.emitFile).toHaveBeenCalledWith(
        expect.objectContaining({
          fileName: 'my-component.component.yml',
        }),
      );

      // Different components should have different content based on their directories
      const calls = instance.emitFile.mock.calls;
      const bazYmlCall = calls.find(
        (call) =>
          call[0].fileName === 'baz.component.yml' &&
          call[0].source.includes('My Component'),
      );
      const myComponentYmlCall = calls.find(
        (call) =>
          call[0].fileName === 'my-component.component.yml' &&
          call[0].source.includes('10.1.x'),
      );

      expect(bazYmlCall).toBeDefined();
      expect(myComponentYmlCall).toBeDefined();
    });
  });

  describe('combined directory and label options', () => {
    test('directory and label are independent - string values', async () => {
      const instance = {
        ...console,
        debug: () => {},
        emitFile: jest.fn(),
        ...drupalSdcGenerator({
          directory: 'templates',
          label: 'Custom Label',
        }),
      };

      await instance.generateBundle(options, bundle);

      // Should use templates from specified directory
      expect(instance.emitFile).toHaveBeenCalledWith(
        expect.objectContaining({
          fileName: 'baz.component.yml',
        }),
      );
      // Should use custom label in content
      expect(instance.emitFile).toHaveBeenCalledWith(
        expect.objectContaining({
          source: expect.stringContaining('Custom Label'),
        }),
      );
    });

    test('directory and label are independent - object values', async () => {
      const directoryMap = {
        baz: 'templates',
      };
      const labelMap = {
        baz: 'Baz Custom Label',
      };
      const instance = {
        ...console,
        debug: () => {},
        emitFile: jest.fn(),
        ...drupalSdcGenerator({
          directory: directoryMap,
          label: labelMap,
        }),
      };

      await instance.generateBundle(options, bundle);

      // Should read from component-specific directory
      expect(instance.emitFile).toHaveBeenCalledWith(
        expect.objectContaining({
          fileName: 'baz.component.yml',
        }),
      );
      // Should use component-specific label
      expect(instance.emitFile).toHaveBeenCalledWith(
        expect.objectContaining({
          source: expect.stringContaining('Baz Custom Label'),
        }),
      );
    });

    test('directory and label can mix string and object types', async () => {
      const instance = {
        ...console,
        debug: () => {},
        emitFile: jest.fn(),
        ...drupalSdcGenerator({
          directory: 'templates', // string for all
          label: {
            baz: 'Component Specific Label',
          }, // object for specific
        }),
      };

      await instance.generateBundle(options, bundle);

      // Should read from string directory (default templates)
      const ymlCall = instance.emitFile.mock.calls.find((call) =>
        call[0].fileName.includes('.component.yml'),
      );
      // Default templates use [label] token which gets replaced
      expect(ymlCall[0].source).toMatch(/Component Specific Label/);
      // Verify it's using the default template structure
      expect(ymlCall[0].source).toMatch(/baz\.js/);
    });
  });
});
