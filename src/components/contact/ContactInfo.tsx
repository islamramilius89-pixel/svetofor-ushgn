import { Card } from '@/common/ui/Card'

const info = [
  { title: 'Компания', text: 'ПАО «Татнефть»' },
  { title: 'Проект', text: 'Светофор УШГН — система мониторинга скважин' },
  { title: 'Статус', text: 'Опытно-промышленная эксплуатация' },
  { title: 'Email', text: 'info@tatneft.ru' },
]

export function ContactInfo() {
  return (
    <Card title="Информация">
      <dl className="space-y-4">
        {info.map((item) => (
          <div key={item.title}>
            <dt className="font-bold text-gray-700 mb-2">{item.title}</dt>
            <dd className="text-gray-600">{item.text}</dd>
          </div>
        ))}
      </dl>
    </Card>
  )
}
