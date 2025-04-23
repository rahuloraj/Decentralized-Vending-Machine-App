
function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-container">
      <div className="error-icon">❌</div>
      <h3>Oops! Something went wrong</h3>
      <p>{message || 'Failed to load products'}</p>
      {onRetry && (
        <button className="retry-button" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
