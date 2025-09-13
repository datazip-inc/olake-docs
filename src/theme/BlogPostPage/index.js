import React from 'react';
import BlogPostPage from '@theme-original/BlogPostPage';

export default function BlogPostPageWrapper(props) {
  // Simple pass-through wrapper without JSON-LD structured data
  // This maintains the wrapper structure while excluding structured data as requested
  return <BlogPostPage {...props} />;
}