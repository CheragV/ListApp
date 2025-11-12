import React from 'react';
import { render } from '@testing-library/react-native';
import { Avatar } from '../components/Avatar';

describe('Avatar', () => {
  it('should render with correct initials for single name', () => {
    const { getByText } = render(<Avatar name="Alice" />);
    expect(getByText('A')).toBeTruthy();
  });

  it('should render with correct initials for full name', () => {
    const { getByText } = render(<Avatar name="John Doe" />);
    expect(getByText('JD')).toBeTruthy();
  });

  it('should handle lowercase names', () => {
    const { getByText } = render(<Avatar name="john doe" />);
    expect(getByText('JD')).toBeTruthy();
  });

  it('should render with custom size', () => {
    const { getByText } = render(<Avatar name="Test User" size={60} />);
    expect(getByText('TU')).toBeTruthy();
  });
});
