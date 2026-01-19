import http from 'http'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const distDir = path.join(__dirname, 'dist')

function getInfo() {
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
    addresses.find((a) => a.family === 'IPv4' && !a.internal)?.address ?? null
  return {
    hostname: os.hostname(),
    primaryIpv4,
    addresses,
    env: {
      HOSTNAME: process.env.HOSTNAME ?? null,
      POD_NAME: process.env.POD_NAME ?? process.env.HOSTNAME ?? null,
      POD_IP: process.env.POD_IP ?? null,
      NODE_NAME: process.env.NODE_NAME ?? null,
    },
    time: new Date().toISOString(),
  }
}

function sendJson(res, obj) {
  const data = JSON.stringify(obj)
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(data)
}

function notFound(res) {
  res.writeHead(404)
  res.end('Not Found')
}

const mime = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.map': 'application/octet-stream',
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`)
  if (url.pathname === '/api/info') {
    return sendJson(res, getInfo())
  }

  let filePath = path.join(distDir, url.pathname)
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html')
  }
  if (!fs.existsSync(filePath)) {
    filePath = path.join(distDir, 'index.html')
  }
  try {
    const ext = path.extname(filePath)
    const type = mime[ext] ?? 'application/octet-stream'
    const stream = fs.createReadStream(filePath)
    res.writeHead(200, { 'Content-Type': type })
    stream.pipe(res)
  } catch {
    notFound(res)
  }
})

const PORT = process.env.PORT ? Number(process.env.PORT) : 8080
const HOST = process.env.HOST ?? '0.0.0.0'

server.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`)
})

