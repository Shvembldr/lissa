const Product = [`
  type Product {
    id: Int!
    vendorCode: String!
    operations: [Operation!]
    group: Group
    size: Int!
    count: Int!
    date: String!
  }
  
  type ProductResponse {
    count: Int!
    rows: [Product!]
  }
  
  input ProductInput {
    vendorCode: String!
    size: Int!
    count: Int!
    date: String!
  }
  
  extend type Query {
    products(match: String, filters: [String], 
    dates: [String!], limit: Int, offset: Int): ProductResponse
  }
  
  extend type Mutation {
    createProduct(input: ProductInput!): Product
    updateProduct(id: Int!, input: ProductInput!): Product
    removeProduct(id: Int!): Product
    removeProducts(ids: [Int!]): [Int!]
  }
`];

export default Product;
