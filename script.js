let gridSize = 16;

const addBombs = () => {
  let noOfBombs = Math.floor(gridSize**2 * 0.3)
  for (let i = 0; i < noOfBombs; i++) {
    let row = Math.floor(Math.random() * gridSize) + 1,
      col = Math.floor(Math.random() * gridSize) + 1,
      cell = document.querySelector(`.cell[data-row-col="${row}-${col}"]`)
    
    cell.classList.add('bomb')
    cell.addEventListener('click', () => {
      
    })
  }
}

const drawGrid = (size) => {
  let grid = document.getElementById('grid')  
  grid.setAttribute('style', `grid-template-columns: repeat(${size}, 1fr);`) 

  for (let i = 1; i <= size; i++) {
    for (let j = 1; j <= size; j++) {
      let cell = document.createElement('div')
      cell.classList.add('cell')
      cell.setAttribute('data-row-col', `${i}-${j}`)
      grid.appendChild(cell);
    }
    /* For etch-a-sketch
    cell.addEventListener('mouseover', () => {
      cell.style.backgroundColor = `rgb(${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)})`
    })
    */    
  }

  addBombs()
  console.log('Grid drawn!')
} 

const clearGrid = () => {
  let grid = document.getElementById('grid')
  while (grid.firstChild) {
    grid.removeChild(grid.lastChild)
  }
}

let button = document.getElementById('submit')
button.addEventListener('click', () => {
  let value = document.getElementById('grid-size').value

  if (value > 100) {
    alert('Max grid size is 100')
    return;
  }

  gridSize = parseInt(value);
  clearGrid();
  drawGrid(gridSize);
})

document.addEventListener('onload', drawGrid(gridSize))