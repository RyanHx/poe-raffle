let running = false,
    entries = [],
    lastResize = [];

function keywordInput() {
    const val = document.getElementById("keywordInput").value;
    window.electronAPI.updateKeyword(val);
}

function toggleRaffle() {
    const toggleBtn = document.getElementById("toggle-raffle-btn");
    running = !running;
    if (running) {
        toggleBtn.classList.remove("btn-primary");
        toggleBtn.classList.add("btn-danger");
        toggleBtn.querySelector(".spinner-border").classList.remove("visually-hidden");
        toggleBtn.querySelector("#raffle-btn-text").textContent = "Stop raffle!";
    } else {
        toggleBtn.classList.remove("btn-danger");
        toggleBtn.classList.add("btn-primary");
        toggleBtn.querySelector(".spinner-border").classList.add("visually-hidden");
        toggleBtn.querySelector("#raffle-btn-text").textContent = "Start raffle!";
    }
    window.electronAPI.toggleLogListener(running);
}

function drawWinner() {
    if (entries.length === 0) {
        return;
    }
    if (running) {
        running = false;
        window.electronAPI.toggleLogListener(running);
        const toggleBtn = document.getElementById("toggle-raffle-btn");
        toggleBtn.classList.remove("btn-danger");
        toggleBtn.classList.add("btn-primary");
        toggleBtn.querySelector(".spinner-border").classList.add("visually-hidden");
        toggleBtn.querySelector("#raffle-btn-text").textContent = "Start raffle!";
    }
    const winner = entries[Math.floor(Math.random() * entries.length)];
    document.getElementById("winner").textContent = winner;
    document.getElementById("winner-wrapper").classList.remove("visually-hidden");
    // https://confetti.js.org/more.html
    const defaults = {
        startVelocity: 50,
        particleCount: 150,
        spread: 60,
        scalar: 0.7
    }
    confetti({
        ...defaults,
        angle: 45,
        origin: { x: 0, y: 0.8 },
    });
    confetti({
        ...defaults,
        angle: 150,
        origin: { x: 1, y: 0.8 },
    });
    window.electronAPI.setClipboard(winner);
}

function resetRaffle() {
    entries = [];
    document.getElementById("entries-table").innerHTML = "";
    document.getElementById("winner-wrapper").classList.add("visually-hidden");
}

function handleResize() {
    const vpHeight = document.querySelector("html").clientHeight;
    const borderElem = document.querySelector("div.border");
    borderElem.style.maxHeight = `${vpHeight - 35}px`;
    console.log(`Max height set to ${borderElem.style.maxHeight}`);
    const tblWrapper = document.getElementById("entries-table-wrapper")
    tblWrapper.style.maxHeight = `${vpHeight - 100}px`;
    console.log(`Max height set to ${tblWrapper.style.maxHeight}`);
}

async function handleFilePick() {
    const filePath = await window.electronAPI.openFile();
    if (filePath) {
        document.getElementById("pathInput").value = filePath;
    }
}

// Receive entry from main process
window.electronAPI.addEntry((_event, value) => {
    if (!entries.includes(value)) {
        entries.push(value);
        const table = document.getElementById("entries-table");
        const row = table.insertRow(-1);
        row.insertCell().appendChild(document.createTextNode(value));
    }
});

window.electronAPI.getSettings().then((settings) => {
    document.getElementById("pathInput").value = settings.logPath;
    document.getElementById("lanInput").value = settings.clientLang;
});

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

// DOM listeners
document.getElementById("keywordInput").addEventListener(
    "input",
    () => keywordInput(),
    false
);

document.getElementById("toggle-raffle-btn").addEventListener(
    "click",
    () => toggleRaffle(),
    false
);

document.getElementById("draw-win-btn").addEventListener(
    "click",
    () => drawWinner(),
    false
);

document.getElementById("reset-confirm-btn").addEventListener(
    "click",
    () => resetRaffle(),
    false
);

document.getElementById("pathInput").addEventListener(
    "click",
    async () => handleFilePick(),
    false
);

document.getElementById("lanInput").addEventListener(
    "change",
    () => window.electronAPI.setLanguage(document.getElementById("lanInput").value),
    false
);

document.getElementById("support-btn").addEventListener(
    "click",
    () => window.open("https://www.buymeacoffee.com/ryanhx"),
    false
);

let timeout = false,
    delay = 100;
window.addEventListener("resize", () => {
    clearTimeout(timeout);
    timeout = setTimeout(handleResize, delay);
});