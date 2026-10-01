import type { Metadata } from 'next'
import { PageShell } from '@/common/ui/PageShell'
import { AboutScreen } from '@/components/about/AboutScreen'

export const metadata: Metadata = { title: 'О проекте' }

export default function AboutPage() {
  return (
    <PageShell title="О проекте Светофор">
      <AboutScreen />
    </PageShell>
  )
}
