const Group = [
  `
  type Group {
    id: Int!
    name: String!
  }
  
  input GroupInput {
    name: String!
  }
  
  extend type Query {
    groups: [Group]!
  }
  
  extend type Mutation {
    createGroup(input: GroupInput!): Group
    updateGroup(id: Int!, input: GroupInput!): Group
    removeGroup(id: Int!): Group
    removeGroups(ids: [Int!]): [Int!]
  }  
`
];

export default Group;
