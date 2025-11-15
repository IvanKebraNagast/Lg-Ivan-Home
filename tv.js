/* =============================
   LG TV REMOTE – tv.js
============================= */

let tvSocket = null;
let tvConnected = false;
let tvClientKey = ""; // sem sa uloží key po párovaní

// Build UI
function buildTVRemote() {
    const container = document.getElementById("tvRemoteContainer");

    container.innerHTML = `
        <div class="tv-ip-box">
            <input id="tvIpInput" placeholder="IP TV (napr. 192.168.178.40)" value="192.168.178.40">
            <button id="tvConnectBtn" class="remote-btn">Pripojiť</button>
        </div>

        <div id="tvStatus" style="margin:10px 0; opacity:0.8;">Odpojené</div>

        <button class="remote-btn remote-power" data-cmd="system/turnOff">⏻</button>

        <div>
            <button class="remote-btn" data-key="UP">▲</button>
        </div>

        <div>
            <button class="remote-btn" data-key="LEFT">◀</button>
            <button class="remote-btn" data-key="ENTER">OK</button>
            <button class="remote-btn" data-key="RIGHT">▶</button>
        </div>

        <div>
            <button class="remote-btn" data-key="DOWN">▼</button>
        </div>

        <div style="margin-top:20px;">
            <button class="remote-btn" data-cmd="audio/volumeUp">VOL +</button>
            <button class="remote-btn" data-cmd="audio/volumeDown">VOL -</button>
        </div>

        <div style="margin-top:10px;">
            <button class="remote-btn" data-cmd="tv/channelUp">CH +</button>
            <button class="remote-btn" data-cmd="tv/channelDown">CH -</button>
        </div>

        <div style="margin-top:20px;">
            <button class="remote-btn" data-cmd="system.launcher/launch" data-app="com.webos.app.home">🏠 Home</button>
            <button class="remote-btn" data-key="BACK">↩ Back</button>
        </div>

        <div style="margin-top:20px;">
            <button class="remote-btn" data-app-launch="netflix">Netflix</button>
            <button class="remote-btn" data-app-launch="youtube.leanback.v4">YouTube</button>
        </div>
    `;

    // Connect button
    document.getElementById("tvConnectBtn").onclick = connectTV;

    // Commands
    container.querySelectorAll("button[data-cmd]").forEach(btn => {
        btn.onclick = () => sendTVCommand(btn);
    });

    // Keys
    container.querySelectorAll("button[data-key]").forEach(btn => {
        btn.onclick = () => sendTVKey(btn.dataset.key);
    });

    // App launch
    container.querySelectorAll("button[data-app-launch]").forEach(btn => {
        btn.onclick = () => launchTVApp(btn.dataset.appLaunch);
    });
}

/* =============================
   TV CONNECTION
============================= */

function connectTV() {
    const ip = document.getElementById("tvIpInput").value.trim();
    const status = document.getElementById("tvStatus");

    if (!ip) return alert("Zadaj IP TV!");

    status.innerText = "Pripájam sa...";
    
    tvSocket = new WebSocket(`ws://${ip}:3000`);

    tvSocket.onopen = () => {
        tvConnected = true;
        status.innerText = "Pripojené ✔";
        vibrate(40);

        const registerMsg = {
            type: "register",
            id: "regReq",
            payload: {
                forcePairing: false,
                pairingType: "prompt",
                "client-key": tvClientKey || ""
            }
        };

        tvSocket.send(JSON.stringify(registerMsg));
    };

    tvSocket.onmessage = (event) => {
        const msg = JSON.parse(event.data);

        if (msg.type === "registered" && msg.payload["client-key"]) {
            tvClientKey = msg.payload["client-key"];
            status.innerText = "Spárované 👍";
        }
    };

    tvSocket.onclose = () => {
        tvConnected = false;
        status.innerText = "Odpojené";
    };
}

/* =============================
   SEND COMMANDS
============================= */

function sendTVCommand(btn) {
    if (!tvConnected) return alert("TV nie je pripojená!");

    const uri = btn.dataset.cmd;
    const app = btn.dataset.app;

    const msg = {
        type: "request",
        id: String(Date.now()),
        uri: `ssap://${uri}`,
        payload: app ? { id: app } : {}
    };

    tvSocket.send(JSON.stringify(msg));
    vibrate(30);
}

function sendTVKey(key) {
    if (!tvConnected) return alert("TV nie je pripojená!");

    const msg = {
        type: "request",
        id: String(Date.now()),
        uri: "ssap://com.webos.service.ime/sendKey",
        payload: { key: key }
    };

    tvSocket.send(JSON.stringify(msg));
    vibrate(30);
}

function launchTVApp(appId) {
    if (!tvConnected) return alert("TV nie je pripojená!");

    const msg = {
        type: "request",
        id: "appLaunch",
        uri: "ssap://system.launcher/launch",
        payload: { id: appId }
    };

    tvSocket.send(JSON.stringify(msg));
    vibrate(40);
}
