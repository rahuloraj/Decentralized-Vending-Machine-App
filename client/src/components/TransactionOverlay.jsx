import useTransactionStatus from '../hooks/useTransactionStatus';

const TransactionOverlay = () => {
  const { transactionLoading, getLoadingMessage } = useTransactionStatus();

  if (!transactionLoading) return null;

  return (
    <div className="transaction-loading-overlay">
      <div className="transaction-loading-spinner"></div>
      <p>{getLoadingMessage()}</p>
    </div>
  );
};

export default TransactionOverlay;