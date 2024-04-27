'use strict'

var gGhosts = []
var gNextId = 0
var gIntervalGhosts

function createGhosts(board, count) {
  gGhosts = []
  for (var i = 0; i < count; i++) {
    createGhost(board)
  }

  if (gIntervalGhosts) clearInterval(gIntervalGhosts)
  gIntervalGhosts = setInterval(moveGhosts, 1000)
}

function createGhost(board) {
  var ghostLocation = getEmptyCell()
  var randColor = Math.floor(Math.random() * 360 + 1)
  const ghost = {
    id: gNextId,
    location: { i: ghostLocation.i, j: ghostLocation.j },
    currCellContent: EMPTY,
    img: 'icons/ghost.png',
    imgSuper: 'icons/whiteGhost.png',
    class: 'ghost',
    color: randColor,
  }
  gNextId++
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
  if (nextCell.class === 'ghost') {
    moveGhost(ghost)
    return
  }
  if (nextCell === PACMAN) {
    if (!PACMAN.isSuper) {
      var gBackGroundAudio = new Audio('sound/pacman_death.wav')
      gBackGroundAudio.play()
      gameOver()
      return
    } else {
      for (var i = 0; i < gGhosts.length; i++) {
        if (gGhosts[i].id === ghost.id) {
          gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent
          var percentSize = cellContent === FOOD ? 40 : 100

          renderCell(
            ghost.location,
            `<img class ="${ghost.currCellContent.class}" src="${ghost.currCellContent.img}" alt="${ghost.currCellContent.class}" width="${percentSize}%" height="${percentSize}%";">`
          )

          gGhosts.splice(i, 1)
          var gBackGroundAudio = new Audio('sound/pacman_eatghost.wav')
          gBackGroundAudio.play()
          setTimeout(() => {
            createGhost(gBoard)
          }, 3000)
          return
        }
      }
    }
  }

  var percentSize = ghost.currCellContent === FOOD ? 40 : 100

  gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent

  renderCell(
    ghost.location,
    `<img class ="${ghost.currCellContent.class}" src="${ghost.currCellContent.img}" alt="${ghost.currCellContent.class}" width="${percentSize}%" height="${percentSize}%";">`
  )

  ghost.currCellContent = nextCell

  ghost.location = nextLocation
  gBoard[nextLocation.i][nextLocation.j] = ghost

  if (PACMAN.isSuper) {
    renderCell(
      ghost.location,
      `<img class ="${ghost.class}" src="${ghost.imgSuper}" alt="${ghost.class}" width="100%" height="100%" style="filter: hue-rotate(${ghost.color}deg);">`
    )
  } else {
    renderCell(
      ghost.location,
      `<img class ="${ghost.class}" src="${ghost.img}" alt="${ghost.class}" width="100%" height="100%" style="filter: hue-rotate(${ghost.color}deg);">`
    )
  }
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
