import { ExternalLink } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export interface SearchResult {
  id: string;
  title: string;
  source: string;
  summary: string;
  url: string;
  type?: string;
  year?: number;
}

interface ResultCardProps {
  result: SearchResult;
}

export function ResultCard({ result }: ResultCardProps) {
  return (
    <Card className="h-full flex flex-col transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {result.title}
          </CardTitle>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{result.source}</span>
          {result.year && (
            <>
              <span>•</span>
              <span>{result.year}</span>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">{result.summary}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-2 border-t">
        <div>
          {result.type && <Badge variant="outline">{result.type}</Badge>}
        </div>
        {result.type === 'youtube' ? (
          <Button variant="outline" size="sm" className="gap-1.5 bg-red-50 hover:bg-red-100 border-red-200" asChild>
            <a href={result.url} target="_blank" rel="noopener noreferrer">
              Watch <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        ) : result.type === 'pdf' ? (
          <Button variant="outline" size="sm" className="gap-1.5 bg-orange-50 hover:bg-orange-100 border-orange-200" asChild>
            <a href={result.url} target="_blank" rel="noopener noreferrer">
              PDF <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        ) : result.type === 'ppt' ? (
          <Button variant="outline" size="sm" className="gap-1.5 bg-blue-50 hover:bg-blue-100 border-blue-200" asChild>
            <a href={result.url} target="_blank" rel="noopener noreferrer">
              Slides <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        ) : result.type === 'docx' ? (
          <Button variant="outline" size="sm" className="gap-1.5 bg-blue-50 hover:bg-blue-100 border-blue-200" asChild>
            <a href={result.url} target="_blank" rel="noopener noreferrer">
              Doc <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        ) : result.type === 'image' ? (
          <Button variant="outline" size="sm" className="gap-1.5 bg-purple-50 hover:bg-purple-100 border-purple-200" asChild>
            <a href={result.url} target="_blank" rel="noopener noreferrer">
              Image <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="gap-1.5" asChild>
            <a href={result.url} target="_blank" rel="noopener noreferrer">
              View <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}