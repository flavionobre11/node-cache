module.exports = {
  bail: true,
  preset: 'ts-jest',
  clearMocks: true,
  coverageProvider: "v8",
  setupFiles: ['dotenv/config'],
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.(test|spec).ts"],
  testPathIgnorePatterns: [
    "/node_modules/"
  ],
};