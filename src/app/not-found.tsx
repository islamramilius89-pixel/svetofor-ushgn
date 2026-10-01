import Link from 'next/link'
import { PageShell } from '@/common/ui/PageShell'

export default function NotFound() {
  return (
    <PageShell title="Страница не найдена">
      <p className="text-gray-700">Такого адреса на сайте нет. Возможно, ссылка устарела или в ней опечатка.</p>
      <Link
        href="/"
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
      >
        На главную
      </Link>
    </PageShell>
  )
}
