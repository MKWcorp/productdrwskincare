import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSpinner, 
  faExclamationTriangle 
} from '@fortawesome/free-solid-svg-icons';
import { cn } from '../utils';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  className = '',
  size = 'md',
  message = 'Memuat produk...'
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  return (
    <div className={cn('drw-loading', className)}>
      <div className="text-center">
        <FontAwesomeIcon 
          icon={faSpinner} 
          className={cn('drw-loading-spinner', sizeClasses[size])}
          spin
        />
        {message && (
          <p className="mt-4 text-gray-600">{message}</p>
        )}
      </div>
    </div>
  );
};

interface ErrorMessageProps {
  className?: string;
  message: string;
  onRetry?: () => void;
  retryText?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  className = '',
  message,
  onRetry,
  retryText = 'Coba Lagi'
}) => {
  return (
    <div className={cn('drw-error', className)}>
      <div>
        <FontAwesomeIcon icon={faExclamationTriangle} className="drw-error-icon" />
        <div className="drw-error-message">
          {message}
        </div>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="drw-error-button"
          >
            {retryText}
          </button>
        )}
      </div>
    </div>
  );
};
