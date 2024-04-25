'use strict'

const WALL = { symbol: '#', img: 'icons/wall.png' }
const FOOD = { symbol: '.', img: 'icons/food.png' }
const EMPTY = { symbol: ' ', img: 'icons/empty.png' }
const SUPERFOOD = { symbol: '*', img: 'icons/superFood.png' }

const gGame = {
  score: 0,
  isOn: false,
}

var gBoard
var gIntervalSuperFood

function onInit() {
  gBoard = buildBoard()
  createGhosts(gBoard)
  createPacman(gBoard)
  renderBoard(gBoard)
  gGame.isOn = true
  gIntervalSuperFood = setInterval(crateSuperFood, 5000)
  gIntervalFood = setInterval(crateFood, 2000)
}

function buildBoard() {
  const size = 10
  const board = []

  for (var i = 0; i < size; i++) {
    board.push([])
    for (var j = 0; j < size; j++) {
      board[i][j] = FOOD

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
      strHTML += `<td class="${className}"><img src="${board[i][j].img}" alt="img" width="30em" height="30em"></td>`
    }
    strHTML += '</tr>'
  }
  const elBoard = document.querySelector('.board')
  elBoard.innerHTML = strHTML
}

function renderCell(location, img) {
  const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
  elCell.innerHTML = `<img src="${img}" alt="ghost" width="30em" height="30em">`
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
  console.log('Game Over')
  clearInterval(gIntervalGhosts)
  renderCell(PACMAN.location, '🪦')
  gGame.isOn = false
  const elBoard = document.querySelector('.board')
  var strHTML = ''
  if (!isFoodIngame()) strHTML = '<div>Victory!!</div> <button onclick="onInit()">play again!</button>'
  else strHTML = '<div>game over!</div> <button onclick="onInit()">play again!</button>'
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

function findEmptyCells(board) {
  var cells = []
  for (var i = 1; i < gBoard.length - 1; i++) {
    for (var j = 1; j < gBoard[0].length - 1; j++) {
      if (gBoard[i][j] === EMPTY) cells.push({ i: i, j: j })
    }
  }
  return cells
}

function getEmptyCell() {
  var cells = findEmptyCells()
  if (cells.length < 1) return
  var randCell = Math.floor(Math.random() * cells.length) + 1
  console.log(cells[randCell])
  return cells[randCell]
}

function crateSuperFood() {
  var location = getEmptyCell()
  if (!location) return
  console.log(location)
  gBoard[location.i][location.j] = SUPERFOOD
  renderCell(location, SUPERFOOD.img)
}

function crateFood() {
  var location = getEmptyCell()
  if (!location) return
  console.log(location)
  gBoard[location.i][location.j] = FOOD
  renderCell(location, FOOD.img)
}

function crateFoods(count) {
  for (var i = 0; i < count; i++) crateFood()
}
