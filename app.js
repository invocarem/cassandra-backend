const cassandra = require('cassandra-driver');
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

app.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, is_completed } = req.body;
  console.log("update: " +title + ":" + description + ":" + is_completed);
  // Validate required fields (adjust as needed)
  if (!title && !description && typeof is_completed === 'undefined') {
    return res.status(400).json({ error: "No fields to update" });
  }

  try {
    // Build the CQL query dynamically based on provided fields
    const updates = [];
    const params = [];
    
    if (typeof title !== 'undefined') {
      updates.push('title = ?');
      params.push(title);
    }
    
    if (typeof description !== 'undefined') {
      updates.push('description = ?');
      params.push(description);
    }
    
    if (typeof is_completed !== 'undefined') {
      updates.push('is_completed = ?');
      params.push(is_completed);
    }

    // Add the todo ID to the parameters
    params.push(id);

    // Construct the query
    const query = `
      UPDATE todos 
      SET ${updates.join(', ')}
      WHERE id = ?
    `;

    await client.execute(query, params, { prepare: true });
    res.json({ success: true });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
