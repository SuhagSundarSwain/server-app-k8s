import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import os from 'os'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'dev-ip-endpoint',
      configureServer(server) {
        server.middlewares.use('/api/info', (_req, res) => {
          const nets = os.networkInterfaces()
          const addresses: Array<{
            iface: string
            address: string
            family: string
            internal: boolean
          }> = []
          for (const [iface, infos] of Object.entries(nets)) {
            for (const info of infos ?? []) {
              addresses.push({
                iface,
                address: info.address,
                family: info.family,
                internal: Boolean(info.internal),
              })
            }
          }
          const primaryIpv4 =
            addresses.find((a) => a.family === 'IPv4' && !a.internal)?.address ??
            null
          const body = {
            hostname: os.hostname(),
            primaryIpv4,
            addresses,
            env: {
              HOSTNAME: process.env.HOSTNAME ?? null,
              POD_NAME: process.env.POD_NAME ?? null,
              POD_IP: process.env.POD_IP ?? null,
              NODE_NAME: process.env.NODE_NAME ?? null,
            },
            time: new Date().toISOString(),
          }
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(body))
        })
      },
    },
  ],
})
