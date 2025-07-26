// backend/routes/index.js
const express = require('express');
const router = express.Router();

const loanRoutes = require('./loans');
router.use('/loans', loanRoutes);

module.exports = router;
