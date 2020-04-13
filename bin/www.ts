#!/usr/bin/env node
require('dotenv').config();
import { createServer as createHttpServer } from 'http';
import { createServer as createHttpsServer } from 'https';
import { mountApolloOnExpressAndServer } from '../config/apollo_servers/graphql';
import App from '../App';

const createServer = process.env.PROTOCOL === 'http' ? createHttpServer : createHttpsServer;


const server = createServer(App);

// Applies ApolloServer as middleware on App and installs subscriptionHandlers on server
mountApolloOnExpressAndServer(App, server);

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
  return null;
})