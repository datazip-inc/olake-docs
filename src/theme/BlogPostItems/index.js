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
          <article key={permalink} className="group h-full w-full">
            <Card className="h-full flex flex-col overflow-hidden rounded-2xl border-0 bg-white dark:bg-gray-900 shadow-lg hover:shadow-2xl transition-all duration-500 ease-out transform hover:-translate-y-2 hover:scale-[1.02] relative">
              {/* Gradient overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/30 dark:from-blue-950/20 dark:via-transparent dark:to-purple-950/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
              
              {/* Featured Image with enhanced hover effect */}
              <div className="relative overflow-hidden">
                <Link
                  to={permalink}
                  className="block relative group/image"
                >
                  <div className="aspect-[16/9] overflow-hidden  from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                    <Image
                      className="h-full w-full object-cover "
                      img={useBaseUrl(frontMatter.image)}
                      alt={title}
                      loading="lazy"
                      width={1280}
                      height={720}
                    />
                  </div>
                  {/* Image overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />
                </Link>
                
                {/* Reading time badge */}
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-white/90 dark:bg-gray-900/90 text-gray-700 dark:text-gray-300 backdrop-blur-sm border border-white/20 shadow-lg">
                    <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {Math.ceil(readingTime)} min
                  </span>
                </div>
              </div>

              {/* Card Content with improved spacing */}
              <CardContent className="flex-1 p-6 space-y-4 relative z-10">
                {/* Title with better typography */}
                <Link to={permalink} className="group/title">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50 leading-tight line-clamp-2 group-hover/title:text-[#193ae6] dark:group-hover/title:text-blue-400 transition-colors duration-300">
                    {title}
                  </h2>
                </Link>

                {/* Description with improved readability */}
                <p className="text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed text-sm">
                  {description}
                </p>

                {/* Author and date section with enhanced design */}
                <div className="flex items-center justify-between pt-2">
                  {/* Authors */}
                  <div className="flex items-center space-x-3">
                    <div className="flex -space-x-2">
                      {authors.slice(0, 2).map((author, index) => (
                        <Link
                          href={author.page?.permalink}
                          title={author.name}
                          key={index}
                          className="relative group/avatar transition-transform hover:scale-110 hover:z-10"
                        >
                          <Avatar className="w-8 h-8 border-2 border-white dark:border-gray-800 shadow-md hover:shadow-lg">
                            <Image
                              alt={author.name}
                              img={useBaseUrl(author.imageURL)}
                              className="aspect-square h-full w-full object-cover"
                            />
                          </Avatar>
                        </Link>
                      ))}
                      {authors.length > 2 && (
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center shadow-md">
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                            +{authors.length - 2}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Author name for single author */}
                    {authors.length === 1 && (
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {authors[0].name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Date with icon */}
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{new Date(date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}</span>
                  </div>
                </div>
              </CardContent>

              {/* Enhanced Tags Footer */}
              {tags.length > 0 && (
                <CardFooter className="px-6 pb-6 pt-0 relative z-10">
                  <div className="w-full">
                    <div className="flex flex-wrap gap-2">
                      {tags.slice(0, 3).map((tag, index) => (
                        <Link
                          key={index}
                          to={tag.permalink}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors duration-200 border border-blue-200/50 dark:border-blue-800/50"
                        >
                          #{tag.label}
                        </Link>
                      ))}
                      {tags.length > 3 && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                          +{tags.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </CardFooter>
              )}

              {/* Subtle bottom accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#193ae6] to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out rounded-b-2xl" />
            </Card>
          </article>
        )
      })}
    </div>
  )
}