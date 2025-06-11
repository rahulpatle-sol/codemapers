"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var http_1 = require("http");
// 🧠 TypeScript declaration fix: use // @ts-ignore if types not found
// @ts-ignore
var ws_1 = require("ws");

var node_pty_1 = require("node-pty");
var app = (0, express_1.default)();
var server = (0, http_1.createServer)(app);
var wss = new ws_1.WebSocketServer({ server: server });
wss.on("connection", function (ws) {
    var shell = node_pty_1.default.spawn("bash", [], {
        name: "xterm-color",
        cols: 80,
        rows: 24,
        cwd: process.env.HOME,
        env: process.env,
    });
    // ✅ Fix: specify type of 'data' to avoid 'any' warning
    shell.on("data", function (data) {
        ws.send(data);
    });
    ws.on("message", function (msg) {
        shell.write(msg.toString());
    });
    ws.on("close", function () {
        shell.kill();
    });
});
server.listen(3001, function () {
    console.log("✅ Terminal server running on http://localhost:3001");
});
