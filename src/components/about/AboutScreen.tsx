import { Card } from '@/common/ui/Card'

const stages = [
  { title: 'Основы NLP и предобработка', text: 'Разработка логического ядра системы' },
  { title: 'Опытно-промышленная эксплуатация', text: 'Тестирование на реальных скважинах (текущий этап)' },
  { title: 'Применение машинного обучения', text: 'Классификация типов отказов и оптимизация моделей' },
]

const methodology = [
  'Анализ электротока скважин',
  'Сравнение с эталонными значениями',
  'Выявление отклонений в реальном времени',
]

const outputs = [
  'Ранжированный список проблемных скважин',
  'Степень отклонения от нормы',
  'Рекомендации по срочности проверки',
]

export function AboutScreen() {
  return (
    <>
      <Card title="Описание">
        <p className="text-gray-700 mb-4">
          Светофор УШГН — это инновационная система мониторинга и диагностики скважин, разработанная компанией
          Татнефть. Система анализирует параметры электротока для автоматического выявления отклонений в работе
          оборудования.
        </p>
        <p className="text-gray-700">
          На текущей стадии опытно-промышленной эксплуатации система успешно выявляет проблемные скважины и
          способствует оптимизации технического обслуживания и ремонтных работ.
        </p>
      </Card>

      <Card title="Этапы развития">
        <ol className="space-y-4">
          {stages.map((stage, index) => (
            <li key={stage.title} className="flex items-start gap-4">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center shrink-0">
                {index + 1}
              </div>
              <div>
                <h3 className="font-bold">{stage.title}</h3>
                <p className="text-gray-600">{stage.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Card>

      <Card title="Технические характеристики">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeatureList title="Методология:" items={methodology} />
          <FeatureList title="Выход:" items={outputs} />
        </div>
      </Card>
    </>
  )
}

function FeatureList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="font-bold mb-2">{title}</h3>
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
