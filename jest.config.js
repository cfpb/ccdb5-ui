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
      functions: 94,
      lines: 94,
      statements: 94,
    },
  },
  coverageReporters: ['lcov', 'text', 'html', 'text-summary'],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.(t|j)sx?$': ['babel-jest', { rootMode: 'upward' }],
  },
  transformIgnorePatterns: ['!node_modules/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    '^(.+\\.svg)\\?react$': '<rootDir>/config/__mocks__/svg.js',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
};
