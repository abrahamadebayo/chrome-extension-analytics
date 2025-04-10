// jest-dom adds custom jest matchers for asserting on DOM nodes.
import '@testing-library/jest-dom';

// Increase the default timeout for async tests
jest.setTimeout(30000);

// Prevent "not wrapped in act" warnings
const originalError = console.error;
console.error = (...args) => {
  if (
    /Warning.*not wrapped in act/.test(args[0]) ||
    /Warning.*Cannot update a component/.test(args[0])
  ) {
    return;
  }
  originalError(...args);
};
