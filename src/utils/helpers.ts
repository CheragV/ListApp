import { User, GroupedUsers } from '../types/user';

export const groupUsersByInitial = (users: User[]): GroupedUsers => {
  const grouped: GroupedUsers = {};

  users.forEach((user) => {
    const initial = user.name.charAt(0).toUpperCase();
    if (!grouped[initial]) {
      grouped[initial] = [];
    }
    grouped[initial].push(user);
  });

  return grouped;
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const getInitials = (name: string): string => {
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

// Check if a userId is from the API vs locally generated
export const isApiUser = (id: string): boolean => {
  // API users have simple numeric ids like 1, 2, 3
  // Local users have timestamp based ids like "1731428467123-abc123def"
  return /^\d+$/.test(id);
};
