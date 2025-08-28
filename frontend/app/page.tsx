'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Label } from '../../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';

export default function LandingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-gray-900 to-black text-white">
      {/* Navigation */}
      <nav className="bg-blue-900/50 backdrop-blur-sm border-b border-blue-800 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-code text-white text-sm"></i>
            </div>
            <span className="text-xl font-bold text-blue-400">SkillSync</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/login" className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-blue-800 transition-colors">
              Login
            </Link>
            <Link href="/signup" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <i className="fas fa-graduation-cap text-white text-3xl"></i>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
            SkillSync Education Platform
          </h1>
          
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Master coding skills, connect with mentors, and accelerate your learning journey with our comprehensive education platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-lg">
                <i className="fas fa-rocket mr-2"></i>
                Get Started Free
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-600 hover:text-white px-8 py-3 text-lg rounded-lg">
                <i className="fas fa-sign-in-alt mr-2"></i>
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="text-center p-6 bg-blue-900/20 rounded-xl border border-blue-800">
            <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-code text-blue-400 text-xl"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">Coding Practice</h3>
            <p className="text-gray-400">Solve problems, track progress, and improve your coding skills with our interactive platform.</p>
          </div>

          <div className="text-center p-6 bg-blue-900/20 rounded-xl border border-blue-800">
            <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-user-graduate text-blue-400 text-xl"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">Expert Mentorship</h3>
            <p className="text-gray-400">Connect with industry professionals and get personalized guidance for your career growth.</p>
          </div>

          <div className="text-center p-6 bg-blue-900/20 rounded-xl border border-blue-800">
            <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-users text-blue-400 text-xl"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">Study Groups</h3>
            <p className="text-gray-400">Join collaborative learning groups and connect with peers who share your interests.</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20 p-8 bg-gradient-to-r from-blue-900/30 to-blue-800/30 rounded-xl border border-blue-700">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-gray-300 mb-6">Join thousands of students already advancing their careers with SkillSync.</p>
          <Link href="/signup">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-lg">
              <i className="fas fa-arrow-right mr-2"></i>
              Start Your Journey
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}