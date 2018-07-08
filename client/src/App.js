import React from 'react';
import {
  BrowserRouter as Router, Redirect, Route, Switch,
} from 'react-router-dom';
import Login from './components/Login';
import { AuthRoute } from './components/AuthRoute';
import Layout from './components/Layout';

const App = () => (
  <Router>
    <Switch>
      <Route path="/login" component={Login} />
      <AuthRoute roles={['admin', 'user']} path="/app" component={Layout} />
      <Route render={() => <Redirect to="/login" />} />
    </Switch>
  </Router>
);

export default App;
