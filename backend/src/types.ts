export interface SearchResult {
  id: string;
  title: string;
  source: string;
  summary: string;
  url: string;
  type: 'article' | 'pdf' | 'ppt' | 'docx' | 'youtube' | 'image' | 'faq' | 'knowledgeGraph' | 'sitelink';
  year?: number;
  downloadUrl?: string;
  fileType?: 'PDF' | 'PPT' | 'DOCX';
}
