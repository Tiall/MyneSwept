var bombCount = 10;

var gameGrid = [];
var flaggedCount = 0;

var isFirstPress = true;
var isGameOver = false;

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
    let bombInput = document.getElementById("bombInput");
    let sizeInput = document.getElementById("sizeInput");
    let boardPxInput = document.getElementById("boardPxInput");
    console.log(boardPxInput.value);
    populateGrid(sizeInput.value, Number(boardPxInput.value));
    placeBombs(bombInput.value);

    bombText.innerText = bombCount - flaggedCount;
}


function resetGame() {
    gameGrid = [];
    flaggedCount = 0;
    isFirstPress = true;
    isGameOver = false;
    document.getElementById("grid").textContent = '';
}

function tileClicked(e) {
    let row = Array.from(this.parentNode.children).indexOf(this);
    let col = Array.from(document.querySelectorAll(".col")).indexOf(this.parentNode);

    clickTile(col, row);
}
function clickTile(col, row, isSearch = false) {
    if (isGameOver) {
        // If we already won, dont do anything
        alert("Game already over, generate a new game to continue playing!");
        return;
    }

    if (gameGrid[col][row]["isFlagged"]) {
        // Do nothing
        return;
    }
    if (isFirstPress) {
        isFirstPress = false;
        if (gameGrid[col][row]["isBomb"]) {
            console.log("You got a bomb on the first click lol... *slow clap* ... I gotchu");
            onGenerateGame();
            clickTile(col, row);
        }
    }

    if (!gameGrid[col][row]["isRevealed"] || (isSearch && gameGrid[col][row]["surroundingBombs"] == 0)) {
        //gameGrid[row][col]["isClicked"] = true;

        if (gameGrid[col][row]["isBomb"]) {
            gameGrid[col][row]["tile"].style.backgroundColor = "red";
            alert("BOMB : You Lose!");
            isGameOver = true;
            return;
        }

        revealTile(gameGrid[col][row]);

        // Above tile
        if (gameGrid[col][row - 1] && !gameGrid[col][row - 1]["isBomb"]) { // If the row above the selected space exists
            if (revealTile(gameGrid[col][row - 1]) != -1) {
                // Top left
                if (gameGrid[col - 1]) {
                    revealTile(gameGrid[col - 1][row - 1]);

                }

                // Top right
                if (gameGrid[col + 1]) {
                    revealTile(gameGrid[col + 1][row - 1]);

                }
            }

            
        }

        // Below tile
        if (gameGrid[col][row + 1] && !gameGrid[col][row + 1]["isBomb"]) { // If the row below the selected space exists
            if (revealTile(gameGrid[col][row + 1]) != -1) {
                // Bottom left
                if (gameGrid[col - 1]) {
                    revealTile(gameGrid[col - 1][row + 1]);
                }

                // Bottom right
                if (gameGrid[col + 1]) {
                    revealTile(gameGrid[col + 1][row + 1]);
                }
            }
        }

        // Left tile
        if (gameGrid[col - 1]) { // If the col to the left of the selected space exists
            revealTile(gameGrid[col - 1][row]);
        }

        // Right tile
        if (gameGrid[col + 1]) { // If the col to the right of the selected space exists
            revealTile(gameGrid[col + 1][row]);
        }


        //console.log("Tile (", col, ",", row);
    }
    else {
        console.log("failed click", gameGrid[col][row]);
    }
}
function revealTile(gridTile) {
    if (gridTile["isRevealed"] == false && gridTile["isBomb"] == false) {
        //if (gridTile["surroundingBombs"] == 0) {
        //    clickTile(gridTile["row"], gridTile["col"]);
        //    gridTile["tile"].querySelector("p").innerText = gridTile["isBomb"] ? "B" : "-";
        //}
        //else {

        //}

        gridTile["isRevealed"] = true;

        // If the tile has no bombs around the clicked tile, we want to automatically reveal nearby empty tiles
        if (gridTile["surroundingBombs"] == 0) {
            gridTile["tile"].style.backgroundColor = "#f7f6ed";
            clickTile(gridTile["col"], gridTile["row"], true);
            return 1;
        }
        else {
            gridTile["tile"].querySelector("p").innerText = gridTile["surroundingBombs"];
            gridTile["tile"].style.backgroundColor = "#edeada";
            return 0;
        }
        
    }
    return gridTile;

}

function tileFlagged(e) {
    if (isGameOver) {
        // If we already won, dont do anything
        alert("Game already over, generate a new game to continue playing!");
        return;
    }
    e.preventDefault();

    let row = Array.from(this.parentNode.children).indexOf(this);
    let col = Array.from(document.querySelectorAll(".col")).indexOf(this.parentNode);

    if (gameGrid[col][row]["isRevealed"]) {
        return;
    }

    gameGrid[col][row]["isFlagged"] = !gameGrid[col][row]["isFlagged"];

    gameGrid[col][row]["tile"].style.backgroundColor = gameGrid[col][row]["isFlagged"] ? "#111111" : "#e3dab1";
    flaggedCount += gameGrid[col][row]["isFlagged"] ? 1 : -1;
    bombText.innerText = bombCount - flaggedCount;

    //console.log("Tile Flagged ", gameGrid[col][row]);

    if (flaggedCount == bombCount) {
        for (let col of gameGrid) {
            for (let tile of col) {
                if (tile["isBomb"] && !tile["isFlagged"]) {
                    return;
                }
            }
        }
        isGameOver = true;
        alert("You Won!");
    }
}

function populateGrid(gridTitleCountWidth, gridWidth) {
    resetGame();

    //console.log("Tile Count Width: ", gridTitleCountWidth,"x",gridTitleCountWidth);
    //console.log("Width: ", gridWidth, "px");

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
            
            let tile = clon.querySelector(".tile");
            tile.style.height = gridWidth/gridTitleCountWidth + 'px';
            tile.style.width = gridWidth / gridTitleCountWidth + 'px';
            tile.querySelector("p").style.fontSize = gridWidth / gridTitleCountWidth/1.2 + 'px';
            tile.querySelector("p").style.margin = "auto";
            //tile.querySelector("p").style.justifyContent = "center";
            
            let newTile = newCol.appendChild(tile);
            // console.log("Tile ", newTile);
            newTile.onclick = tileClicked;
            newTile.oncontextmenu = tileFlagged;
            
            // console.log("Added grid tile.");
            gameGrid[col][row] = {
                "tile": newTile,
                "isRevealed": false,
                "isClicked":false,
                "isFlagged":false,
                "isBomb": false,
                "surroundingBombs": 0,
                "row": row,
                "col": col
            };
        }
        
    }
}

function placeBombs(count) {
    var placementCount = 0;
    while (placementCount < count) {
        let col = Math.floor(Math.random() * (gameGrid.length - 1));
        let row = Math.floor(Math.random() * (gameGrid[col].length-1));

        if (gameGrid[col][row]["isBomb"] == false) {
            gameGrid[col][row]["isBomb"] = true;

            incrementBombCounts(col, row);
            placementCount++;
        }
    }
}
function incrementBombCounts(col, row) {
    // Above tile
    if (gameGrid[col][row - 1]) { // If the row above the selected space exists
        incrementTileBombCount(gameGrid[col][row - 1]);

        // Top left
        if (gameGrid[col - 1]) {
            incrementTileBombCount(gameGrid[col - 1][row - 1]);
        }

        // Top right
        if (gameGrid[col + 1]) {
            incrementTileBombCount(gameGrid[col + 1][row - 1]);
        }
    }

    // Below tile
    if (gameGrid[col][row + 1]) { // If the row below the selected space exists
        incrementTileBombCount(gameGrid[col][row + 1]);

        // Bottom left
        if (gameGrid[col - 1]) {
            incrementTileBombCount(gameGrid[col - 1][row + 1]);
        }

        // Bottom right
        if (gameGrid[col + 1]) {
            incrementTileBombCount(gameGrid[col + 1][row + 1]);
        }
    }

    // Left tile
    if (gameGrid[col - 1]) { // If the col to the left of the selected space exists
        incrementTileBombCount(gameGrid[col - 1][row]);
    }

    // Right tile
    if (gameGrid[col + 1]) { // If the col to the right of the selected space exists
        incrementTileBombCount(gameGrid[col + 1][row]);
    }
}
function incrementTileBombCount(gridTile) {
    gridTile["surroundingBombs"] += 1;
}
