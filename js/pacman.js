'use strict'

var PACMAN

function createPacman(board) {
  var randLocation = getEmptyCell()
  PACMAN = {
    location: {
      i: randLocation.i,
      j: randLocation.j,
    },
    isSuper: false,
    img: 'icons/pacman.png',
    class: 'pacman',
    color: 360,
  }
  board[PACMAN.location.i][PACMAN.location.j] = PACMAN
}

function onMovePacman(ev) {
  if (!gGame.isOn) return
  const nextLocation = getNextLocation(ev.key)
  const nextCell = gBoard[nextLocation.i][nextLocation.j]

  if (nextCell === WALL) return

  if (nextCell.class === 'ghost') {
    if (!PACMAN.isSuper) {
      var gBackGroundAudio = new Audio('sound/pacman_death.wav')
      gBackGroundAudio.play()
      gameOver()
      return
    } else {
      for (var i = 0; i < gGhosts.length; i++) {
        if (gGhosts[i].id === nextCell.id) {
          gBoard[nextLocation.i][nextLocation.j] = nextCell.currCellContent
          gGhosts.splice(i, 1)
          var gBackGroundAudio = new Audio('sound/pacman_eatghost.wav')
          gBackGroundAudio.play()

          setTimeout(() => {
            createGhost(gBoard)
          }, 3000)
        }
      }
    }
  }
  if (nextCell === SUPERFOOD) {
    if (PACMAN.isSuper === true) return
    PACMAN.isSuper = true
    for (var i = 0; i < gGhosts.length; i++) {
      renderCell(
        gGhosts[i].location,
        `<img class ="${gGhosts[i].class}" src="${gGhosts[i].imgSuper}" alt="${gGhosts[i].class}" width="100%" height="100%" style="filter: hue-rotate(${gGhosts[i].color}deg);">`
      )
    }
    toggleSuperMode()
    var gBackGroundAudio = new Audio('sound/pacman_intermission.wav')
    gBackGroundAudio.play()
    setTimeout(() => {
      PACMAN.isSuper = false
      toggleSuperMode()
    }, 5000)
  }
  var elPacman = document.querySelector('[class*="pacman"]')

  gBoard[PACMAN.location.i][PACMAN.location.j] = EMPTY
  renderCell(PACMAN.location, `<img class ="${EMPTY.class}" src="${EMPTY.img}" alt="${EMPTY.class}" width="100%" height="100%">`)

  gBoard[nextLocation.i][nextLocation.j] = PACMAN
  PACMAN.location = nextLocation
  renderCell(PACMAN.location, `<img class ="${PACMAN.class} ${elPacman.classList[1]}" src="${PACMAN.img}" alt="${PACMAN.class}" width="100%" height="100%">`)

  if (nextCell === FOOD) {
    var gBackGroundAudio = new Audio('sound/eatFood.wav')
    gBackGroundAudio.play()
    updateScore(1)
    if (!isFoodIngame()) gameOver()
  }
  if (nextCell === CHERTY) {
    var gBackGroundAudio = new Audio('sound/pacman_eatfruit.wav')
    gBackGroundAudio.play()
    updateScore(10)
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
      var elPacman = document.querySelector('[class*="pacman"]')
      elPacman.classList.add('rotateUp')
      elPacman.classList.remove('rotateDown')
      elPacman.classList.remove('rotateLeft')
      elPacman.classList.remove('rotateRight')
      break
    case 'ArrowRight':
      nextLocation.j++
      var elPacman = document.querySelector('[class*="pacman"]')
      elPacman.classList.remove('rotateUp')
      elPacman.classList.remove('rotateDown')
      elPacman.classList.remove('rotateLeft')
      elPacman.classList.add('rotateRight')
      break
    case 'ArrowDown':
      nextLocation.i++
      var elPacman = document.querySelector('[class*="pacman"]')
      elPacman.classList.remove('rotateUp')
      elPacman.classList.add('rotateDown')
      elPacman.classList.remove('rotateLeft')
      elPacman.classList.remove('rotateRight')

      break
    case 'ArrowLeft':
      nextLocation.j--
      var elPacman = document.querySelector('[class*="pacman"]')
      elPacman.classList.remove('rotateUp')
      elPacman.classList.remove('rotateDown')
      elPacman.classList.add('rotateLeft')
      elPacman.classList.remove('rotateRight')

      break
  }
  return nextLocation
}
