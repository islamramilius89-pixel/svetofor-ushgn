import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8 mt-16">
      <div className="px-6 py-4 text-center">
        <p className="text-gray-300">© 2026 Светофор УШГН — Система мониторинга скважин Татнефть</p>
        <Link href="/admin" className="inline-block mt-3 text-sm text-gray-400 hover:text-white">
          Вход для администратора
        </Link>
      </div>
    </footer>
  )
}
