import Header from './components/Header'
import ErrorBanner from './components/ErrorBanner'
import SystemIdentityCard from './components/SystemIdentityCard'
import EnvK8sCard from './components/EnvK8sCard'
import NetworkInterfacesCard from './components/NetworkInterfacesCard'
import ClientFallbackCard from './components/ClientFallbackCard'
import Footer from './components/Footer'
import { useServerInfo } from './hooks/useServerInfo'
import { useMemo } from 'react'

function App() {
  const { serverInfo, fallbackLocalIps, publicIp, error } = useServerInfo()
  const ipv4Addresses = useMemo(
    () => (serverInfo?.addresses ?? []).filter((a) => a.family === 'IPv4'),
    [serverInfo?.addresses]
  )

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 font-sans relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-gradient-to-br from-blue-600/30 to-cyan-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-gradient-to-tr from-fuchsia-600/20 to-purple-500/10 blur-3xl" />
      </div>
      <div className="max-w-5xl mx-auto relative">
        <Header title="Server Instance Dashboard" subtitle="Live system diagnostics and network insights" />

        <ErrorBanner message={error} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SystemIdentityCard info={serverInfo} />

          <EnvK8sCard env={serverInfo?.env} />

          <NetworkInterfacesCard addresses={ipv4Addresses} />

          <ClientFallbackCard publicIp={publicIp} localIps={fallbackLocalIps} />
        </div>

        <Footer />
      </div>
    </div>
  )
}

export default App
