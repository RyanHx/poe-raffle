let running = false,
    entries = [];

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
    // https://www.npmjs.com/package/tsparticles-confetti
    (async () => {
        const defaults = {
            startVelocity: 50,
            count: 150,
            spread: 60,
            scalar: 0.7
        }
        await confetti({
            ...defaults,
            angle: 45,
            position: { x: 0, y: 80 },
        });
        await confetti({
            ...defaults,
            angle: 135,
            position: { x: 100, y: 80 },
        });
    })();
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

function showToast(isError, message) {
    const div = document.createElement("div");
    div.classList.add("toast", "align-items-center", `${isError ? "text-bg-danger" : "text-bg-primary"}`, "border-0");
    div.role = "alert";
    div.ariaLive = "assertive";
    div.ariaAtomic = "true";
    div.innerHTML =
        `    
    <div class="d-flex">
    <div class="toast-body">
        ${message}
    </div>
    <button type="button" class="btn btn-dark me-2 m-auto" data-bs-dismiss="toast" aria-label="Dismiss">X</button>
    </div>
    `;
    const container = document.getElementById("toastPlacement");
    container.appendChild(div);
    (new bootstrap.Toast(div)).show();
}

// Receive entry from main process
window.electronAPI.addEntry((_event, value) => {
    if (!entries.includes(value)) {
        entries.push(value);
        const table = document.getElementById("entries-table");
        const row = table.insertRow(-1);
        const cell = row.insertCell();
        // Bootstrap row
        const bootRow = document.createElement("div");
        bootRow.classList.add('row', 'justify-content-end', 'align-items-center', 'mx-3');
        // Column 1
        const bootCol1 = document.createElement("div");
        bootCol1.classList.add('col-4');
        bootCol1.textContent = value;
        // Column 2
        const bootCol2 = document.createElement("div");
        bootCol2.classList.add('col-4', 'text-end');
        const btn = document.createElement("button");
        btn.classList.add('btn', 'btn-outline-danger');
        btn.type = "button";
        btn.textContent = "X";
        btn.ariaLabel = "Delete";
        btn.addEventListener(
            "click",
            (_event) => {
                const name = _event.target.closest('.col-4').previousElementSibling.textContent;
                entries.splice(entries.indexOf(name), 1);
                _event.target.closest('tr').remove();
                console.log('Entry removed');
                console.log(entries);
            },
            false
        );
        bootCol2.appendChild(btn);
        // Add columns
        bootRow.appendChild(bootCol1);
        bootRow.appendChild(bootCol2);
        cell.appendChild(bootRow);
    }
});

window.electronAPI.toastError((_event, value) => {
    showToast(true, value);
});

window.electronAPI.toastPrimary((_event, value) => {
    showToast(false, value);
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