"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pubsub = void 0;
const graphql_redis_subscriptions_1 = require("graphql-redis-subscriptions");
exports.pubsub = new graphql_redis_subscriptions_1.RedisPubSub();
