import * as SQLite from 'expo-sqlite';
import { User, UserInput } from '../types/user';
import { Config } from '../constants/config';

class Database {
  private db: SQLite.SQLiteDatabase | null = null;

  async init(): Promise<void> {
    try {
      this.db = await SQLite.openDatabaseAsync(Config.DB_NAME);
      await this.createTables();
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        role TEXT NOT NULL
      );
    `);
  }

  async getAllUsers(): Promise<User[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getAllAsync<User>(
      'SELECT * FROM users ORDER BY name ASC'
    );
    return result;
  }

  async getUsersByRole(role: string): Promise<User[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getAllAsync<User>(
      'SELECT * FROM users WHERE role = ? ORDER BY name ASC',
      [role]
    );
    return result;
  }

  async getUserById(id: string): Promise<User | null> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getFirstAsync<User>(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    return result || null;
  }

  async addUser(user: User): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync(
      'INSERT INTO users (id, name, email, role) VALUES (?, ?, ?, ?)',
      [user.id, user.name, user.email, user.role]
    );
  }

  async updateUser(id: string, user: Partial<UserInput>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const updates: string[] = [];
    const values: any[] = [];

    if (user.name !== undefined) {
      updates.push('name = ?');
      values.push(user.name);
    }
    if (user.email !== undefined) {
      updates.push('email = ?');
      values.push(user.email);
    }
    if (user.role !== undefined) {
      updates.push('role = ?');
      values.push(user.role);
    }

    if (updates.length === 0) return;

    values.push(id);
    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;

    await this.db.runAsync(query, values);
  }

  async deleteUser(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync('DELETE FROM users WHERE id = ?', [id]);
  }

  async bulkInsertUsers(users: User[]): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const placeholders = users.map(() => '(?, ?, ?, ?)').join(', ');
    const values = users.flatMap(u => [u.id, u.name, u.email, u.role]);

    await this.db.runAsync(
      `INSERT OR REPLACE INTO users (id, name, email, role) VALUES ${placeholders}`,
      values
    );
  }

  async clearAllUsers(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync('DELETE FROM users');
  }

  async searchUsers(query: string): Promise<User[]> {
    if (!this.db) throw new Error('Database not initialized');

    const searchPattern = `%${query}%`;
    const result = await this.db.getAllAsync<User>(
      'SELECT * FROM users WHERE name LIKE ? ORDER BY name ASC',
      [searchPattern]
    );
    return result;
  }
}

export const database = new Database();
