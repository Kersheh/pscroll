import '@testing-library/jest-dom';

beforeEach(() => {
  // @ts-ignore
  window.matchMedia = window.matchMedia
    ? window.matchMedia
    : () => ({
        matches: false,
        addListener: jest.fn(),
        removeListener: jest.fn()
      });
});
