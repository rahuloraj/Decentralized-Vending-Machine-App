import { createContext, useContext, useEffect, useState } from 'react';

const Web3Context = createContext();

export function Web3Provider({ children }) {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [web3, setWeb3] = useState(null);

  useEffect(() => {
    if (typeof window.ethereum === 'undefined') {
      return;
    }

    window.ethereum.on('accountsChanged', (accounts) => {
      setAccount(accounts[0])
    });
  }, [account]);

  return (
    <Web3Context.Provider value={{
      account,
      setAccount,
      contract,
      setContract,
      web3,
      setWeb3
    }}>
      {children}
    </Web3Context.Provider>
  );
}

export const useWeb3 = () => useContext(Web3Context);
