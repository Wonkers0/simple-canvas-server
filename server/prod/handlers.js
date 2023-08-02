"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runHandlers = exports.handlers = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
exports.handlers = {};
function runHandlers() {
    // run handlers
    const handlersPath = path_1.default.join(__dirname, "handlers");
    const handlerFiles = fs_1.default.readdirSync(handlersPath).filter((file) => file.endsWith(".js"));
    for (const file of handlerFiles) {
        const filePath = path_1.default.join(handlersPath, file);
        const handler = require(filePath);
        if ("handle" in handler) {
            exports.handlers[file.split(".").shift()] = handler;
        }
        else {
            console.warn(`[WARNING] The handler at ${filePath} is missing the required "handler" property.`);
        }
    }
}
exports.runHandlers = runHandlers;
