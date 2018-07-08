const Worker = [
  `
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
    worker(code: Int!): Worker
    workers: [Worker]!
    workersReport(dateRange: [String!]): [Worker!]
  }
  
  extend type Mutation {
    createWorker(input: WorkerInput!): Worker
    updateWorker(id: Int!, input: WorkerInput!): Worker
    removeWorker(id: Int!): Worker
    removeWorkers(ids: [Int!]): [Int!]
  }
`,
];

export default Worker;
