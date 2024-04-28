'use strict'

// Global variable to store the Pacman object
var PACMAN

// Function to create Pacman on the board
function createPacman(board) {
  // Get a random empty cell for Pacman's location
  var randLocation = getEmptyCell()
  // Define the Pacman object
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
  // Update the board with Pacman's position
  board[PACMAN.location.i][PACMAN.location.j] = PACMAN
}

// Function to handle Pacman's movement based on user input
function onMovePacman(ev) {
  // Check if the game is on
  if (!gGame.isOn) return
  // Get the next location based on the user's input
  const nextLocation = getNextLocation(ev.key)
  const nextCell = gBoard[nextLocation.i][nextLocation.j]

  // Handle collision with walls
  if (nextCell === WALL) return

  // Handle collision with ghosts
  if (nextCell.class === 'ghost') {
    if (!PACMAN.isSuper) {
      // If Pacman is not in super mode, game over
      var gBackGroundAudio = new Audio('sound/pacman_death.wav')
      gBackGroundAudio.play()
      gameOver()
      return
    } else {
      // If Pacman is in super mode, eat the ghost
      for (var i = 0; i < gGhosts.length; i++) {
        if (gGhosts[i].id === nextCell.id) {
          gBoard[nextLocation.i][nextLocation.j] = nextCell.currCellContent
          gGhosts.splice(i, 1)
          var gBackGroundAudio = new Audio('sound/pacman_eatghost.wav')
          gBackGroundAudio.play()
          updateScore(50)

          setTimeout(() => {
            createGhost(gBoard)
          }, 3000)
        }
      }
    }
  }

  // Handle collision with superfood
  if (nextCell === SUPERFOOD) {
    if (PACMAN.isSuper === true) return
    // Turn Pacman into super mode for a limited time
    PACMAN.isSuper = true
    for (var i = 0; i < gGhosts.length; i++) {
      // Render ghosts differently when Pacman is in super mode
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

  // Move Pacman to the next cell
  var elPacman = document.querySelector('[class*="pacman"]')

  gBoard[PACMAN.location.i][PACMAN.location.j] = EMPTY
  renderCell(PACMAN.location, `<img class ="${EMPTY.class}" src="${EMPTY.img}" alt="${EMPTY.class}" width="100%" height="100%">`)

  gBoard[nextLocation.i][nextLocation.j] = PACMAN
  PACMAN.location = nextLocation
  renderCell(PACMAN.location, `<img class ="${PACMAN.class} ${elPacman.classList[1]}" src="${PACMAN.img}" alt="${PACMAN.class}" width="100%" height="100%">`)

  // Handle collision with regular food
  if (nextCell === FOOD) {
    var gBackGroundAudio = new Audio('sound/eatFood.wav')
    gBackGroundAudio.play()
    updateScore(1)
    if (!isFoodIngame()) gameOver()
  }

  // Handle collision with cherry
  if (nextCell === CHERRY) {
    var gBackGroundAudio = new Audio('sound/pacman_eatfruit.wav')
    gBackGroundAudio.play()
    updateScore(10)
  }
}

// Function to get the next location based on Pacman's movement direction
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
