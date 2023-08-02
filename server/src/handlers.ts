import WebSocket, { WebSocketServer } from "ws"
import path from "path"
import fs from "fs"
import ServerData from "./types/ServerData"

export const handlers: Record<string, Handler> = {}
export function runHandlers() {
   // run handlers
   const handlersPath = path.join(__dirname, "handlers")
   const handlerFiles = fs.readdirSync(handlersPath).filter((file) => file.endsWith(".js"))
   for (const file of handlerFiles) {
      const filePath = path.join(handlersPath, file)
      const handler = require(filePath)
      if ("handle" in handler) {
         handlers[file.split(".").shift() as string] = handler
      } else {
         console.warn(
            `[WARNING] The handler at ${filePath} is missing the required "handler" property.`
         )
      }
   }
}

export interface Handler {
   handle(
      clientId: string,
      client: WebSocket,
      connectedClients: Record<string, WebSocket>,
      data: any,
      serverData: ServerData
   ): void
}
