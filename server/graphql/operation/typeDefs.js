const Operation = [`
  type Operation {
    id: Int!
    code: Int!
    price: Int!
    worker: Worker
  }
  
  input OperationInput {
    code: Int!
    price: Int!
  }
  
  extend type Mutation {
    createOperation(input: OperationInput!, workerId: Int!): Operation
    updateOperation(id: Int!, input: OperationInput!, workerId: Int!): Operation
    removeOperation(id: Int!): Operation
  }
`];

export default Operation;
