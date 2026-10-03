'use client'

import { useId, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'

const controlClass =
  'w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-blue-600 aria-invalid:border-red-500'

type FieldShellProps = { id: string; label: string; error?: string; hint?: string; children: React.ReactNode }

function FieldShell({ id, label, error, hint, children }: FieldShellProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-gray-700 font-semibold mb-1">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-600 mt-1">
          {error}
        </p>
      )}
    </div>
  )
}

/** Атрибуты, которые связывают поле с подписью и текстом ошибки (для скринридеров). */
function a11yProps(id: string, error?: string) {
  return {
    id,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? `${id}-error` : undefined,
  }
}

type BaseProps = { label: string; error?: string; hint?: string }

export function TextField({ label, error, hint, ...props }: BaseProps & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId()
  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <input className={controlClass} {...a11yProps(id, error)} {...props} />
    </FieldShell>
  )
}

export function TextAreaField({ label, error, hint, ...props }: BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId()
  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <textarea className={controlClass} rows={4} {...a11yProps(id, error)} {...props} />
    </FieldShell>
  )
}

type SelectFieldProps = BaseProps &
  SelectHTMLAttributes<HTMLSelectElement> & { options: { value: string | number; label: string }[] }

export function SelectField({ label, error, hint, options, ...props }: SelectFieldProps) {
  const id = useId()
  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <select className={controlClass} {...a11yProps(id, error)} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  )
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <p role="alert" className="text-red-600">
      {message}
    </p>
  )
}
