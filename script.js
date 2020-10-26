let gridSize = 10;

const hasClass = (element, cls) => {
  return element.className.includes(cls);
}

const addBombs = () => {
  let noOfBombs = Math.floor(gridSize**2 * 0.23)
  for (let i = 0; i < noOfBombs; i++) {
    let row = Math.floor(Math.random() * gridSize) + 1,
      col = Math.floor(Math.random() * gridSize) + 1,
      bombCell = document.querySelector(`.cell[data-pos="${row}-${col}"]`)
    
    bombCell.classList.add('bomb')  
    bombCell.addEventListener('click', () => {      
      revealBombs()
      alert('You clicked on a bomb. Game over!')    
      setTimeout(clearGrid, 1000) 
    })
  }
}

const revealBombs = () => {
  let bombs = Array.from(document.querySelectorAll('.bomb'))
  bombs.forEach(bomb => {
    setTimeout(() => {
      bomb.style.backgroundColor = 'red'
    }, 500)    
  })
}

const checkNeighbors = (row, col) => {
  let noOfBombs = 0,
    neighbors = []
  
  for (let i = row - 1, x = i + 3; i < x; i++) {
    for (let j = col - 1, y = j + 3; j < y; j++) {
      if (i != row && j != col) continue;
      if ((i > 0 && i <= gridSize) && (j > 0  && j <= gridSize)) {
        let nearbyCell = document.querySelector(`.cell[data-pos="${i}-${j}"]`)
        neighbors.push(nearbyCell)        
        console.log(nearbyCell, i, j)
        if (hasClass(nearbyCell, 'bomb')) {
          noOfBombs++
        }
      }
    }
  }

  console.log(neighbors.length)
  return [noOfBombs, neighbors];
}

const revealNeighbors = (neighbors) => {
  neighbors.forEach(cell => {
    if (!hasClass(cell, 'visited'))
      cell.style.backgroundColor = 'white'
  })
}

const checkForBombs = (cell) => {
  let pos = cell.getAttribute('data-pos').split('-').map(x => parseInt(x)),
    [bombsNearby, neighbors] = checkNeighbors(...pos)

  cell.classList.add('visited')

  if (bombsNearby) {
    let text = document.createElement('p')
    text.textContent = `${bombsNearby}`
    
    cell.appendChild(text);
    cell.style.backgroundColor = 'white'  
    cell.style.color = `rgb(${Math.floor(Math.random() * 220)}, ${Math.floor(Math.random() * 220)}, ${Math.floor(Math.random() * 220)})`
    cell.removeEventListener('click', cellSelected)
  } else {
    revealNeighbors(neighbors)
    
    neighbors.forEach(cell => {
      if (!hasClass(cell, 'visited')) {
        checkForBombs(cell)
      }
    })    
  }
  
}

const cellSelected = (e) => {
  let cell = e.target
  checkForBombs(cell)
  cell.removeEventListener('click', cellSelected)
}

const drawGrid = (size) => {
  let grid = document.getElementById('grid')  
  grid.setAttribute('style', `grid-template-columns: repeat(${size}, 1fr);`) 

  for (let i = 1; i <= size; i++) {
    for (let j = 1; j <= size; j++) {
      let cell = document.createElement('div')
      cell.classList.add('cell')
      cell.setAttribute('data-pos', `${i}-${j}`)
      cell.addEventListener('click', cellSelected)   
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
  drawGrid(gridSize);
}

let button = document.getElementById('submit')
button.addEventListener('click', () => {
  let value = document.getElementById('grid-size').value

  if (value > 50) {
    alert('Max grid size is 50')
    return;
  }

  gridSize = parseInt(value);
  clearGrid();
})

document.addEventListener('onload', drawGrid(gridSize))