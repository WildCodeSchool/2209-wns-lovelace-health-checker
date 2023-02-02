import { StatusBar } from 'expo-status-bar';
import Constants from "expo-constants";
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

const GRAPHQL_API_URL = Constants?.expoConfig?.extra?.GRAPHQL_API_URL;

const client = new ApolloClient({
  uri: GRAPHQL_API_URL,
  cache: new InMemoryCache(),
});

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <ApolloProvider client={client}>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </ApolloProvider>
      </SafeAreaProvider>
    );
  }
}
