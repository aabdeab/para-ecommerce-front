import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorHandler, ErrorType } from '../utils/errorHandler';
import type { AppError } from '../utils/errorHandler';
import { useAuth } from '../context/AuthContext';

export const useErrorHandler = () => {
  const [error, setError] = useState<AppError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleError = useCallback((error: any) => {
    const appError = ErrorHandler.handleError(error);
    setError(appError);

    // Auto-redirect based on error type
    if (ErrorHandler.shouldRedirectToLogin(appError)) {
      logout();
      navigate('/Auth');
    } else if (ErrorHandler.shouldShowErrorPage(appError)) {
      navigate('/error', { 
        state: { 
          statusCode: appError.statusCode, 
          message: appError.message 
        } 
      });
    }

    return appError;
  }, [navigate, logout]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const executeAsync = useCallback(async <T>(
    asyncFunction: () => Promise<T>,
    onSuccess?: (result: T) => void,
    onError?: (error: AppError) => void
  ): Promise<T | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await asyncFunction();
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      const appError = handleError(err);
      
      if (onError) {
        onError(appError);
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const showErrorToast = useCallback((message: string, type: ErrorType = ErrorType.UNKNOWN_ERROR) => {
    const appError: AppError = {
      type,
      message
    };
    setError(appError);

    // Auto-clear after 5 seconds
    setTimeout(() => {
      setError(null);
    }, 5000);
  }, []);

  return {
    error,
    isLoading,
    handleError,
    clearError,
    executeAsync,
    showErrorToast
  };
};