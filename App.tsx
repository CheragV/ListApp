import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { ApolloProvider } from '@apollo/client/react';
import { apolloClient } from './src/services/graphql';
import { useDatabase } from './src/hooks/useDatabase';
import { AppNavigator } from './src/navigation/AppNavigator';
import { Colors } from './src/constants/colors';

export default function App() {
  const { isReady, error } = useDatabase();

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to initialize database</Text>
        <Text style={styles.errorDetail}>{error.message}</Text>
      </View>
    );
  }

  if (!isReady) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ApolloProvider client={apolloClient}>
      <AppNavigator />
      <StatusBar style="dark" />
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.error,
    marginBottom: 8,
  },
  errorDetail: {
    fontSize: 14,
    color: Colors.textLight,
  },
});
