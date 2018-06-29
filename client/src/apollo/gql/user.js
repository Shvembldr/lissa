import gql from 'graphql-tag';

export default gql`
  query user {
    me {
      name
      email
      role
    }
  }
`;
