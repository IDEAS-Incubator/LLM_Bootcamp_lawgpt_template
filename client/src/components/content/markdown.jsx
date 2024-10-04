import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'

import SyntaxHighlighter from "react-syntax-highlighter";

export const MarkdownRenderer = ({ content }) => {
  return (
    <ReactMarkdown
      children={content}
      remarkPlugins={[remarkGfm]}
      renderers={{
        code: ({ language, value }) => {
          return (
            <SyntaxHighlighter language={language} style={{ margin: "1em 0" }}>
              {value}
            </SyntaxHighlighter>
          );
        },
      }}
    />
  );
};

