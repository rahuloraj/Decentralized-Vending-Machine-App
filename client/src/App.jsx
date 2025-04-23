import { lazy } from 'react';
const VendingMachine = lazy(() => import('./components/VendingMachine'));
const PurchasesList = lazy(() => import('./components/PurchasesList'));
const NoWeb3Provider = lazy(() => import('./components/NoWeb3Provider'));
const NoContract = lazy(() => import('./components/NoContract'));

import WalletConnect from './components/WalletConnect';
import useVendingMachine from './hooks/useVendingMachine';
import useContract from './hooks/useContract';
import TransactionOverlay from './components/TransactionOverlay';
import './styles/index.css';

function App() {
  const {
    selectedProduct,
    showPurchases,
    balance,
    products,
    isLoading,
    error,
    addMoney,
    selectProduct,
    clearSelection,
    makePurchase,
    consumeItem,
    loadInit,
    setShowPurchases
  } = useVendingMachine();

  const { account } = useContract();

  if (typeof window.ethereum === 'undefined' && !isLoading) {
    return <NoWeb3Provider />
  }

  return (
    <>
      <WalletConnect />
      {(!account && !isLoading) ?
        <NoContract /> :
        <div className="app">
          <TransactionOverlay />

          <VendingMachine
            products={products}
            balance={balance}
            selectedProduct={selectedProduct}
            onSelectProduct={selectProduct}
            onClearSelection={clearSelection}
            onPurchase={makePurchase}
            onAddMoney={addMoney}
            onViewPurchases={() => setShowPurchases(true)}
            isLoading={isLoading}
            error={error}
            onRetry={loadInit}
          />
          {showPurchases &&
            <PurchasesList
              onClose={() => setShowPurchases(false)}
              onConsume={consumeItem}
            />}
        </div>
      }
    </>
  );
}

export default App;
