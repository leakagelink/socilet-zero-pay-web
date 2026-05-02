import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { blogPosts } from '@/data/blogData';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Loader2, CheckCircle2, AlertTriangle, XCircle, ExternalLink } from 'lucide-react';

/**
 * SEO Audit / Route Inspector
 * --------------------------------------------------
 * Internal QA page. Fetches every known route from a chosen origin and reports:
 *   - HTTP status
 *   - <title>
 *   - <meta name="description">
 *   - <link rel="canonical">
 *   - Whether title / description are unique across the site
 *
 * Notes:
 *   - Uses the LIVE origin by default (https://socilet.in) because the dev preview
 *     serves the SPA shell only — every route would look identical there.
 *   - Cross-origin fetches are subject to CORS. Most static hosts (Netlify/Vercel/Lovable)
 *     allow GET on HTML, but if blocked we surface the error per-row.
 */

type Row = {
  path: string;
  url: string;
  status: number | null;
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogImage: string;
  error?: string;
  loading?: boolean;
};

// Static routes from src/App.tsx (excluding dynamic / auth-only / param routes)
const STATIC_ROUTES = [
  '/',
  '/blog',
  '/track-project',
  '/affiliate',
  '/zero-advance-payment',
  '/website-development',
  '/app-development',
  '/ai-spokesperson',
  '/business-profile',
  '/faq',
  '/terms-of-service',
  '/privacy-policy',
  '/cookie-policy',
  '/hire-indian-developer',
  '/meetings',
  '/investments',
  '/zero-advance-payment',
];

function parseHtml(html: string) {
  const get = (re: RegExp) => {
    const m = html.match(re);
    return m ? m[1].trim() : '';
  };
  return {
    title: get(/<title[^>]*>([\s\S]*?)<\/title>/i),
    description: get(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i)
      || get(/<meta[^>]+content=["']([^"']*)["'][^>]*name=["']description["']/i),
    canonical: get(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']*)["']/i)
      || get(/<link[^>]+href=["']([^"']*)["'][^>]*rel=["']canonical["']/i),
    ogTitle: get(/<meta[^>]+property=["']og:title["'][^>]*content=["']([^"']*)["']/i),
    ogImage: get(/<meta[^>]+property=["']og:image["'][^>]*content=["']([^"']*)["']/i),
  };
}

const SeoAudit: React.FC = () => {
  const [origin, setOrigin] = useState('https://socilet.in');
  const [rows, setRows] = useState<Row[]>([]);
  const [running, setRunning] = useState(false);

  const allRoutes = useMemo(() => {
    const blogRoutes = blogPosts.map((p) => `/blog/${p.slug}`);
    // Dedupe + sort with homepage first
    const set = new Set<string>([...STATIC_ROUTES, ...blogRoutes]);
    return Array.from(set);
  }, []);

  const runAudit = async () => {
    setRunning(true);
    const base = origin.replace(/\/$/, '');
    const initial: Row[] = allRoutes.map((p) => ({
      path: p,
      url: `${base}${p}`,
      status: null,
      title: '',
      description: '',
      canonical: '',
      ogTitle: '',
      ogImage: '',
      loading: true,
    }));
    setRows(initial);

    // Limited concurrency to be polite
    const CONCURRENCY = 4;
    let cursor = 0;
    const next = async (): Promise<void> => {
      const idx = cursor++;
      if (idx >= initial.length) return;
      const row = { ...initial[idx] };
      try {
        const res = await fetch(row.url, { redirect: 'follow' });
        row.status = res.status;
        const html = await res.text();
        const parsed = parseHtml(html);
        Object.assign(row, parsed);
      } catch (e: any) {
        row.error = e?.message || 'Fetch failed (CORS?)';
      } finally {
        row.loading = false;
        setRows((prev) => {
          const copy = [...prev];
          copy[idx] = row;
          return copy;
        });
      }
      return next();
    };
    await Promise.all(Array.from({ length: CONCURRENCY }, next));
    setRunning(false);
  };

  // Uniqueness maps
  const titleCounts = useMemo(() => {
    const m = new Map<string, number>();
    rows.forEach((r) => r.title && m.set(r.title, (m.get(r.title) || 0) + 1));
    return m;
  }, [rows]);
  const descCounts = useMemo(() => {
    const m = new Map<string, number>();
    rows.forEach((r) => r.description && m.set(r.description, (m.get(r.description) || 0) + 1));
    return m;
  }, [rows]);

  const stats = useMemo(() => {
    const done = rows.filter((r) => !r.loading);
    return {
      total: rows.length,
      done: done.length,
      ok: done.filter((r) => r.status && r.status >= 200 && r.status < 300).length,
      missingTitle: done.filter((r) => !r.title).length,
      missingDesc: done.filter((r) => !r.description).length,
      missingCanonical: done.filter((r) => !r.canonical).length,
      dupTitles: done.filter((r) => r.title && (titleCounts.get(r.title) || 0) > 1).length,
      dupDescs: done.filter((r) => r.description && (descCounts.get(r.description) || 0) > 1).length,
    };
  }, [rows, titleCounts, descCounts]);

  return (
    <>
      <Helmet>
        <title>SEO Route Audit | Socilet (Internal)</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <header className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold">SEO Route Audit</h1>
            <p className="text-sm text-muted-foreground">
              Fetches each route's served HTML and reports status, canonical, and title/description uniqueness.
              Run against the <strong>live origin</strong> — the dev preview serves the SPA shell only.
            </p>
          </header>

          <Card className="p-4 flex flex-col md:flex-row gap-3 md:items-center">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground">Origin</label>
              <Input
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="https://socilet.in"
              />
            </div>
            <Button onClick={runAudit} disabled={running} className="md:self-end">
              {running ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Auditing…</>) : `Run audit (${allRoutes.length} routes)`}
            </Button>
          </Card>

          {rows.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="Checked" value={`${stats.done}/${stats.total}`} />
              <StatCard label="2xx OK" value={stats.ok} tone="good" />
              <StatCard label="Missing title" value={stats.missingTitle} tone={stats.missingTitle ? 'bad' : 'good'} />
              <StatCard label="Missing description" value={stats.missingDesc} tone={stats.missingDesc ? 'bad' : 'good'} />
              <StatCard label="Missing canonical" value={stats.missingCanonical} tone={stats.missingCanonical ? 'warn' : 'good'} />
              <StatCard label="Duplicate titles" value={stats.dupTitles} tone={stats.dupTitles ? 'bad' : 'good'} />
              <StatCard label="Duplicate descriptions" value={stats.dupDescs} tone={stats.dupDescs ? 'bad' : 'good'} />
            </div>
          )}

          {rows.length > 0 && (
            <Card className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left">
                  <tr>
                    <th className="p-3">Route</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Title</th>
                    <th className="p-3">Description</th>
                    <th className="p-3">Canonical</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => {
                    const dupTitle = !!r.title && (titleCounts.get(r.title) || 0) > 1;
                    const dupDesc = !!r.description && (descCounts.get(r.description) || 0) > 1;
                    return (
                      <tr key={r.path} className="border-t border-border align-top">
                        <td className="p-3 font-mono text-xs whitespace-nowrap">
                          <a href={r.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:underline">
                            {r.path} <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                        <td className="p-3">
                          {r.loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : r.error ? (
                            <Badge variant="destructive">ERR</Badge>
                          ) : (
                            <StatusBadge status={r.status} />
                          )}
                          {r.error && <div className="text-xs text-destructive mt-1 max-w-[12rem] break-words">{r.error}</div>}
                        </td>
                        <td className="p-3 max-w-xs">
                          <div className="line-clamp-2">{r.title || <span className="text-muted-foreground italic">— missing —</span>}</div>
                          <CellFlags
                            missing={!r.title && !r.loading && !r.error}
                            duplicate={dupTitle}
                          />
                        </td>
                        <td className="p-3 max-w-md">
                          <div className="line-clamp-2 text-muted-foreground">{r.description || <span className="italic">— missing —</span>}</div>
                          <CellFlags
                            missing={!r.description && !r.loading && !r.error}
                            duplicate={dupDesc}
                          />
                        </td>
                        <td className="p-3 max-w-xs">
                          <div className="font-mono text-xs break-all">
                            {r.canonical || <span className="text-muted-foreground italic">— none —</span>}
                          </div>
                          {!r.canonical && !r.loading && !r.error && (
                            <Badge variant="outline" className="mt-1 text-amber-600 border-amber-600">no canonical</Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

const StatusBadge: React.FC<{ status: number | null }> = ({ status }) => {
  if (status == null) return <Badge variant="outline">—</Badge>;
  if (status >= 200 && status < 300) return <Badge className="bg-emerald-600 hover:bg-emerald-600"><CheckCircle2 className="w-3 h-3 mr-1" />{status}</Badge>;
  if (status >= 300 && status < 400) return <Badge className="bg-blue-600 hover:bg-blue-600">{status}</Badge>;
  return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />{status}</Badge>;
};

const CellFlags: React.FC<{ missing?: boolean; duplicate?: boolean }> = ({ missing, duplicate }) => (
  <div className="flex gap-1 mt-1">
    {missing && <Badge variant="destructive" className="text-[10px]">missing</Badge>}
    {duplicate && (
      <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-600">
        <AlertTriangle className="w-3 h-3 mr-1" /> duplicate
      </Badge>
    )}
    {!missing && !duplicate && <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-600">unique</Badge>}
  </div>
);

const StatCard: React.FC<{ label: string; value: React.ReactNode; tone?: 'good' | 'warn' | 'bad' }> = ({ label, value, tone }) => {
  const toneClass =
    tone === 'good' ? 'text-emerald-600' :
    tone === 'warn' ? 'text-amber-600' :
    tone === 'bad' ? 'text-destructive' : '';
  return (
    <Card className="p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`text-xl font-bold ${toneClass}`}>{value}</div>
    </Card>
  );
};

export default SeoAudit;
