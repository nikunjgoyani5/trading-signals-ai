import { useEffect, useState } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    const media = window.matchMedia(query)
    const onChange = () => setMatches(media.matches)
    onChange()
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [query])

  return matches
}

/** Desktop table layout (sidebar + main); cards below this width */
export function useIsLgUp() {
  return useMediaQuery('(min-width: 1024px)')
}

/** Full table columns including Updated */
export function useIsXlUp() {
  return useMediaQuery('(min-width: 1280px)')
}
