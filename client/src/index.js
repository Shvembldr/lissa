import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { LocaleProvider } from 'antd';
import ruRU from 'antd/lib/locale-provider/ru_RU';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import client from './apollo/client';

ReactDOM.render(
  <ApolloProvider client={client}>
    <LocaleProvider locale={ruRU}>
      <App />
    </LocaleProvider>
  </ApolloProvider>,

  document.getElementById('root'),
);
registerServiceWorker();
