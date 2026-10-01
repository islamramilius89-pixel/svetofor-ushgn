const numberFormat = new Intl.NumberFormat('ru-RU')
const dateTimeFormat = new Intl.DateTimeFormat('ru-RU', { dateStyle: 'short', timeStyle: 'short' })

export function formatNumber(value: number): string {
  return numberFormat.format(value)
}

export function formatDateTime(isoDate: string): string {
  return dateTimeFormat.format(new Date(isoDate))
}
