// backend/routes/loans.js

const express = require('express');
const router = express.Router();
const db = require('../db');
const { v4: uuidv4 } = require('uuid');

// Create Loan
router.post('/', (req, res) => {
  const { customer_id, loan_amount, loan_period_years, interest_rate_yearly } = req.body;

  if (!customer_id || !loan_amount || !loan_period_years || !interest_rate_yearly) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const principal = parseFloat(loan_amount);
  const interestRate = parseFloat(interest_rate_yearly);
  const period = parseInt(loan_period_years);

  const interest = (principal * interestRate * period) / 100;
  const total = principal + interest;
  const monthlyEMI = parseFloat((total / (period * 12)).toFixed(2));

  const loan_id = uuidv4();
  const created_at = new Date().toISOString();

  console.log(`Creating loan for ${customer_id}`);
  db.run(
    `INSERT INTO loans 
      (loan_id, customer_id, principal, interest_rate, loan_period_years, total_amount, monthly_emi, status, created_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [loan_id, customer_id, principal, interestRate, period, total, monthlyEMI, 'ongoing', created_at],
    function (err) {
      if (err) {
        console.error('DB Error:', err.message);
        return res.status(500).json({ error: 'Failed to create loan' });
      }

      // Insert customer only if not already exists (safe insert)
      db.run(
        `INSERT OR IGNORE INTO customers (customer_id, name, created_at)
         VALUES (?, ?, ?)`,
        [customer_id, `Customer ${customer_id}`, created_at]
      );

      return res.status(201).json({
        message: 'Loan created',
        loan_id,
        total_amount: total,
        monthly_emi: monthlyEMI
      });
    }
  );
});

module.exports = router;
