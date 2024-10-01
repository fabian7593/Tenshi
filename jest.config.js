/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  moduleNameMapper: {
    '^@TenshiJS/(.*)$': '<rootDir>/tenshi/$1',
    '^tenshi/(.*)$': '<rootDir>/tenshi/$1',
    '^@index/(.*)$': '<rootDir>/src/$1',
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
    '^@templates/(.*)$': '<rootDir>/src/templates/$1',
    '^@entity/(.*)$': '<rootDir>/src/entity/$1',
    '^@data/(.*)$': '<rootDir>/src/data/json/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1'
  },
};