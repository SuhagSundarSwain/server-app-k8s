export type NetAddress = {
  iface: string
  address: string
  family: string
  internal: boolean
}

export type EnvInfo = {
  HOSTNAME: string | null
  POD_NAME: string | null
  POD_IP: string | null
  NODE_NAME: string | null
}

export type ServerInfo = {
  hostname: string
  primaryIpv4: string | null
  addresses: NetAddress[]
  env: EnvInfo
  time: string
}
