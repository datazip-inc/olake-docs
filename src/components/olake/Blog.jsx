import React from "react";
import { outerLink } from '../../../utils/functions'

const BlogList = [
  {
    tag: "New Release",
    heading:
      "Four Critical Challenges in MongoDB ETL and How to tackle them for your Data Lake",
    content:
      "Uncover the key challenges of extracting, transforming, and loading data from MongoDB into a data lakehouse. Learn best practices and common pitfalls to ensure seamless data integration and unlock valuable insights.",
    link: "https://datazip.io/blog/mongodb-etl-challenges",
    image: "/img/olake/blog-image-1.svg",
  },
  {
    tag: "New Release",
    heading:
      "Troubleshooting Common Issues and Solutions to MongoDB ETL Errors",
    content:
      "Explore practical solutions to common MongoDB ETL errors in our troubleshooting guide. Learn how to address issues like schema mismatches, data type conflicts, and performance bottlenecks to streamline your ETL processes and ensure smooth data integration.",
    link: "https://datazip.io/blog/troubleshooting-common-issues-and-solutions-to-mongodb-etl-errors/",
    image: "/img/olake/blog-image-2.svg",
  },
];

const OlakeBlogList = () => {
  return (
    <div className="olake-product-blog-container">
      <div className="olake-product-blog-main-heading">
        Read more from our blogs
      </div>
      <div className="olake-product-blog-list">
        {BlogList.map((blog) => {
          return (
            <div
              className="olake-product-blog"
              onClick={() => outerLink(blog.link)}
            >
              <img
                src={blog.image}
                alt={blog.heading}
                className="olake-product-blog-image"
              />
              <div className="olake-product-blog-tag">{blog.tag}</div>
              <div className="olake-product-blog-heading">{blog.heading}</div>
              <div className="olake-product-blog-subheading">
                {blog.content}
              </div>
              <a
                href={blog.link}
                target="_blank"
                rel="noopener noreferrer"
                className="olake-product-blog-link"
              >
                Read more
                <img
                  src="/img/olake/ArrowSquareOut.svg"
                  alt="arrow right"
                />
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OlakeBlogList;
