import { randomBytes } from "node:crypto"
import WebSocket, { RawData, WebSocketServer } from "ws"
import ServerData from "./types/ServerData"
import { handlers, runHandlers } from "./handlers"
import { sendDebug, sendToAll, sendToAllExcept } from "./utilities"
import generate from "./world"
import InitPacket from "./types/InitPacket"

let ratelimit: Record<string, number> = {}
let lastRatelimitPeriod = Date.now()

export const serverData: ServerData = {
   players: [],
   world: generate()
}

const server = new WebSocketServer({
   port: 6969
})

const connectedClients: Record<string, WebSocket> = {}

runHandlers()
server.on("connection", (client, req) => {
   const clientID = randomBytes(16).toString("hex")
   const clientIP = req.socket.remoteAddress || clientID

   client.send(
      JSON.stringify({
         type: "init",
         you: {
            id: clientID,
            position: {
               x: Math.random() * 500,
               y: Math.random() * 500
            }
         },
         ...serverData
      } satisfies InitPacket)
   )

   const playerData = getNewPlayerData(clientID)
   serverData.players.push(playerData)

   sendToAllExcept(clientID, connectedClients, {
      type: "player-connect",
      ...playerData
   })
   connectedClients[clientID] = client

   client.on("message", (message) => {
      if (handleRatelimitAndGetIfRatelimited(clientIP)) {
         sendDebug(client, "Ratelimited 🐀")
         return client.close()
      }

      const data = parseData(message)
      if (data == null) return sendDebug(client, "Invalid Format 💀")
      if (!(data.type in handlers)) return sendDebug(client, "Invalid type 🤓")

      handlers[data.type].handle(clientID, client, connectedClients, data, serverData)
   })

   client.on("close", () => {
      delete connectedClients[clientID]
      serverData.players = serverData.players.filter((p) => p.id !== clientID)
      sendToAll(connectedClients, {
         type: "player-disconnect",
         id: clientID
      })
   })
})

function getNewPlayerData(clientID: string) {
   return {
      id: clientID,
      position: {
         x: 0,
         y: 0
      }
   }
}

function parseData(message: RawData) {
   try {
      // @ts-ignore
      return JSON.parse(message)
   } catch (error) {
      console.warn(error)
      return null
   }
}

function handleRatelimitAndGetIfRatelimited(clientIP: string): boolean {
   return false // Only in development because the ip is always the same since ngrok serves as a proxy
   if (Date.now() - lastRatelimitPeriod > 10000) {
      lastRatelimitPeriod = Date.now()
      ratelimit = {}
   }
   if (clientIP in ratelimit) ratelimit[clientIP]++
   else ratelimit[clientIP] = 1

   return ratelimit[clientIP] > 300
}

console.log(`🤓 socket running on ws://127.0.0.1:6969 (probably)`)
