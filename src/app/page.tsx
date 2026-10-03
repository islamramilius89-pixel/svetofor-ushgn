import { HomeScreen } from '@/components/home/HomeScreen'
import { fetchStats } from '@/layers/infrastructure/server/server-queries'
import { getMonitoringOverview } from '@/layers/use-cases/monitoring/get-monitoring-overview'

export default async function HomePage() {
  return <HomeScreen overview={getMonitoringOverview()} stats={await fetchStats()} />
}
