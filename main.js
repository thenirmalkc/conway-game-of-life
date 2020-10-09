const { floor, random } = Math;
const cellSize = 10;
const rowSize = 60;
const colSize = 100;
const width = cellSize * colSize;
const height = cellSize * rowSize;

let grid = undefined;

function array(rowSize, colSize) {
  const arr = [];
  for (let row = 0; row < rowSize; row++) {
    arr.push([]);
    for (let col = 0; col < colSize; col++) {
      arr[row].push({ row, col, dead: true });
    }
  }
  return arr;
}

function randomAlive() {
  const temp = [];
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      temp.push({ row, col });
    }
  }
  for (let i = 0; i < (rowSize * colSize) / 2; i++) {
    const { row, col } = temp.splice(floor(random() * temp.length), 1).pop();
    grid[row][col].dead = false;
  }
}

function getNeighbours({ row, col }) {
  const neighbours = [];
  for (let i = -1; i <= 1; i++) {
    if ((row == 0 && i == -1) || (row == rowSize - 1 && i == 1)) continue;
    for (let j = -1; j <= 1; j++) {
      if ((i == 0 && j == 0) || (col == 0 && j == -1) || (col == colSize - 1 && j == 1)) continue;
      neighbours.push(grid[row + i][col + j]);
    }
  }
  return neighbours;
}

function getAliveNeighboursCount({ row, col }) {
  const neighbours = getNeighbours({ row, col });
  let count = 0;
  for (const neighbour of neighbours) {
    if (!neighbour.dead) count++;
  }
  return count;
}

function displayGrid(grid) {
  strokeWeight(0.2);
  stroke('black');
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col].dead) fill('white');
      else fill('black');
      square(col * cellSize + 0.2, row * cellSize + 0.2, cellSize - 0.4);
    }
  }
}

function getNextGrid(grid) {
  const nextGrid = [];
  for (let row = 0; row < grid.length; row++) {
    nextGrid.push([]);
    for (let col = 0; col < grid[row].length; col++) {
      nextGrid[row].push({ ...grid[row][col] });
      const count = getAliveNeighboursCount(grid[row][col]);
      if (count < 2 || count > 3) nextGrid[row][col].dead = true;
      else if (count == 3) nextGrid[row][col].dead = false;
    }
  }
  return nextGrid;
}

function setup() {
  const canvas = createCanvas(width, height);
  canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2);
  background('white');
  grid = array(rowSize, colSize);
  randomAlive();
  displayGrid(grid);
}

function draw() {
  background('white');
  grid = getNextGrid(grid);
  displayGrid(grid);
}
