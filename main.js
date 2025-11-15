/* ============================================
   LG IVAN – MAIN APP ENGINE
   Prepína obrazovky, inicializuje moduly,
   štartuje TV, ventilátor, Tuya a hlasové príkazy
=============================================== */

// Prepínanie obrazoviek
function openScreen(screen) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById(screen).classList.add("active");

    // Haptika pri prepnutí
    if (navigator.vibrate) navigator.vibrate(30);

    // Načítanie modulov
    if (screen === "tv") buildTVRemote();
    if (screen === "fan") buildFanHUD();
    if (screen === "tuya") buildTuyaDevices();
}

/* ============================================
   HLASOVÝ ASISTENT
=============================================== */

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const synth = window.speechSynthesis;

let recognizer = null;

function startVoice() {
    if (!SpeechRecognition) {
        alert("Tvoj prehliadač nepodporuje hlasové ovládanie!");
        return;
    }

    if (!recognizer) {
        recognizer = new SpeechRecognition();
        recognizer.lang = "sk-SK";
        recognizer.continuous = false;
        recognizer.interimResults = false;
    }

    speak("Počúvam ťa Ivan.");

    recognizer.start();

    recognizer.onresult = (event) => {
        const text = event.results[0][0].transcript.toLowerCase();
        console.log("Rozpoznané:", text);

        handleVoiceCommand(text);
    };
}

function speak(text) {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = "sk-SK";
    synth.speak(msg);
}

/* ============================================
   INTERPRETÁCIA HLASOVÝCH PRÍKAZOV
=============================================== */

function handleVoiceCommand(text) {

    // === Globálne prepínanie modulov ===
    if (text.includes("televízor") || text.includes("tv")) {
        openScreen("tv");
        speak("Otváram ovládač televízora.");
    }

    else if (text.includes("ventilátor")) {
        openScreen("fan");
        speak("Otváram ventilátor.");
    }

    else if (text.includes("žiarovku") || text.includes("svetlo") || text.includes("dom")) {
        openScreen("tuya");
        speak("Otváram smart domácnosť.");
    }

    // === Presmerovanie na TV modul ===
    else if (document.getElementById("tv").classList.contains("active")) {
        handleTVVoice(text);
    }

    // === Presmerovanie na ventilátor ===
    else if (document.getElementById("fan").classList.contains("active")) {
        handleFanVoice(text);
    }

    // === Presmerovanie na Tuya ===
    else if (document.getElementById("tuya").classList.contains("active")) {
        handleTuyaVoice(text);
    }

    else {
        speak("No nerozumiem, povedz to ešte raz.");
    }
}

/* ============================================
   PRÁZDNE HOOKY – vyplnené v tv.js / fan.js / tuya.js
=============================================== */

function handleTVVoice(text) {}
function handleFanVoice(text) {}
function handleTuyaVoice(text) {}

/* ============================================
   Štart aplikácie
=============================================== */

window.onload = () => {
    openScreen("home");
};
