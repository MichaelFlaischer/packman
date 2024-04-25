'use strict'

var PACMAN

function createPacman(board) {
  PACMAN = {
    location: {
      i: 2,
      j: 2,
    },
    isSuper: false,
    img: 'icons/pacman.png',
  }
  board[PACMAN.location.i][PACMAN.location.j] = PACMAN
}

function onMovePacman(ev) {
  if (!gGame.isOn) return
  const nextLocation = getNextLocation(ev.key)
  const nextCell = gBoard[nextLocation.i][nextLocation.j]

  if (nextCell === WALL) return
  if (nextCell === GHOST) {
    if (!PACMAN.isSuper) gameOver()
    else {
      console.log(nextCell)
    }
    // gameOver()
    return
  }
  if (nextCell === SUPERFOOD) {
    if (PACMAN.isSuper === true) return
    PACMAN.isSuper = true

    setTimeout(() => {
      PACMAN.isSuper = false
    }, 5000)
  }

  gBoard[PACMAN.location.i][PACMAN.location.j] = EMPTY
  renderCell(PACMAN.location, EMPTY.img)

  gBoard[nextLocation.i][nextLocation.j] = PACMAN
  PACMAN.location = nextLocation
  renderCell(PACMAN.location, PACMAN.img)
  if (nextCell === FOOD) {
    updateScore(1)
    if (!isFoodIngame()) gameOver()
  }
}

function getNextLocation(eventKeyboard) {
  const nextLocation = {
    i: PACMAN.location.i,
    j: PACMAN.location.j,
  }
  switch (eventKeyboard) {
    case 'ArrowUp':
      nextLocation.i--
      break
    case 'ArrowRight':
      nextLocation.j++
      break
    case 'ArrowDown':
      nextLocation.i++
      break
    case 'ArrowLeft':
      nextLocation.j--
      break
  }
  return nextLocation
}
