import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

describe('<App />', () => {
  // TODO: fix imports for unit test
  it.skip('should render', () => {
    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
  });
});
