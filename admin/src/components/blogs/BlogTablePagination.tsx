import type { PaginationComponentProps } from 'react-data-table-component'
import BlogListPaginationBar from './BlogListPaginationBar'

export default function BlogTablePagination({
  rowsPerPage,
  rowCount,
  currentPage,
  onChangePage,
  onChangeRowsPerPage,
}: PaginationComponentProps) {
  return (
    <BlogListPaginationBar
      rowsPerPage={rowsPerPage}
      rowCount={rowCount}
      currentPage={currentPage}
      onChangePage={(page) => onChangePage(page, rowCount)}
      onChangeRowsPerPage={(perPage) => onChangeRowsPerPage(perPage, 1)}
    />
  )
}
