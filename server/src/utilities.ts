import WebSocket, { WebSocketServer } from "ws"

export function sendDebug(client: WebSocket, message: string) {
   client.send(
      JSON.stringify({
         type: "debug",
         message
      })
   )
}

export function sendToAll(connectedClients: Record<string, WebSocket>, data: any) {
   Object.values(connectedClients).forEach((client) => {
      client.send(JSON.stringify(data))
   })
}

export function sendToAllExcept(except: string, clients: Record<string, WebSocket>, data: any) {
   Object.keys(clients).forEach((clientID) => {
      if (clientID !== except) clients[clientID].send(JSON.stringify(data))
   })
}

export function isInvalidNumber(thing: any) {
   return thing == undefined || thing == null || isNaN(thing) || !isFinite(thing)
}
