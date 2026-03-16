/**
 * Unescapes HTML entities in a string.
 * This is useful if the content from the DB is double-escaped or contains literal entities.
 */
export function unescapeHTML(html: string): string {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.documentElement.textContent || '';
}

/**
 * Ensures HTML content is ready for dangerouslySetInnerHTML.
 * If the content contains tags that were escaped (e.g. &lt;), it unescapes them.
 */
export function formatRichText(html: string): string {
  if (!html) return '';
  
  // If the string contains &lt;, it's likely escaped HTML
  if (html.includes('&lt;') || html.includes('&gt;')) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.documentElement.textContent || '';
  }
  
  return html;
}
