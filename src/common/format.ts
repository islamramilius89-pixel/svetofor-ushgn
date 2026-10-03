const numberFormat = new Intl.NumberFormat('ru-RU')
const dateTimeFormat = new Intl.DateTimeFormat('ru-RU', { dateStyle: 'short', timeStyle: 'short' })
const dateFormat = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

export function formatNumber(value: number): string {
  return numberFormat.format(value)
}

export function formatDateTime(isoDate: string): string {
  return dateTimeFormat.format(new Date(isoDate))
}

export function formatDate(isoDate: string): string {
  return dateFormat.format(new Date(isoDate))
}
