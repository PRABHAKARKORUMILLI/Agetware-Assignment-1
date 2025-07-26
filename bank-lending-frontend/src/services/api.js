const API_BASE = "http://localhost:3000/api/v1";

// Create Loan
export async function createLoan(data) {
  const res = await fetch(`${API_BASE}/lend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

// Make Payment
export async function makePayment(data) {
  const res = await fetch(`${API_BASE}/payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

// View Ledger
export async function getLedger(loanId) {
  const res = await fetch(`${API_BASE}/ledger/${loanId}`);
  return res.json();
}

// Account Overview
export async function getOverview(customerId) {
  const res = await fetch(`${API_BASE}/account/${customerId}`);
  return res.json();
}
