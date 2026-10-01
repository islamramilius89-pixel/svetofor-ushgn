import type { Metadata } from 'next'
import { PageShell } from '@/common/ui/PageShell'
import { ContactInfo } from '@/components/contact/ContactInfo'
import { ContactScreen } from '@/components/contact/ContactScreen'

export const metadata: Metadata = { title: 'Контакты' }

export default function ContactPage() {
  return (
    <PageShell title="Контакты">
      <ContactScreen info={<ContactInfo />} />
    </PageShell>
  )
}
