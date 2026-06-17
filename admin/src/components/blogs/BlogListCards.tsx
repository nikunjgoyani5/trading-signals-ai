import BlogListCard from './BlogListCard'
import BlogListPaginationBar from './BlogListPaginationBar'
import type { Blog } from '../../types/blog'

type BlogListCardsProps = {
  blogs: Blog[]
  total: number
  page: number
  perPage: number
  searchQuery: string
  onChangePage: (page: number) => void
  onChangePerPage: (perPage: number) => void
}

export default function BlogListCards({
  blogs,
  total,
  page,
  perPage,
  searchQuery,
  onChangePage,
  onChangePerPage,
}: BlogListCardsProps) {
  if (blogs.length === 0) {
    return (
      <p className="px-4 py-12 text-center text-sm text-tsai-muted sm:px-6">
        {searchQuery ? `No blogs match “${searchQuery}”.` : 'No blogs found.'}
      </p>
    )
  }

  return (
    <>
      <ul className="flex flex-col gap-2.5 p-3 sm:gap-3 sm:p-5 lg:p-6">
        {blogs.map((blog) => (
          <li key={blog.id}>
            <BlogListCard blog={blog} />
          </li>
        ))}
      </ul>
      <BlogListPaginationBar
        rowsPerPage={perPage}
        rowCount={total}
        currentPage={page}
        onChangePage={onChangePage}
        onChangeRowsPerPage={(next) => {
          onChangePerPage(next)
          onChangePage(1)
        }}
      />
    </>
  )
}
