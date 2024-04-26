'use strict'

const WALL = { symbol: '#', img: 'icons/wall.png', class: 'wall' }
const FOOD = { symbol: '.', img: 'icons/food.png', class: 'food' }
const EMPTY = { symbol: ' ', img: 'icons/empty.png', class: 'empty' }
const SUPERFOOD = { symbol: '*', img: 'icons/superFood.png', class: 'superFood' }

const gGame = {
  score: 0,
  isOn: false,
}

var gBoard
var gIntervalSuperFood
var gIntervalFood

function onInit() {
  gBoard = buildBoard()
  createPacman(gBoard)
  // createGhosts(gBoard)
}

function startGame() {
  renderBoard(gBoard)
  crateFoods(10)
  gGame.score = 0
  gGame.isOn = true
  gIntervalSuperFood = setInterval(crateSuperFood, 15000)
  gIntervalFood = setInterval(crateFood, 2000)
}
function restartGame() {}

function buildBoard() {
  const size = 10
  const board = []

  for (var i = 0; i < size; i++) {
    board.push([])
    for (var j = 0; j < size; j++) {
      board[i][j] = EMPTY
      if (i === 0 || i === size - 1 || j === 0 || j === size - 1 || (j === 3 && i > 4 && i < size - 2)) {
        board[i][j] = WALL
      }
    }
  }
  return board
}

function renderBoard(board) {
  var strHTML = ''
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>'
    for (var j = 0; j < board[0].length; j++) {
      const className = `cell cell-${i}-${j}`
      strHTML += `<td class="${className}"><img class ="${board[i][j].class}" src="${board[i][j].img}" alt="img" width="100%" height="100%"></td>`
    }
    strHTML += '</tr>'
  }
  const elBoard = document.querySelector('.board')
  elBoard.innerHTML = strHTML
}

function renderCell(location, htmlCode) {
  const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
  elCell.innerHTML = htmlCode
}

function updateScore(diff) {
  if (!diff) {
    gGame.score = 0
  } else {
    gGame.score += diff
  }
  document.querySelector('span.score').innerText = gGame.score
}

function gameOver() {
  clearInterval(gIntervalGhosts)
  clearInterval(gIntervalFood)
  clearInterval(gIntervalSuperFood)
  gGame.isOn = false
  const elBoard = document.querySelector('.board')
  var strHTML = ''
  if (!isFoodIngame()) strHTML = '<div>Victory!!</div> <button onclick="restartGame()">play again!</button>'
  else strHTML = '<div>game over!</div> <button onclick="restartGame()">play again!</button>'
  elBoard.innerHTML = strHTML
}

function isFoodIngame() {
  for (var i = 1; i < gBoard.length - 1; i++) {
    for (var j = 1; j < gBoard[0].length - 1; j++) {
      if (gBoard[i][j] === FOOD) return true
    }
  }
  return false
}

function findEmptyCells() {
  var cells = []
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (gBoard[i][j] === EMPTY) cells.push({ i: i, j: j })
    }
  }
  return cells
}

function getEmptyCell() {
  var cells = findEmptyCells()
  if (cells.length === 0) return
  var randCell = Math.floor(Math.random() * cells.length)
  return cells[randCell]
}

function crateSuperFood() {
  var location = getEmptyCell()
  if (!location) return
  gBoard[location.i][location.j] = SUPERFOOD

  renderCell(location, `<img class ="${SUPERFOOD.class}" src="${SUPERFOOD.img}" alt="${SUPERFOOD.class}" width="100%" height="100%">`)

  //setTimeout(() => {
  //  if (gBoard[location.i][location.j] === SUPERFOOD) gBoard[location.i][location.j] = EMPTY
  //  renderCell(location, `<img class ="${EMPTY.class}" src="${EMPTY.img}" alt="${EMPTY.class}" width="100%" height="100%">`)
  //}, 3000)
}

function crateFood() {
  var location = getEmptyCell()
  if (!location) return
  gBoard[location.i][location.j] = FOOD
  renderCell(location, `<img class ="${FOOD.class}" src="${FOOD.img}" alt="${FOOD.class}" width="40%" height="40%">`)
}

function crateFoods(count) {
  for (var i = 0; i < count; i++) crateFood()
}
