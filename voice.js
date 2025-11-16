/* ============================================================
   VOICE ENGINE – Slovenské hlasové ovládanie pre PWA
   Používa SpeechRecognition + SpeechSynthesis
============================================================ */

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const synth = window.speechSynthesis;

let recognizer = null;

/* ============================================================
   ŠTART HLASOVÉHO OVLÁDANIA
============================================================ */

function startVoice() {

    if (!SpeechRecognition) {
        alert("Tvoj prehliadač nepodporuje hlasové ovládanie.");
        return;
    }

    if (!recognizer) {
        recognizer = new SpeechRecognition();
        recognizer.lang = "sk-SK";          // Jazyk rozpoznávania
        recognizer.continuous = false;
        recognizer.interimResults = false;
    }

    speak("Počúvam ťa Ivan.");

    recognizer.start();

    recognizer.onresult = (event) => {
        const text = event.results[0][0].transcript.toLowerCase();
        console.log("Hlas rozpoznal:", text);
        handleVoiceCommand(text);
    };

    recognizer.onerror = () => {
        speak("Nerozumel som, skús znova.");
    };
}

/* ============================================================
   SYNTĖZA HLASU (hovorenie)
============================================================ */

function speak(text) {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = "sk-SK";
    synth.speak(msg);
}

/* ============================================================
   GLOBÁLNA INTERPRETÁCIA PRÍKAZOV
   (presmeruje do správneho modulu)
============================================================ */

function handleVoiceCommand(text) {

    // Prepínanie modulov hlasom
    if (text.includes("televízor") || text.includes("tv")) {
        openScreen("tv");
        speak("Otváram ovládač televízora.");
        return;
    }

    if (text.includes("ventilátor")) {
        openScreen("fan");
        speak("Otváram ventilátor.");
        return;
    }

    if (text.includes("svetlo") || text.includes("žiarovku") || text.includes("dom")) {
        openScreen("tuya");
        speak("Otváram smart domácnosť.");
        return;
    }

    // --- Modul TV ---
    if (document.getElementById("tv").classList.contains("active")) {
        handleTVVoice(text);
        return;
    }

    // --- Modul Ventilátor ---
    if (document.getElementById("fan").classList.contains("active")) {
        handleFanVoice(text);
        return;
    }

    // --- Modul Tuya ---
    if (document.getElementById("tuya").classList.contains("active")) {
        handleTuyaVoice(text);
        return;
    }

    speak("Nerozumel som, skús povedať to znova.");
}
