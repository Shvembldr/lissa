const Card = [`
  type Card {
    id: Int!
    vendorCode: String!
    size: Int!
    count: Int!
    date: String!
    operations: [Operation]
    group: Group
  }
  
  input CardInput {
    vendorCode: String!
    size: Int!
    count: Int!
    date: String!
    groupId: Int!
  }
  
  extend type Query {
    card(id: Int!): Card!
    cards: [Card]!
  }
  
  extend type Mutation {
    createCard(input: CardInput!, operationCount: Int): Card
    updateCard(id: Int!, input: CardInput!): Card
    removeCard(id: Int!): Card
  }
`];

export default Card;
