let gridSize = 12,
  bombPercentage = 0.21,
  noOfBombs = Math.floor(gridSize**2 * bombPercentage),
  noOfCells = gridSize**2 - noOfBombs,
  duplicates = 0;

const hasClass = (element, cls) => {
  return element.className.includes(cls);
}

const addBombs = () => {
  let positionArray = []
  noOfBombs = Math.floor(gridSize**2 * bombPercentage)

  for (let i = 0; i < noOfBombs; i++) {
    let row = Math.floor(Math.random() * gridSize) + 1,
      col = Math.floor(Math.random() * gridSize) + 1

    if (positionArray.includes(`${row}${col}`)) duplicates++
    positionArray.push(`${row}${col}`)

    let bombCell = document.querySelector(`.cell[data-pos="${row}-${col}"]`)
    
    bombCell.classList.add('bomb')  
    bombCell.addEventListener('click', () => {      
      revealBombs()
      alert('You clicked on a bomb. Game over!')    
      setTimeout(clearGrid, 1500) 
    })
  }

  noOfCells += duplicates
}

const revealBombs = () => {
  let bombs = Array.from(document.querySelectorAll('.bomb'))
  bombs.forEach(bomb => {
    bomb.classList.remove('flag')
    setTimeout(() => {
      bomb.style.backgroundColor = 'red'
    }, 500)    
  })
}

const checkNeighbors = (row, col) => {
  let nearbyBombs = 0,
    neighbors = []
  
  for (let i = row - 1, x = i + 3; i < x; i++) {
    for (let j = col - 1, y = j + 3; j < y; j++) {
      if (i != row && j != col) continue;
      if ((i > 0 && i <= gridSize) && (j > 0  && j <= gridSize)) {
        let nearbyCell = document.querySelector(`.cell[data-pos="${i}-${j}"]`)
        neighbors.push(nearbyCell)        
        if (hasClass(nearbyCell, 'bomb')) {
          nearbyBombs++
        }
      }
    }
  }

  return [nearbyBombs, neighbors];
}

const revealNeighbors = (neighbors) => {
  neighbors.forEach(cell => {
    if (!hasClass(cell, 'visited'))
      cell.style.backgroundColor = 'white'
      cell.removeEventListener('contextmenu', addFlag)
  })
}

const checkForBombs = (cell) => {
  let pos = cell.getAttribute('data-pos').split('-').map(x => parseInt(x)),
    [bombsNearby, neighbors] = checkNeighbors(...pos)

  cell.classList.add('visited')
  cell.classList.remove('flag')
  cell.style.backgroundColor = 'white'
  noOfCells-- 

  if (bombsNearby) {
    if (!hasClass(cell, 'bomb')) {
      let text = document.createElement('p')
      text.textContent = `${bombsNearby}`
      cell.appendChild(text);    
      cell.style.color = `rgb(${Math.floor(Math.random() * 220)}, ${Math.floor(Math.random() * 220)}, ${Math.floor(Math.random() * 220)})`
    }    
    cell.removeEventListener('click', cellSelected)
  } else {
    revealNeighbors(neighbors)
    neighbors.forEach(cell => {
      if (!hasClass(cell, 'visited')) {
        checkForBombs(cell)
      }
    })    
  }

  if (noOfCells === 0) {
    alert('Congratulations! You won.')
    clearGrid()
    return;
  }  
}

const cellSelected = (e) => {
  let cell = e.target
  checkForBombs(cell)
  cell.removeEventListener('click', cellSelected)
  cell.removeEventListener('contextmenu', addFlag)
}

const addFlag = (e) => {
  e.preventDefault()
  e.target.classList.toggle('flag')
}

const drawGrid = () => {
  let grid = document.getElementById('grid')  
  grid.setAttribute('style', `grid-template-columns: repeat(${gridSize}, 1fr);`) 

  for (let i = 1; i <= gridSize; i++) {
    for (let j = 1; j <= gridSize; j++) {
      let cell = document.createElement('div')
      cell.classList.add('cell')
      cell.setAttribute('data-pos', `${i}-${j}`)
      cell.addEventListener('click', cellSelected)
      cell.addEventListener('contextmenu', addFlag)   
      grid.appendChild(cell);     
    } 
  }

  addBombs()
  console.log('Grid drawn!')
} 

const clearGrid = () => {
  let grid = document.getElementById('grid')
  while (grid.firstChild) {
    grid.removeChild(grid.lastChild)
  }
  drawGrid();
}


/* Settings element event listeners */

let button1 = document.getElementById('x')
button1.addEventListener('click', () => {
  let value = parseInt(document.getElementById('grid-size').value)

  if (value > 50) {
    alert('Max grid size is 25')
    return;
  } else if (value < 8) {
    alert('Minimum grid size is 8')
    return;
  }

  gridSize = value;
  clearGrid();
})

let button2 = document.getElementById('y')
button2.addEventListener('click', () => {
  let value = parseFloat(document.getElementById('bomb-no').value)

  if (value < 0.1) {
    alert('Minimum number of bombs is 10% of grid area')
    return;
  } else if (value > 0.6) {
    alert('Maximum number of bombs is 60% of grid area')
    return;
  }

  alert(`Number of bombs is changed to ${value*100}% of grid area`)
  bombPercentage = value;
  clearGrid();
})

let dropdown = document.getElementById('difficulty')
dropdown.addEventListener('change', (e) => {
  [gridSize, bombPercentage] = e.target.value.split('-').map(x => parseFloat(x))
  clearGrid()
})

document.addEventListener('onload', drawGrid(gridSize))