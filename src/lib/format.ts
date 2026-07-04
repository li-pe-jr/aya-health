export function greeting(date = new Date()): string {
  const h = date.getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export function longDate(date = new Date()): string {
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export function relativeDay(ts: number): string {
  const now = new Date()
  const then = new Date(ts)
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime()
  const dayMs = 86_400_000
  const diff = Math.floor((startOfToday - then.setHours(0, 0, 0, 0)) / dayMs)
  if (diff <= 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  if (diff < 7) return `${diff} days ago`
  return new Date(ts).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
  })
}

export function timeOfDay(ts: number): string {
  return new Date(ts).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function joinedLabel(ts: number): string {
  if (!ts) return 'Just joined'
  return `Joined ${new Date(ts).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  })}`
}
