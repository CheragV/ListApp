export enum UserRole {
  Admin = 'Admin',
  Manager = 'Manager',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface UserInput {
  name: string;
  email: string;
  role: UserRole;
}

export type TabType = 'All' | 'Admin' | 'Manager';

export interface GroupedUsers {
  [key: string]: User[];
}
