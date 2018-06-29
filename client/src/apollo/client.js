import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { serverUriGraphQl } from '../config';

const httpLink = createHttpLink({
  uri: serverUriGraphQl,
});

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    'x-token': localStorage.getItem('x-token'),
    'x-refresh-token': localStorage.getItem('x-refresh-token'),
  },
}));

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
