import React from "react";

type TRichHtml = {
  html: string;
  /** Jira site, so relative links like /browse/ABC-1 lead back to Jira */
  site: string;
  empty?: string;
};

const STYLE = `
  html, body { margin: 0; color: #111; font: 14px/1.55 system-ui, sans-serif; overflow-wrap: anywhere; }
  body { display: flow-root; }
  p { margin: 0 0 0.6em; }
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
 * links are made absolute (the site CSP forbids <base>) and open in a new tab,
 * images become a placeholder – the CSP blocks them and Jira attachments need a login anyway.
 */
const prepare = (html: string, site: string) => {
  const doc = new DOMParser().parseFromString(html, "text/html");

  doc.querySelectorAll("a[href]").forEach((a) => {
    try {
      const url = new URL(a.getAttribute("href")!, `https://${site}/`);
      if (!SAFE_PROTOCOLS.includes(url.protocol)) throw new Error();
      a.setAttribute("href", url.href);
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener noreferrer");
    } catch {
      a.removeAttribute("href");
    }
  });

  doc.querySelectorAll("img").forEach((img) => {
    const placeholder = doc.createElement("span");
    placeholder.className = "img";
    placeholder.textContent = img.alt ? `[${img.alt}]` : "[obrazek – zobacz w Jirze]";
    img.replaceWith(placeholder);
  });

  return doc.body.innerHTML;
};

/**
 * Jira's rendered HTML goes into a sandboxed iframe with scripts disabled – it comes from a
 * third party and the page holds an API token. allow-same-origin only lets us measure its height.
 */
export const RichHtml = ({ html, site, empty = "brak" }: TRichHtml) => {
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
    // re-measure when the card width changes
    observer.current?.disconnect();
    observer.current = new ResizeObserver(measure);
    observer.current.observe(doc.body);
  };

  if (!html.trim()) return <p className="text-sm opacity-60">{empty}</p>;

  return (
    <iframe
      ref={ref}
      title="treść z Jiry"
      sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      srcDoc={srcDoc}
      onLoad={onLoad}
      style={{ height }}
      className="block w-full border-0 bg-transparent"
    />
  );
};
