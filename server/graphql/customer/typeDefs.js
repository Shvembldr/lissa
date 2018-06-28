const Customer = [
  `
  type Customer {
    id: Int!
    name: String!
  }
  
  input CustomerInput {
    name: String!
  }
  
  extend type Query {
    customers: [Customer]!
  }
  
  extend type Mutation {
    createCustomer(input: CustomerInput!): Customer
    updateCustomer(id: Int!, input: CustomerInput!): Customer
    removeCustomer(id: Int!): Customer
    removeCustomers(ids: [Int!]): [Int!]
  }  
`,
];

export default Customer;
