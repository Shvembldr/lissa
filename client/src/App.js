import React from 'react';
import {
  BrowserRouter as Router, Redirect, Route, Switch,
} from 'react-router-dom';
import Login from './components/Login';
import { AuthRoute } from './components/AuthRoute';
import Layout from './components/Layout';
import Cards from './components/Routes/Cards';
import Groups from './components/Routes/Groups';
import Reports from './components/Routes/Reports';
import Workers from './components/Routes/Workers';
import Products from './components/Routes/Products';
import Customers from './components/Routes/Customers';

const App = () => (
  <Router>
    <Switch>
      <Route exact path="/" render={() => <Redirect to="/login" />} />
      <Route path="/login" component={Login} />
      <Layout>
        <AuthRoute roles={['admin', 'user']} path="/cards" component={Cards} />
        <AuthRoute roles={['admin']} path="/groups" component={Groups} />
        <AuthRoute roles={['admin']} path="/workers" component={Workers} />
        <AuthRoute roles={['admin']} path="/customers" component={Customers} />
        <AuthRoute roles={['admin', 'user']} path="/production" component={Products} />
        <AuthRoute roles={['admin']} path="/reports" component={Reports} />
      </Layout>
    </Switch>
  </Router>
);

export default App;
