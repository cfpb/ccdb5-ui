// jest.config.js
module.exports = {
  collectCoverageFrom: [
    '**/*.{js,jsx}',
    '!<rootDir>/node_modules/',
    '!<rootDir>/cypress/**/**',
    '!<rootDir>/coverage/**',
    '!<rootDir>/postcss/**',
    '!<rootDir>/src/index.js',
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
  transformIgnorePatterns: [
    '/node_modules/(?!(d3|d3-[^/]+|internmap|delaunator|robust-predicates|query-string|split-on-first|strict-uri-encode|decode-uri-component|filter-obj|react-leaflet|@react-leaflet/core|@cfpb/design-system-react)/)',
  ],
  moduleNameMapper: {
    '^react$': '<rootDir>/node_modules/react',
    '^react-dom$': '<rootDir>/node_modules/react-dom',
    '^react/(.*)$': '<rootDir>/node_modules/react/$1',
    '^(.+\\.svg)\\?react$': '<rootDir>/config/__mocks__/svg.js',
    '^(.+\\.png)$': '<rootDir>/config/__mocks__/png.js',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
};
