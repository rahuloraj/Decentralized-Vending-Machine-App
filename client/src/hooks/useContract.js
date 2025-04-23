import { useWeb3 } from '../context/Web3Context';
import Web3 from 'web3';
import { useState, useCallback } from 'react';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contract';
import contractEvents from '../services/contractEvents';
export { default as contractEvents } from '../services/contractEvents';

const useContract = () => {
  const { 
    account, 
    setAccount, 
    contract, 
    setContract, 
    web3, 
    setWeb3 
  } = useWeb3();

  const [transactionStatus, setTransactionStatus] = useState({
    type: null,
    status: null,
    hash: null,
    timestamp: null
  });

  const updateTransactionStatus = useCallback((newStatus) => {
    const statusWithTimestamp = {
      ...newStatus,
      timestamp: Date.now() 
    };
    setTransactionStatus(statusWithTimestamp);
    contractEvents.emit('transactionUpdate', statusWithTimestamp);
  }, []);

  const handleConnect = useCallback(async () => {
    if (typeof window.ethereum !== 'undefined') {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
      
      try {
        const contractInstance = new web3Instance.eth.Contract(
          CONTRACT_ABI,
          CONTRACT_ADDRESS
        );
        setContract(contractInstance);

        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        setAccount(accounts[0]);        
        window.ethereum.on('accountsChanged', (newAccounts) => {
          setAccount(newAccounts[0] || '');
        });
      } catch (error) {
        console.error('connect', error.message || 'User denied account access');
        throw error;
      }
    } else {
      const error = 'MetaMask is not installed';
      console.error('connect', error);
      throw new Error(error);
    }
  }, [setWeb3, setContract, setAccount]);

  const getAllProducts = useCallback(async () => {
    if (!contract) return [];
    
    try {
      const products = await contract.methods.getAllProducts().call();
      return products.map(product => ({
        code: product.code,
        price: web3.utils.fromWei(product.price, 'gwei'),
        name: product.name,
        image: product.imageCID
      }));
    } catch (error) {
      console.error('Failed to fetch products:', error);
      return [];
    }
  }, [contract, web3]);

  const getBalance = useCallback(async () => {
    if (!contract || !account)  return '0';

    try {
      const balance = await contract.methods.getBalance().call({ from: account });
      return web3.utils.fromWei(balance, 'gwei');
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      return '0';
    }
  }, [contract, account, web3]);

  const purchaseProduct = useCallback(async (code) => {
    if (!contract || !account) return false;
    
    try {
      await contract.methods.purchaseProduct(code).send({
        from: account,
        gas: 300000
      })
      .on('sent', (hash) => {
        updateTransactionStatus({
          type: 'purchase',
          status: 'sending',
          hash
        });
      })
      .on('receipt', (receipt) => {
        updateTransactionStatus({
          type: 'purchase',
          status: 'completed',
          hash: receipt.transactionHash
        });
      })
      .on('error', (error) => {
        updateTransactionStatus({
          type: 'purchase',
          status: 'error',
          hash: null,
          error: error.message
        });
        throw error;
      });

      return true;
    } catch (error) {
      console.error('Product purchase failed:', error);
      return false;
    }
  }, [contract, account, updateTransactionStatus]);

  const addFunds = useCallback(async (funds) => {
    if (!contract || !account) return false;

    try {
      const fundsInGwei = web3.utils.toWei(funds.toString(), 'gwei');
      
      await contract.methods.addFunds().send({
        from: account,
        value: fundsInGwei
      })
      .on('sent', (hash) => {
        updateTransactionStatus({
          type: 'addFunds',
          status: 'sending',
          hash
        });
      })
      .on('receipt', (receipt) => {
        updateTransactionStatus({
          type: 'addFunds',
          status: 'completed',
          hash: receipt.transactionHash
        });
      })
      .on('error', (error) => {
        updateTransactionStatus({
          type: 'addFunds',
          status: 'error',
          hash: null,
          error: error.message
        });
        throw error;
      });

      return true;
    } catch (error) {
      console.error('Add funds failed:', error);
      return false;
    }
  }, [contract, account, web3, updateTransactionStatus]);

  const getPurchases = useCallback(async () => {
    if (!contract || !account) return [];

    try {
      const purchases = await contract.methods.getAllPurchases(account).call({ from: account });
      return purchases.map(purchase => ({
        id: purchase.id,
        name: purchase.name,
        image: purchase.image,
        price: web3.utils.fromWei(purchase.price, 'gwei'),
        date: purchase.purchaseDate,
        consumed: purchase.consumed
      }));
    } catch (error) {
      console.error('Failed to fetch purchases:', error);
      return [];
    }
  }, [contract, account, web3]);

  const consumeProduct = useCallback(async (index) => {
    if (!contract || !account) return false;

    try {
      await contract.methods.consumePurchase(index).send({ from: account })
      .on('sent', (hash) => {
        updateTransactionStatus({
          type: 'consume',
          status: 'sending',
          hash
        });
      })
      .on('receipt', (receipt) => {
        updateTransactionStatus({
          type: 'consume',
          status: 'completed',
          hash: receipt.transactionHash
        });
      })
      .on('error', (error) => {
        updateTransactionStatus({
          type: 'consume',
          status: 'error',
          hash: null,
          error: error.message
        });
        throw error;
      });
      
      return true;
    } catch (error) {
      console.error('Product consumption failed:', error);
      return false;
    }
  }, [contract, account, updateTransactionStatus]);

  return {
    contract,
    web3,
    account,
    getAllProducts,
    getBalance,
    purchaseProduct,
    getPurchases,
    consumeProduct,
    addFunds,
    handleConnect,
    transactionStatus
  };
};

export default useContract;