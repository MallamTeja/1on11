import express from 'express';
import cors from 'cors';
import './config.js'; // loads environment variables
import { searchWithSerper } from './serper-service.js';
import { searchWithGemini } from './gemini-service.js';

const app = express();

const allowlist = (process.env.ORIGIN_ALLOWLIST || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow non-browser clients
    if (allowlist.length === 0 || allowlist.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (_req, res) => {
  res.type('text/html').send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>ScholarSearch Backend</title>
  <style>
    body { font-family: system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial,sans-serif; line-height: 1.5; padding: 2rem; max-width: 720px; margin: auto; }
    code { background: #f2f2f2; padding: .125rem .375rem; border-radius: .25rem; }
    a { color: #0d6efd; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>Backend is running</h1>
  <p>Health endpoint: <a href="/api/health">/api/health</a></p>
  <p>This service exposes protected API endpoints for search and AI services.</p>
  <p>If you expected the web UI here, run the frontend dev server on <code>http://localhost:3000</code> (npm start in project root).</p>
</body>
</html>`);
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Resource Finder API
// Example: /api/resources?q=java%20loops&type=all&difficulty=all&indianOnly=true
app.get('/api/resources', async (req, res) => {
  const q = String(req.query.q || '').trim();
  const type = String(req.query.type || 'all').toLowerCase();
  const difficulty = String(req.query.difficulty || 'all').toLowerCase();
  const indianOnly = String(req.query.indianOnly || 'true').toLowerCase() === 'true';

  if (!q) return res.status(400).json({ error: 'Missing required query parameter: q' });

  const started = Date.now();
  try {
    const serperResults = await searchWithSerper(q, type === 'all' ? undefined : type, difficulty);

    // Try Gemini enrichment (best-effort, ignored on failure)
    let mappedGemini = [];
    try {
      const gemini = await searchWithGemini(q);
      mappedGemini = (gemini || []).map((g) => {
        // map Gemini result types to our SearchResult type
        let mappedType = 'article';
        const t = (g.type || '').toLowerCase();
        if (t.includes('video')) mappedType = 'youtube';
        if (t.includes('paper') || g.fileType === 'PDF') mappedType = 'pdf';
        return {
          id: g.id,
          title: g.title,
          summary: g.summary,
          source: g.source,
          url: g.url,
          type: mappedType,
          downloadUrl: g.downloadUrl,
          fileType: g.fileType,
        };
      });
    } catch (e) {
      console.warn('Gemini enrichment failed:', (e && e.message) || e);
    }

    // Merge and deduplicate by URL/title
    const merged = [...serperResults, ...mappedGemini];
    const seen = new Set();
    const dedup = merged.filter((r) => {
      const key = (r.url || r.title || '').toLowerCase();
      if (!key) return false;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const isIndianSource = (r) => {
      if (!r.url) return false;
      try {
        const host = new URL(r.url).hostname.toLowerCase();
        return (
          host.endsWith('.ac.in') ||
          host.endsWith('.edu.in') ||
          host.endsWith('.gov.in') ||
          host.includes('nptel') ||
          host.includes('swayam') ||
          host.includes('iit') ||
          host.includes('iisc') ||
          host.includes('bits') ||
          host.includes('ugc.ac.in') ||
          host.includes('isro') ||
          host.includes('rbi.org.in') ||
          host.includes('geeksforgeeks')
        );
      } catch {
        return false;
      }
    };

    const filtered = indianOnly ? dedup.filter(isIndianSource) : dedup;

    const isCourse = (r) => {
      if (!r.url) return false;
      try {
        const host = new URL(r.url).hostname.toLowerCase();
        return (
          r.type === 'article' && (
            host.includes('nptel') || host.includes('swayam') || host.includes('coursera') || host.includes('udemy') ||
            host.includes('iit') || host.endsWith('.edu.in') || host.endsWith('.ac.in')
          )
        );
      } catch { return false; }
    };

    const isRepo = (r) => {
      if (!r.url) return false;
      try {
        const host = new URL(r.url).hostname.toLowerCase();
        return host.includes('github.com') || host.includes('gitlab.com') || host.includes('bitbucket.org');
      } catch { return false; }
    };

    const articles = filtered.filter((r) => r.type === 'article' && !isCourse(r) && !isRepo(r));
    const pdfs = filtered.filter((r) => r.type === 'pdf');
    const videos = filtered.filter((r) => r.type === 'youtube');
    const images = filtered.filter((r) => r.type === 'image');
    const qa = filtered.filter((r) => r.type === 'faq');
    const courses = filtered.filter(isCourse);
    const repos = filtered.filter(isRepo);

    const all = [...courses, ...articles, ...pdfs, ...videos, ...repos, ...qa, ...images];

    res.json({
      sections: { all, articles, pdfs, videos, images, qa, courses, repos },
      totals: {
        all: all.length,
        articles: articles.length,
        pdfs: pdfs.length,
        videos: videos.length,
        images: images.length,
        qa: qa.length,
        courses: courses.length,
        repos: repos.length,
      },
      latencyMs: Date.now() - started,
    });
  } catch (err) {
    res.status(500).json({ error: (err && err.message) || 'Search failed' });
  }
});

const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
