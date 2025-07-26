import React, { useState } from 'react';
import { makePayment } from '../services/api';

function MakePayment() {
  const [form, setForm] = useState({
    loan_id: '',
    amount: '',
    payment_type: ''
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      loan_id: form.loan_id,
      amount: parseFloat(form.amount),
      payment_type: form.payment_type
    };
    const res = await makePayment(data);
    setResult(res);
  };

  return (
    <div>
      <h2>Make a Payment</h2>
      <form onSubmit={handleSubmit}>
        <input name="loan_id" placeholder="Loan ID" onChange={handleChange} required />
        <input name="amount" placeholder="Amount" type="number" onChange={handleChange} required />
        <select name="payment_type" onChange={handleChange} required>
          <option value="">-- Select Payment Type --</option>
          <option value="EMI">EMI</option>
          <option value="LUMPSUM">LUMPSUM</option>
        </select>
        <button type="submit">Pay</button>
      </form>

      {result && (
        <div>
          <p><strong>Message:</strong> {result.message}</p>
        </div>
      )}
    </div>
  );
}

export default MakePayment;
