const User = [`
  type User {
    id: Int!
    name: String!
    email: String!
  }
  
  type AuthPayload {
    token: String!
    refreshToken: String!
  }
  
  input UserInput {
    name: String!
    email: String!
    password: String!
  }
  
  input LoginInput {
    email: String!
    password: String!
  }
  
  extend type Query {
    me: User
    users: [User]
  }
  
  extend type Mutation {
    updateUser(id: Int!, input: UserInput!): User
    removeUser(id: Int!): User
    register(input: UserInput!): User
    login(input: LoginInput!): AuthPayload!
  }
`];

export default User;
