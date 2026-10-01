import { HomeScreen } from '@/components/home/HomeScreen'
import { getMonitoringOverview } from '@/layers/use-cases/monitoring/get-monitoring-overview'

export default function HomePage() {
  return <HomeScreen overview={getMonitoringOverview()} />
}
