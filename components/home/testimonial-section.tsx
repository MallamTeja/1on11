import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const testimonials = [
  {
    content: "ScholarSearch has revolutionized how I conduct research for my PhD. The AI summaries save me hours of reading irrelevant papers.",
    author: "Dr. Sarah Chen",
    role: "Research Fellow, MIT",
    avatar: "SC"
  },
  {
    content: "As a professor, I recommend ScholarSearch to all my students. It's like having a research assistant that works 24/7.",
    author: "Prof. James Miller",
    role: "Professor of History, Oxford",
    avatar: "JM"
  },
  {
    content: "The quality of search results is outstanding. I've discovered papers I would have missed using traditional search methods.",
    author: "Alex Rodriguez",
    role: "Doctoral Candidate, Stanford",
    avatar: "AR"
  }
];

export function TestimonialSection() {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container px-4 mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">What Researchers Say</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-card border-none shadow-md">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <p className="text-card-foreground italic">"{testimonial.content}"</p>
                  
                  <div className="flex items-center pt-4">
                    <Avatar className="h-10 w-10 mr-4">
                      <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{testimonial.author}</p>
                      <p className="text-muted-foreground text-xs">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}