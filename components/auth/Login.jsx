"use client"
import React, { useState } from 'react';
import TextInput from '../input/TextInput';
import Button from '../input/Button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 m-4 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-semibold mb-6 text-center">Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <TextInput
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label={'Email'}
              required
            />
          </div>
          <div className="mb-6">

            <TextInput
            label={'Password'}
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              
              required
            />
          </div>
          <div className="flex items-center justify-end">
            <Button
              type="submit"
            >
              Sign In
            </Button>
            
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;