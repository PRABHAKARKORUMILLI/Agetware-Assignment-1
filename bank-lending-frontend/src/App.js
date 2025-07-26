import React from 'react';
import CreateLoan from './components/CreateLoan';
import MakePayment from './components/MakePayment';
import ViewLedger from './components/ViewLedger';
import AccountOverview from './components/AccountOverview';

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>🏦 Bank Lending System</h1>
      <CreateLoan />
      <hr />
      <MakePayment />
      <hr />
      <ViewLedger />
      <hr />
      <AccountOverview />
    </div>
  );
}

export default App;