export const parseYMD = (s: string): Date => {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}

export const formatYMD = (date: Date): string => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export const getDateRange = (start: Date, end: Date): string[] => {
  const result = []
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateString = formatYMD(d)
    result.push(dateString)
  }
  return result
}
