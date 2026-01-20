export function getLocalIps(): Promise<string[]> {
  const w = window as unknown as {
    RTCPeerConnection?: typeof RTCPeerConnection
    mozRTCPeerConnection?: typeof RTCPeerConnection
    webkitRTCPeerConnection?: typeof RTCPeerConnection
  }
  const RTCPeer =
    w.RTCPeerConnection || w.mozRTCPeerConnection || w.webkitRTCPeerConnection
  if (!RTCPeer) return Promise.resolve([])
  const ipSet = new Set<string>()
  return new Promise((resolve) => {
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
    pc
      .createOffer()
      .then((offer) => pc.setLocalDescription(offer))
      .then(() => {
        setTimeout(() => {
          try {
            pc.close()
          } catch {
            void 0
          }
          resolve(Array.from(ipSet))
        }, 1500)
      })
      .catch(() => {
        try {
          pc.close()
        } catch {
          void 0
        }
        resolve(Array.from(ipSet))
      })
  })
}
