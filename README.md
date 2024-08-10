# Rollup Plugin for Drupal to Generate Single Directory Components (SDCs)

This is a [vite](https://vitejs.dev) plugin that creates
[single directory components](https://www.drupal.org/docs/develop/theming-drupal/using-single-directory-components)
for embedding your app in a [Drupal](https://www.drupal.org) module or theme.

## Installation

```shell
npm install --save-dev rollup-plugin-drupal-sdc-generator
```

## Usage

```javascript
import { defineConfig } from 'vite';
import rollupPluginDrupalSdcGenerator from 'rollup-plugin-drupal-sdc-generator';

// https://vitejs.dev/config/
export default defineConfig({
  root: 'js',
  build: {
    rollupOptions: {
      input: 'js/main.js',
    },
    plugins: [rollupPluginDrupalSdcGenerator()],
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
`[{component-name}].twig`, and other files that will be included
with the built single directory component.

When a string is provided, the templates in the directory passed in are used
on all generated single directory components.

When an object is provided, the templates in the directory passed in are used
for the component names specified by the object's keys.

In your templates, `[name]` will be replaced with the value
of `{component-name}` too. Use `\[name\]` if you want the string `[name]`
included verbatim.

```javascript
rollupPluginDrupalSdcGenerator({ directory: 'vite/shared' });

rollupPluginDrupalSdcGenerator({
  directory: {
    'my-component': 'vite/my-component',
  },
});
```

## About Us

Located in San Francisco, California, the Exploratorium is a public learning laboratory exploring the world through science, art, and human perception.

### Mission, Vision, and Values

Our mission is to create inquiry-based experiences that transform learning worldwide. Our vision is a world where people think for themselves and can confidently ask questions, question answers, and understand the world around them. We value lifelong learning, curiosity, and inclusion.

We create tools and experiences that help you to become an active explorer: hundreds of explore-for-yourself exhibits, a website with over 35,000 pages of content, film screenings, evening art and science events for adults, plus much more. We also create professional development programs for educators, and are at the forefront of changing the way science is taught. We share our exhibits and expertise with museums worldwide.

---

The Exploratorium is a 501(c)(3) nonprofit organization. Our tax ID #: 94-1696494

https://www.exploratorium.edu
