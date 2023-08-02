"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInvalidNumber = exports.sendToAllExcept = exports.sendToAll = exports.sendDebug = void 0;
function sendDebug(client, message) {
    client.send(JSON.stringify({
        type: "debug",
        message
    }));
}
exports.sendDebug = sendDebug;
function sendToAll(connectedClients, data) {
    Object.values(connectedClients).forEach((client) => {
        client.send(JSON.stringify(data));
    });
}
exports.sendToAll = sendToAll;
function sendToAllExcept(except, clients, data) {
    Object.keys(clients).forEach((clientID) => {
        if (clientID !== except)
            clients[clientID].send(JSON.stringify(data));
    });
}
exports.sendToAllExcept = sendToAllExcept;
function isInvalidNumber(thing) {
    return thing == undefined || thing == null || isNaN(thing) || !isFinite(thing);
}
exports.isInvalidNumber = isInvalidNumber;
