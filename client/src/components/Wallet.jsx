import React from 'react';

function Wallet({ balance }) {
  return (
    <div className="wallet">
      <h3>My Wallet</h3>
      <div className="wallet-balance">
        <p>Balance: ${balance.toFixed(2)}</p>
      </div>
    </div>
  );
}

export default Wallet;