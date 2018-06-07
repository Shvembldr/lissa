const RootQuery = `
type Query {
  dummy: Int
}

type Mutation {
  dummy: Int
}

type Subscription {
  dummy: Int
}
`;
const SchemaDefinition = `
schema {
  query: Query
  mutation: Mutation
  subscription: Subscription
}
`;

export default [RootQuery,SchemaDefinition];