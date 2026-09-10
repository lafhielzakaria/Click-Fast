let btnsContainer = document.querySelector(".btns");
let totalAttempsResult = document.getElementById("totalAttemps");
let correctClickResult = document.getElementById("correctClick");
let missClickResult = document.getElementById("missClick");
const timer = document.querySelector("#timer");
let startGameBtn = document.getElementById("startGame");
let board = document.getElementById("board");
let boardSize = document.getElementById("boardSize");
let ignoredClickResult = document.getElementById("ignoredClick");
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
//fax 4ay dir pressesion 4ay khasni n7ayd delay dyal tsba4 dyal btn ou fax ykliki n3ayt 3La lfunction pint 
startGameBtn.addEventListener("click", () => {
    startGame();
    setTime(10);
});

boardSize.addEventListener("change", () => {
    makeTheBoard(boardSize.value || 3);
});

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
            e.target.style.backgroundColor = "gray";
            e.target.disabled = true;
        }
    }
});

function showResult() {
    missClickResult.textContent = "Miss clicks: " + wrongClick;
    correctClickResult.textContent = "Correct clicks: " + correctClick;
    totalAttempsResult.textContent = "Total attempts: " + userClicksCount;
    ignoredClickResult.textContent = "Ignored clicks: " + ignoredClickCount;
}

function resetTheGame() {
    missClickResult.textContent = "";
    correctClickResult.textContent = "";
    totalAttempsResult.textContent = "";
    ignoredClickResult.textContent = "";
}

function startGame() {
      for (let btn of btnsContainer.children) {
      btn.style.backgroundColor = "white";
      btn.style.disabled = "false";
    }
    wrongClick = 0;
    correctClick = 0;
    userClicksCount = 0;
    btnActivationCount = 0;
    ignoredClickCount = 0;
    targetClicked = false;
    currentIndex = null;
    previousIndex = null;
    pushTheArrayOfRandomsIndex();
}

function pintTheBtn(time = 10) {
    let previousBtn = null;
    let btns = btnsContainer.children;

    if (pintTime) clearInterval(pintTime);

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
    let btns = btnsContainer.children;
    if (index !== null && btns[index] && btns[index].style.backgroundColor !== "gray" && !BtnsRandomIndexes.includes(index)) {
        BtnsRandomIndexes.push(index);
    }
}

function pushTheArrayOfRandomsIndex() {
    BtnsRandomIndexes = [];
    let btns = btnsContainer.children;
    for (let i = 0; i < btns.length; i++) {
        if (btns[i].style.backgroundColor !== "gray") {
            BtnsRandomIndexes.push(i);
        }
    }
}

function disableBtns() {
    for (let btn of btnsContainer.children) {
        btn.disabled = true;
    }
}

function enableBtns() {
    for (let btn of btnsContainer.children) {
        if (btn.style.backgroundColor !== "gray") {
            btn.disabled = false;
        }
    }
}

function setTime(time = 10) {
    pintTheBtn(time);
    startGameBtn.disabled = true;
    timer.textContent = time;
    enableBtns();

    if (countdownInterval) clearInterval(countdownInterval);

    countdownInterval = setInterval(function () {
        time--;
        timer.textContent = time;

        if (time === 0) {
            clearInterval(countdownInterval);
            clearInterval(pintTime);

            if (currentBtn !== null && !targetClicked) {
                ignoredClickCount++;
                currentBtn.style.backgroundColor = "gray";
                currentBtn.disabled = true;
            }

            if (currentBtn !== null) {
                currentBtn = null;
            }

            startGameBtn.disabled = false;
            disableBtns();
            showResult();
        }
    }, 1000);
}

function makeTheBoard(size) {
    btnsContainer.textContent = "";
    for (let i = 0; i < size * size; i++) {
        let btn = document.createElement("button");
        btn.style.padding = "30px";
        btn.style.backgroundColor = "white";
        btnsContainer.appendChild(btn);
        btn.disabled = true;
    }
    pushTheArrayOfRandomsIndex();
}

makeTheBoard(3);
disableBtns();