const N = 4, M = 4;
let turn = "R", selectedLines = [], score = { R: 0, B: 0 }, lineCounter = 0;
const hoverClasses = { R: "hover-red", B: "hover-blue" };
const bgClasses = { R: "bg-red", B: "bg-blue" };

const playersTurnText = (turn) => {
  return `It's ${turn === "R" ? "Red" : "Blue"}'s turn`;
};

const scoreText = () => {
  return `Red: ${score.R} | Blue: ${score.B}`;
};

const winnerText = () => {
  const winner = score.R > score.B ? "Red" : "Blue";
  const winnerDiv = document.createElement("div");

  winnerDiv.innerHTML = `
    <div class="dot"></div>
    <div class="box"></div>
    <span>${winner} Won !!</span>
  `;

  winnerDiv.classList.add("winner-message");
  return winnerDiv.outerHTML;
};

const isLineSelected = (line) => line.classList.contains(bgClasses.R) || line.classList.contains(bgClasses.B);

const createGameGrid = () => {
  const gameGridContainer = document.querySelector(".game-grid-container");
  const rows = Array.from({ length: N }, (_, i) => i);
  const cols = Array.from({ length: M }, (_, i) => i);

  rows.forEach(row => {
    cols.forEach(col => {
      createDot(gameGridContainer);
      if (col < M - 1) createHorizontalLine(gameGridContainer, row, col);
    });

    if (row < N - 1) {
      cols.forEach(col => {
        createVerticalLine(gameGridContainer, row, col);
        if (col < M - 1) createBox(gameGridContainer, row, col);
      });
    }
  });

  document.getElementById("game-status").innerHTML = `${playersTurnText(turn)} <br> ${scoreText()}`;
};

const createDot = (container) => {
  const dot = document.createElement("div");
  dot.setAttribute("class", "dot");
  container.appendChild(dot);
};

const createHorizontalLine = (container, row, col) => {
  const hLine = document.createElement("div");
  hLine.setAttribute("class", `line-horizontal ${hoverClasses[turn]}`);
  hLine.setAttribute("id", `h-${row}-${col}`);
  hLine.addEventListener("click", handleLineClick);
  container.appendChild(hLine);
};

const createVerticalLine = (container, row, col) => {
  const vLine = document.createElement("div");
  vLine.setAttribute("class", `line-vertical ${hoverClasses[turn]}`);
  vLine.setAttribute("id", `v-${row}-${col}`);
  vLine.addEventListener("click", handleLineClick);
  container.appendChild(vLine);
};

const createBox = (container, row, col) => {
  const box = document.createElement("div");
  box.setAttribute("class", "box");
  box.setAttribute("id", `box-${row}-${col}`);
  container.appendChild(box);
};

const changeTurn = () => {
  const nextTurn = turn === "R" ? "B" : "R";
  document.querySelectorAll(".line-vertical, .line-horizontal").forEach(l => {
    if (!isLineSelected(l)) {
      l.classList.replace(hoverClasses[turn], hoverClasses[nextTurn]);
    }
  });
  turn = nextTurn;
};

const isLineSelectedByRowCol = (state, i, j) => {
  return (state === "h" && i >= 0 && i <= 3 && j >= 0 && j <= 2) ||
         (state === "v" && i >= 0 && i <= 2 && j >= 0 && j <= 3) 
         ? isLineSelected(document.getElementById(`${state}-${i}-${j}`)) : false;
};

const handleLineClick = (e) => {
  const lineId = e.target.id;
  const selectedLine = document.getElementById(lineId);
  if (isLineSelected(selectedLine)) return;
  
  lineCounter++;
  selectedLines.push(lineId);
  colorLine(selectedLine);

  let [state, i, j] = lineId.split("-");
  i = Number(i);
  j = Number(j);

  let flag = 1;
  if (state === "v") {
    if (isLineSelectedByRowCol("h", i, j - 1) && isLineSelectedByRowCol("v", i, j - 1) && isLineSelectedByRowCol("h", i + 1, j - 1)) {
      document.getElementById(`box-${i}-${j - 1}`).classList.add(bgClasses[turn]);
      score[turn]++;
      flag = 0;
    }
    if (isLineSelectedByRowCol("h", i, j) && isLineSelectedByRowCol("v", i, j + 1) && isLineSelectedByRowCol("h", i + 1, j)) {
      document.getElementById(`box-${i}-${j}`).classList.add(bgClasses[turn]);
      score[turn]++;
      flag = 0;
    }
  } else if (state === "h") {
    if (isLineSelectedByRowCol("h", i - 1, j) && isLineSelectedByRowCol("v", i - 1, j) && isLineSelectedByRowCol("v", i - 1, j + 1)) {
      document.getElementById(`box-${i - 1}-${j}`).classList.add(bgClasses[turn]);
      score[turn]++;
      flag = 0;
    }
    if (isLineSelectedByRowCol("h", i + 1, j) && isLineSelectedByRowCol("v", i, j) && isLineSelectedByRowCol("v", i, j + 1)) {
      document.getElementById(`box-${i}-${j}`).classList.add(bgClasses[turn]);
      score[turn]++;
      flag = 0;
    }
  }
  
  if (flag === 1) changeTurn();

  document.getElementById("game-status").innerHTML = lineCounter === 24 ? winnerText() : `${playersTurnText(turn)} <br> ${scoreText()}`;
};

const colorLine = (line) => {
  line.classList.remove(hoverClasses[turn]);
  line.classList.add(bgClasses[turn]);
};

createGameGrid();
