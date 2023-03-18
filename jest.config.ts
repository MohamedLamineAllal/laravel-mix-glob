import { Config } from 'jest';

const config: Config = {
  testPathIgnorePatterns: ['test/__fixtures__', 'node_modules', 'dist'],
  silent: true,
  cache: false,
  forceExit: true,
};

export default config;
