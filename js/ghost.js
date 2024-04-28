'use strict'

// Array to store ghost objects
var gGhosts = []

// Variable to track the ID of the next ghost
var gNextId = 0

// Interval for moving ghosts
var gIntervalGhosts

// Function to create ghosts on the board
function createGhosts(board, count) {
  // Clear the ghosts array
  gGhosts = []
  // Create specified number of ghosts
  for (var i = 0; i < count; i++) {
    createGhost(board)
  }
  // Clear previous interval and set a new one for moving ghosts
  if (gIntervalGhosts) clearInterval(gIntervalGhosts)
  gIntervalGhosts = setInterval(moveGhosts, 1000)
}

// Function to create a single ghost
function createGhost(board = gBoard) {
  // Get an empty cell for the ghost's location
  var ghostLocation = getEmptyCell()
  // Generate a random color for the ghost
  var randColor = Math.floor(Math.random() * 360 + 1)
  // Define the ghost object
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
  // Update the board with the ghost's position
  board[ghost.location.i][ghost.location.j] = ghost
}

// Function to move all ghosts
function moveGhosts() {
  for (var i = 0; i < gGhosts.length; i++) {
    const ghost = gGhosts[i]
    moveGhost(ghost)
  }
}

// Function to move a single ghost
function moveGhost(ghost) {
  // Get the direction of movement
  const moveDiff = getMoveDiff()
  const nextLocation = {
    i: ghost.location.i + moveDiff.i,
    j: ghost.location.j + moveDiff.j,
  }
  const nextCell = gBoard[nextLocation.i][nextLocation.j]

  // Handle collision with walls
  if (nextCell === WALL) {
    moveGhost(ghost)
    return
  }

  // Handle collision with other ghosts
  if (nextCell.class === 'ghost') {
    moveGhost(ghost)
    return
  }

  // Handle collision with Pacman
  if (nextCell === PACMAN) {
    if (!PACMAN.isSuper) {
      // If Pacman is not in super mode, game over
      var gBackGroundAudio = new Audio('sound/pacman_death.wav')
      gBackGroundAudio.play()
      gameOver()
      return
    } else {
      // If Pacman is in super mode, eat the ghost
      for (var i = 0; i < gGhosts.length; i++) {
        if (gGhosts[i].id === ghost.id) {
          // Remove the ghost from the board and the ghosts array
          gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent
          var percentSize = gGhosts[i].currCellContent === FOOD ? 40 : 100

          renderCell(
            ghost.location,
            `<img class ="${ghost.currCellContent.class}" src="${ghost.currCellContent.img}" alt="${ghost.currCellContent.class}" width="${percentSize}%" height="${percentSize}%";">`
          )

          gGhosts.splice(i, 1)
          var gBackGroundAudio = new Audio('sound/pacman_eatghost.wav')
          gBackGroundAudio.play()
          // Increase the score and respawn the ghost after 3 seconds
          updateScore(50)
          setTimeout(() => {
            createGhost(gBoard)
            renderCell(
              gGhosts[gGhosts.length].location,
              `<img class ="${gGhosts[gGhosts.length].class}" src="${gGhosts[gGhosts.length].imgSuper}" alt="${
                gGhosts[gGhosts.length].class
              }" width="100%" height="100%" style="filter: hue-rotate(${gGhosts[gGhosts.length].color}deg);">`
            )
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

  // Render the ghost on the board
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

// Function to get the movement direction for a ghost
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

// Function to toggle super mode for ghosts
function toggleSuperMode() {
  var ghosts = document.querySelectorAll('ghost')
  for (var i = 0; i < ghosts.length; i++) {
    ghosts[i].classList.toggle('superFoodActive')
  }
}
