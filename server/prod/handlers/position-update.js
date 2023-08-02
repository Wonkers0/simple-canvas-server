"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("../utilities");
module.exports = {
    handle(clientId, client, connectedClients, data, serverData) {
        const player = serverData.players.filter((p) => p.id == clientId)[0];
        const parsedX = parseInt(data.x);
        const parsedY = parseInt(data.y);
        if ((0, utilities_1.isInvalidNumber)(parsedX) || (0, utilities_1.isInvalidNumber)(parsedY))
            return (0, utilities_1.sendDebug)(client, "Invalid position properties 🧭");
        player.position = {
            x: parsedX,
            y: parsedY
        };
        (0, utilities_1.sendToAllExcept)(clientId, connectedClients, {
            type: "position-update",
            id: clientId,
            position: player.position
        });
        return (0, utilities_1.sendDebug)(client, "Success 👍");
    }
};
