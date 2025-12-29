import React from 'react'
import { useHistory } from '@docusaurus/router'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '../../components/ui/pagination.tsx'

export const BlogPagination = ({ metadata }) => {
  const history = useHistory()

  const getBasePath = () => {
    const path = history.location.pathname
    // Check if we're on /iceberg or /blog
    if (path.includes('/iceberg')) {
      return '/iceberg'
    } else if (path.includes('/blog')) {
      return '/blog'
    }
    // Default fallback
    return '/blog'
  }

  const handleParams = () => {
    const path = history.location.pathname
    const parts = path.split('/').filter(p => p !== '')
    
    // Check if the path contains 'page' keyword
    const pageIndex = parts.indexOf('page')
    if (pageIndex !== -1 && pageIndex < parts.length - 1) {
      const pageNumber = parseInt(parts[pageIndex + 1], 10)
      return !isNaN(pageNumber) && pageNumber > 0 ? pageNumber : 1
    }
    
    // Default to page 1 if no page number found
    return 1
  }

  const page = handleParams()
  const basePath = getBasePath()

  const getPagePath = (pageNum) => {
    return pageNum === 1 ? basePath : `${basePath}/page/${pageNum}`
  }

  const handlePageChange = (e, value) => {
    e.preventDefault()
    if (value === page) {
      return
    }
    const newPagePath = getPagePath(value)
    history.push(newPagePath)
  }

  // Generate array of page numbers - show current, prev, next, and last page
  const generatePagination = (currentPage, totalPages) => {
    const pages = []
    
    // Ensure we have valid numbers
    const current = parseInt(currentPage, 10)
    const total = parseInt(totalPages, 10)
    
    if (isNaN(current) || isNaN(total) || current < 1 || total < 1) {
      return [1] // Return safe default
    }

    if (total <= 4) {
      // If 4 or fewer pages, show all pages
      for (let i = 1; i <= total; i++) {
        pages.push(i)
      }
      return pages
    }

    // For page 1: show [1, 2, ..., last]
    if (current === 1) {
      pages.push(1, 2, 'ellipsis', total)
      return pages
    }

    // For page 2: show [1, 2, 3, ..., last]
    if (current === 2) {
      pages.push(1, 2, 3, 'ellipsis', total)
      return pages
    }

    // For last page: show [1, ..., prev, last]
    if (current === total) {
      pages.push(1, 'ellipsis', total - 1, total)
      return pages
    }

    // For second to last page: show [1, ..., prev, second-last, last]
    if (current === total - 1) {
      pages.push(1, 'ellipsis', total - 2, total - 1, total)
      return pages
    }

    // For middle pages: show [1, ..., prev, current, next, ..., last]
    pages.push(1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total)
    return pages
  }

  if (!metadata || !metadata.totalPages || metadata.totalPages <= 1) {
    return null
  }

  const pages = generatePagination(page, metadata.totalPages)
  
  console.log('Pagination Debug:', { 
    currentPage: page, 
    totalPages: metadata.totalPages, 
    generatedPages: pages 
  })
  const hasPrevious = page > 1
  const hasNext = page < metadata.totalPages

  return (
    <Pagination className='mt-8 mb-8'>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={hasPrevious ? getPagePath(page - 1) : undefined}
            onClick={(e) => hasPrevious && handlePageChange(e, page - 1)}
            className={!hasPrevious ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
          />
        </PaginationItem>

        {pages.map((pageNum, index) => (
          <PaginationItem key={`${pageNum}-${index}`}>
            {pageNum === 'ellipsis' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href={getPagePath(pageNum)}
                onClick={(e) => handlePageChange(e, pageNum)}
                isActive={page === pageNum}
                className='cursor-pointer'
              >
                {pageNum}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href={hasNext ? getPagePath(page + 1) : undefined}
            onClick={(e) => hasNext && handlePageChange(e, page + 1)}
            className={!hasNext ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default BlogPagination
