module.exports = {
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts'],
  coveragePathIgnorePatterns: ['src/index.js'],
  setupFiles: ['<rootDir>/config/setup.js'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/?(*.)(spec|test).{js,jsx,ts,tsx}',
  ],
  testEnvironment: 'jsdom',
  testURL: 'http://localhost',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.(css|less)$': '<rootDir>/config/jest/cssTransform.js',
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)':
      '<rootDir>/config/jest/fileTransform.js',
  },
  transformIgnorePatterns: [
    '^.+\\.module\\.(css|sass|scss)$',
    'node_modules/(?!(cfpb-chart-builder)/)', // The modules that need to be transpiled. You might not need this.
    // "[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$", // This line is no longer needed.
  ],
  moduleNameMapper: {
    // "^react-native$": "react-native-web", // This was generated while "ejecting", not necessary.
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    '\\.(css|less)$': 'identity-obj-proxy', // If you are importing css/less in JS files
  },
  moduleDirectories: [
    'node_modules', // This is required
  ],
  moduleFileExtensions: [
    'web.js',
    'js',
    'web.ts',
    'ts',
    'web.tsx',
    'tsx',
    'json',
    'web.jsx',
    'jsx',
    'node',
  ],
};
