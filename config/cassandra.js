require('dotenv').config();
const cassandra = require('cassandra-driver');

const client = new cassandra.Client({
  contactPoints: [`${process.env.CASSANDRA_HOST}:${process.env.CASSANDRA_PORT}`],
  localDataCenter: 'datacenter1', // Use your Cassandra datacenter name (default: datacenter1)
  keyspace: process.env.CASSANDRA_KEYSPACE,
  credentials: {
    username: process.env.CASSANDRA_USERNAME,
    password: process.env.CASSANDRA_PASSWORD
  }
});

module.exports = client;
