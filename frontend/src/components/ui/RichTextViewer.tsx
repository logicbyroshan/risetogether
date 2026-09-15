import React from 'react';

interface RichTextViewerProps {
  content?: string | null;
  className?: string;
}

export const RichTextViewer: React.FC<RichTextViewerProps> = ({ content, className = '' }) => {
  if (!content) return null;

  return (
    <div
      className={`prose prose-invert prose-orange max-w-none 
        prose-headings:font-rajdhani prose-headings:text-orange-400 prose-headings:font-bold
        prose-p:text-gray-300 prose-p:leading-relaxed
        prose-a:text-orange-400 prose-a:underline hover:prose-a:text-orange-300
        prose-code:text-orange-300 prose-code:bg-gray-800/80 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
        prose-pre:bg-gray-950 prose-pre:border prose-pre:border-gray-800
        prose-img:rounded-xl prose-img:border prose-img:border-gray-800
        prose-ul:text-gray-300 prose-ol:text-gray-300 ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};
