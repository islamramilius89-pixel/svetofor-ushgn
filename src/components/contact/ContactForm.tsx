import type { FormEvent } from 'react'
import { Card } from '@/common/ui/Card'
import type { ContactFlow } from '@/flows/use-contact-flow'
import type { ContactFormField } from '@/layers/domain/messages/message'

const fields: { name: ContactFormField; label: string; type: 'text' | 'email' | 'textarea'; autoComplete?: string }[] = [
  { name: 'name', label: 'Имя', type: 'text', autoComplete: 'name' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { name: 'text', label: 'Сообщение', type: 'textarea' },
]

const inputClassName =
  'w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-600 aria-invalid:border-red-500'

export function ContactForm({ flow }: { flow: ContactFlow }) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    flow.submit()
  }

  return (
    <Card title="Отправить сообщение">
      {/* noValidate: проверку делает схема из domain, чтобы сообщения были одинаковыми в браузере и на сервере */}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {fields.map((field) => {
          const id = `contact-${field.name}`
          const error = flow.fieldErrors[field.name]
          const commonProps = {
            id,
            name: field.name,
            value: flow.form[field.name],
            autoComplete: field.autoComplete,
            'aria-invalid': error ? true : undefined,
            'aria-describedby': error ? `${id}-error` : undefined,
            className: `${inputClassName} border-gray-300`,
          }

          return (
            <div key={field.name}>
              <label htmlFor={id} className="block text-gray-700 font-bold mb-2">
                {field.label}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  {...commonProps}
                  rows={5}
                  onChange={(event) => flow.updateField(field.name, event.target.value)}
                />
              ) : (
                <input
                  {...commonProps}
                  type={field.type}
                  onChange={(event) => flow.updateField(field.name, event.target.value)}
                />
              )}
              {error && (
                <p id={`${id}-error`} className="text-sm text-red-600 mt-1">
                  {error}
                </p>
              )}
            </div>
          )
        })}

        {flow.sendError && (
          <p role="alert" className="text-red-600">
            {flow.sendError}
          </p>
        )}
        {flow.isSent && (
          <p role="status" className="text-green-700">
            Сообщение отправлено
          </p>
        )}

        <button
          type="submit"
          disabled={flow.isSending}
          className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition disabled:opacity-60"
        >
          {flow.isSending ? 'Отправляем…' : 'Отправить'}
        </button>
      </form>
    </Card>
  )
}
