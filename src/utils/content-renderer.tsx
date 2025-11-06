import React from 'react';

/**
 * Simple markdown parser for common markdown elements
 * This is a basic implementation - for production, consider using a library like 'marked' or 'react-markdown'
 */
export function parseMarkdownToHtml(markdown: string): string {
  if (!markdown) return '';
  
  let html = markdown;
  
  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
  
  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.*?)_/g, '<em>$1</em>');
  
  // Code blocks
  html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
  
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  
  // Paragraphs (replace double newlines)
  html = html.replace(/\n\n/g, '</p><p>');
  html = '<p>' + html + '</p>';
  
  // Line breaks
  html = html.replace(/\n/g, '<br>');
  
  return html;
}

/**
 * Detect if content is HTML or Markdown
 */
export function isMarkdown(content: string): boolean {
  if (!content) return false;
  
  // If content already contains HTML tags, it's probably HTML
  if (/<[^>]+>/.test(content)) {
    // If it's well-formed HTML with balanced tags, it's HTML
    return false;
  }
  
  // Check for markdown patterns
  const markdownPatterns = [
    /^#{1,6}\s/,  // Headers
    /```/,        // Code blocks
    /`[^`]+`/,    // Inline code
    /\*\*[^*]+\*\*/, // Bold
    /__[^_]+__/,  // Bold (underline)
    /\[.*?\]\(.*?\)/, // Links
  ];
  
  return markdownPatterns.some(pattern => pattern.test(content));
}

/**
 * Render content whether it's HTML or Markdown
 */
export function renderContent(content: string): string {
  if (!content) return '';
  
  // If content is already HTML, return as is
  if (content.includes('<') && content.includes('>')) {
    // Check if it's well-formed HTML by looking for common tags
    const htmlTags = ['<p>', '<div>', '<span>', '<h1>', '<h2>', '<h3>', '<strong>', '<em>', '<br>', '<a>'];
    const hasHtmlTags = htmlTags.some(tag => content.includes(tag));
    
    if (hasHtmlTags) {
      return content;
    }
  }
  
  // Otherwise, treat as markdown and convert
  if (isMarkdown(content)) {
    return parseMarkdownToHtml(content);
  }
  
  // If it's plain text or unrecognized, wrap in paragraphs
  return `<p>${content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>`;
}

/**
 * React component to render content with proper styling
 */
export function ContentRenderer({ content, style }: { content: string; style?: React.CSSProperties }) {
  const renderedContent = renderContent(content);
  
  return (
    <div
      style={{
        fontSize: "1.1rem",
        lineHeight: "1.8",
        color: "#333",
        ...style,
      }}
      dangerouslySetInnerHTML={{ __html: renderedContent }}
    />
  );
}

