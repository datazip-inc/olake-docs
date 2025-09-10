import React from 'react';
import BlogStructuredData from '../../plugins/blog-structured-data/components/BlogStructuredData';
import BlogPostPage from '@theme-original/BlogPostPage';

export default function BlogPostPageWrapper(props) {
  return (
    <>
      <BlogStructuredData 
        frontMatter={props.content.metadata}
        content={props.content}
        metadata={props.metadata}
      />
      <BlogPostPage {...props} />
    </>
  );
}
