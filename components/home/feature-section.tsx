import { BookOpen, Search, Brain, Clock } from 'lucide-react';

const features = [
  {
    name: 'Academic Excellence',
    description: 'Access high-quality scholarly articles from top academic sources and journals worldwide.',
    icon: BookOpen,
  },
  {
    name: 'AI-Powered Search',
    description: 'Our intelligent search understands the context and nuance of your academic queries.',
    icon: Search,
  },
  {
    name: 'Smart Summaries',
    description: 'Get AI-generated summaries of complex papers to quickly determine relevance.',
    icon: Brain,
  },
  {
    name: 'Save Time',
    description: 'Find exactly what you need without wading through pages of irrelevant search results.',
    icon: Clock,
  },
];

export function FeatureSection() {
  return (
    <div className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-foreground sm:text-4xl">
            A better way to research
          </p>
          <p className="mt-4 max-w-2xl text-xl text-muted-foreground lg:mx-auto">
            ScholarSearch combines AI technology with academic rigor to transform how you find and consume scholarly content.
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="pt-6">
                <div className="flow-root bg-card rounded-lg px-6 pb-8 h-full">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-primary rounded-md shadow-lg">
                        <feature.icon className="h-6 w-6 text-primary-foreground" aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-card-foreground tracking-tight">{feature.name}</h3>
                    <p className="mt-5 text-base text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}