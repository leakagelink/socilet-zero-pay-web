import { useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, XCircle, Loader2, RefreshCw, ExternalLink } from "lucide-react";

type FetchResult = {
  url: string;
  status: number | null;
  ok: boolean;
  contentType: string | null;
  cacheControl: string | null;
  xRobotsTag: string | null;
  contentLength: string | null;
  lastModified: string | null;
  server: string | null;
  body: string | null;
  bodyPreview: string | null;
  error: string | null;
  durationMs: number;
};

const DEFAULT_ORIGIN = "https://socilet.in";

const ROBOTS_AND_SITEMAPS = [
  "/robots.txt",
  "/sitemap_index.xml",
  "/sitemap-pages.xml",
  "/sitemap-blog.xml",
  "/sitemap-services.xml",
  "/sitemap-images.xml",
  "/llms.txt",
  "/ads.txt",
  "/manifest.json",
];

const KEY_PAGES = [
  "/",
  "/blog",
  "/website-development",
  "/app-development",
  "/ai-spokesperson",
  "/business-profile",
  "/hire-indian-developer",
  "/zero-advance-payment",
  "/faq",
  "/affiliate",
];

async function fetchWithMeta(url: string): Promise<FetchResult> {
  const start = performance.now();
  try {
    const res = await fetch(url, { method: "GET", redirect: "follow" });
    const text = await res.text();
    return {
      url,
      status: res.status,
      ok: res.ok,
      contentType: res.headers.get("content-type"),
      cacheControl: res.headers.get("cache-control"),
      xRobotsTag: res.headers.get("x-robots-tag"),
      contentLength:
        res.headers.get("content-length") ?? String(text.length),
      lastModified: res.headers.get("last-modified"),
      server: res.headers.get("server"),
      body: text,
      bodyPreview: text.slice(0, 600),
      error: null,
      durationMs: Math.round(performance.now() - start),
    };
  } catch (e) {
    return {
      url,
      status: null,
      ok: false,
      contentType: null,
      cacheControl: null,
      xRobotsTag: null,
      contentLength: null,
      lastModified: null,
      server: null,
      body: null,
      bodyPreview: null,
      error: e instanceof Error ? e.message : String(e),
      durationMs: Math.round(performance.now() - start),
    };
  }
}

function StatusBadge({ r }: { r: FetchResult }) {
  if (r.status === null) return <Badge variant="destructive">ERROR</Badge>;
  if (r.ok) return <Badge className="bg-green-600 hover:bg-green-600">{r.status}</Badge>;
  return <Badge variant="destructive">{r.status}</Badge>;
}

function ResultCard({ r }: { r: FetchResult }) {
  const sitemapCount =
    r.body && r.url.endsWith(".xml")
      ? (r.body.match(/<loc>/g) || []).length
      : null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-sm font-mono break-all">
            {r.url.replace(/^https?:\/\/[^/]+/, "")}
          </CardTitle>
          <div className="flex items-center gap-2 shrink-0">
            <StatusBadge r={r} />
            <a
              href={r.url}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground"
              aria-label="Open"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        {r.error ? (
          <div className="flex items-center gap-2 text-destructive">
            <XCircle className="h-4 w-4" /> {r.error}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              <Meta label="Content-Type" value={r.contentType} />
              <Meta label="Cache-Control" value={r.cacheControl} />
              <Meta
                label="X-Robots-Tag"
                value={r.xRobotsTag ?? "(none — indexable)"}
                good={!r.xRobotsTag || !/noindex/i.test(r.xRobotsTag)}
              />
              <Meta label="Last-Modified" value={r.lastModified} />
              <Meta label="Size" value={r.contentLength} />
              <Meta label="Server" value={r.server} />
              <Meta label="Time" value={`${r.durationMs} ms`} />
              {sitemapCount !== null && (
                <Meta
                  label="<loc> count"
                  value={String(sitemapCount)}
                  good={sitemapCount > 0}
                />
              )}
            </div>
            {r.bodyPreview && (
              <details className="mt-2">
                <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                  Preview body ({r.body?.length ?? 0} chars)
                </summary>
                <pre className="mt-2 max-h-64 overflow-auto rounded bg-muted p-2 text-[10px] whitespace-pre-wrap break-all">
                  {r.bodyPreview}
                  {r.body && r.body.length > r.bodyPreview.length ? "…" : ""}
                </pre>
              </details>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

function Meta({
  label,
  value,
  good,
}: {
  label: string;
  value: string | null | undefined;
  good?: boolean;
}) {
  return (
    <div className="flex items-start gap-1">
      <span className="text-muted-foreground min-w-[110px]">{label}:</span>
      <span
        className={`font-mono break-all ${
          good === false
            ? "text-destructive"
            : good === true
            ? "text-green-600 dark:text-green-400"
            : ""
        }`}
      >
        {value || "—"}
      </span>
    </div>
  );
}

export default function CrawlStatus() {
  const [origin, setOrigin] = useState(DEFAULT_ORIGIN);
  const [results, setResults] = useState<Record<string, FetchResult>>({});
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  const allPaths = useMemo(
    () => [...ROBOTS_AND_SITEMAPS, ...KEY_PAGES],
    []
  );

  const run = async () => {
    setLoading(true);
    setResults({});
    setProgress({ done: 0, total: allPaths.length });
    const cleanOrigin = origin.replace(/\/$/, "");

    const CONCURRENCY = 4;
    let i = 0;
    const next: Record<string, FetchResult> = {};

    async function worker() {
      while (i < allPaths.length) {
        const path = allPaths[i++];
        const url = `${cleanOrigin}${path}`;
        const r = await fetchWithMeta(url);
        next[path] = r;
        setResults({ ...next });
        setProgress((p) => ({ ...p, done: p.done + 1 }));
      }
    }

    await Promise.all(
      Array.from({ length: CONCURRENCY }, () => worker())
    );

    setLoading(false);
  };

  const summary = useMemo(() => {
    const arr = Object.values(results);
    const ok = arr.filter((r) => r.ok).length;
    const bad = arr.filter((r) => !r.ok).length;
    const blocked = arr.filter(
      (r) => r.xRobotsTag && /noindex/i.test(r.xRobotsTag)
    ).length;
    return { ok, bad, blocked, total: arr.length };
  }, [results]);

  const renderGroup = (paths: string[]) => (
    <div className="grid gap-3 md:grid-cols-2">
      {paths.map((p) =>
        results[p] ? (
          <ResultCard key={p} r={results[p]} />
        ) : (
          <Card key={p} className="opacity-60">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-mono">{p}</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" /> Pending…
                </span>
              ) : (
                "Not checked yet"
              )}
            </CardContent>
          </Card>
        )
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Crawl Status — Socilet</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="container mx-auto max-w-6xl px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Crawl Status</h1>
          <p className="text-sm text-muted-foreground">
            Quickly verify robots.txt, sitemaps, and key pages — including
            HTTP status, headers, and indexability.
          </p>
        </div>

        <Card>
          <CardContent className="pt-6 flex flex-col sm:flex-row gap-3">
            <Input
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="https://socilet.in"
              className="font-mono"
            />
            <Button onClick={run} disabled={loading} className="shrink-0">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Checking {progress.done}/{progress.total}
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Run check
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {summary.total > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <SummaryStat label="Total" value={summary.total} />
            <SummaryStat
              label="OK (2xx)"
              value={summary.ok}
              icon={<CheckCircle2 className="h-4 w-4 text-green-600" />}
            />
            <SummaryStat
              label="Failed"
              value={summary.bad}
              icon={<XCircle className="h-4 w-4 text-destructive" />}
              bad={summary.bad > 0}
            />
            <SummaryStat
              label="noindex"
              value={summary.blocked}
              bad={summary.blocked > 0}
            />
          </div>
        )}

        <Tabs defaultValue="robots">
          <TabsList>
            <TabsTrigger value="robots">Robots & Sitemaps</TabsTrigger>
            <TabsTrigger value="pages">Key Pages</TabsTrigger>
          </TabsList>
          <TabsContent value="robots" className="mt-4">
            {renderGroup(ROBOTS_AND_SITEMAPS)}
          </TabsContent>
          <TabsContent value="pages" className="mt-4">
            {renderGroup(KEY_PAGES)}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function SummaryStat({
  label,
  value,
  icon,
  bad,
}: {
  label: string;
  value: number;
  icon?: React.ReactNode;
  bad?: boolean;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{label}</span>
          {icon}
        </div>
        <div
          className={`text-2xl font-bold mt-1 ${
            bad ? "text-destructive" : ""
          }`}
        >
          {value}
        </div>
      </CardContent>
    </Card>
  );
}
