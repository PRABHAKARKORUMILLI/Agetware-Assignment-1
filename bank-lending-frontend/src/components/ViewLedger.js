import React, { useState } from 'react';
import { getLedger } from '../services/api';

function ViewLedger() {
  const [loanId, setLoanId] = useState('');
  const [ledger, setLedger] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await getLedger(loanId);
    if (Array.isArray(data)) {
      setLedger(data);
    } else {
      setLedger([]);
    }
  };

  return (
    <div>
      <h2>📒 View Ledger</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={loanId}
          onChange={(e) => setLoanId(e.target.value)}
          placeholder="Enter Loan ID"
          required
        />
        <button type="submit">Get Ledger</button>
      </form>

      {ledger.length > 0 ? (
        <table border="1" cellPadding="5" style={{ marginTop: '10px' }}>
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {ledger.map((entry) => (
              <tr key={entry.payment_id}>
                <td>{entry.payment_id}</td>
                <td>{entry.amount}</td>
                <td>{entry.payment_type}</td>
                <td>{entry.payment_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No ledger data found</p>
      )}
    </div>
  );
}

export default ViewLedger;
