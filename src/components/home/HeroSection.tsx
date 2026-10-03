import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white py-32">
      <div className="px-6 sm:px-16 md:px-20">
        <div className="max-w-6xl mx-auto flex flex-col items-center justify-center text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">🚨 Светофор УШГН</h1>
          <p className="text-2xl md:text-3xl mb-6 opacity-95 font-semibold">
            Инновационная система мониторинга и диагностики скважин
          </p>
          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-3xl">
            Автоматическое выявление отклонений в работе оборудования
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/wells"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold hover:bg-blue-50 transition text-lg"
            >
              Открыть скважины
            </Link>
            <Link
              href="/board"
              className="border-2 border-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-blue-600 transition text-lg"
            >
              Доска заявок
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
