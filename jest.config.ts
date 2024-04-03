import type { Config } from 'jest';

const config: Config = {
  roots: ['./app/javascript/spec'],
  transform: {
    '^.+\\.svelte$': ['svelte-jester', { preprocess: true }],
    '^.+\\.(js|ts)x?$': ['ts-jest', { useESM: true }],
  },
  moduleFileExtensions: ['ts', 'js', 'svelte'],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "./app/javascript/spec/__mocks__/fileMock.js",
    "\\.(css|less)$": "./app/javascript/spec/__mocks__/styleMock.js"
  },
  extensionsToTreatAsEsm: ['.svelte', '.ts'],
  setupFilesAfterEnv: ["./app/javascript/spec/spec_setup.ts"],
};

export default config;
