let btnsContainer = document.querySelector(".btns");
const timer = document.querySelector("#timer");
let startGameBtn = document.getElementById("startGame");
let btns = btnsContainer.children;
let randomIndex = Math.floor(Math.random() * btns.length);
let board = document.getElementById("board")
let btnActivationCount = 0;
let userClicksCount = 0;
let currentBtn = null;
let correctClick = 0;
let wrongClick = 0;
function getRandomNumber() {
    return Math.floor(Math.random() * btnsCount) + 1;;
}
function pintTheBtn(time = 10) {
    let currentTime = time;
    let previousBtn = null;
    let interval = setInterval(function () {
        if ((time - currentTime) % 3 === 0) {
            if (previousBtn !== null) {
                previousBtn.style.backgroundColor = "white";
                console.log("change to white");
            }
            let random = getRandomNumber();
            currentBtn = btns[random];
            currentBtn.style.backgroundColor = "black"; //probleme 
            previousBtn = currentBtn;
            btnActivationCount++;
            console.log(btnActivationCount);
        }

        currentTime--;

        if (currentTime === 0) {
            clearInterval(interval);

            if (previousBtn !== null) {
                previousBtn.style.backgroundColor = "white";
            }
        }

    }, 1000);
}

function disableBtns() {
    for (let btn of btns) {
        btn.disabled = true;
    }
}
function enableBtns() {
    for (let btn of btns) {
        btn.disabled = false;
    }
}
function setTime(time = 10) {
    pintTheBtn();
    startGameBtn.disabled = true;
    timer.textContent = time;
    enableBtns();
    const countdown = setInterval(function () {
        time--;
        timer.textContent = time;

        if (time === 0) {
            startGameBtn.disabled = false;
            clearInterval(countdown);
            console.log("right: " + correctClick);
            console.log("wrong: " + wrongClick);
            disableBtns();
        }
    }, 1000);
}
startGameBtn.addEventListener("click", () => {
    setTime();
});
for (let i = 0; i < 16; i++) {
    let btn = document.createElement("button");
    btn.style.padding = "30px";
    btn.style.backgroundColor = "white";
    btnsContainer.appendChild(btn);
    btn.disabled = true;
}
let btnsCount = board.childElementCount;
console.log(btnsCount);
for (let btn of btns) {
    btn.addEventListener("click", function () {
        userClicksCount++;
        if (currentBtn == btn) {
            console.log("correct");
            correctClick++;
        }
        else {
            wrongClick++;
            console.log("false");
        }
        console.log(userClicksCount);
        btn.disabled = true;
    });
}