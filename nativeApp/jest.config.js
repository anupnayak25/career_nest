module.exports = {
  preset: 'react-native',
  setupFiles: ['<rootDir>/jestSetup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|react-native|@react-navigation|@react-native-async-storage/async-storage|react-native-vector-icons|react-native-reanimated)'
  ],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
};
