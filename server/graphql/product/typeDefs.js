const Product = [`
  type Product {
    id: Int!
    vendorCode: String!
    operations: [Operation!]
    group: Group!
    size: Int!
    count: Int!
    date: String!
  }
  
  input ProductInput {
    cardId: Int!
    size: Int!
    count: Int!
    date: String!
    groupId: Int!
  }
  
  extend type Query {
    products: [Product]!
  }
  
  extend type Mutation {
    createProduct(input: ProductInput!): Product
    updateProduct(id: Int!, input: ProductInput!): Product
    removeProduct(id: Int!): Product
  }
`];

export default Product;
