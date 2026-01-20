export function getLocalIps(): Promise<string[]> {
  const RTCPeer =
    (window as any).RTCPeerConnection ||
    (window as any).mozRTCPeerConnection ||
    (window as any).webkitRTCPeerConnection
  if (!RTCPeer) return Promise.resolve([])
  const ipSet = new Set<string>()
  return new Promise(async (resolve) => {
    const pc = new RTCPeer({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    })
    pc.createDataChannel('x')
    pc.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
      const candidate = event.candidate?.candidate
      if (!candidate) return
      const match = candidate.match(
        /(?:candidate:.+? )?([0-9]{1,3}(?:\.[0-9]{1,3}){3}|[a-fA-F0-9:]+)/
      )
      const ip = match?.[1]
      if (!ip) return
      ipSet.add(ip)
    }
    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)
    setTimeout(() => {
      pc.close()
      resolve(Array.from(ipSet))
    }, 1500)
  })
}
