'use client'

import type { ReactNode } from 'react'
import { useContactFlow } from '@/flows/use-contact-flow'
import { ContactForm } from './ContactForm'
import { MessageList } from './MessageList'

/** Интерактивная часть страницы контактов. Статичный блок с информацией приходит с сервера через `info`. */
export function ContactScreen({ info }: { info: ReactNode }) {
  const flow = useContactFlow()

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ContactForm flow={flow} />
        {info}
      </div>
      <MessageList flow={flow} />
    </>
  )
}
