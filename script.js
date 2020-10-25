let gridSize = 16;

const hasClass = (element, cls) => {
  return element.className.includes(cls);
}

const addBombs = () => {
  let noOfBombs = Math.floor(gridSize**2 * 0.3)
  for (let i = 0; i < noOfBombs; i++) {
    let row = Math.floor(Math.random() * gridSize) + 1,
      col = Math.floor(Math.random() * gridSize) + 1,
      bombCell = document.querySelector(`.cell[data-row-col="${row}-${col}"]`)
    
    bombCell.classList.toggle('bomb')
    bombCell.addEventListener('click', () => {
      bombCell.style.backgroundColor = 'red'
      alert('You clicked on a bomb. Game over!')
      clearGrid()
    })
  }
}

const checkSurroundings = (e) => {
  let [row, col] = e.target.getAttribute('data-row-col').split('-'),
    noOfBombs = 0

  e.target.style.backgroundColor = 'royalblue'

  for (let i = row - 1, x = i + 3; i < x; i++) {
    for (let j = col - 1, y = j + 3; j < y; j++) {
      if ((i >= 0 && i < gridSize) && (j >= 0 && j < gridSize)) {
        let nearbyCell = document.querySelector(`.cell[data-row-col="${i}-${j}"]`)
        
        if (hasClass(nearbyCell, 'bomb')) {
          noOfBombs++
        } else {
          nearbyCell.style.backgroundColor = 'royalblue'
        }
      }
    }
  }
  
  return noOfBombs
}

const drawGrid = (size) => {
  let grid = document.getElementById('grid')  
  grid.setAttribute('style', `grid-template-columns: repeat(${size}, 1fr);`) 

  for (let i = 1; i <= size; i++) {
    for (let j = 1; j <= size; j++) {
      let cell = document.createElement('div')
      cell.classList.add('cell')
      cell.setAttribute('data-row-col', `${i}-${j}`)

      cell.addEventListener('click', (e) => {
        let bombsNearby = checkSurroundings(e)
        //let text = document.createElement('p')
        //text.textContent = `${bombsNearby}`
        //cell.appendChild(text);
      })

      
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