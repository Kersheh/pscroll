import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import MediaContainer from '../MediaContainer';

describe('<MediaContainer />', () => {
  it('should render image', () => {
    const { container } = render(<MediaContainer src="example.png" />);

    fireEvent.load(screen.getByTestId('img'));
    expect(container).toMatchSnapshot();
  });

  it('should render video', async () => {
    const { container } = render(<MediaContainer src="example.mp4" />);

    fireEvent.loadedData(screen.getByTestId('video'));
    expect(container).toMatchSnapshot();
  });

  it('should display spinner and hide image while loading', () => {
    render(<MediaContainer src="example.png" />);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.getByTestId('img')).not.toBeVisible();

    fireEvent.load(screen.getByTestId('img'));
    expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    expect(screen.getByTestId('img')).toBeVisible();
  });

  it('should display spinner and hide video while loading', () => {
    render(<MediaContainer src="example.mp4" />);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.getByTestId('video')).not.toBeVisible();

    fireEvent.loadedData(screen.getByTestId('video'));
    expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    expect(screen.getByTestId('video')).toBeVisible();
  });
});
