import express from 'express'
import os from 'os'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = process.env.PORT || 3000

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, 'dist')))

// API Endpoint
app.get('/api/info', (req, res) => {
  const nets = os.networkInterfaces()
  const addresses = []
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
  res.json(body)
})

// Handle client-side routing by returning index.html for all other routes
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`)
})
