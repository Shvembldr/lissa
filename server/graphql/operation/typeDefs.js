const Operation = [
  `
  type Operation {
    id: Int!
    code: Int!
    price: Int!
    worker: Worker
    card: Card
    product: Product
  }
  
  input OperationInput {
    id: Int
    price: Int
    workerCode: Int
  }
  
  extend type Mutation {
    updateOperations(input: [OperationInput!]): [Operation]
  }
`,
];

export default Operation;
