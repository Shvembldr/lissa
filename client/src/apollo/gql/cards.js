import gql from 'graphql-tag';

export const getCard = gql`
  query card($vendorCode: String!) {
    card(vendorCode: $vendorCodeid) {
      vendorCode
    }
  }
`;

export const getCardsMatch = gql`
  query cardsMatch($match: String) {
    cardsMatch(match: $match) {
      id
      vendorCode
      operations {
        id
        code
        price
      }
      group {
        id
        name
      }
    }
  }
`;

export const getCards = gql`
  query cards($match: String, $filters: [String], $limit: Int, $offset: Int) {
    cards(match: $match, filters: $filters, limit: $limit, offset: $offset) {
      count
      rows {
        id
        vendorCode
        operations {
          id
          code
          price
        }
        group {
          id
          name
        }
      }
    }
  }
`;

export const createCard = gql`
  mutation createCard($input: CardInput!, $operationCount: Int!) {
    createCard(input: $input, operationCount: $operationCount) {
      id
      vendorCode
      operations {
        id
        code
        price
      }
      group {
        id
        name
      }
    }
  }
`;

export const updateCard = gql`
  mutation updateCard($id: Int!, $input: CardInput!) {
    updateCard(id: $id, input: $input) {
      id
      vendorCode
      operations {
        id
        code
        price
      }
      group {
        id
        name
      }
    }
  }
`;

export const removeCards = gql`
  mutation removeCards($ids: [Int!]) {
    removeCards(ids: $ids)
  }
`;
