import gql from 'graphql-tag';

export const getGroups = gql`
  query groups {
    groups {
      id
      name
    }
  }
`;

export const createGroup = gql`
  mutation createGroup($input: GroupInput!) {
    createGroup(input: $input) {
      id
      name
    }
  }
`;

export const updateGroup = gql`
  mutation updateGroup($id: Int!, $input: GroupInput!) {
    updateGroup(id: $id, input: $input) {
      id
      name
    }
  }
`;

export const removeGroups = gql`
  mutation removeGroups($ids: [Int!]) {
    removeGroups(ids: $ids)
  }
`;
