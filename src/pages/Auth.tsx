import React from 'react';

import { LoginForm } from '@/Components/login-form';

const Auth: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center mb-4">Login</h1>
                <LoginForm />
            </div>
        </div>
    );
};

export default Auth;