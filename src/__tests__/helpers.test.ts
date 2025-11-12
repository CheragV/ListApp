import { groupUsersByInitial, generateId, getInitials } from '../utils/helpers';
import { User, UserRole } from '../types/user';

describe('groupUsersByInitial', () => {
  const users: User[] = [
    { id: '1', name: 'Alice Smith', email: 'alice@test.com', role: UserRole.Admin },
    { id: '2', name: 'Bob Jones', email: 'bob@test.com', role: UserRole.Manager },
    { id: '3', name: 'Anna Brown', email: 'anna@test.com', role: UserRole.Admin },
  ];

  it('should group users by first letter of name', () => {
    const grouped = groupUsersByInitial(users);
    
    expect(grouped['A']).toHaveLength(2);
    expect(grouped['B']).toHaveLength(1);
  });

  it('should use uppercase for initials', () => {
    const lowerCaseUsers: User[] = [
      { id: '1', name: 'alice', email: 'alice@test.com', role: UserRole.Admin },
    ];
    const grouped = groupUsersByInitial(lowerCaseUsers);
    
    expect(grouped['A']).toBeDefined();
    expect(grouped['a']).toBeUndefined();
  });

  it('should return empty object for empty array', () => {
    const grouped = groupUsersByInitial([]);
    expect(Object.keys(grouped)).toHaveLength(0);
  });
});

describe('generateId', () => {
  it('should generate unique ids', () => {
    const id1 = generateId();
    const id2 = generateId();
    
    expect(id1).not.toBe(id2);
  });

  it('should generate non-empty string', () => {
    const id = generateId();
    expect(id).toBeTruthy();
    expect(typeof id).toBe('string');
  });
});

describe('getInitials', () => {
  it('should return first letter for single word name', () => {
    expect(getInitials('Alice')).toBe('A');
  });

  it('should return first and last letter for full name', () => {
    expect(getInitials('John Doe')).toBe('JD');
  });

  it('should handle multiple spaces', () => {
    expect(getInitials('Mary Jane Watson')).toBe('MW');
  });

  it('should return uppercase initials', () => {
    expect(getInitials('john doe')).toBe('JD');
  });

  it('should handle extra whitespace', () => {
    expect(getInitials('  John   Doe  ')).toBe('JD');
  });
});
