import { ApolloClient, InMemoryCache, gql, HttpLink } from '@apollo/client';
import { Config } from '../constants/config';
import { User } from '../types/user';

const httpLink = new HttpLink({
  uri: Config.GRAPHQL_API_URL,
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export const LIST_CUSTOMERS_QUERY = gql`
  query ListZellerCustomers {
    listZellerCustomers {
      items {
        id
        name
        email
        role
      }
      nextToken
    }
  }
`;

export interface ListCustomersResponse {
  listZellerCustomers: {
    items: User[];
    nextToken: string | null;
  };
}

export const fetchCustomersFromAPI = async (): Promise<User[]> => {
  try {
    const { data } = await apolloClient.query<ListCustomersResponse>({
      query: LIST_CUSTOMERS_QUERY,
    });

    if (!data) {
      throw new Error('No data returned from API');
    }

    return data.listZellerCustomers.items;
  } catch (error) {
    console.error('Error fetching customers from API:', error);
    throw error;
  }
};

export const getCustomerByIdQuery = gql`
  query GetZellerCustomer($id: String!) {
    getZellerCustomer(id: $id) {
      id
      name
      email
      role
    }
  }
`;
