const Worker = [`
  type Worker {
    id: Int!
    code: Int!
    name: String!
    surname: String!
    operations: [Operation]
  }
  
  input WorkerInput {
    code: Int!
    name: String!
    surname: String!
  }
  
  extend type Query {
    workers: [Worker]!
  }
  
  extend type Mutation {
    createWorker(input: WorkerInput!): Worker
    updateWorker(id: Int!, input: WorkerInput!): Worker
    removeWorker(id: Int!): Worker
    removeWorkers(ids: [Int!]): [Int!]
  }
`];

export default Worker;
