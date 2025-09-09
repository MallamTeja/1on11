'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut, useSession } from 'next-auth/react';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Courses', path: '/courses' },
  { name: 'Features', path: '#features' },
  { name: 'Pricing', path: '/pricing' },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
    router.refresh();
  };

  return (
    <header className="border-b border-gray-800">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <GraduationCap className="w-8 h-8 text-blue-400" />
          <Link href="/" className="text-xl font-bold text-white hover:text-blue-400 transition-colors">
            EduLearn
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link 
              key={item.path}
              href={item.path} 
              className={`font-medium ${
                pathname === item.path ? 'text-white' : 'text-gray-300 hover:text-white'
              } transition-colors`}
            >
              {item.name}
            </Link>
          ))}
          {isAuthenticated && (
            <Link 
              href="/dashboard" 
              className={`font-medium ${
                pathname === '/dashboard' ? 'text-white' : 'text-gray-300 hover:text-white'
              } transition-colors`}
            >
              Dashboard
            </Link>
          )}
        </nav>
        
        {isLoading ? (
          <div className="w-24 h-10 bg-gray-800 rounded-md animate-pulse"></div>
        ) : isAuthenticated ? (
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                {session?.user?.name?.charAt(0) || 'U'}
              </div>
              <span className="text-gray-300">{session?.user?.name || 'User'}</span>
            </div>
            <Button 
              variant="ghost"
              onClick={handleSignOut}
              className="text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              Sign Out
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link 
              href="/login" 
              className="px-4 py-2 text-gray-300 hover:text-white font-medium transition-colors"
            >
              Log in
            </Link>
            <Link 
              href="/register" 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
