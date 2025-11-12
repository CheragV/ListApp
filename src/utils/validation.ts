import { Config } from '../constants/config';

export interface ValidationError {
  field: string;
  message: string;
}

export const validateName = (name: string): ValidationError | null => {
  if (!name || name.trim().length === 0) {
    return { field: 'name', message: 'Name is required' };
  }

  if (name.length > Config.MAX_NAME_LENGTH) {
    return {
      field: 'name',
      message: `Name must not exceed ${Config.MAX_NAME_LENGTH} characters`,
    };
  }

  // Only alphabets and spaces
  const nameRegex = /^[A-Za-z\s]+$/;
  if (!nameRegex.test(name)) {
    return {
      field: 'name',
      message: 'Name can only contain letters and spaces',
    };
  }

  return null;
};

export const validateEmail = (email: string): ValidationError | null => {
  if (!email || email.trim().length === 0) {
    return { field: 'email', message: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { field: 'email', message: 'Invalid email format' };
  }

  return null;
};

export const validateUser = (
  name: string,
  email: string
): ValidationError[] => {
  const errors: ValidationError[] = [];

  const nameError = validateName(name);
  if (nameError) errors.push(nameError);

  const emailError = validateEmail(email);
  if (emailError) errors.push(emailError);

  return errors;
};
