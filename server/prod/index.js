"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverData = void 0;
const node_crypto_1 = require("node:crypto");
const ws_1 = require("ws");
const handlers_1 = require("./handlers");
const utilities_1 = require("./utilities");
const world_1 = __importDefault(require("./world"));
let ratelimit = {};
let lastRatelimitPeriod = Date.now();
exports.serverData = {
    players: [],
    world: (0, world_1.default)()
};
const server = new ws_1.WebSocketServer({
    port: 6969
});
const connectedClients = {};
(0, handlers_1.runHandlers)();
server.on("connection", (client, req) => {
    const clientID = (0, node_crypto_1.randomBytes)(16).toString("hex");
    const clientIP = req.socket.remoteAddress || clientID;
    client.send(JSON.stringify({
        type: "init",
        you: {
            id: clientID,
            position: {
                x: Math.random() * 500,
                y: Math.random() * 500
            }
        },
        ...exports.serverData
    }));
    const playerData = getNewPlayerData(clientID);
    exports.serverData.players.push(playerData);
    (0, utilities_1.sendToAllExcept)(clientID, connectedClients, {
        type: "player-connect",
        ...playerData
    });
    connectedClients[clientID] = client;
    client.on("message", (message) => {
        if (handleRatelimitAndGetIfRatelimited(clientIP)) {
            (0, utilities_1.sendDebug)(client, "Ratelimited 🐀");
            return client.close();
        }
        const data = parseData(message);
        if (data == null)
            return (0, utilities_1.sendDebug)(client, "Invalid Format 💀");
        if (!(data.type in handlers_1.handlers))
            return (0, utilities_1.sendDebug)(client, "Invalid type 🤓");
        handlers_1.handlers[data.type].handle(clientID, client, connectedClients, data, exports.serverData);
    });
    client.on("close", () => {
        delete connectedClients[clientID];
        exports.serverData.players = exports.serverData.players.filter((p) => p.id !== clientID);
        (0, utilities_1.sendToAll)(connectedClients, {
            type: "player-disconnect",
            id: clientID
        });
    });
});
function getNewPlayerData(clientID) {
    return {
        id: clientID,
        position: {
            x: 0,
            y: 0
        }
    };
}
function parseData(message) {
    try {
        // @ts-ignore
        return JSON.parse(message);
    }
    catch (error) {
        console.warn(error);
        return null;
    }
}
function handleRatelimitAndGetIfRatelimited(clientIP) {
    return false; // Only in development because the ip is always the same since ngrok serves as a proxy
    if (Date.now() - lastRatelimitPeriod > 10000) {
        lastRatelimitPeriod = Date.now();
        ratelimit = {};
    }
    if (clientIP in ratelimit)
        ratelimit[clientIP]++;
    else
        ratelimit[clientIP] = 1;
    return ratelimit[clientIP] > 300;
}
console.log(`🤓 socket running on ws://127.0.0.1:6969 (probably)`);
