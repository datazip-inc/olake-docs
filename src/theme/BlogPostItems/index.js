import React from 'react'
import Link from '@docusaurus/Link'
import Image from '@theme/IdealImage'
import useBaseUrl from '@docusaurus/useBaseUrl'

import BlogPostItem from '@theme/BlogPostItem'
import TagsListInline from '@theme/TagsListInline'

import { Avatar } from '../../components/ui/avatar'
import { Card, CardContent, CardFooter } from '../../components/ui/card'

export default function BlogPostItems({
  items,
  component: BlogPostItemComponent = BlogPostItem,
}) {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((blog) => {
        const { permalink, title, tags, date, readingTime, description, frontMatter, authors } =
          blog.content.metadata

        return (
          <div key={permalink} className="flex">
            <Card
              className="
                flex w-full flex-col
                rounded-lg border border-gray-200 dark:border-gray-700
                bg-white dark:bg-slate-800
                shadow-sm hover:shadow-md
                transition-shadow
              "
            >
              {/* Image */}
              <Link
                to={permalink}
                className="
                  overflow-hidden 
                  rounded-t-lg 
                  transition-opacity 
                  hover:opacity-90
                "
              >
                <Image
                  className="h-auto w-full object-cover"
                  img={useBaseUrl(frontMatter.image)}
                  alt={title}
                  loading="lazy"
                />
              </Link>

              {/* Card Content */}
              <CardContent className="p-4">
                <Link to={permalink}>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                    {title}
                  </h2>
                </Link>
                <p className="mb-4 mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                  {description}
                </p>

                <div className="my-2 flex flex-wrap items-center gap-2">
                  {/* Authors */}
                  {authors.map((author, index) => (
                    <Link
                      href={author.page.permalink}
                      title={author.name}
                      key={index}
                      className="transition-opacity hover:opacity-80"
                    >
                      <Avatar>
                        <Image
                          alt={author.name}
                          img={useBaseUrl(author.imageURL)}
                          className="aspect-square h-full w-full"
                        />
                      </Avatar>
                    </Link>
                  ))}

                  {/* Date + Reading Time */}
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <span>{new Date(date).toLocaleDateString()}</span>
                    <span className="mx-2">•</span>
                    <span>{Math.ceil(readingTime)} min read</span>
                  </div>
                </div>
              </CardContent>

              {/* Tags Footer */}
              {tags.length > 0 && (
                <CardFooter className="px-4 pb-4">
                  <div className="blog-tags flex flex-wrap gap-2 text-sm">
                    <TagsListInline tags={tags} />
                  </div>
                </CardFooter>
              )}
            </Card>
          </div>
        )
      })}
    </div>
  )
}
