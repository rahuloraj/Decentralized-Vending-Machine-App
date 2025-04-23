import useContract from "../hooks/useContract";

function NoContract() {
  const { handleConnect } = useContract()

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
    }}>
      <div style={{
        maxWidth: '24rem',
        border: '1px dashed #202032',
        padding: '2rem',
        borderRadius: '12px',
        textAlign: 'center',
      }}>
        <h1>Welcome</h1>
        <p>Please connect your wallet to continue.</p>
        <button
          onClick={handleConnect}
          style={{ backgroundColor: '#3b82f6', color: 'white', padding: '12px', borderRadius: '12px', border: 'none', marginTop: '1rem', cursor: 'pointer' }}
        >
          Connect Wallet
        </button>
      </div>
    </div>
  );
}

export default NoContract;