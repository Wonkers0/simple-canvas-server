import { Handler } from "../handlers"
import { sendDebug, sendToAllExcept, isInvalidNumber } from "../utilities"

module.exports = {
   handle(clientId, client, connectedClients, data, serverData) {
      const player = serverData.players.filter((p) => p.id == clientId)[0]
      const parsedX = parseInt(data.x)
      const parsedY = parseInt(data.y)

      if (isInvalidNumber(parsedX) || isInvalidNumber(parsedY))
         return sendDebug(client, "Invalid position properties 🧭")

      player.position = {
         x: parsedX,
         y: parsedY
      }

      sendToAllExcept(clientId, connectedClients, {
         type: "position-update",
         id: clientId,
         position: player.position
      })

      return sendDebug(client, "Success 👍")
   }
} as Handler
