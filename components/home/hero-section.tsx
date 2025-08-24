import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnimatedGradient } from '@/components/ui/animated-gradient';

export function HeroSection() {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <AnimatedGradient />
      
      <div className="container relative z-10 mx-auto px-4 py-32 text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          <span className="block">Discover Academic Excellence</span>
          <span className="block mt-2">Powered by AI</span>
        </h1>
        
        <p className="mt-6 max-w-md mx-auto text-lg text-muted-foreground sm:max-w-xl">
          Find high-quality academic resources, research papers, and scholarly articles 
          with our AI-powered search. Get summaries and insights instantly.
        </p>
        
        <div className="mt-10 max-w-md mx-auto sm:flex sm:justify-center md:mt-12">
          <div className="rounded-md shadow">
            <Button asChild size="lg" className="w-full sm:w-auto px-8 py-3 text-base">
              <Link href="/search">Start Searching</Link>
            </Button>
          </div>
          <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto px-8 py-3 text-base">
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-0 right-0 flex justify-center animate-bounce">
        <svg 
          className="w-6 h-6 text-foreground" 
          fill="none" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </div>
  );
}