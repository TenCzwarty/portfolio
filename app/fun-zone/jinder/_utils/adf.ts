/** Plain text -> Atlassian Document Format, one paragraph per non-empty line */
export const textToAdf = (text: string) => ({
  type: "doc",
  version: 1,
  content: text
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter(Boolean)
    .map((line) => ({ type: "paragraph", content: [{ type: "text", text: line }] })),
});

const escapeHtml = (text: string) => text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/** The demo has no Jira renderer, so it fakes one */
export const textToHtml = (text: string) =>
  text
    .split(/\r?\n/)
    .filter((line) => line.trim())
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join("");
