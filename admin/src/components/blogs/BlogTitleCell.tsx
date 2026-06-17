type BlogTitleCellProps = {
  title: string
  slug: string
}

export default function BlogTitleCell({ title, slug }: BlogTitleCellProps) {
  return (
    <div className="min-w-0 max-w-full py-0.5">
      <p className="line-clamp-2 text-sm font-medium leading-snug text-tsai-text lg:text-[0.9375rem] xl:text-base">
        {title}
      </p>
      <p className="mt-1 max-w-full truncate font-mono text-[10px] text-tsai-subtle lg:text-[11px]">
        /{slug}
      </p>
    </div>
  )
}
