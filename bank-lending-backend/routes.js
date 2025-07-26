const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('./db');

// ✅ Create Loan (LEND)
router.post('/loans', (req, res) => {
  const { customer_id, loan_amount, loan_period_years, interest_rate_yearly } = req.body;

  if (!customer_id || !loan_amount || !loan_period_years || !interest_rate_yearly) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const interest = loan_amount * loan_period_years * (interest_rate_yearly / 100);
  const total_amount = loan_amount + interest;
  const monthly_emi = parseFloat((total_amount / (loan_period_years * 12)).toFixed(2));
  const loan_id = uuidv4();
  const created_at = new Date().toISOString();

  db.run(`INSERT INTO loans (loan_id, customer_id, principal, interest_rate, loan_period_years, total_amount, monthly_emi, status, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [loan_id, customer_id, loan_amount, interest_rate_yearly, loan_period_years, total_amount, monthly_emi, 'ACTIVE', created_at],
    function (err) {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.status(201).json({
        loan_id,
        customer_id,
        total_amount_payable: total_amount,
        monthly_emi
      });
    });
});

// ✅ Record Payment (PAYMENT)
router.post('/loans/:loan_id/payments', (req, res) => {
  const { loan_id } = req.params;
  const { amount, payment_type } = req.body;

  if (!amount || !payment_type) {
    return res.status(400).json({ error: 'Amount and payment type are required' });
  }

  const payment_id = uuidv4();
  const payment_date = new Date().toISOString();

  db.get(`SELECT * FROM loans WHERE loan_id = ?`, [loan_id], (err, loan) => {
    if (err || !loan) return res.status(404).json({ error: 'Loan not found' });

    const updated_total_paid = (loan.amount_paid || 0) + amount;
    const remaining_balance = loan.total_amount - updated_total_paid;
    const emis_left = Math.max(0, Math.ceil(remaining_balance / loan.monthly_emi));

    db.run(`UPDATE loans SET amount_paid = ? WHERE loan_id = ?`, [updated_total_paid, loan_id]);
    db.run(`INSERT INTO payments (payment_id, loan_id, amount, payment_type, payment_date)
            VALUES (?, ?, ?, ?, ?)`,
      [payment_id, loan_id, amount, payment_type, payment_date]);

    res.status(200).json({
      payment_id,
      loan_id,
      message: 'Payment recorded successfully.',
      remaining_balance: parseFloat(remaining_balance.toFixed(2)),
      emis_left
    });
  });
});

// ✅ View Loan Ledger (LEDGER)
router.get('/loans/:loan_id/ledger', (req, res) => {
  const { loan_id } = req.params;

  db.get(`SELECT * FROM loans WHERE loan_id = ?`, [loan_id], (err, loan) => {
    if (err || !loan) return res.status(404).json({ error: 'Loan not found' });

    db.all(`SELECT * FROM payments WHERE loan_id = ? ORDER BY payment_date`, [loan_id], (err, payments) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch transactions' });

      const remaining_balance = loan.total_amount - (loan.amount_paid || 0);
      const emis_left = Math.max(0, Math.ceil(remaining_balance / loan.monthly_emi));

      res.status(200).json({
        loan_id: loan.loan_id,
        customer_id: loan.customer_id,
        principal: loan.principal,
        total_amount: loan.total_amount,
        monthly_emi: loan.monthly_emi,
        amount_paid: loan.amount_paid || 0,
        balance_amount: parseFloat(remaining_balance.toFixed(2)),
        emis_left,
        transactions: payments.map(p => ({
          transaction_id: p.payment_id,
          date: p.payment_date,
          amount: p.amount,
          type: p.payment_type
        }))
      });
    });
  });
});

// ✅ View All Loans (ACCOUNT OVERVIEW)
router.get('/customers/:customer_id/overview', (req, res) => {
  const { customer_id } = req.params;

  db.all(`SELECT * FROM loans WHERE customer_id = ?`, [customer_id], (err, loans) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch loans' });
    if (loans.length === 0) return res.status(404).json({ error: 'No loans found for this customer' });

    const summary = loans.map(loan => {
      const total_interest = loan.total_amount - loan.principal;
      const remaining = loan.total_amount - (loan.amount_paid || 0);
      const emis_left = Math.max(0, Math.ceil(remaining / loan.monthly_emi));

      return {
        loan_id: loan.loan_id,
        principal: loan.principal,
        total_amount: loan.total_amount,
        total_interest: parseFloat(total_interest.toFixed(2)),
        emi_amount: loan.monthly_emi,
        amount_paid: loan.amount_paid || 0,
        emis_left
      };
    });

    res.status(200).json({
      customer_id,
      total_loans: loans.length,
      loans: summary
    });
  });
});

module.exports = router;