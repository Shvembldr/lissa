import gql from 'graphql-tag';

export const updateOperations = gql`
  mutation updateOperations($input: [OperationInput!]) {
    updateOperations(input: $input) {
      id
      code
      price
      worker {
        id
        code
        name
        surname
      }
      product {
        id
      }
      card {
        id
      }
    }
  }
`;

export const removeOperation = gql`
  mutation removeOperation($id: Int!) {
    removeOperation(id: $id)
  }
`;
