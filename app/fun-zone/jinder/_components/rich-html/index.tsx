import React from "react";

type TRichHtml = {
  html: string;
  /** Jira site, so relative links like /browse/ABC-1 lead back to Jira */
  site: string;
  loadImage: (url: string) => Promise<string | null>;
  empty?: string;
};

const STYLE = `
  html, body { margin: 0; color: #111; font: 14px/1.55 system-ui, sans-serif; overflow-wrap: anywhere; }
  body { display: flow-root; }
  p { margin: 0 0 0.6em; }
  img { max-width: 100%; height: auto; border-radius: 4px; }
  img[data-src] { display: inline-block; min-width: 120px; min-height: 60px; background: #e9ecef; }
  .img { opacity: 0.6; font-style: italic; }
  pre, code { white-space: pre-wrap; font-size: 13px; }
  pre { background: #f2f2f2; padding: 8px; border-radius: 6px; }
  table { border-collapse: collapse; }
  td, th { border: 1px solid #ccc; padding: 4px 6px; }
  a { color: #0b57d0; }
`;

const SAFE_PROTOCOLS = ["http:", "https:", "mailto:"];

/**
 * Prepared in an inert DOMParser document, so nothing loads before it is cleaned up:
 * links are made absolute (the site CSP forbids <base>) and open in a new tab, and images
 * lose their src – the CSP blocks other hosts and Jira attachments need the token, so they
 * are fetched through the proxy and put back as blob: URLs once the iframe is ready.
 */
const prepare = (html: string, site: string) => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const base = `https://${site}/`;

  doc.querySelectorAll("a[href]").forEach((a) => {
    try {
      const url = new URL(a.getAttribute("href")!, base);
      if (!SAFE_PROTOCOLS.includes(url.protocol)) throw new Error();
      a.setAttribute("href", url.href);
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener noreferrer");
    } catch {
      a.removeAttribute("href");
    }
  });

  doc.querySelectorAll("img").forEach((img) => {
    const src = img.getAttribute("src");
    img.removeAttribute("src");
    img.removeAttribute("srcset");
    if (src) img.setAttribute("data-src", src);
  });

  return doc.body.innerHTML;
};

const placeholder = (doc: Document, img: HTMLImageElement) => {
  const span = doc.createElement("span");
  span.className = "img";
  span.textContent = img.alt ? `[${img.alt}]` : "[image – see it in Jira]";
  img.replaceWith(span);
};

/**
 * Jira's rendered HTML goes into a sandboxed iframe with scripts disabled – it comes from a
 * third party and the page holds an API token. allow-same-origin lets us measure its height
 * and swap in the images.
 */
export const RichHtml = ({ html, site, loadImage, empty = "none" }: TRichHtml) => {
  const ref = React.useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = React.useState(0);
  const observer = React.useRef<ResizeObserver | null>(null);

  React.useEffect(() => () => observer.current?.disconnect(), []);

  const srcDoc = React.useMemo(
    () =>
      `<!doctype html><html><head><meta charset="utf-8"><style>${STYLE}</style></head><body>${prepare(html, site)}</body></html>`,
    [html, site]
  );

  const onLoad = () => {
    const doc = ref.current?.contentDocument;
    if (!doc) return;
    const measure = () => setHeight(doc.body.scrollHeight);
    measure();
    // re-measure when the card width changes or an image arrives
    observer.current?.disconnect();
    observer.current = new ResizeObserver(measure);
    observer.current.observe(doc.body);

    doc.querySelectorAll<HTMLImageElement>("img[data-src]").forEach(async (img) => {
      const blobUrl = await loadImage(img.dataset.src!);
      if (!img.isConnected) return;
      if (!blobUrl) return placeholder(doc, img);
      img.addEventListener("load", measure, { once: true });
      img.src = blobUrl;
      img.removeAttribute("data-src");
    });
  };

  if (!html.trim()) return <p className="text-sm opacity-60">{empty}</p>;

  return (
    <iframe
      ref={ref}
      title="content from Jira"
      sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      srcDoc={srcDoc}
      onLoad={onLoad}
      style={{ height }}
      className="block w-full border-0 bg-transparent"
    />
  );
};
