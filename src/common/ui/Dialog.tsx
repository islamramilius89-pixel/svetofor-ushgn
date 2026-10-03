'use client'

import { useEffect, useId, useRef, type ReactNode } from 'react'

type DialogProps = { open: boolean; title: string; onClose: () => void; children: ReactNode }

/**
 * Модальное окно на встроенном элементе <dialog>: браузер сам закрывает его по Esc,
 * держит фокус внутри и затемняет фон.
 */
export function Dialog({ open, title, onClose, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby={titleId}
      className="m-auto w-[min(36rem,calc(100%-2rem))] rounded-2xl p-0 shadow-2xl backdrop:bg-black/40"
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h2 id={titleId} className="text-2xl font-bold">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="text-gray-500 hover:text-gray-800 text-2xl leading-none"
          >
            ×
          </button>
        </div>
        {open && children}
      </div>
    </dialog>
  )
}
