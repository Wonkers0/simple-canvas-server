// 🤓 <-- The Incredible Git Expert has been spotted

import { Handler } from "../handlers"
import { sendDebug, sendToAllExcept } from "../utilities"

module.exports = {
   handle(clientId, client, connectedClients, data) {
      if (!data.message) return sendDebug(client, "Invalid message 🤓")

      sendToAllExcept(clientId, connectedClients, {
         type: "chat",
         id: clientId,
         message: data.message
      })
      sendDebug(client, "Success 👍")
   }
} as Handler
