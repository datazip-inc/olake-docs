import React from 'react';
import BlogStructuredData from '../../plugins/blog-structured-data/components/BlogStructuredData';
import BlogBreadcrumbs from '../BlogBreadcrumbs';
import BlogPostPage from '@theme-original/BlogPostPage';

export default function BlogPostPageWrapper(props) {
  return (
    <>
      <BlogStructuredData 
        frontMatter={props.content.metadata}
        content={props.content}
        metadata={props.metadata}
      />
      <div className="container mx-auto px-4 py-6">
        <BlogBreadcrumbs />
      </div>
      <BlogPostPage {...props} />
    </>
  );
}
