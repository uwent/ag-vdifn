/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "./app/javascript/spec/__mocks__/fileMock.js",
    "\\.(css|less)$": "./app/javascript/spec/__mocks__/styleMock.js"
  },
  transform: {
    '^.+\\.svelte$': ['svelte-jester', { preprocess: true }],
    '^.+\\.tsx?$': ['ts-jest', { useESM: true }],
  },
}
