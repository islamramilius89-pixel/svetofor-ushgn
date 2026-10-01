const features = [
  {
    icon: '📊',
    title: 'Мониторинг в реальном времени',
    text: 'Анализ электротока и выявление аномалий в работе оборудования скважин',
  },
  {
    icon: '🎯',
    title: 'Точная диагностика',
    text: 'Разделение сигналов по типам неисправностей: наземный привод vs ГНО',
  },
  {
    icon: '⚡',
    title: 'Оптимизация процессов',
    text: 'Снижение внеплановых простоев и затрат на аварийный ремонт',
  },
]

export function FeaturesSection() {
  return (
    <section className="w-full px-6 sm:px-16 md:px-20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          ✨ Возможности системы
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition group hover:scale-105 duration-300 text-center"
            >
              <div className="text-6xl mb-4 group-hover:scale-125 transition duration-300">{feature.icon}</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
