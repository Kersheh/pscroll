import '@testing-library/jest-dom';

// @ts-ignore
window.matchMedia = window.matchMedia
  ? window.matchMedia
  : () => ({
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn()
    });

Object.defineProperty(HTMLMediaElement.prototype, 'muted', {
  set: () => null
});
