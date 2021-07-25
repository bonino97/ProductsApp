import { gql } from 'apollo-server';

// Schemas
export const typeDefs = gql(`

    type Token {
        token: String
    }

    input AuthInput {
        email: String!
        password: String!
    }

    type User {
        id: ID
        name: String
        lastName: String
        email: String
    }

    input UserInput {
        name: String!
        lastName: String!
        email: String!
        password: String!
    }

    type Product {
        id: ID
        name: String
        stock: Int
        price: Float
    }

    input ProductInput {
        name: String!
        stock: Int!
        price: Float!
    }

    type Client {
        id: ID
        name: String
        lastName: String
        enterprise: String
        email: String
        phone: String
        user: ID
    }

    input ClientInput {
        name: String!
        lastName: String!
        enterprise: String!
        email: String!
        phone: String
    }

    type Order {
        id: ID
        order: [OrderProducts]
        total: Float
        client: ID
        seller: ID
        status: OrderStatus
    }

    type OrderProducts {
        productId: ID
        quantity: Int
    }

    enum OrderStatus {
        PENDING
        COMPLETED
        CANCELLED
    }


    input OrderInput {
        client: ID!
        order: [OrderProductsInput]
        total: Float!
        status: OrderStatus
    }

    input OrderProductsInput {
        productId: ID
        quantity: Int
    }

    type TopClient {
        total: Float
        client: [Client]
    }

    type TopSellers {
        total: Float
        seller: [User]
    }

    type Query {
        # Users
        getUser: User
        
        # Products
        getProducts: [Product]
        getProduct(productId: ID!): Product

        # Clients
        getClients: [Client]
        getClient(clientId: ID!): Client

        # Orders
        getOrders: [Order]
        getOrder(orderId: ID!): Order
        getOrdersByStatus(orderStatus: OrderStatus): [Order]

        # Advanced Queries
        bestClients: [TopClient]
        bestSellers: [TopSellers]
        getProductByName(productName: String!): [Product]
    }

    type Mutation {
        # Users
        addUser(userInput: UserInput): User
        authenticateUser(authInput: AuthInput): Token

        # Products
        addProduct(productInput: ProductInput): Product
        updateProduct(productId: ID!, productInput: ProductInput): Product
        removeProduct(productId: ID!): String

        # Clients
        addClient(clientInput: ClientInput): Client
        updateClient(clientId: ID!, clientInput: ClientInput): Client
        removeClient(clientId: ID!): String

        # Order
        newOrder(orderInput: OrderInput): Order
        updateOrder(orderId: ID!, orderInput: OrderInput): Order
        removeOrder(orderId: ID!): String
    }

`);
