const Websocket = require('ws');
const url = require('url');
let wws;
const clients = new Map(); // key: userRole, value: array of sokets

function initWebSocket(httpServer){
    wws = new Websocket.Server({ server: httpServer, path: '/ws' }); // path cho WebSocket, ví dụ /ws
    wws.on("connection", (ws, req) => {
        console.log(`[WebSocket] Incoming connection: ${req.url}`);
        const params = url.parse(req.url, true).query;
        const role = params.role || 'guest'; // ✅ dùng .role thay vì .get("role")

        if (!clients.has(role)) clients.set(role, []);
        clients.get(role).push(ws);
        console.log(`🟢 WebSocket connected: role=${role}`);

        ws.on("close", () => {
            clients.set(role, clients.get(role).filter(s => s !== ws));
            console.log(`🔴 WebSocket disconnected: role=${role}`);
        });
    });
}

function broadcastToAdmins(data){
    const adminSockets = clients.get('admin') || [];
    adminSockets.forEach(ws => {
        if(ws.readyState === Websocket.OPEN){
            ws.send(JSON.stringify(data));
        }
    })
}

module.exports = { initWebSocket, broadcastToAdmins };