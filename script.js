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
}


function removeAllGridTiles() {
    document.getElementById("grid").textContent = '';
}

function populateGrid(gridTitleCountWidth, gridWidth) {
    removeAllGridTiles();

    console.log("Tile Count Width: ", gridTitleCountWidth,"x",gridTitleCountWidth);
    console.log("Width: ",gridWidth,"px")

    let grid = document.getElementById("grid");

    grid.style.width = gridWidth + 2*gridTitleCountWidth + 'px';
    grid.style.height = gridWidth + 2*gridTitleCountWidth + 'px';
    grid.style.gridTemplateColumns = 'repeat('+gridTitleCountWidth+','+ gridWidth/gridTitleCountWidth+'px';
    grid.style.gridTemplateRows = 'repeat('+gridTitleCountWidth+','+ gridWidth/gridTitleCountWidth+'px';

    for (let i = 0; i < gridTitleCountWidth * gridTitleCountWidth; i++) {
        let temp = document.getElementsByTagName("template")[0];
        let clon = temp.content.cloneNode(true);
        
        let tile = clon.querySelector(".tile")
        tile.style.height = gridWidth/gridTitleCountWidth + 'px';
        tile.style.width = gridWidth/gridTitleCountWidth + 'px';

        grid.appendChild(clon);
        
        console.log("Added grid tile.");
    }
}