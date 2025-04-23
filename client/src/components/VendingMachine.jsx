import { useState } from 'react';
import { imageGateway } from '../config/contract';
import usePurchases from '../hooks/usePurchases';

function VendingMachine({
  products,
  balance,
  selectedProduct,
  onSelectProduct,
  onClearSelection,
  onPurchase,
  onAddMoney,
  onViewPurchases,
  isLoading,
  error,
  onRetry
}) {
  const [customAmount, setCustomAmount] = useState('');
  const { purchases } = usePurchases();

  const handleClear = () => {
    onClearSelection();
  };

  const handlePurchase = () => {
    onPurchase();
  };

  const handleAddCustomAmount = () => {
    onAddMoney(Number(customAmount));
    setCustomAmount('');
  };

  if (isLoading) {
    return (
      <div className='loading-container'>
        <div className="loading-spinner-initial"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={onRetry} />;
  }

  return (
    <div className="vending-machine">
      <div className="main-content">
        <div className="products-section">
          <h2 className='products-section--title'>SNACKS & DRINKS</h2>

          <div className='products-grid'>
            {products.map(product => (
              <div key={product?.code}>
                <div
                  onClick={() => onSelectProduct(product?.code)}
                  className={`product-item ${selectedProduct === (product?.code) ? 'selected' : ''}`}>
                  <div className="product-code">{product?.code}</div>
                  <div className="product-image">
                    <img src={`${imageGateway}${product.image}`} alt={product?.name} loading='eager' />
                  </div>
                  <div className="product-price">${Number(product?.price).toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="control-section">
          <div className="keypad-section">
            <div className="display">
              <div className="display-text">
                {selectedProduct
                  ? `Selected: ${selectedProduct}`
                  : 'Select your favorite product'}
              </div>
            </div>

            <div className="keypad">
              <button
                className="keypad-button clear-button"
                onClick={handleClear}
              >
                Clear
              </button>
            </div>

            <button
              className="purchase-button"
              onClick={handlePurchase}
              disabled={!selectedProduct || balance < (products.find(p => p.id === selectedProduct)?.price || 0)}
            >
              Purchase
            </button>
          </div>

          <div className="payment-section">
            <h3>Payment System</h3>
            <div className="display">
              <div className="display-amount">${Number(balance).toFixed(2)}</div>
            </div>

            <div className="amount-input">
              <input
                type="number"
                placeholder="Amount"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
              />
              <button
                className="add-button"
                onClick={handleAddCustomAmount}
              >
                Add
              </button>
            </div>

            <div className="quick-amounts">
              <button onClick={() => onAddMoney(1)}>$1</button>
              <button onClick={() => onAddMoney(5)}>$5</button>
              <button onClick={() => onAddMoney(10)}>$10</button>
            </div>
          </div>
        </div>
      </div>

      <button
        className="view-purchases-button"
        onClick={onViewPurchases}
      >
        View My Purchases ({purchases.length})
      </button>
    </div>
  );
}

export default VendingMachine;