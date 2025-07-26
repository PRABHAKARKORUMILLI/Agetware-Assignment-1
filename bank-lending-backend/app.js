// app.js (Backend)

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes'); // Your main route file

const app = express();

// Enable Cross-Origin Resource Sharing so frontend (localhost:3000 <-> 5173 etc.) can access the backend
app.use(cors());

// Parse incoming JSON request bodies
app.use(bodyParser.json());

// All API routes will start with /api/v1
app.use('/api/v1', routes);

// Start the backend server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
