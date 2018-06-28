const Product = [
  `
  type Product {
    id: Int!
    vendorCode: String!
    operations: [Operation!]
    customer: Customer!
    group: Group
    size: Int!
    count: Int!
    date: String!
  }
  
  type ProductResponse {
    count: Int!
    rows: [Product!]
  }
  
  type ProductsReport {
    vendorCode: String!
    count: Int!
    price: Int!
    sum: Int!
  }
  
  type ProductsReportResponse {
    report: [ProductsReport!]
  }
  
  input ProductInput {
    vendorCode: String!
    customerId: Int!
    size: Int!
    count: Int!
    date: String!
  }
  
  extend type Query {
    products(match: String, filters: [String], 
    dates: [String!], limit: Int, offset: Int): ProductResponse
    productsReport(dateRange: [String!]): ProductsReportResponse
  }
    
  extend type Mutation {
    createProduct(input: ProductInput!): Product
    updateProduct(id: Int!, input: ProductInput!): Product
    removeProduct(id: Int!): Product
    removeProducts(ids: [Int!]): [Int!]
  }
`,
];

export default Product;
