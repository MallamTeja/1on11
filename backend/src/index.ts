import express, { Request, Response } from 'express';
import cors, { CorsOptions } from 'cors';
import './config'; // loads environment variables

const app = express();

const allowlist = (process.env.ORIGIN_ALLOWLIST || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
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

app.get('/', (_req: Request, res: Response) => {
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

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
