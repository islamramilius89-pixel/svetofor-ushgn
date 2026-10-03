import { useEffect, useRef } from 'react'

/** Вызывает функцию, только когда пользователь перестал печатать (по умолчанию 350 мс). */
export function useDebouncedCallback<A extends unknown[]>(callback: (...args: A) => void, delay = 350) {
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const latest = useRef(callback)

  useEffect(() => {
    latest.current = callback
  })

  useEffect(() => () => clearTimeout(timer.current), [])

  return (...args: A) => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => latest.current(...args), delay)
  }
}
