export const transform = { '^.+\\.ts$': 'ts-jest' };
export const moduleFileExtensions = ['js', 'ts'];
// export const testMatch = ['**/test/**/*.test.(ts|js)'];
export const testMatch = ['_tests_/**/*.test.(ts|js)'];
export const testEnvironment = 'node';
export const setupFiles = ['dotenv/config'];