import React from 'react';
import { useBackendStatus } from '../hooks/useBackendStatus';

const BackendStatusIndicator: React.FC = () => {
  const { isOnline, isChecking, checkBackendStatus } = useBackendStatus();

  if (isOnline && !isChecking) {
    return null;
  }

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
      isOnline ? 'bg-green-500' : 'bg-red-500'
    } text-white`}>
      <div className="flex items-center space-x-2">
        {isChecking && (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        )}
        <span>
          {isChecking ? 'Checking backend...' : 
           isOnline ? 'Backend is online' : 'Backend is offline'}
        </span>
        {!isOnline && (
          <button
            onClick={checkBackendStatus}
            className="ml-2 px-2 py-1 bg-white text-red-500 rounded text-sm hover:bg-gray-100"
          >
            Retry
          </button>
        )}
      </div>
      {!isOnline && (
        <p className="text-sm mt-1">
          Please make sure the Spring Boot backend is running on port 8080
        </p>
      )}
    </div>
  );
};

export default BackendStatusIndicator;