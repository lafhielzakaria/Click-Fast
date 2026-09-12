let gameTime = document.getElementById("gameTime");
let btnsContainer = document.querySelector(".btns");
let totalAttempsResult = document.getElementById("totalAttemps");
let correctClickResult = document.getElementById("correctClick");
let missClickResult = document.getElementById("missClick");
const timer = document.querySelector("#timer");
let startGameBtn = document.getElementById("startGame");
let board = document.getElementById("board");
let boardSize = document.getElementById("boardSize");
let ignoredClickResult = document.getElementById("ignoredClick");
let usernameInput = document.getElementById("username");
let btnActivationCount = 0;
let userClicksCount = 0;
let currentBtn = null;
let currentIndex = null;
let previousIndex = null;
let correctClick = 0;
let wrongClick = 0;
let ignoredClickCount = 0;
let targetClicked = false;
let pintTime = null;
let countdownInterval = null;
let BtnsRandomIndexes = [];
let modeSelected = "stantard";
let gameTimer = 10;
let modeSection = document.getElementById("mode");
let timeSelected;
let speed = 0;
let configForm = document.getElementById("config");
let clickPerSecond = document.getElementById("clickPerSecond");

if (startGameBtn) {
    startGameBtn.addEventListener("click", () => {
        startGame();
        setTime(timeSelected || 10);
    });
}

if (gameTime) {
    gameTime.addEventListener("change", () => {
        timeSelected = gameTime.value;
        if (timer) {
            timer.textContent = timeSelected;
        }
    });
}

if (modeSection) {
    modeSection.addEventListener('change', () => {
        modeSelected = modeSection.value;
    });
}

if (boardSize) {
    boardSize.addEventListener("change", () => {
        makeTheBoard(boardSize.value || 3);
    });
}

if (btnsContainer) {
    btnsContainer.addEventListener("click", function (e) {
        if (e.target.tagName === "BUTTON" && !e.target.disabled) {
            if (currentBtn === e.target) {
                userClicksCount++;
                correctClick++;
                targetClicked = true;
                e.target.style.backgroundColor = "gray";
                e.target.disabled = true;
                currentBtn = null;
            } else if (currentBtn !== null) {
                userClicksCount++;
                targetClicked = true;
                wrongClick++;
                currentBtn.style.backgroundColor = "gray";
                currentBtn.disabled = true;
                e.target.style.backgroundColor = "gray";
                e.target.disabled = true;
                currentBtn = null;
            }

            if (modeSelected === "precision") {
                if (BtnsRandomIndexes.length > 0) {
                    pintTheBtn();
                }
            }
        }
    });
}

function getData() {
    let records = JSON.parse(localStorage.getItem("gameRecords")) || [];
    return records;
}

function displayGameHistory() {
    const container = document.getElementById("gamesHistoryList");
    if (!container) return;
    const records = getData();
    container.innerHTML = "";

    if (records.length === 0) {
        container.innerHTML = `<div class="no-records">No games played yet! Play a game to see your history.</div>`;
        return;
    }

    records.forEach((game, index) => {
        const card = document.createElement("div");
        card.className = "game-card";

        card.innerHTML = `
            <div class="game-card-header">
                <span>Game ${index + 1} ${game.username || ""}</span>
                <span style="font-weight: normal; font-size: 13px; color: #888;">${game.date}</span>
            </div>
            <div class="game-card-details">
                <div>Mode: <strong>${game.mode}</strong></div>
                <div>Board Size: <strong>${game.boardSize}x${game.boardSize}</strong></div>
                <div>Correct Clicks: <strong style="color: green;">${game.correctClicks}</strong></div>
                <div>Miss Clicks: <strong style="color: red;">${game.missClicks}</strong></div>
                <div>Total Attempts: <strong>${game.totalAttempts}</strong></div>
                <div>Ignored Clicks: <strong>${game.ignoredClicks}</strong></div>
            </div>
        `;

        container.appendChild(card);
    });
}

if (document.getElementById("gamesHistoryList")) {
    displayGameHistory();
}

function showResult() {
    if (missClickResult) missClickResult.textContent = "Miss clicks : " + wrongClick;
    if (correctClickResult) correctClickResult.textContent = "Correct clicks : " + correctClick;
    if (totalAttempsResult) totalAttempsResult.textContent = "Total attempts : " + userClicksCount;
    if (ignoredClickResult) ignoredClickResult.textContent = "Ignored clicks :  " + ignoredClickCount;

    if (clickPerSecond) {
        if (modeSelected == "precision") {
            speed = (timeSelected || 10) / userClicksCount;
            if (isNaN(speed)) speed = 0;
            let speedFormatted = speed.toFixed(2).replace(".", ",");
            clickPerSecond.textContent = "click per second : " + speedFormatted;
        } else {
            speed = 0;
            clickPerSecond.textContent = "";
        }
    }

    saveGameResult();
}

function saveGameResult() {
    let gameData = {
        username: usernameInput ? usernameInput.value : "",
        time: timeSelected || 10,
        boardSize: boardSize ? (boardSize.value || 3) : 3,
        mode: modeSelected,
        correctClicks: correctClick,
        missClicks: wrongClick,
        totalAttempts: userClicksCount,
        ignoredClicks: ignoredClickCount,
        clickPerSecond: typeof speed === "number" ? speed.toFixed(2) : "0.00",
        date: new Date().toLocaleDateString()
    };
    let existingRecords = JSON.parse(localStorage.getItem("gameRecords")) || [];
    existingRecords.push(gameData);
    localStorage.setItem("gameRecords", JSON.stringify(existingRecords));
}

function resetTheGame() {
    if (missClickResult) missClickResult.textContent = "";
    if (correctClickResult) correctClickResult.textContent = "";
    if (totalAttempsResult) totalAttempsResult.textContent = "";
    if (ignoredClickResult) ignoredClickResult.textContent = "";
    if (clickPerSecond) clickPerSecond.textContent = "";
    if (configForm) configForm.style.display = "block";
    disableBtns();
}

function startGame() {
    if (btnsContainer) {
        for (let btn of btnsContainer.children) {
            btn.style.backgroundColor = "white";
            btn.disabled = false;
        }
    }
    if (configForm) configForm.style.display = "none";
    wrongClick = 0;
    correctClick = 0;
    userClicksCount = 0;
    btnActivationCount = 0;
    ignoredClickCount = 0;
    targetClicked = false;
    currentIndex = null;
    previousIndex = null;
    currentBtn = null;
    pushTheArrayOfRandomsIndex();
}

function pintTheBtn(gameTimer) {
    if (!btnsContainer) return;
    let btns = btnsContainer.children;
    if (modeSelected === "precision") {
        if (BtnsRandomIndexes.length === 0) return;
        let random = getRandomIndex();
        currentBtn = btns[random];
        if (currentBtn) {
            currentBtn.style.backgroundColor = "red";
            currentBtn.disabled = false;
            btnActivationCount++;
        }
        return;
    }
    let previousBtn = null;
    targetClicked = false;

    pintTime = setInterval(function () {
        if (previousBtn !== null && !targetClicked) {
            ignoredClickCount++;
            previousBtn.style.backgroundColor = "gray";
            previousBtn.disabled = true;
        }

        targetClicked = false;

        if (previousBtn !== null) {
            if (previousBtn.style.backgroundColor !== "gray") {
                previousBtn.style.backgroundColor = "white";
                previousBtn.disabled = false;
                removeThePreviousIndex(previousIndex);
            }
        }

        if (BtnsRandomIndexes.length === 0) {
            clearInterval(pintTime);
            return;
        }

        let random = getRandomIndex();
        previousIndex = currentIndex;
        currentIndex = random;
        currentBtn = btns[random];

        if (currentBtn) {
            currentBtn.style.backgroundColor = "red";
            previousBtn = currentBtn;
            btnActivationCount++;
        }
    }, 800);
}

function getRandomIndex() {
    if (BtnsRandomIndexes.length === 0) {
        pushTheArrayOfRandomsIndex();
    }
    let randomIndex = Math.floor(Math.random() * BtnsRandomIndexes.length);
    return BtnsRandomIndexes.splice(randomIndex, 1)[0];
}

function removeThePreviousIndex(index) {
    if (!btnsContainer) return;
    let btns = btnsContainer.children;
    if (index !== null && btns[index] && btns[index].style.backgroundColor !== "gray" && !BtnsRandomIndexes.includes(index)) {
        BtnsRandomIndexes.push(index);
    }
}

function pushTheArrayOfRandomsIndex() {
    BtnsRandomIndexes = [];
    if (!btnsContainer) return;
    let btns = btnsContainer.children;
    for (let i = 0; i < btns.length; i++) {
        if (btns[i].style.backgroundColor !== "gray") {
            BtnsRandomIndexes.push(i);
        }
    }
}

function disableBtns() {
    if (!btnsContainer) return;
    for (let btn of btnsContainer.children) {
        btn.disabled = true;
        btn.style.backgroundColor = "white";
    }
}

function enableBtns() {
    if (!btnsContainer) return;
    for (let btn of btnsContainer.children) {
        if (btn.style.backgroundColor !== "gray") {
            btn.disabled = false;
        }
    }
}

function setTime(gameTimerVal = timeSelected || 10) {
    let activeTimer = gameTimerVal;
    pintTheBtn(activeTimer);
    if (startGameBtn) startGameBtn.disabled = true;
    if (timer) timer.textContent = activeTimer;
    enableBtns();

    if (countdownInterval) clearInterval(countdownInterval);

    countdownInterval = setInterval(function () {
        activeTimer--;
        if (timer) timer.textContent = activeTimer;

        if (activeTimer === 0) {
            clearInterval(countdownInterval);
            clearInterval(pintTime);
            resetTheGame();
            if (currentBtn !== null && !targetClicked) {
                ignoredClickCount++;
                currentBtn.style.backgroundColor = "gray";
                currentBtn.disabled = true;
            }

            if (currentBtn !== null) {
                currentBtn = null;
            }

            if (startGameBtn) startGameBtn.disabled = false;
            disableBtns();
            showResult();
        }
    }, 1000);
}

function makeTheBoard(size) {
    if (!btnsContainer) return;
    btnsContainer.textContent = "";
    btnsContainer.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    for (let i = 0; i < size * size; i++) {
        let btn = document.createElement("button");
        btn.style.padding = "30px";
        btn.style.backgroundColor = "white";
        btnsContainer.appendChild(btn);
        btn.disabled = true;
    }
    pushTheArrayOfRandomsIndex();
}

if (btnsContainer) {
    makeTheBoard(3);
    disableBtns();
}