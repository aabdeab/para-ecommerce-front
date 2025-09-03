import React from 'react';

import { LoginForm } from '@/Components/login-form';

const Auth: React.FC = () => {
    return (
        <div className="container mx-auto">
            <div className="flex items-center justify-center min-h-screen bg-blue-50">
                <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg border border-blue-200">
                    <h1 className="text-2xl font-bold text-center text-blue-600 mb-4">Login</h1>
                    <LoginForm signUpLink="/Signup" />
                </div>
            </div>
        </div>
    );
};

export default Auth;