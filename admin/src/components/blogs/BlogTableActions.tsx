import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Archive, Eye, Pencil, Send, Trash2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  useArchiveBlogMutation,
  useDeleteBlogMutation,
  usePublishBlogMutation,
} from '../../redux/api/blogsApi'
import { getApiErrorMessage } from '../../utils/apiError'
import { getAdminEditBlogUrl, getPublicBlogUrl } from '../../utils/blogUrls'
import type { Blog } from '../../types/blog'

const iconBtn =
  'inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border transition disabled:cursor-not-allowed disabled:opacity-50'

type BlogTableActionsProps = {
  blog: Blog
  layout?: 'table' | 'card'
}

function actionGridClass(isCard: boolean): string {
  if (!isCard) return 'flex items-center justify-end gap-1.5 py-0.5'
  return 'grid grid-cols-3 gap-2 sm:flex sm:justify-end sm:gap-1.5'
}

const neutralBtn =
  'border-white/10 bg-white/5 text-tsai-text hover:border-tsai-accent-cyan/40 hover:bg-tsai-accent/10 hover:text-tsai-accent-cyan'

function btnSize(isCard: boolean): string {
  return isCard ? 'h-10 w-full sm:h-9 sm:w-9' : ''
}

export default function BlogTableActions({ blog, layout = 'table' }: BlogTableActionsProps) {
  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation()
  const [publishBlog, { isLoading: isPublishing }] = usePublishBlogMutation()
  const [archiveBlog, { isLoading: isArchiving }] = useArchiveBlogMutation()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const isCard = layout === 'card'
  const size = btnSize(isCard)
  const busy = isDeleting || isPublishing || isArchiving

  const handleConfirmDelete = async () => {
    setDeleteError(null)
    try {
      await deleteBlog(blog.id).unwrap()
      setDeleteOpen(false)
    } catch (error) {
      setDeleteError(getApiErrorMessage(error))
    }
  }

  async function runStatusAction(action: () => Promise<unknown>) {
    setActionError(null)
    try {
      await action()
    } catch (error) {
      setActionError(getApiErrorMessage(error))
    }
  }

  const editButton = (
    <Link
      to={getAdminEditBlogUrl(blog.id)}
      aria-label="Edit blog"
      title="Edit"
      className={`${iconBtn} ${size} ${neutralBtn}`}
    >
      <Pencil className="h-4 w-4" strokeWidth={2} />
    </Link>
  )

  const viewButton = (
    <a
      href={getPublicBlogUrl(blog.slug)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="View blog on site"
      title="View on site"
      className={`${iconBtn} ${size} ${neutralBtn}`}
    >
      <Eye className="h-4 w-4" strokeWidth={2} />
    </a>
  )

  const deleteDialog = (
    <AlertDialog
      open={deleteOpen}
      onOpenChange={(nextOpen) => {
        if (!isDeleting) {
          setDeleteOpen(nextOpen)
          if (!nextOpen) setDeleteError(null)
        }
      }}
    >
      <AlertDialogTrigger
        nativeButton={false}
        render={
          <button
            type="button"
            disabled={busy}
            aria-label="Delete blog"
            title="Delete"
            className={`${iconBtn} ${size} border-red-500/25 bg-red-500/10 text-red-300 hover:border-red-400/40 hover:bg-red-500/20`}
          >
            <Trash2 className="h-4 w-4" strokeWidth={2} />
          </button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete blog?</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-medium text-tsai-text">&quot;{blog.title}&quot;</span> will be
            permanently removed. This action cannot be undone.
          </AlertDialogDescription>
          {deleteError ? (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {deleteError}
            </p>
          ) : null}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isDeleting}
            onClick={() => void handleConfirmDelete()}
          >
            {isDeleting ? 'Deleting…' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )

  return (
    <div className="w-full">
      <div className={actionGridClass(isCard)}>
        {blog.status === 'draft' ? (
          <>
            {editButton}
            <button
              type="button"
              disabled={busy}
              aria-label="Publish blog"
              title="Publish"
              onClick={() => void runStatusAction(() => publishBlog(blog.id).unwrap())}
              className={`${iconBtn} ${size} border-emerald-500/25 bg-emerald-500/10 text-emerald-300 hover:border-emerald-400/40 hover:bg-emerald-500/20`}
            >
              <Send className="h-4 w-4" strokeWidth={2} />
            </button>
            {deleteDialog}
          </>
        ) : null}

        {blog.status === 'published' ? (
          <>
            {editButton}
            {viewButton}
            <button
              type="button"
              disabled={busy}
              aria-label="Archive blog"
              title="Archive"
              onClick={() => void runStatusAction(() => archiveBlog(blog.id).unwrap())}
              className={`${iconBtn} ${size} border-amber-500/25 bg-amber-500/10 text-amber-300 hover:border-amber-400/40 hover:bg-amber-500/20`}
            >
              <Archive className="h-4 w-4" strokeWidth={2} />
            </button>
          </>
        ) : null}

        {blog.status === 'archived' ? (
          <>
            {viewButton}
            <button
              type="button"
              disabled={busy}
              aria-label="Publish blog"
              title="Publish"
              onClick={() => void runStatusAction(() => publishBlog(blog.id).unwrap())}
              className={`${iconBtn} ${size} border-emerald-500/25 bg-emerald-500/10 text-emerald-300 hover:border-emerald-400/40 hover:bg-emerald-500/20`}
            >
              <Send className="h-4 w-4" strokeWidth={2} />
            </button>
            {deleteDialog}
          </>
        ) : null}
      </div>

      {actionError ? (
        <p className="mt-2 text-[11px] text-red-300 sm:text-xs">{actionError}</p>
      ) : null}
    </div>
  )
}
