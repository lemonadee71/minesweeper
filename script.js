let gridSize = 10;

const hasClass = (element, cls) => {
  return element.className.includes(cls);
}

const addBombs = () => {
  let noOfBombs = Math.floor(gridSize**2 * 0.3)
  for (let i = 0; i < noOfBombs; i++) {
    let row = Math.floor(Math.random() * gridSize) + 1,
      col = Math.floor(Math.random() * gridSize) + 1,
      bombCell = document.querySelector(`.cell[data-pos="${row}-${col}"]`)
    
    //bombCell.setAttribute('data-bomb', 'true')
    bombCell.classList.add('bomb')
    bombCell.style.backgroundColor = 'red'
    bombCell.addEventListener('click', () => {      
      alert('You clicked on a bomb. Game over!')
      clearGrid()
    })
  }
}

const checkSurroundings = (row, col) => {
  let noOfBombs = 0
  
  for (let i = row - 1, x = i + 3; i < x; i++) {
    for (let j = col - 1, y = j + 3; j < y; j++) {
      if ((i > 0 && i <= gridSize) && (j > 0  && j <= gridSize)) {
        let nearbyCell = document.querySelector(`.cell[data-pos="${i}-${j}"]`)
        //console.log('data-bomb' in nearbyCell.attributes)
        if (!nearbyCell) break;

        if (hasClass(nearbyCell, 'bomb')) {
          noOfBombs++
        } else {
          nearbyCell.style.backgroundColor = 'royalblue'
        }
      }
    }
  }
  
  return noOfBombs;
}

const checkForBombs = (cell) => {
  let pos = cell.getAttribute('data-pos').split('-').map(x => parseInt(x)),
    bombsNearby = checkSurroundings(...pos),
    text = document.createElement('p')

  text.textContent = `${bombsNearby}`
  cell.appendChild(text);
  cell.style.backgroundColor = 'royalblue'
}

const cellSelected = (e) => {
  let cell = e.target
  checkForBombs(cell)
  cell.removeEventListener('click', checkForBombs)
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