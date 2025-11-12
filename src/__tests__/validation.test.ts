import { validateName, validateEmail, validateUser } from '../utils/validation';

describe('validateName', () => {
  it('should return error for empty name', () => {
    const result = validateName('');
    expect(result).not.toBeNull();
    expect(result?.message).toContain('required');
  });

  it('should return error for name with special characters', () => {
    const result = validateName('John@Doe');
    expect(result).not.toBeNull();
    expect(result?.message).toContain('letters and spaces');
  });

  it('should return error for name exceeding max length', () => {
    const longName = 'a'.repeat(51);
    const result = validateName(longName);
    expect(result).not.toBeNull();
    expect(result?.message).toContain('50 characters');
  });

  it('should return null for valid name', () => {
    const result = validateName('John Doe');
    expect(result).toBeNull();
  });

  it('should accept name with multiple spaces', () => {
    const result = validateName('Mary Jane Watson');
    expect(result).toBeNull();
  });
});

describe('validateEmail', () => {
  it('should return error for empty email', () => {
    const result = validateEmail('');
    expect(result).not.toBeNull();
    expect(result?.message).toContain('required');
  });

  it('should return error for invalid email format', () => {
    const result = validateEmail('invalid-email');
    expect(result).not.toBeNull();
    expect(result?.message).toContain('Invalid email');
  });

  it('should return error for email without domain', () => {
    const result = validateEmail('test@');
    expect(result).not.toBeNull();
  });

  it('should return null for valid email', () => {
    const result = validateEmail('test@example.com');
    expect(result).toBeNull();
  });
});

describe('validateUser', () => {
  it('should return errors for both invalid name and email', () => {
    const errors = validateUser('', 'invalid');
    expect(errors).toHaveLength(2);
    expect(errors.find(e => e.field === 'name')).toBeDefined();
    expect(errors.find(e => e.field === 'email')).toBeDefined();
  });

  it('should return empty array for valid inputs', () => {
    const errors = validateUser('John Doe', 'john@example.com');
    expect(errors).toHaveLength(0);
  });

  it('should return only name error when email is valid', () => {
    const errors = validateUser('John123', 'john@example.com');
    expect(errors).toHaveLength(1);
    expect(errors[0].field).toBe('name');
  });
});
