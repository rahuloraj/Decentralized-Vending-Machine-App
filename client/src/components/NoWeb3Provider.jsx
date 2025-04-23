const IMAGES = {
  ethWallet: new URL('/ethereum-wallet.png', import.meta.url).href
}

function NoWeb3Provider() {
  return (
    <div className="no-web3-container">
      <div className="no-web3-content">
        <img
          src={IMAGES.ethWallet}
          alt="Ethereum Wallet"
          className="metamask-logo"
        />
        <h2>Web3 Wallet Required</h2>
        <p>Please install MetaMask or another Ethereum wallet to use this application. A Web3 wallet allows you to interact with the Ethereum blockchain and use our vending machine.</p>
        <a
          href="https://metamask.io/download/"
          target="_blank"
          rel="noopener noreferrer"
          className="install-button"
        >
          Install MetaMask
        </a>
        <p className="wallet-alternatives">
          Other options: <a href="https://www.coinbase.com/wallet" target="_blank" rel="noopener noreferrer">Coinbase Wallet</a>, <a href="https://brave.com/wallet/" target="_blank" rel="noopener noreferrer">Brave Wallet</a>
        </p>
      </div>
    </div>
  );
}

export default NoWeb3Provider;