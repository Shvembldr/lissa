import gql from 'graphql-tag';

export const getCustomers = gql`
  query customers {
    customers {
      id
      name
    }
  }
`;

export const createCustomer = gql`
  mutation createCustomer($input: CustomerInput!) {
    createCustomer(input: $input) {
      id
      name
    }
  }
`;

export const updateCustomer = gql`
  mutation updateCustomer($id: Int!, $input: CustomerInput!) {
    updateCustomer(id: $id, input: $input) {
      id
      name
    }
  }
`;

export const removeCustomers = gql`
  mutation removeCustomers($ids: [Int!]) {
    removeCustomers(ids: $ids)
  }
`;
