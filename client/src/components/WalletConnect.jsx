import useContract from '../hooks/useContract';

const WalletConnect = () => {
  const { account, handleConnect } = useContract()

  return (
    <div className="wallet-connect">
      <div className="wallet-connect__container">
        <h1>Smart Vending Machine</h1>
        <button onClick={handleConnect} className="wallet-connect__button">
          {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect Wallet'}
        </button>
      </div>
    </div>
  );
};

export default WalletConnect;