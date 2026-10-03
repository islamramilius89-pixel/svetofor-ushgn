import type { ButtonHTMLAttributes } from 'react'

const variants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  ghost: 'text-gray-700 hover:bg-gray-100',
} as const

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants
  size?: 'sm' | 'md'
}

export function Button({ variant = 'primary', size = 'md', className = '', type = 'button', ...props }: ButtonProps) {
  const sizeClass = size === 'sm' ? 'px-3 py-1.5 text-sm' : 'px-4 py-2'
  return (
    <button
      type={type}
      className={`rounded-lg font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed ${sizeClass} ${variants[variant]} ${className}`}
      {...props}
    />
  )
}
