"use strict";
// 🤓 <-- The Incredible Git Expert has been spotted
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("../utilities");
module.exports = {
    handle(clientId, client, connectedClients, data) {
        if (!data.message)
            return (0, utilities_1.sendDebug)(client, "Invalid message 🤓");
        (0, utilities_1.sendToAllExcept)(clientId, connectedClients, {
            type: "chat",
            id: clientId,
            message: data.message
        });
        (0, utilities_1.sendDebug)(client, "Success 👍");
    }
};
