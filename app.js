const express = require('express');
const cors = require('cors');
const client = require('./config/cassandra');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for your iOS app
app.use(express.json());

// GET all todos
app.get('/todos', async (req, res) => {
  try {
    const query = 'SELECT id, title, description, is_completed FROM todos;';
    const result = await client.execute(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// POST a new todo
app.post('/todos', async (req, res) => {
  const { title, description } = req.body;
  const id = cassandra.types.Uuid.random();
  const query = 'INSERT INTO todos (id, title, description, is_completed) VALUES (?, ?, ?, false);';

  try {
    await client.execute(query, [id, title, description], { prepare: true });
    res.status(201).json({ id, title, description, is_completed: false });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
