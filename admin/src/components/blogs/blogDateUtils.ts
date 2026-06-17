export function splitFormattedDate(value: string): { date: string; time: string } {
  const parts = value.split(', ')
  if (parts.length >= 3) {
    return {
      date: `${parts[0]}, ${parts[1]}`,
      time: parts.slice(2).join(', '),
    }
  }
  return { date: value, time: '' }
}
