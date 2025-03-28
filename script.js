var bombCount = 10;

var gameGrid = [[]];
var flaggedCount = 0;


function getGridElementsPosition(index) {
    const gridEl = document.getElementById("grid");
  
    // our indexes are zero-based but gridColumns are 1-based, so subtract 1
    let offset = Number(window.getComputedStyle(gridEl.children[0]).gridColumnStart) - 1; 
  
    // if we haven't specified the first child's grid column, then there is no offset
    if (isNaN(offset)) {
      offset = 0;
    }
    const colCount = window.getComputedStyle(gridEl).gridTemplateColumns.split(" ").length;
  
    const rowPosition = Math.floor((index + offset) / colCount);
    const colPosition = (index + offset) % colCount;
  
    //Return an object with properties row and column
    return { row: rowPosition, column: colPosition };
}

function onGenerateGame() {
    populateGrid(10, 500);
    // placeBombs(bombCount);

    bombText.innerText = bombCount - flaggedCount;
}


function removeAllGridTiles() {
    document.getElementById("grid").textContent = '';
}

function tileClicked(e) {
    let cols = document.querySelectorAll(".col");

    let row = Array.from(this.parentNode.children).indexOf(this);
    let col = Array.from(cols).indexOf(this.parentNode);
    // console.log(Array.from(cols));
    
    // Above tile
    if (gameGrid[col][row-1]) { // If the row above the selected space exists
        gameGrid[col][row-1].style.backgroundColor = "Gray";

        // Top left
        if (gameGrid[col-1]) {
            cols[col-1].children[row-1].style.backgroundColor = "Gray";
        }

        // Top right
        if (gameGrid[col-1]) {
            gameGrid[col+1][row-1].style.backgroundColor = "Gray";
        }
    }

    // Below tile
    if (gameGrid[col][row+1]) { // If the row below the selected space exists
        gameGrid[col][row+1].style.backgroundColor = "Gray";
        
        // Bottom left
        if (gameGrid[col-1]) {
            gameGrid[col-1][row+1].style.backgroundColor = "Gray";
        }

        // Bottom right
        if (gameGrid[col+1]) {
            gameGrid[col+1][row+1].style.backgroundColor = "Gray";
        }
    }

    // Left tile
    if (gameGrid[col-1]) { // If the col to the left of the selected space exists
        gameGrid[col-1][row].style.backgroundColor = "Gray";
    }
    
    // Right tile
    if (gameGrid[col+1]) { // If the col to the right of the selected space exists
        gameGrid[col+1][row].style.backgroundColor = "Gray";
    }

    this.style.backgroundColor = "Black";
    console.log("Tile (", col, ",", row);
}

function tileFlagged(e) {
    e.preventDefault()
    console.log("Tile Flagged ", this);
}

function populateGrid(gridTitleCountWidth, gridWidth) {
    removeAllGridTiles();

    console.log("Tile Count Width: ", gridTitleCountWidth,"x",gridTitleCountWidth);
    console.log("Width: ",gridWidth,"px")

    let grid = document.getElementById("grid");

    grid.style.width = gridWidth + 8*gridTitleCountWidth - (4*gridTitleCountWidth) + 'px';
    grid.style.height = gridWidth + 8*gridTitleCountWidth - (4*gridTitleCountWidth) + 'px';
    grid.style.gridTemplateColumns = 'repeat('+gridTitleCountWidth+','+ gridWidth/gridTitleCountWidth+'px';
    grid.style.gridTemplateRows = 'repeat('+gridTitleCountWidth+','+ gridWidth/gridTitleCountWidth+'px';

    for (let col = 0; col < gridTitleCountWidth; col++) {
        let tempCol = document.createElement("div");
        tempCol.style.height = gridWidth/gridTitleCountWidth + 'px';
        tempCol.style.width = gridWidth/gridTitleCountWidth + 'px';
        tempCol.classList.add("col");
        let newCol = grid.appendChild(tempCol);
        // console.log("Col ", newCol);
        gameGrid.push([]);
        for(let row = 0; row < gridTitleCountWidth; row++) {
            let temp = document.getElementsByTagName("template")[0];
            let clon = temp.content.cloneNode(true);
            
            let tile = clon.querySelector(".tile")
            tile.style.height = gridWidth/gridTitleCountWidth + 'px';
            tile.style.width = gridWidth/gridTitleCountWidth + 'px';
            
            let newTile = newCol.appendChild(tile);
            // console.log("Tile ", newTile);
            newTile.onclick = tileClicked;
            newTile.oncontextmenu = tileFlagged;
            
            // console.log("Added grid tile.");
            gameGrid[col][row] = {
                "tile":newTile,
                "isFlagged":false,
                "isBomb":false
            };
        }
        
    }
}

function placeBombs(count) {
    var placementCount = 0;
    while (placementCount < bombCount) {
        let col = Math.random() * gameGrid.length;
        let row = Math.random() * gameGrid[col].length;

        if (gameGrid[col][row]["isBomb"] == false) {
            gameGrid[col][row]["isBomb"] = true;
        }
    }
}
