/** @type {import('jest').Config} */
const config = {
  projects: [
    {
      displayName: 'unittests',
      testMatch: ['<rootDir>/src/**/*.test.js'],
    },
    {
      displayName: 'examples',
      testMatch: ['<rootDir>/examples/**/*.test.js'],
    },
  ],
};

// eslint-disable-next-line no-undef
module.exports = config;
