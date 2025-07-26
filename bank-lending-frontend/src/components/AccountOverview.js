import React, { useState } from 'react';
import { getOverview } from '../services/api';

function AccountOverview() {
  const [customerId, setCustomerId] = useState('');
  const [loans, setLoans] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
const data = await getOverview(customerId);

    if (Array.isArray(data)) {
      setLoans(data);
    } else {
      setLoans([]);
    }
  };

  return (
    <div>
      <h2>📋 Account Overview</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          placeholder="Enter Customer ID"
          required
        />
        <button type="submit">Get Loans</button>
      </form>

      {loans.length > 0 ? (
        <table border="1" cellPadding="5" style={{ marginTop: '10px' }}>
          <thead>
            <tr>
              <th>Loan ID</th>
              <th>Principal</th>
              <th>Total Amount</th>
              <th>EMI</th>
              <th>Status</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan.loan_id}>
                <td>{loan.loan_id}</td>
                <td>{loan.principal}</td>
                <td>{loan.total_amount}</td>
                <td>{loan.monthly_emi}</td>
                <td>{loan.status}</td>
                <td>{loan.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No loans found</p>
      )}
    </div>
  );
}

export default AccountOverview;
