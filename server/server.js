const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Data file path
const dataFile = path.join(__dirname, 'data', 'tasks.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}

// Initialize tasks file if it doesn't exist
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.stringify([]));
}

// Helper function to read tasks
const readTasks = () => {
  const data = fs.readFileSync(dataFile, 'utf8');
  return JSON.parse(data);
};

// Helper function to write tasks
const writeTasks = (tasks) => {
  fs.writeFileSync(dataFile, JSON.stringify(tasks, null, 2));
};

// ========== API ROUTES ==========

// GET all tasks
app.get('/api/tasks', (req, res) => {
  try {
    const tasks = readTasks();
    // Sort by creation date (newest first)
    tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// POST create a new task
app.post('/api/tasks', (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    
    // Validation: title is required
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const tasks = readTasks();
    
    const newTask = {
      id: Date.now().toString(), // Simple unique ID
      title: title.trim(),
      description: description || '',
      dueDate: dueDate || null,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    writeTasks(tasks);
    
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT update a task
app.put('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, completed } = req.body;
    
    const tasks = readTasks();
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Update only provided fields
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      title: title !== undefined ? title.trim() : tasks[taskIndex].title,
      description: description !== undefined ? description : tasks[taskIndex].description,
      dueDate: dueDate !== undefined ? dueDate : tasks[taskIndex].dueDate,
      completed: completed !== undefined ? completed : tasks[taskIndex].completed,
      updatedAt: new Date().toISOString()
    };
    
    writeTasks(tasks);
    res.json(tasks[taskIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE a task
app.delete('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const tasks = readTasks();
    const filteredTasks = tasks.filter(task => task.id !== id);
    
    if (filteredTasks.length === tasks.length) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    writeTasks(filteredTasks);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});