// src/components/CreateLoan.js

import React, { useState } from 'react';
import { createLoan } from '../services/api';

function CreateLoan() {
  const [customer_id, setCustomerId] = useState('');
  const [loan_amount, setLoanAmount] = useState('');
  const [loan_period, setLoanPeriod] = useState('');
  const [interest_rate, setInterestRate] = useState('');
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createLoan({ customer_id, loan_amount, loan_period_years: loan_period, interest_rate_yearly: interest_rate });
      alert('Loan created successfully!');
      console.log(res.data);
    } catch (err) {
      alert('Error creating loan');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Create Loan</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Customer ID:</label>
          <input type="text" value={customer_id} onChange={(e) => setCustomerId(e.target.value)} required />
        </div>
        <div>
          <label>Loan Amount:</label>
          <input type="number" value={loan_amount} onChange={(e) => setLoanAmount(e.target.value)} required />
        </div>
        <div>
          <label>Loan Period (Years):</label>
          <input type="number" value={loan_period} onChange={(e) => setLoanPeriod(e.target.value)} required />
        </div>
        <div>
          <label>Interest Rate (% yearly):</label>
          <input type="number" value={interest_rate} onChange={(e) => setInterestRate(e.target.value)} required />
        </div>
        <button type="submit">Create Loan</button>
      </form>
    </div>
  );
}

export default CreateLoan;
