/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,
  coverageProvider: "v8",

  moduleNameMapper: {
    '^@api': '<rootDir>/src/utils/burger-api',
    '^@utils-types$': '<rootDir>/src/utils/types',
  }
};

module.exports = config;
