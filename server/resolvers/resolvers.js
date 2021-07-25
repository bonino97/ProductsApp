import bcryptjs from 'bcryptjs';

import { User } from '../models/user.js';
import { Product } from '../models/product.js';
import { Client } from '../models/client.js';
import { Order } from '../models/order.js';

import { createToken } from '../helpers/jwt.js';

export const resolvers = {
  Query: {
    // User Queries
    getUser: async (_, __, authenticatedUser) => {
      try {
        return authenticatedUser;
      } catch (e) {
        console.error(e);
        throw new Error(e);
      }
    },

    // Products Queries
    getProducts: async () => {
      try {
        const products = await Product.find();
        return products;
      } catch (e) {
        console.error(e);
        throw new Error(e);
      }
    },
    getProduct: async (_, { productId }) => {
      try {
        const product = await Product.findById(productId);
        if (!product) throw new Error('Product not found');
        return product;
      } catch (e) {
        console.error(e);
        throw new Error(e);
      }
    },

    // Client Queries
    getClients: async (_, __, authenticatedUser) => {
      try {
        const clients = await Client.find({ user: authenticatedUser.id });
        return clients;
      } catch (e) {
        console.error(e);
        throw new Error(e);
      }
    },
    getClient: async (_, { clientId }, authenticatedUser) => {
      try {
        const client = await Client.findById(clientId);
        if (!client) throw new Error('Client not found');
        if (String(client.user) !== String(authenticatedUser.id))
          throw new Error('User is not owner of client.');
        return client;
      } catch (e) {
        console.error(e);
        throw new Error(e);
      }
    },

    // Order Queries
    getOrders: async (_, __, authenticatedUser) => {
      try {
        const orders = await Order.find({ seller: authenticatedUser.id });
        return orders;
      } catch (e) {
        console.error(e);
        throw new Error(e);
      }
    },
    getOrder: async (_, { orderId }, authenticatedUser) => {
      try {
        const order = await Order.findOne({
          _id: orderId,
          seller: authenticatedUser.id,
        });
        if (!order) throw new Error('Order doesnt exist.');
        return order;
      } catch (e) {
        console.error(e);
        throw new Error(e);
      }
    },
    getOrdersByStatus: async (_, { orderStatus }, authenticatedUser) => {
      try {
        const orders = await Order.find({
          status: orderStatus,
          seller: authenticatedUser.id,
        });
        if (!orders) throw new Error('Order doesnt exist.');
        return orders;
      } catch (e) {
        console.error(e);
        throw new Error(e);
      }
    },

    // Advanced Queries
    bestClients: async (_, {}, authenticatedUser) => {
      try {
        const clients = await Order.aggregate([
          { $match: { status: 'COMPLETED' } },
          {
            $group: {
              _id: '$client',
              total: { $sum: '$total' },
            },
          },
          {
            $lookup: {
              from: 'clients',
              localField: '_id',
              foreignField: '_id',
              as: 'client',
            },
          },
          {
            $sort: { total: -1 },
          },
        ]);
        return clients;
      } catch (error) {
        console.error(e);
        throw new Error(e);
      }
    },
    bestSellers: async (_, {}, authenticatedUser) => {
      try {
        const sellers = await Order.aggregate([
          { $match: { status: 'COMPLETED' } },
          {
            $group: {
              _id: '$seller',
              total: { $sum: '$total' },
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: '_id',
              foreignField: '_id',
              as: 'seller',
            },
          },
          {
            $sort: { total: -1 },
          },
          {
            $limit: 5,
          },
        ]);
        return sellers;
      } catch (error) {
        console.error(e);
        throw new Error(e);
      }
    },
    getProductByName: async (_, { productName }, authenticatedUser) => {
      try {
        const products = await Product.find({
          $text: {
            $search: productName,
          },
        }).limit(10);

        return products;
      } catch (e) {
        console.error(e);
        throw new Error(e);
      }
    },
  },
  Mutation: {
    // User Mutations.
    addUser: async (_, { userInput }) => {
      try {
        const { email, password } = userInput;

        // Verify user doesnt exists.
        const userFound = await User.findOne({ email });

        if (userFound) throw new Error('Email exists.');

        // Hash password
        const salt = await bcryptjs.genSalt(10);
        userInput.password = await bcryptjs.hash(password, salt);

        // Save on Db
        const user = new User(userInput);

        user.save();

        return user;
      } catch (e) {
        console.error(e);
        throw new Error(e);
      }
    },
    authenticateUser: async (_, { authInput }) => {
      try {
        const { email, password } = authInput;
        const user = await User.findOne({ email });

        if (!user) throw new Error('User doesnt exist.');

        // Validate password.
        const validatePassword = await bcryptjs.compare(
          password,
          user.password
        );

        if (!validatePassword) throw new Error('Incorrect password.');

        // Return token.
        const token = await createToken(user);

        return { token };
      } catch (e) {
        console.error(e);
        throw new Error(e);
      }
    },

    // Products Mutations.
    addProduct: async (_, { productInput }) => {
      try {
        const newProduct = new Product(productInput);
        const product = await newProduct.save();
        return product;
      } catch (e) {
        console.error(e);
        throw new Error(e);
      }
    },
    updateProduct: async (_, { productId, productInput }) => {
      try {
        const existProduct = await Product.findById(productId);
        if (!existProduct) throw new Error('Product not found');
        const product = await Product.findOneAndUpdate(
          { _id: productId },
          productInput,
          {
            new: true,
          }
        );
        return product;
      } catch (e) {
        console.error(e);
        throw new Error(e);
      }
    },
    removeProduct: async (_, { productId }) => {
      try {
        const existProduct = await Product.findById(productId);
        if (!existProduct) throw new Error('Product not found');
        const product = await Product.findOneAndDelete({ _id: productId });
        return `${product.name} Removed successfully.`;
      } catch (e) {
        console.error(e);
        throw new Error(e);
      }
    },

    // Clients Mutations.
    addClient: async (_, { clientInput }, authenticatedUser) => {
      try {
        const { email } = clientInput;
        // Verify client existence
        const existClient = await Client.findOne({ email });
        if (existClient) throw new Error('Client exists.');

        // Add User who create Client.
        const client = new Client(clientInput);
        client.user = authenticatedUser.id;

        // Save on Db
        const result = client.save();
        return result;
      } catch (e) {
        console.error(e);
        throw new Error(e);
      }
    },
    updateClient: async (_, { clientId, clientInput }, authenticatedUser) => {
      try {
        const existClient = await Client.findById(clientId);
        if (!existClient) throw new Error('Client not found.');
        if (String(existClient.user) !== String(authenticatedUser.id))
          throw new Error('User is not owner of client.');

        const client = await Client.findOneAndUpdate(
          { _id: clientId },
          clientInput,
          {
            new: true,
          }
        );

        return client;
      } catch (e) {
        console.error(e);
        throw new Error(e);
      }
    },
    removeClient: async (_, { clientId }, authenticatedUser) => {
      try {
        const existClient = await Client.findById(clientId);
        if (!existClient) throw new Error('Client not found');
        const client = await Client.findOneAndDelete({
          _id: clientId,
          user: String(authenticatedUser.id),
        });
        if (!client)
          throw new Error(
            'Error ocurred removing client. Maybe you are not the owner.'
          );
        return `${client.name} Removed successfully.`;
      } catch (e) {
        console.error(e);
        throw new Error(e);
      }
    },

    // Orders Mutations.
    newOrder: async (_, { orderInput }, authenticatedUser) => {
      try {
        const { client, order } = orderInput;
        //Verify if client exists.
        const existClient = await Client.findById(client);
        if (!existClient) throw new Error('Client not found');

        //Verify if client is from seller.
        if (String(existClient.user) !== String(authenticatedUser.id))
          throw new Error('User is not owner of client.');

        //Verify stock
        for await (let orderProduct of order) {
          const { productId, quantity } = orderProduct;
          const product = await Product.findById(productId);
          if (!product) throw new Error('Product not found');
          if (product.stock < quantity)
            throw new Error(
              `${product.name} doesnt have stock, actual stock ${product.stock}`
            );

          product.stock = product.stock - quantity;
          await product.save();
        }

        //Create order
        const newOrder = new Order(orderInput);

        //Assing Seller.
        newOrder.seller = authenticatedUser.id;

        //Save on DB
        const result = newOrder.save();
        return result;
      } catch (e) {
        console.error(e);
        throw new Error(e);
      }
    },
    updateOrder: async (_, { orderId, orderInput }, authenticatedUser) => {
      try {
        const { client, order } = orderInput;
        //Verify if order exists
        const existOrder = await Order.findById(orderId);
        if (!existOrder) throw new Error('Order not found');

        //Verify if client exists.
        const existClient = await Client.findById(client);
        if (!existClient) throw new Error('Client not found');

        //Verify if client is from seller.
        if (String(existClient.user) !== String(authenticatedUser.id))
          throw new Error('User is not owner of client.');

        //Verify stock
        for await (let orderProduct of order) {
          const { productId, quantity } = orderProduct;
          const product = await Product.findById(productId);
          if (!product) throw new Error('Product not found');
          if (product.stock < quantity)
            throw new Error(
              `${product.name} doesnt have stock, actual stock ${product.stock}`
            );

          product.stock = product.stock - quantity;
          await product.save();
        }

        //Create order
        const updatedOrder = await Order.findOneAndUpdate(
          { _id: orderId },
          orderInput,
          { new: true }
        );

        return updatedOrder;
      } catch (e) {
        console.error(e);
        throw new Error(e);
      }
    },
    removeOrder: async (_, { orderId }, authenticatedUser) => {
      try {
        const order = await Order.findById(orderId);
        if (!order) throw new Error('Order doesnt exist.');
        if (String(order.seller) !== String(authenticatedUser.id))
          throw new Error('User is not the owner of this order.');
        await Order.findOneAndDelete({ _id: orderId });
        return 'Order Removed successfully.';
      } catch (e) {
        console.error(e);
        throw new Error(e);
      }
    },
  },
};
