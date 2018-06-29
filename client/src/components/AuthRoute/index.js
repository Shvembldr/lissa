import React from 'react';
import decode from 'jwt-decode';
import { Redirect, Route } from 'react-router-dom';
import { Query } from 'react-apollo';
import user from '../../apollo/gql/user';
import Loading from '../Loading';

const checkAuth = (roles, role) => {
  const token = localStorage.getItem('x-token');
  const refreshToken = localStorage.getItem('x-refresh-token');
  if (!token || !refreshToken) {
    return false;
  }

  try {
    const { exp } = decode(refreshToken);
    if (exp < new Date().getTime() / 1000) {
      return false;
    }
  } catch (err) {
    return false;
  }

  return roles.indexOf(role) !== -1;
};

export const AuthRoute = ({ component: Component, roles, ...rest }) => (
  <Query query={user}>
    {({ loading, error, data: { me } }) => {
      if (loading) return <Loading />;
      return (
        <Route
          {...rest}
          render={props => (checkAuth(roles, me.role) && !error ? (
              <Component {...props} />
          ) : (
              <Redirect
                to={{
                  pathname: '/login',
                }}
              />
          ))
          }
        />
      );
    }}
  </Query>
);
