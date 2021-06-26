document.addEventListener("DOMContentLoaded", function () {
  const score = document.querySelector(".score");
  const intro = document.querySelector(".intro");
  const consoleEm = document.querySelector(".console-emulator");
  const aButton = document.querySelector("#a");
  const bButton = document.querySelector("#b");
  const upButton = document.querySelector("#up");
  const downButton = document.querySelector("#down");
  const rightButton = document.querySelector("#right");
  const leftButton = document.querySelector("#left");
  const play = document.querySelector(".play");
  const gamearea = document.querySelector(".GameArea");
  let player = { speed: 3, score: 0 };
  let highest = window.localStorage.getItem("roadRallyHiScore") || 0;
  let keys = {
    ArrowRight: false,
    ArrowLeft: false,
  };
  let speedInterval = setInterval(speedIncrement, 20000);

  aButton.addEventListener("click", start);
  bButton.addEventListener("click", resetScore);
  play.addEventListener("click", function () {
    intro.classList.add("hide");
    consoleEm.classList.remove("hide");
  });

  document.addEventListener("keydown", keyDown);
  document.addEventListener("keyup", keyUp);

  ["mousedown", "touchstart"].forEach((evnt) =>
    rightButton.addEventListener(evnt, function () {
      keys["ArrowRight"] = true;
    })
  );

  ["mouseup", "touchend"].forEach((evnt) =>
    rightButton.addEventListener(evnt, function () {
      keys["ArrowRight"] = false;
    })
  );

  ["mousedown", "touchstart"].forEach((evnt) =>
    leftButton.addEventListener(evnt, function () {
      keys["ArrowLeft"] = true;
    })
  );

  ["mouseup", "touchend"].forEach((evnt) =>
    leftButton.addEventListener(evnt, function () {
      keys["ArrowLeft"] = false;
    })
  );

  function speedIncrement() {
    player.speed = player.speed + 0.5;
    if (player.speed === 6) {
      clearInterval(speedInterval);
    }
  }

  function keyDown(ev) {
    ev.preventDefault();
    pressButton(ev.key);
    keys[ev.key] = true;
  }

  function keyUp(ev) {
    ev.preventDefault();
    keys[ev.key] = false;
  }

  function pressButton(key) {
    if (key === "a" || key === "A") {
      triggerClick(aButton);
    }
    if (key === "b" || key === "B") {
      triggerClick(bButton);
    }
    if (key === "ArrowUp") {
      triggerClick(upButton);
    }
    if (key === "ArrowDown") {
      triggerClick(downButton);
    }
    if (key === "ArrowRight") {
      triggerClick(rightButton);
    }
    if (key === "ArrowLeft") {
      triggerClick(leftButton);
    }
  }

  function triggerClick(button) {
    button.classList.add("active");
    button.click();
    setTimeout(() => {
      button.classList.remove("active");
    }, 100);
  }

  function isCollide(a, b) {
    aRect = a.getBoundingClientRect();
    bRect = b.getBoundingClientRect();

    return !(
      aRect.bottom < bRect.top ||
      aRect.top > bRect.bottom ||
      aRect.right < bRect.left ||
      aRect.left > bRect.right
    );
  }

  function moveLines() {
    let lines = document.querySelectorAll(".lines");
    lines.forEach((item) => {
      if (item.y >= 700) {
        item.y -= 750;
      }
      item.y += player.speed;
      item.style.top = item.y + "px";
    });
  }

  function endGame() {
    setTimeout(() => {
      window.localStorage.setItem("roadRallyHiScore", highest);
      gamearea.classList.add("blank");
      gamearea.innerHTML =
        "Game Over <br><br> Press A to restart <br><br> Press B to reset";
    }, 500);
    player.speed = 3;
    player.start = false;
  }

  function moveCar(car) {
    let other = document.querySelectorAll(".other");
    other.forEach((item) => {
      if (isCollide(car, item)) {
        endGame();
      }
      if (item.y >= 750) {
        item.y = -300;
        item.style.left =
          Math.abs(Math.floor(Math.random() * gamearea.clientWidth - 25)) +
          "px";
      }
      item.y += player.speed;
      item.style.top = item.y + "px";
    });
  }

  function gamePlay() {
    let car = document.querySelector(".car");
    let road = gamearea.getBoundingClientRect();

    if (player.start) {
      moveLines();
      moveCar(car);
      if (keys.ArrowLeft && player.x > 0) {
        player.x -= player.speed;
      }
      if (keys.ArrowRight && player.x < road.width - 25) {
        player.x += player.speed;
      }

      car.style.top = player.y + "px";
      car.style.left = player.x + "px";

      window.requestAnimationFrame(gamePlay);
      player.score++;
      if (player.score >= highest) {
        highest = player.score;
      }
      score.innerHTML =
        "Score:" + player.score + "<br><br>" + "Hi-Score:" + highest;
    }
  }

  function start() {
    if (!gamearea.classList.contains("blank")) {
      return;
    }
    gamearea.classList.remove("blank");
    gamearea.innerHTML = "";

    player.start = true;
    player.score = 0;
    window.requestAnimationFrame(gamePlay);

    for (x = 0; x < 5; x++) {
      let roadline = document.createElement("div");
      roadline.setAttribute("class", "lines");
      roadline.y = x * 150;
      roadline.style.top = roadline.y + "px";
      gamearea.appendChild(roadline);
    }

    let car = document.createElement("div");
    car.setAttribute("class", "car");
    gamearea.appendChild(car);

    player.x = car.offsetLeft;
    player.y = car.offsetTop;

    for (x = 0; x < 4; x++) {
      let othercar = document.createElement("div");
      othercar.setAttribute("class", "other");
      othercar.y = (x + 1) * 250 * -1;
      othercar.style.top = othercar.y + "px";
      othercar.style.left =
        Math.abs(Math.floor(Math.random() * gamearea.clientWidth - 25)) + "px";
      gamearea.appendChild(othercar);
    }
  }

  function resetScore() {
    if (!gamearea.classList.contains("blank")) {
      return;
    }
    window.localStorage.removeItem("roadRallyHiScore");
    highest = 0;
    score.innerHTML = "Score:0 <br><br> Hi-Score:0";
  }
});
