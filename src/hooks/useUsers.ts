import { useState, useEffect, useCallback } from 'react';
import { database } from '../database/db';
import { fetchCustomersFromAPI } from '../services/graphql';
import { User, UserInput, UserRole, TabType } from '../types/user';
import { generateId } from '../utils/helpers';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    try {
      const dbUsers = await database.getAllUsers();
      setUsers(dbUsers);
      setError(null);
    } catch (err) {
      setError('Failed to load users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const syncWithAPI = useCallback(async () => {
    try {
      const apiUsers = await fetchCustomersFromAPI();
      await database.bulkInsertUsers(apiUsers);
      await loadUsers();
    } catch (err) {
      console.error('Failed to sync with API:', err);
      // Still load from local DB even if API fails
      await loadUsers();
    }
  }, [loadUsers]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await syncWithAPI();
    setRefreshing(false);
  }, [syncWithAPI]);

  const addUser = useCallback(
    async (userInput: UserInput): Promise<void> => {
      const newUser: User = {
        id: generateId(),
        ...userInput,
      };

      await database.addUser(newUser);
      await loadUsers();
    },
    [loadUsers]
  );

  const updateUser = useCallback(
    async (id: string, updates: Partial<UserInput>): Promise<void> => {
      await database.updateUser(id, updates);
      await loadUsers();
    },
    [loadUsers]
  );

  const deleteUser = useCallback(
    async (id: string): Promise<void> => {
      await database.deleteUser(id);
      await loadUsers();
    },
    [loadUsers]
  );

  const searchUsers = useCallback(async (query: string): Promise<User[]> => {
    if (!query.trim()) {
      return users;
    }
    return await database.searchUsers(query);
  }, [users]);

  const filterUsersByTab = useCallback(
    (tab: TabType): User[] => {
      if (tab === 'All') return users;
      return users.filter((user) => user.role === tab);
    },
    [users]
  );

  useEffect(() => {
    syncWithAPI();
  }, [syncWithAPI]);

  return {
    users,
    loading,
    refreshing,
    error,
    refresh,
    addUser,
    updateUser,
    deleteUser,
    searchUsers,
    filterUsersByTab,
  };
};
