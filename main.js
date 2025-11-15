// MAIN ENGINE – prepínanie obrazoviek & inicializácia modulov

function openScreen(name) {
    document.querySelectorAll(".screen").forEach(el => el.classList.remove("active"));
    document.getElementById(name).classList.add("active");

    // Načítanie modulov
    if (name === "tv") buildTVRemote();
    if (name === "fan") buildFanHUD();
    if (name === "tuya") buildTuyaDevices();
}


// GLOBAL HLASOVÝ ENGINE
function startVoice() {
    if (typeof handleVoiceCommand === "function") {
        handleVoiceCommand();
    }
}


// Vibrácie (len ak ich mobil podporuje)
function vibrate(ms = 40) {
    if (navigator.vibrate) navigator.vibrate(ms);
}
