const Operation = [`
  type Operation {
    id: Int!
    code: Int!
    price: Int!
    worker: Worker
    card: Card
    product: Product
  }
  
  input OperationInput {
    code: Int!
    price: Int!
    workerCode: Int
  }
  
  extend type Mutation {
    createOperation(input: OperationInput!, workerCode: Int!): Operation
    updateOperation(id: Int!, input: OperationInput!): Operation
    removeOperation(id: Int!): Operation
  }
`];

export default Operation;