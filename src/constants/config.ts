import { Platform } from 'react-native';

// Android emulator needs 10.0.2.2 to access host machine's localhost
// iOS simulator and web can use localhost directly
const getApiUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:9002/graphql';
  }
  return 'http://localhost:9002/graphql';
};

export const Config = {
  GRAPHQL_API_URL: getApiUrl(),
  DB_NAME: 'listapp.db',
  MAX_NAME_LENGTH: 50,
};
