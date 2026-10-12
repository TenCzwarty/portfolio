import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Thin proxy to Jira Cloud – the browser cannot call *.atlassian.net directly (CORS).
 * Credentials come with every request and are never stored or logged here.
 * Only the handful of endpoints Jinder needs are allowed, so this is not an open proxy.
 */

const SITE = /^[a-z0-9][a-z0-9-]*\.atlassian\.net$/i;
const KEY = "[A-Z][A-Z0-9_]*-\\d+";

const ALLOWED: Array<[string, RegExp]> = [
  ["GET", /^\/rest\/api\/3\/myself$/],
  ["GET", /^\/rest\/api\/3\/priority$/],
  ["GET", /^\/rest\/api\/3\/user\/assignable\/search$/],
  ["GET", new RegExp(`^/rest/api/3/issue/${KEY}$`)],
  ["PUT", new RegExp(`^/rest/api/3/issue/${KEY}$`)],
  ["POST", new RegExp(`^/rest/api/3/issue/${KEY}/comment$`)],
  ["GET", /^\/rest\/agile\/1\.0\/board$/],
  ["GET", /^\/rest\/agile\/1\.0\/board\/\d+\/sprint$/],
  ["GET", /^\/rest\/agile\/1\.0\/sprint\/\d+\/issue$/],
  ["POST", /^\/rest\/agile\/1\.0\/sprint\/\d+\/issue$/],
];

type TProxyRequest = {
  site: string;
  email: string;
  token: string;
  method: string;
  path: string;
  body?: unknown;
};

const isString = (value: unknown): value is string => typeof value === "string" && value !== "";

const parse = (raw: unknown): TProxyRequest | null => {
  if (!raw || typeof raw !== "object") return null;
  const { site, email, token, method, path, body } = raw as Record<string, unknown>;
  if (![site, email, token, method, path].every(isString)) return null;
  return { site, email, token, method, path, body } as TProxyRequest;
};

const error = (message: string, status: number) =>
  NextResponse.json({ errorMessages: [message] }, { status });

export async function POST(request: Request) {
  const req = parse(await request.json().catch(() => null));
  if (!req) return error("Niepoprawne zapytanie", 400);

  const site = req.site.trim().toLowerCase();
  if (!SITE.test(site)) return error("Adres musi wyglądać jak twojafirma.atlassian.net", 400);

  const url = new URL(req.path, `https://${site}`);
  const allowed = ALLOWED.some(([m, re]) => m === req.method && re.test(url.pathname));
  if (url.host !== site || !allowed) return error("Niedozwolony endpoint", 403);

  const auth = Buffer.from(`${req.email.trim()}:${req.token.trim()}`).toString("base64");

  try {
    const response = await fetch(url, {
      method: req.method,
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
        ...(req.body === undefined ? {} : { "Content-Type": "application/json" }),
      },
      body: req.body === undefined ? undefined : JSON.stringify(req.body),
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });

    // a 204 cannot carry a body, and the client always expects JSON
    const text = await response.text();
    return new NextResponse(text || "{}", {
      status: response.status === 204 ? 200 : response.status,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  } catch {
    return error("Jira nie odpowiada", 502);
  }
}
