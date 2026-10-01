type ProgressBarProps = {
  /** Значение в процентах (0–100). */
  value: number
  label: string
  /** Классы цвета заполненной части. */
  barClassName: string
  /** Классы высоты, например h-4. */
  sizeClassName?: string
}

export function ProgressBar({ value, label, barClassName, sizeClassName = 'h-4' }: ProgressBarProps) {
  const width = Math.min(100, Math.max(0, value))

  return (
    <div
      className={`w-full bg-gray-200 rounded-full ${sizeClassName}`}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
    >
      <div
        className={`rounded-full transition-all duration-500 ${sizeClassName} ${barClassName}`}
        style={{ width: `${width}%` }}
      />
    </div>
  )
}
