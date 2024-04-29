'use strict'

// Constants defining different cell types with their properties
const WALL = { symbol: '#', img: 'icons/wall.png', class: 'wall', color: 360 }
const FOOD = { symbol: '.', img: 'icons/food.png', class: 'food', color: 360 }
const CHERRY = { symbol: '%', img: 'icons/cherry.png', class: 'cherry', color: 360 }
const EMPTY = { symbol: ' ', img: 'icons/empty.png', class: 'empty', color: 360 }
const SUPERFOOD = { symbol: '*', img: 'icons/superFood.png', class: 'superFood', color: 360 }

// Game object storing game state
const gGame = {
  score: 0,
  isOn: false,
}

// Variables for game intervals and board
var gBoard
var gTimePlay
var gIntervalSuperFood
var gIntervalFood
var gIntervalCherry
var gIntervalTime
var gIntervalGhostsNew

// Function to initialize the game
function onInit() {
  gBoard = buildBoard()
}

// Function to start the game
function startGame() {
  // Create pacman, ghosts, and render the board
  createPacman(gBoard)
  createGhosts(gBoard, 3)
  renderBoard(gBoard)
  // Create initial foods and superfoods
  crateFoods(10)
  crateSuperFoodInStart()
  // Reset score and update UI
  gGame.score = 0
  updateScore(0)
  // Set game state to on and start intervals for game elements
  gGame.isOn = true
  gIntervalFood = setInterval(crateFood, 2000)
  gIntervalCherry = setInterval(crateCherry, 15000)
  gIntervalTime = setInterval(updateTime, 1000)
  gIntervalSuperFood = setInterval(crateSuperFood, 45000)
  gIntervalGhostsNew = setInterval(createGhost, 60000)
  // Play background audio
  var gBackGroundAudio = new Audio('sound/backGround.wav')
  gBackGroundAudio.play()
}

// Function to restart the game
function restartGame() {
  // Reset game variables and intervals
  gTimePlay = -1
  updateTime()
  gGhosts = []
  gNextId = 0
  clearInterval(gIntervalGhosts)
  clearInterval(gIntervalFood)
  clearInterval(gIntervalCherry)
  clearInterval(gIntervalSuperFood)
  clearInterval(gIntervalTime)
  clearInterval(gIntervalGhostsNew)

  PACMAN = null
  gGame.score = 0
  gGame.isOn = false
  onInit()
  startGame()
}

// Function to build the game board
function buildBoard() {
  const size = 13
  const board = []

  for (var i = 0; i < size; i++) {
    board.push([])
    for (var j = 0; j < size; j++) {
      board[i][j] = EMPTY
      // Add walls to the board borders and a specific position
      if (i === 0 || i === size - 1 || j === 0 || j === size - 1 || (j === 3 && i > 4 && i < size - 2)) {
        board[i][j] = WALL
      }
    }
  }
  return board
}

// Function to render the game board
function renderBoard(board) {
  var strHTML = ''
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>'
    for (var j = 0; j < board[0].length; j++) {
      const className = `cell cell-${i}-${j}`
      // Render each cell with its respective class and image
      strHTML += `<td class="${className}"><img class ="${board[i][j].class}" src="${board[i][j].img}" alt="${board[i][j].class}" width="100%" height="100%" style="filter: hue-rotate(${board[i][j].color}deg);"></td>`
    }
    strHTML += '</tr>'
  }
  const elBoard = document.querySelector('.board')
  elBoard.innerHTML = strHTML
}

// Function to render a specific cell
function renderCell(location, htmlCode) {
  const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
  elCell.innerHTML = htmlCode
}

// Function to update the score
function updateScore(diff) {
  if (!diff) {
    gGame.score = 0
  } else {
    gGame.score += diff
  }
  document.querySelector('span.score').innerText = 'Score: ' + gGame.score + '\n'
}

// Function to handle game over
function gameOver() {
  clearInterval(gIntervalGhosts)
  clearInterval(gIntervalFood)
  clearInterval(gIntervalCherry)
  clearInterval(gIntervalSuperFood)
  clearInterval(gIntervalTime)
  clearInterval(gIntervalGhostsNew)
  gGame.isOn = false
  const elBtnStart = document.querySelector('.startBtn')
  elBtnStart.innerText = 'Play Again!'

  const elBoard = document.querySelector('.board')
  // Check if all food is eaten to determine game outcome
  if (!isFoodIngame()) {
    var gBackGroundAudio = new Audio('sound/win.mp3')
    gBackGroundAudio.play()
    updateScore(parseInt(gGame.score + 100000 / gTimePlay))
    elBoard.innerHTML = `<div>Victory!! the score you got: ${gGame.score}</div>`
  } else {
    elBoard.innerHTML = `<div>Game Over! the score you got: ${gGame.score}</div>`
  }
}

// Function to check if there is still food on the board
function isFoodIngame() {
  for (var i = 1; i < gBoard.length - 1; i++) {
    for (var j = 1; j < gBoard[0].length - 1; j++) {
      if (gBoard[i][j] === FOOD) return true
    }
  }
  return false
}

// Function to find all empty cells on the board
function findEmptyCells() {
  var cells = []
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (gBoard[i][j] === EMPTY) cells.push({ i: i, j: j })
    }
  }
  return cells
}

// Function to get a random empty cell
function getEmptyCell() {
  var cells = findEmptyCells()
  if (cells.length === 0) return
  var randCell = Math.floor(Math.random() * cells.length)
  return cells[randCell]
}

// Function to create superfood on the board
function crateSuperFood() {
  var location = getEmptyCell()
  if (!location) return
  gBoard[location.i][location.j] = SUPERFOOD

  renderCell(location, `<img class ="${SUPERFOOD.class}" src="${SUPERFOOD.img}" alt="${SUPERFOOD.class}" width="100%" height="100%">`)
}

// Function to create cherry on the board
function crateCherry() {
  var location = getEmptyCell()
  if (!location) return
  gBoard[location.i][location.j] = CHERRY

  renderCell(location, `<img class ="${CHERRY.class}" src="${CHERRY.img}" alt="${CHERRY.class}" width="100%" height="100%">`)
}

// Function to create regular food on the board
function crateFood() {
  var location = getEmptyCell()
  if (!location) return
  gBoard[location.i][location.j] = FOOD
  renderCell(location, `<img class ="${FOOD.class}" src="${FOOD.img}" alt="${FOOD.class}" width="40%" height="40%">`)
}

// Function to create multiple regular foods on the board
function crateFoods(count) {
  for (var i = 0; i < count; i++) crateFood()
}

// Function to create initial superfoods on the board
function crateSuperFoodInStart() {
  var location
  for (var i = 0; i < 4; i++) {
    if (i === 0) location = { i: 1, j: 1 }
    if (i === 1) location = { i: gBoard.length - 2, j: 1 }
    if (i === 2) location = { i: 1, j: gBoard.length - 2 }
    if (i === 3) location = { i: gBoard.length - 2, j: gBoard.length - 2 }
    gBoard[location.i][location.j] = SUPERFOOD
    renderCell(location, `<img class ="${SUPERFOOD.class}" src="${SUPERFOOD.img}" alt="${SUPERFOOD.class}" width="100%" height="100%">`)
  }
}

// Function to update the game time
function updateTime() {
  const timeDiv = document.querySelector('.time')
  gTimePlay++
  timeDiv.textContent = 'Time: ' + gTimePlay + '\n'
}
