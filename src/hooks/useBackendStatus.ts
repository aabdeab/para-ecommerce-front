import { useState, useEffect } from 'react';
import { apiClient } from '../api/apiClient';

export const useBackendStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [isChecking, setIsChecking] = useState(false);

  const checkBackendStatus = async () => {
    setIsChecking(true);
    try {
      // Try to ping a simple endpoint
      await apiClient.get('/api/health');
      setIsOnline(true);
    } catch (error) {
      setIsOnline(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkBackendStatus();
    
    // Check backend status every 30 seconds
    const interval = setInterval(checkBackendStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { isOnline, isChecking, checkBackendStatus };
};