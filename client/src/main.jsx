import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Web3Provider } from './context/Web3Context.jsx'
import { Helmet, HelmetProvider } from 'react-helmet-async'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <Helmet>
        <title>Vending Machine Dapp - Ethereum Powered Vending</title>
        <meta name="description" content="A blockchain-powered vending machine application that allows users to purchase and consume virtual products using Ethereum." />
        <meta name="keywords" content="ethereum, blockchain, vending machine, dapp, web3, decentralized application" />
        <meta name="author" content="Lenugo" />
        <meta property="og:title" content="Vending Machine Dapp" />
        <meta property="og:description" content="Purchase and consume virtual products using Ethereum" />
        <meta property="og:image" content="https://lenugo.github.io/vending-machine-dapp/dapp-preview.png" />
        <meta property="og:url" content="https://lenugo.github.io/vending-machine-dapp/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://lenugo.github.io/vending-machine-dapp/" />
      </Helmet>
      <Web3Provider>
        <App />
      </Web3Provider>
    </HelmetProvider>
  </StrictMode>,
)
