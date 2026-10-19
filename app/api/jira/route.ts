import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Thin proxy to Jira Cloud – the browser cannot call *.atlassian.net directly (CORS), and
 * images need the token too, which an <img> cannot send. Credentials come with every request
 * and are never stored or logged here. Only the endpoints Jinder needs are allowed, so this
 * is not an open proxy.
 */

const SITE = /^[a-z0-9][a-z0-9-]*\.atlassian\.net$/i;
const KEY = "[A-Z][A-Z0-9_]*-\\d+";

const ALLOWED: Array<[string, RegExp]> = [
  ["GET", /^\/rest\/api\/3\/myself$/],
  ["GET", /^\/rest\/api\/3\/priority$/],
  ["GET", /^\/rest\/api\/3\/label$/],
  ["GET", /^\/rest\/api\/3\/user\/assignable\/search$/],
  ["GET", new RegExp(`^/rest/api/3/issue/${KEY}$`)],
  ["PUT", new RegExp(`^/rest/api/3/issue/${KEY}$`)],
  ["POST", new RegExp(`^/rest/api/3/issue/${KEY}/comment$`)],
  ["GET", /^\/rest\/agile\/1\.0\/board$/],
  ["GET", /^\/rest\/agile\/1\.0\/board\/\d+\/sprint$/],
  ["GET", /^\/rest\/agile\/1\.0\/board\/\d+\/epic$/],
  ["GET", /^\/rest\/agile\/1\.0\/sprint\/\d+\/issue$/],
  ["POST", /^\/rest\/agile\/1\.0\/sprint\/\d+\/issue$/],
  ["POST", new RegExp(`^/rest/agile/1\\.0/epic/(${KEY}|none)/issue$`)],
];

/** Images on the Jira site: attachments, emoticons, issue type and avatar icons */
const SITE_IMAGES = [
  /^\/rest\/api\/[23]\/attachment\/(content|thumbnail)\/\d+$/,
  /^\/secure\/(attachment|thumbnail)\/\d+\/[^/]+$/,
  /^\/secure\/viewavatar$/,
  /^\/rest\/api\/[23]\/universal_avatar\/view\/type\/\w+\/avatar\/\d+$/,
  /^\/images\/icons\/[\w/.-]+$/,
];

/** Public avatar hosts – fetched without credentials */
const PUBLIC_IMAGE_HOSTS = /(^|\.)(gravatar\.com|atl-paas\.net|atlassian\.com)$/i;

/** Vercel functions cannot answer with more than ~4.5 MB */
const MAX_IMAGE_BYTES = 4_000_000;

type TProxyRequest = {
  site: string;
  email: string;
  token: string;
  method: string;
  /** site-relative path, or an absolute URL of an image */
  path: string;
  body?: unknown;
  /** answer with the raw bytes instead of JSON – images only */
  binary?: boolean;
};

const isString = (value: unknown): value is string => typeof value === "string" && value !== "";

const parse = (raw: unknown): TProxyRequest | null => {
  if (!raw || typeof raw !== "object") return null;
  const { site, email, token, method, path, body, binary } = raw as Record<string, unknown>;
  if (![site, email, token, method, path].every(isString)) return null;
  return { site, email, token, method, path, body, binary: binary === true } as TProxyRequest;
};

const error = (message: string, status: number) =>
  NextResponse.json({ errorMessages: [message] }, { status });

/** null = not allowed, otherwise whether the token goes along */
const authorize = (req: TProxyRequest, url: URL, site: string): { auth: boolean } | null => {
  if (url.protocol !== "https:") return null;

  if (url.host === site) {
    const list: Array<[string, RegExp]> = req.binary
      ? SITE_IMAGES.map((re) => ["GET", re])
      : ALLOWED;
    return list.some(([m, re]) => m === req.method && re.test(url.pathname))
      ? { auth: true }
      : null;
  }

  if (req.binary && req.method === "GET" && PUBLIC_IMAGE_HOSTS.test(url.hostname)) {
    return { auth: false };
  }
  return null;
};

const image = async (response: Response) => {
  const type = response.headers.get("content-type") ?? "";
  if (!response.ok) return error(`Jira answered with error ${response.status}`, response.status);
  if (!type.startsWith("image/")) return error("Not an image", 415);
  if (Number(response.headers.get("content-length")) > MAX_IMAGE_BYTES) {
    return error("Image too large", 413);
  }

  const bytes = await response.arrayBuffer();
  if (bytes.byteLength > MAX_IMAGE_BYTES) return error("Image too large", 413);

  return new NextResponse(bytes, {
    headers: { "Content-Type": type, "Cache-Control": "private, max-age=3600" },
  });
};

export async function POST(request: Request) {
  const req = parse(await request.json().catch(() => null));
  if (!req) return error("Invalid request", 400);

  const site = req.site.trim().toLowerCase();
  if (!SITE.test(site)) return error("The site must look like yourcompany.atlassian.net", 400);

  let url: URL;
  try {
    url = new URL(req.path, `https://${site}`);
  } catch {
    return error("Invalid address", 400);
  }

  const access = authorize(req, url, site);
  if (!access) return error("Endpoint not allowed", 403);

  const auth = Buffer.from(`${req.email.trim()}:${req.token.trim()}`).toString("base64");

  try {
    const response = await fetch(url, {
      method: req.method,
      headers: {
        ...(access.auth ? { Authorization: `Basic ${auth}` } : {}),
        Accept: req.binary ? "image/*" : "application/json",
        ...(req.body === undefined ? {} : { "Content-Type": "application/json" }),
      },
      body: req.body === undefined ? undefined : JSON.stringify(req.body),
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });

    if (req.binary) return image(response);

    // a 204 cannot carry a body, and the client always expects JSON
    const text = await response.text();
    return new NextResponse(text || "{}", {
      status: response.status === 204 ? 200 : response.status,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  } catch {
    return error("Jira is not responding", 502);
  }
}
