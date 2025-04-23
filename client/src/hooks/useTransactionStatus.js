import { useState, useEffect } from 'react';
import { contractEvents } from './useContract';

const useTransactionStatus = () => {
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [txType, setTxType] = useState(null);

  useEffect(() => {
    const unsubscribe = contractEvents.on('transactionUpdate', (status) => {
      if (status.status === 'sending') {
        setTransactionLoading(true);
        setTxType(status.type);
      } else if (status.status === 'completed' || status.status === 'error') {
        setTransactionLoading(false);
        setTxType(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const getLoadingMessage = () => {
    switch (txType) {
      case 'purchase':
        return 'Purchasing product...';
      case 'consume':
        return 'Consuming product...';
      case 'addFunds':
        return 'Adding funds...';
      default:
        return 'Processing transaction...';
    }
  };

  return {
    transactionLoading,
    txType,
    getLoadingMessage
  };
};

export default useTransactionStatus;