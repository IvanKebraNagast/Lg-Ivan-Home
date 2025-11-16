/* ============================================================
   VENTILÁTOR – HUD SIMULÁCIA
   (Funguje hneď v PWA, bez API)
   Neskôr sa doplní Tuya API volanie.
============================================================ */

let fanState = {
    power: false,
    speed: 1,         // 1–3
    swing: false,     // oscilácia
    timer: 0          // v minútach
};

function buildFanHUD() {
    const box = document.getElementById("fanHUDContainer");

    box.innerHTML = `
        <div class="fan-status">
            <p><b>Stav:</b> ${fanState.power ? "Zapnutý" : "Vypnutý"}</p>
            <p><b>Rýchlosť:</b> ${fanState.speed}</p>
            <p><b>Oscilácia:</b> ${fanState.swing ? "Zapnutá" : "Vypnutá"}</p>
            <p><b>Časovač:</b> ${fanState.timer} min</p>
        </div>

        <div class="fan-controls">
            <button onclick="fanTogglePower()">⚡ Zapnúť/Vypnúť</button>
            <button onclick="fanSpeedUp()">➕ Rýchlosť</button>
            <button onclick="fanSpeedDown()">➖ Rýchlosť</button>
            <button onclick="fanToggleSwing()">🔄 Oscilácia</button>
            <button onclick="fanSetTimer()">⏱ Časovač</button>
        </div>
    `;
}

/* ============================================================
   FUNKCIE NA SIMULÁCIU
============================================================ */

function fanTogglePower() {
    fanState.power = !fanState.power;
    speak(`Ventilátor je teraz ${fanState.power ? "zapnutý" : "vypnutý"}.`);
    buildFanHUD();
}

function fanSpeedUp() {
    if (fanState.speed < 3) fanState.speed++;
    speak(`Rýchlosť nastavená na ${fanState.speed}.`);
    buildFanHUD();
}

function fanSpeedDown() {
    if (fanState.speed > 1) fanState.speed--;
    speak(`Rýchlosť nastavená na ${fanState.speed}.`);
    buildFanHUD();
}

function fanToggleSwing() {
    fanState.swing = !fanState.swing;
    speak(`Oscilácia ${fanState.swing ? "zapnutá" : "vypnutá"}.`);
    buildFanHUD();
}

function fanSetTimer() {
    const minutes = prompt("Nastav čas (v minútach):", "30");
    if (!minutes) return;

    fanState.timer = parseInt(minutes);
    speak(`Časovač nastavený na ${fanState.timer} minút.`);
    buildFanHUD();
}

/* ============================================================
   HLASOVÉ PRÍKAZY
============================================================ */

function handleFanVoice(text) {
    text = text.toLowerCase();

    if (text.includes("zapni")) {
        fanState.power = true;
        speak("Zapínam ventilátor.");
    }
    else if (text.includes("vypni")) {
        fanState.power = false;
        speak("Vypínam ventilátor.");
    }
    else if (text.includes("rýchlo") || text.includes("zvýš")) {
        fanSpeedUp();
        return;
    }
    else if (text.includes("pomaly") || text.includes("zniž")) {
        fanSpeedDown();
        return;
    }
    else if (text.includes("oscil")) {
        fanToggleSwing();
        return;
    }
    else if (text.includes("čas") || text.includes("timer")) {
        fanSetTimer();
        return;
    }
    else {
        speak("Nerozumiem príkazu pre ventilátor.");
        return;
    }

    buildFanHUD();
}
