export const turnBracketsIntoSpans = (text: string) =>
  text.replace(/\[/g, "<span>").replace(/\]/g, "</span>");
