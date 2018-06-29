import gql from 'graphql-tag';

export const getProducts = gql`
  query products($match: String, $filters: [String], $dates: [String!], $limit: Int, $offset: Int) {
    products(match: $match, filters: $filters, dates: $dates, limit: $limit, offset: $offset) {
      count
      rows {
        id
        vendorCode
        customer {
          id
          name
        }
        operations {
          id
          code
          price
          worker {
            id
            code
            name
            surname
          }
        }
        group {
          id
          name
        }
        size
        count
        date
      }
    }
  }
`;

export const getProductsReport = gql`
  query productsReport($dateRange: [String!]) {
    productsReport(dateRange: $dateRange) {
      report {
        count
        vendorCode
        price
        sum
      }
    }
  }
`;

export const createProduct = gql`
  mutation createProduct($input: ProductInput!) {
    createProduct(input: $input) {
      id
      vendorCode
      customer {
        id
        name
      }
      operations {
        id
        code
        price
        worker {
          id
          code
          name
          surname
        }
      }
      group {
        id
        name
      }
      size
      count
      date
    }
  }
`;

export const updateProduct = gql`
  mutation updateProduct($id: Int!, $input: ProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
      vendorCode
      customer {
        id
        name
      }
      operations {
        id
        code
        price
        worker {
          id
          code
        }
      }
      group {
        id
        name
      }
      size
      count
      date
    }
  }
`;

export const removeProducts = gql`
  mutation removeProducts($ids: [Int!]) {
    removeProducts(ids: $ids)
  }
`;
