"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_crypto_1 = require("node:crypto");
const WORLD_SIZE = 2500;
function generate() {
    return {
        structures: generateTrees(),
        size: WORLD_SIZE
    };
}
exports.default = generate;
function generateTrees() {
    const treeAmount = Math.floor(Math.random() * 7) + 3;
    return new Array(treeAmount).fill(null).map(() => ({
        type: "tree",
        id: (0, node_crypto_1.randomBytes)(16).toString("hex"),
        position: {
            x: Math.random() * WORLD_SIZE,
            y: Math.random() * WORLD_SIZE
        },
        data: {
            health: 100,
            size: Math.floor(Math.random() * 3) + 1
        }
    }));
}
