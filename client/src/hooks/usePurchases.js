import { useState, useEffect, useCallback } from 'react';
import useContract, { contractEvents } from './useContract';

const usePurchases = () => {
  const { getPurchases, account } = useContract();
  const [activeTab, setActiveTab] = useState('available');
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [transactionState, setTransactionState] = useState({
    type: null,
    status: null,
    hash: null
  });
  
  const availablePurchases = purchases.filter(p => !p.consumed);
  const consumedPurchases = purchases.filter(p => p.consumed);

  const fetchPurchases = useCallback(async () => {
    setLoading(true);
    try {
      const purchasesData = await getPurchases();
      setPurchases(purchasesData);
      return true;
    } catch (error) {
      console.error('Failed to fetch purchases:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [getPurchases]);

  useEffect(() => {
    const unsubscribe = contractEvents.on('transactionUpdate', (status) => {
      setTransactionState(status);
      
      if (status.status === 'completed' && 
          (status.type === 'purchase' || status.type === 'consume')) {
        fetchPurchases();
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, [fetchPurchases]);

  useEffect(() => {
    if (account) {
      fetchPurchases();
    }
  }, [account, fetchPurchases]);

  return {
    activeTab,
    setActiveTab,
    purchases,
    availablePurchases,
    consumedPurchases,
    fetchPurchases,
    loading,
    transactionState
  };
};

export default usePurchases;