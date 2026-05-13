# Rollup Plugin for Drupal to Generate Single Directory Components (SDCs)

This is a [Rollup](https://rollupjs.org) plugin that creates
[single directory components](https://www.drupal.org/docs/develop/theming-drupal/using-single-directory-components)
for embedding your app in a [Drupal](https://www.drupal.org) module or theme.

## Installation

```shell
npm install --save-dev rollup-plugin-drupal-sdc-generator
```

## Ejecting templates

Copy the default templates into your project so you can customize them:

```shell
# Copy templates to a directory relative to your current location
npx drupal-sdc-eject ./vite

# Copy to a different path
npx drupal-sdc-eject ../custom-templates
```

Then point the `directory` option at the copied templates (see [Options](#options)).

## Usage

```javascript
import drupalSdcGenerator from 'rollup-plugin-drupal-sdc-generator';

// https://rollupjs.org/configuration-options/
export default {
  input: 'main.js',
  plugins: [drupalSdcGenerator()],
};
```

This plugin can be used with [Vite](https://vitejs.dev).

```javascript
import { defineConfig } from 'vite';
import drupalSdcGenerator from 'rollup-plugin-drupal-sdc-generator';

// https://vitejs.dev/config/
export default defineConfig({
  root: 'js',
  build: {
    rollupOptions: {
      input: 'js/main.js',
      plugins: [drupalSdcGenerator()],
    },
  },
});
```

## Options

### directory

Type
: `string | object = { "{component-name}": string }`

Default
: `"node_modules/rollup-plugin-drupal-sdc-generator/templates"`

The directory where your SDC's `[{component-name}].component.yml`,
`[{component-name}].twig`, and other files that will be included with the built
single directory component.

When a string is provided, the templates in the directory passed in are used
on all generated single directory components.

When an object is provided, the templates in the directory passed in are used
for the component names specified by the object's keys.

In your templates, `[name]` will be replaced with the value of
`{component-name}`, too. Use `[[name]]` if you want the string `[name]` included
verbatim.

```javascript
drupalSdcGenerator({ directory: 'vite/shared' });

drupalSdcGenerator({
  directory: {
    'my-component': 'vite/my-component',
  },
});
```

### label

Type
: `string | object = { "{component-name}": string }`

Default
: `"My Component"`

This is a descriptive name for your SDC.

In your templates, `[label]` will be replaced with the value of this variable.
Use `[[label]]` if you want the string `[label]` included verbatim.

```javascript
drupalSdcGenerator({ label: 'Best SDC ever!' });

drupalSdcGenerator({
  label: {
    'my-component': 'Best SDC ever!',
  },
});
```

### group

Type
: `string | object = { "{component-name}": string }`

Default
: `undefined`

This is the group that your SDC belongs to in Drupal's component organization.

When provided, a `group` field will be added to your component's metadata.

```javascript
drupalSdcGenerator({ group: 'Navigation' });

drupalSdcGenerator({
  group: {
    'my-component': 'Navigation',
    'other-component': 'Content',
  },
});
```

---

The Exploratorium is a 501(c)(3) nonprofit organization. Our tax ID #:
94-1696494

https://www.exploratorium.edu
