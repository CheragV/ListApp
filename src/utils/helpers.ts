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
