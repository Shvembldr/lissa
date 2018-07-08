import gql from 'graphql-tag';

export const getWorkers = gql`
  query workers {
    workers {
      id
      code
      name
      surname
    }
  }
`;

export const getWorker = gql`
  query worker($code: Int!) {
    worker(code: $code) {
      id
      code
      name
      surname
    }
  }
`;

export const getWorkersReport = gql`
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
`;

export const createWorker = gql`
  mutation createWorker($input: WorkerInput!) {
    createWorker(input: $input) {
      id
      code
      name
      surname
    }
  }
`;

export const updateWorker = gql`
  mutation updateWorker($id: Int!, $input: WorkerInput!) {
    updateWorker(id: $id, input: $input) {
      id
      code
      name
      surname
    }
  }
`;

export const removeWorkers = gql`
  mutation removeWorkers($ids: [Int!]) {
    removeWorkers(ids: $ids)
  }
`;
