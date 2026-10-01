import Link from 'next/link'

export function CallToActionSection() {
  return (
    <section className="w-full px-6 sm:px-16 md:px-20">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-12 rounded-2xl shadow-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Готовы узнать больше?</h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Изучите результаты опытно-промышленной эксплуатации и технологию
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/about"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition"
            >
              О проекте
            </Link>
            <Link
              href="/results"
              className="border-2 border-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-blue-600 transition"
            >
              Результаты
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
