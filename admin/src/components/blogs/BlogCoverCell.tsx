import { ImageIcon } from 'lucide-react'
import { useState } from 'react'
import { resolveBlogCoverUrl } from '../../utils/mapBlog'

type BlogCoverCellProps = {
  title: string
  coverImage?: string
  size?: 'sm' | 'md'
}

const sizeClass = {
  sm: 'h-11 w-14 rounded-lg',
  md: 'h-[3.25rem] w-[4.5rem] rounded-xl',
} as const

function CoverPlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-tsai-accent/20 to-tsai-accent-cyan/10">
      <ImageIcon className="h-5 w-5 text-tsai-accent-cyan/70" strokeWidth={1.75} />
    </div>
  )
}

export default function BlogCoverCell({ title, coverImage, size = 'md' }: BlogCoverCellProps) {
  const src = resolveBlogCoverUrl(coverImage)
  const [failed, setFailed] = useState(false)
  const dim = sizeClass[size]

  if (!src || failed) {
    return (
      <div
        className={`${dim} shrink-0 overflow-hidden border border-white/10`}
        title="No cover image"
      >
        <CoverPlaceholder />
      </div>
    )
  }

  return (
    <div className={`${dim} shrink-0 overflow-hidden border border-white/10 bg-tsai-surface`}>
      <img
        src={src}
        alt={title}
        className="h-full w-full object-cover"
        loading="lazy"
        onError={() => setFailed(true)}
      />
    </div>
  )
}
