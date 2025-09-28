import React, { useState } from 'react';

const BackendTestPage: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testConnection = async () => {
    setIsLoading(true);
    setTestResult('');
    
    try {
      // Test basic connection
      const response = await fetch('http://localhost:8080/api/health', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        setTestResult('✅ Backend connection successful!');
      } else {
        setTestResult(`❌ Backend responded with status: ${response.status}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('CORS')) {
          setTestResult(`❌ CORS Error: ${error.message}\n\nPlease ensure your Spring Boot backend has CORS properly configured.`);
        } else if (error.message.includes('fetch')) {
          setTestResult('❌ Network Error: Cannot connect to backend. Make sure the Spring Boot server is running on port 8080.');
        } else {
          setTestResult(`❌ Error: ${error.message}`);
        }
      } else {
        setTestResult('❌ Unknown error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const testAuthEndpoint = async () => {
    setIsLoading(true);
    setTestResult('');
    
    try {
      const response = await fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'test',
          email: 'test@test.com',
          password: 'test123'
        })
      });
      
      if (response.status === 400) {
        setTestResult('✅ Auth endpoint is accessible (validation error expected)');
      } else if (response.ok) {
        setTestResult('✅ Auth endpoint working perfectly!');
      } else {
        setTestResult(`⚠️ Auth endpoint responded with status: ${response.status}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('CORS')) {
          setTestResult(`❌ CORS Error on auth endpoint: ${error.message}`);
        } else {
          setTestResult(`❌ Auth endpoint error: ${error.message}`);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Backend Connection Test</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Connection Tests</h2>
          
          <div className="space-y-4">
            <button
              onClick={testConnection}
              disabled={isLoading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {isLoading ? 'Testing...' : 'Test Basic Connection'}
            </button>
            
            <button
              onClick={testAuthEndpoint}
              disabled={isLoading}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 ml-4"
            >
              {isLoading ? 'Testing...' : 'Test Auth Endpoint'}
            </button>
          </div>
          
          {testResult && (
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <pre className="whitespace-pre-wrap text-sm">{testResult}</pre>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Common Issues & Solutions</h2>
          
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold text-red-600">CORS Policy Error</h3>
              <p>Make sure your Spring Boot backend has CORS configuration in SecurityConfig:</p>
              <code className="block bg-gray-100 p-2 mt-1 rounded">
                .cors(cors -&gt; cors.configurationSource(corsConfigurationSource()))
              </code>
            </div>
            
            <div>
              <h3 className="font-semibold text-red-600">Connection Refused</h3>
              <p>Ensure your Spring Boot application is running on port 8080:</p>
              <code className="block bg-gray-100 p-2 mt-1 rounded">
                ./gradlew bootRun
              </code>
            </div>
            
            <div>
              <h3 className="font-semibold text-green-600">Expected Backend Endpoints</h3>
              <ul className="list-disc list-inside mt-1">
                <li>POST /auth/register - User registration</li>
                <li>POST /auth/login - User login</li>
                <li>GET /api/products - Get all products</li>
                <li>GET /api/categories - Get all categories</li>
                <li>GET /api/health - Health check (if available)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackendTestPage;