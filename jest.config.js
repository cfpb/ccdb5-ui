// jest.config.js
module.exports = {
  collectCoverageFrom: [
    '**/*.{js,jsx}',
    '!<rootDir>/node_modules/',
    '!<rootDir>/cypress/**/**',
    '!<rootDir>/coverage/**',
    '!**/constants/**',
    '!**/__fixtures__/**',
    '!**/dist/**',
    '!**/**config**',
    '!**/serviceWorker.js',
  ],
  coverageThreshold: {
    global: {
      branches: 86,
      functions: 93,
      lines: 94,
      statements: 94,
    },
  },
  coverageReporters: ['lcov', 'text', 'html', 'text-summary'],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: ['!node_modules/'],
  moduleNameMapper: {
    '^(.+\\.svg)\\?react$': '<rootDir>/config/__mocks__/svg.js',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
};
