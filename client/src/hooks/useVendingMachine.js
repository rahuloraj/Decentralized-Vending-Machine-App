import { useState, useEffect } from 'react';
import useContract from './useContract';

const useVendingMachine = () => {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [showPurchases, setShowPurchases] = useState(false);
  const [balance, setBalance] = useState(0);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    account, 
    getAllProducts, 
    getBalance, 
    purchaseProduct, 
    addFunds, 
    consumeProduct
  } = useContract();

  const addMoney = async (amount) => {
    if (amount <= 0) return;
    await addFunds(amount);
    const newBalance = await getBalance();
    setBalance(newBalance);
  };

  const selectProduct = (code) => {
    setSelectedProduct(code);
  };

  const clearSelection = () => {
    setSelectedProduct('');
  };

  const makePurchase = async () => {
    if (!selectedProduct) return;

    const product = products.find(p => p.code === selectedProduct);
    if (!product) return;

    if (product.price > balance) {
      alert('Insufficient funds!');
      return;
    }

    await purchaseProduct(product.code);
    const newBalance = await getBalance();
    setBalance(newBalance);
    setSelectedProduct('');
  };

  const consumeItem = async (purchaseId) => {
    await consumeProduct(purchaseId);
  };

  const loadInit = async () => {
    if (!account) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const fetchedProducts = await getAllProducts();
      setProducts(fetchedProducts);
      const currentBalance = await getBalance();
      setBalance(currentBalance);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInit();
  }, [account]);

  return {
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
  };
};

export default useVendingMachine;