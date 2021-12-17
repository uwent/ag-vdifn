module.exports = {
  roots: ['./app/packs/spec'],
  transform: {
    '^.+\\.svelte$': ['svelte-jester', { "preprocess": true }],
    '^.+\\.ts$': ['ts-jest'],
    '^.+\\.js$': 'babel-jest',
  },
  // testRegex: ['(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$'],
  moduleFileExtensions: ['ts', 'js', 'svelte'],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "./app/packs/spec/__mocks__/fileMock.js",
    "\\.(css|less)$": "./app/packs/spec/__mocks__/styleMock.js"
    },
  setupFilesAfterEnv: ["./app/packs/spec/spec_setup.ts"],
  transformIgnorePatterns: ["node_modules"],
  testPathIgnorePatterns: ["/node_modules/", "/build/"],
  verbose: true,
  testEnvironment: "jsdom"
}
