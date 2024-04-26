'use strict'

const GHOST = {
  img: 'icons/ghost.png',
}

var gGhosts = []

var gIntervalGhosts
var stackImg = ['icons/redGhost.png', 'icons/yelloGhost.png', 'icons/blueGhost.png']

function createGhosts(board) {
  gGhosts = []
  for (var i = 0; i < 3; i++) {
    createGhost(board)
    gGhosts[i].id = i
  }

  if (gIntervalGhosts) clearInterval(gIntervalGhosts)
  gIntervalGhosts = setInterval(moveGhosts, 1000)
}

function createGhost(board) {
  var loc = getEmptyCell()
  console.log(loc)
  const ghost = { id: 0, location: { i: 2, j: 8 }, currCellContent: FOOD, img: stackImg.pop(), imgSuper: 'icons/whiteGhost.png', class: 'ghost' }
  gGhosts.push(ghost)
  board[ghost.location.i][ghost.location.j] = ghost
}

function moveGhosts() {
  for (var i = 0; i < gGhosts.length; i++) {
    const ghost = gGhosts[i]
    moveGhost(ghost)
  }
}

function moveGhost(ghost) {
  const moveDiff = getMoveDiff()
  const nextLocation = {
    i: ghost.location.i + moveDiff.i,
    j: ghost.location.j + moveDiff.j,
  }
  const nextCell = gBoard[nextLocation.i][nextLocation.j]

  if (nextCell === WALL) {
    moveGhost(ghost)
    return
  }
  if (nextCell === GHOST) {
    moveGhost(ghost)
    return
  }
  if (nextCell === PACMAN) {
    if (!PACMAN.isSuper) gameOver()
    else {
    }
    // gameOver()
    return
  }

  gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent
  renderCell(ghost.location, ghost.currCellContent.img)

  ghost.location = nextLocation
  ghost.currCellContent = nextCell
  gBoard[nextLocation.i][nextLocation.j] = GHOST
}

function getMoveDiff() {
  const randNum = getRandomIntInclusive(1, 4)

  switch (randNum) {
    case 1:
      return { i: 0, j: 1 }
    case 2:
      return { i: 1, j: 0 }
    case 3:
      return { i: 0, j: -1 }
    case 4:
      return { i: -1, j: 0 }
  }
}

function toggleSuperMode() {
  var ghosts = document.querySelectorAll('ghost')
  for (var i = 0; i < ghosts.length; i++) {
    ghosts[i].classList.toggle('superFoodActive')
  }
}
