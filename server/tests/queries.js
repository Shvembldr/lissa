const user = {
  login: `
  mutation login($input: LoginInput!) {
    login(input: $input) {
      token
      refreshToken
    }
  }
`,
  getUser: `
    query user {
      me {
        name
        email
        role
      }
    }
  `,
};

const cards = {
  getCards: `
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
  `,
  getCardsMatch: `
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
  `,
  createCard: `
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
  `,
  updateCard: `
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
  `,
  removeCards: `
    mutation removeCards($ids: [Int!]) {
      removeCards(ids: $ids)
    }
  `,
};

const groups = {
  getGroups: `
    query groups {
      groups {
        id
        name
      }
    }
  `,
  createGroup: `
    mutation createGroup($input: GroupInput!) {
      createGroup(input: $input) {
        id
        name
      }
    }
  `,
  updateGroup: `
    mutation updateGroup($id: Int!, $input: GroupInput!) {
      updateGroup(id: $id, input: $input) {
        id
        name
      }
    }
  `,
  removeGroups: `
    mutation removeGroups($ids: [Int!]) {
      removeGroups(ids: $ids)
    }
  `,
};

const customers = {
  getCustomers: `
    query customers {
      customers {
        id
        name
      }
    }
  `,
  createCustomer: `
    mutation createCustomer($input: CustomerInput!) {
      createCustomer(input: $input) {
        id
        name
      }
    }
  `,
  updateCustomer: `
    mutation updateCustomer($id: Int!, $input: CustomerInput!) {
      updateCustomer(id: $id, input: $input) {
        id
        name
      }
    }
  `,
  removeCustomers: `
    mutation removeCustomers($ids: [Int!]) {
      removeCustomers(ids: $ids)
    }
  `,
};

const operations = {
  updateOperations: `
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
  `,
};

const products = {
  getProducts: `
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
  `,
  getProductsReport: `
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
  `,
  createProduct: `
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
  `,
  updateProduct: `
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
  `,
  removeProducts: `
    mutation removeProducts($ids: [Int!]) {
      removeProducts(ids: $ids)
    }
  `,
};

const workers = {
  getWorkers: `
    query workers {
      workers {
        id
        code
        name
        surname
      }
    }
  `,
  getWorkersReport: `
    query workersReport($dateRange: [String!]) {
      workersReport(dateRange: $dateRange) {
        id
        code
        name
        surname
        operations {
          id
          code
          price
          product {
            id
            vendorCode
            date
            count
          }
        }
      }
    }
  `,
  createWorker: `
    mutation createWorker($input: WorkerInput!) {
      createWorker(input: $input) {
        id
        code
        name
        surname
      }
    }
  `,
  updateWorker: `
    mutation updateWorker($id: Int!, $input: WorkerInput!) {
      updateWorker(id: $id, input: $input) {
        id
        code
        name
        surname
      }
    }
  `,
  removeWorkers: `
    mutation removeWorkers($ids: [Int!]) {
      removeWorkers(ids: $ids)
    }
  `,
};

const login = `
  mutation login($input: LoginInput!) {
    login(input: $input) {
      token
      refreshToken
    }
  }
`;

export {
  user, cards, customers, groups, operations, products, workers, login,
};
