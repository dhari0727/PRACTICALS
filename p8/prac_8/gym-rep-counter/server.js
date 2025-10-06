// server.js
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware to serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html from /views
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
