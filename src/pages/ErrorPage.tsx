import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../Components/ui/card';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

interface ErrorPageProps {
  statusCode?: number;
  message?: string;
  showRetry?: boolean;
  onRetry?: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ 
  statusCode = 500, 
  message = "Something went wrong on our end. Please try again later.",
  showRetry = true,
  onRetry 
}) => {
  const navigate = useNavigate();

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const getErrorTitle = () => {
    switch (statusCode) {
      case 404:
        return "Page Not Found";
      case 403:
        return "Access Denied";
      case 401:
        return "Authentication Required";
      case 500:
      default:
        return "Server Error";
    }
  };

  const getErrorIcon = () => {
    switch (statusCode) {
      case 404:
        return "🔍";
      case 403:
        return "🚫";
      case 401:
        return "🔐";
      case 500:
      default:
        return "⚠️";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {getErrorTitle()}
          </CardTitle>
          <div className="text-4xl mb-2">{getErrorIcon()}</div>
          <p className="text-lg font-semibold text-red-600">
            Error {statusCode}
          </p>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            {message}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Button>
            
            {showRetry && (
              <Button
                onClick={handleRetry}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
            )}
          </div>

          {statusCode === 500 && (
            <div className="mt-6 text-sm text-gray-500 bg-gray-100 p-3 rounded-lg">
              <p className="font-medium mb-1">What can you do?</p>
              <ul className="text-left space-y-1">
                <li>• Wait a few minutes and try again</li>
                <li>• Check your internet connection</li>
                <li>• Contact support if the problem persists</li>
              </ul>
            </div>
          )}

          {statusCode === 401 && (
            <div className="mt-4">
              <Button
                onClick={() => navigate('/Auth')}
                className="w-full"
              >
                Login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorPage;