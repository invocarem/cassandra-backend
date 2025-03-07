# Cassandra Backend

A Node.js backend service for connecting to Apache Cassandra.

## Setup

1. Install dependencies:
   ```bash
   npm install
```
 
2. Create a .env file
```
CASSANDRA_HOST=localhost
CASSANDRA_PORT=9042
CASSANDRA_KEYSPACE=todo_app
CASSANDRA_USERNAME=your_username
CASSANDRA_PASSWORD=your_password
PORT=3000
```
3 Start the server
```
    node app.js
```
