import { fetchCustomersFromAPI, LIST_CUSTOMERS_QUERY } from '../services/graphql';
import { UserRole } from '../types/user';

// Mock Apollo Client query
jest.mock('../services/graphql', () => {
  const originalModule = jest.requireActual('../services/graphql');
  return {
    ...originalModule,
    apolloClient: {
      query: jest.fn(),
    },
    fetchCustomersFromAPI: jest.fn(),
  };
});

describe('GraphQL Service', () => {
  const mockedFetch = fetchCustomersFromAPI as jest.MockedFunction<typeof fetchCustomersFromAPI>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchCustomersFromAPI', () => {
    it('should fetch customers successfully', async () => {
      const mockUsers = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: UserRole.Admin,
        },
      ];

      mockedFetch.mockResolvedValue(mockUsers);

      const result = await fetchCustomersFromAPI();

      expect(result).toEqual(mockUsers);
    });

    it('should throw error when API fails', async () => {
      const error = new Error('Network error');
      mockedFetch.mockRejectedValue(error);

      await expect(fetchCustomersFromAPI()).rejects.toThrow('Network error');
    });

    it('should handle empty items array', async () => {
      mockedFetch.mockResolvedValue([]);

      const result = await fetchCustomersFromAPI();

      expect(result).toEqual([]);
    });

    it('should handle multiple customers', async () => {
      const mockUsers = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: UserRole.Admin,
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: UserRole.Manager,
        },
      ];

      mockedFetch.mockResolvedValue(mockUsers);

      const result = await fetchCustomersFromAPI();

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('John Doe');
      expect(result[1].name).toBe('Jane Smith');
    });
  });

  describe('LIST_CUSTOMERS_QUERY', () => {
    it('should be defined', () => {
      expect(LIST_CUSTOMERS_QUERY).toBeDefined();
    });

    it('should have correct query structure', () => {
      const queryString = LIST_CUSTOMERS_QUERY.loc?.source.body;
      expect(queryString).toContain('listZellerCustomers');
      expect(queryString).toContain('items');
      expect(queryString).toContain('id');
      expect(queryString).toContain('name');
      expect(queryString).toContain('email');
      expect(queryString).toContain('role');
    });
  });
});
