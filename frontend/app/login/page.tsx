'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = '/dashboard.html';
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-gray-900 to-black text-white">
      {/* Navigation */}
      <nav className="bg-blue-900/50 backdrop-blur-sm border-b border-blue-800 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-code text-white text-sm"></i>
            </div>
            <span className="text-xl font-bold text-blue-400">SkillSync</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">Don't have an account?</span>
            <Link href="/signup" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Login Form */}
      <div className="container mx-auto px-4 py-20 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-sign-in-alt text-white text-2xl"></i>
            </div>
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-gray-400">Sign in to your SkillSync account</p>
          </div>

          <Card className="bg-blue-900/20 backdrop-blur-sm border-blue-800">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-white">Sign In</CardTitle>
              <CardDescription className="text-center text-gray-400">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    className="bg-gray-800/50 border-blue-700 text-white placeholder-gray-400 focus:border-blue-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    required
                    className="bg-gray-800/50 border-blue-700 text-white placeholder-gray-400 focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember"
                      className="w-4 h-4 text-blue-600 bg-gray-800 border-blue-700 rounded focus:ring-blue-500"
                    />
                    <Label htmlFor="remember" className="text-sm text-gray-300">Remember me</Label>
                  </div>
                  <Link href="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300">
                    Forgot password?
                  </Link>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Signing in...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sign-in-alt mr-2"></i>
                      Sign In
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-400">
                  Don't have an account?{' '}
                  <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-medium">
                    Sign up here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
