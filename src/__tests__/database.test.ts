import { database } from '../database/db';
import { User, UserRole } from '../types/user';

// Mock expo-sqlite
jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: jest.fn(() =>
    Promise.resolve({
      execAsync: jest.fn(),
      getAllAsync: jest.fn(() => Promise.resolve([])),
      getFirstAsync: jest.fn(() => Promise.resolve(null)),
      runAsync: jest.fn(),
    })
  ),
}));

describe('Database', () => {
  const mockUser: User = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: UserRole.Admin,
  };

  beforeEach(async () => {
    await database.init();
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const users = await database.getAllUsers();
      expect(Array.isArray(users)).toBe(true);
    });

    it('should throw error if database not initialized', async () => {
      const uninitializedDb = new (database.constructor as any)();
      await expect(uninitializedDb.getAllUsers()).rejects.toThrow('Database not initialized');
    });
  });

  describe('getUsersByRole', () => {
    it('should get users by role', async () => {
      const users = await database.getUsersByRole('Admin');
      expect(Array.isArray(users)).toBe(true);
    });

    it('should throw error if database not initialized', async () => {
      const uninitializedDb = new (database.constructor as any)();
      await expect(uninitializedDb.getUsersByRole('Admin')).rejects.toThrow('Database not initialized');
    });
  });

  describe('getUserById', () => {
    it('should get user by id', async () => {
      const user = await database.getUserById('1');
      expect(user).toBeDefined();
    });

    it('should throw error if database not initialized', async () => {
      const uninitializedDb = new (database.constructor as any)();
      await expect(uninitializedDb.getUserById('1')).rejects.toThrow('Database not initialized');
    });
  });

  describe('addUser', () => {
    it('should add a user', async () => {
      await expect(database.addUser(mockUser)).resolves.not.toThrow();
    });

    it('should throw error if database not initialized', async () => {
      const uninitializedDb = new (database.constructor as any)();
      await expect(uninitializedDb.addUser(mockUser)).rejects.toThrow('Database not initialized');
    });
  });

  describe('updateUser', () => {
    it('should update user name', async () => {
      await expect(database.updateUser('1', { name: 'Jane Doe' })).resolves.not.toThrow();
    });

    it('should update user email', async () => {
      await expect(database.updateUser('1', { email: 'jane@example.com' })).resolves.not.toThrow();
    });

    it('should update user role', async () => {
      await expect(database.updateUser('1', { role: UserRole.Manager })).resolves.not.toThrow();
    });

    it('should handle empty updates', async () => {
      await expect(database.updateUser('1', {})).resolves.not.toThrow();
    });

    it('should throw error if database not initialized', async () => {
      const uninitializedDb = new (database.constructor as any)();
      await expect(uninitializedDb.updateUser('1', { name: 'Test' })).rejects.toThrow('Database not initialized');
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      await expect(database.deleteUser('1')).resolves.not.toThrow();
    });

    it('should throw error if database not initialized', async () => {
      const uninitializedDb = new (database.constructor as any)();
      await expect(uninitializedDb.deleteUser('1')).rejects.toThrow('Database not initialized');
    });
  });

  describe('bulkInsertUsers', () => {
    it('should bulk insert users', async () => {
      const users = [mockUser, { ...mockUser, id: '2', name: 'Jane' }];
      await expect(database.bulkInsertUsers(users)).resolves.not.toThrow();
    });

    it('should throw error if database not initialized', async () => {
      const uninitializedDb = new (database.constructor as any)();
      await expect(uninitializedDb.bulkInsertUsers([mockUser])).rejects.toThrow('Database not initialized');
    });
  });

  describe('clearAllUsers', () => {
    it('should clear all users', async () => {
      await expect(database.clearAllUsers()).resolves.not.toThrow();
    });

    it('should throw error if database not initialized', async () => {
      const uninitializedDb = new (database.constructor as any)();
      await expect(uninitializedDb.clearAllUsers()).rejects.toThrow('Database not initialized');
    });
  });

  describe('searchUsers', () => {
    it('should search users by name', async () => {
      const results = await database.searchUsers('John');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should throw error if database not initialized', async () => {
      const uninitializedDb = new (database.constructor as any)();
      await expect(uninitializedDb.searchUsers('John')).rejects.toThrow('Database not initialized');
    });
  });

  describe('init', () => {
    it('should initialize database', async () => {
      const newDb = new (database.constructor as any)();
      await expect(newDb.init()).resolves.not.toThrow();
    });
  });
});
