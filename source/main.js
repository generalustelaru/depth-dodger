var boardElements = new Map(); // Stores uCoords and their statuses.
var boardCover = new Map(); // Stores oCoords and their statuses.

function resetGame() { 
    document.getElementById("tagLine").innerText = "A New Daring Adventure!";
    document.getElementById("gameArea").innerHTML = "";
    document.getElementById("serumMonitor").innerText = "Soothe serum: " + serum + "/" + recipe;
    virginMap = true;
    movesLeft = 381; // 480-99 (381).
    boardElements = new Map();
    boardCover = new Map();    
    drawGameBoard();
    isPlaying = false;
    startGame();

}

function drawGameBoard() { // Called on page load. Does not start the game.
    let gameBoard = document.createElement("div");
    gameBoard.id = "gameBoard";
    for (let x = 0; x < 16; x++) {
        let row = document.createElement("div");
        row.className = "row";
        for (let y = 0; y < 30; y++) {
            // tileContainer: Holds two overlapping elements
            let tileContainer = document.createElement("div");            
            tileContainer.className = "tileContainer";
            row.appendChild(tileContainer);
            // boardTile: Displays a mine, a bubble, or nothing. Right now it's nothing.
            let boardTile = document.createElement("div");            
            boardTile.className = "boardTile";
            let coords = x + "u" + y;
            boardTile.id = coords;
            boardTile.style.zIndex = "1";
            boardElements.set(coords, "blank");
            tileContainer.appendChild(boardTile);
            // coverTile: Displays flags and obscures the board.
            let coverTile = document.createElement("div");            
            coverTile.className = "coverTile";
            let coverCoords = x + "o" + y;
            coverTile.id = coverCoords;
            coverTile.style.zIndex = "2";
            coverTile.style.backgroundImage = "url(graphics/covered.svg)";
            boardCover.set(coverCoords, "covered");
            tileContainer.appendChild(coverTile);
        }
        gameBoard.appendChild(row);
    }
    document.getElementById("gameArea").appendChild(gameBoard);
}

var axisPattern = ["x", "y", "x", "x", "y", "y", "x", "x"]; // tile-checking pattern for bubble values and multi-reveals (bursts)
var driftPattern = [-1, -1, 1, 1, 1, 1, -1, -1];

function populateBoard(startCoords) {
    let mines = 99;
    let tiles = 480;
    //let delay = 0.0;
    while (mines > 0) { // Mines are placed randomly at an ever-increasing probability rate.
        var coordIterator = boardElements.keys();
        for (let i = 0; i < 480; i++) {
            let coords = coordIterator.next().value;
            if (coords == startCoords || boardElements.get(coords) == "mine") {
                continue;
            }
            let dieRoll = Math.random();
            if (dieRoll <= mines / tiles) {
                boardElements.set(coords, "mine");
                let mine = document.getElementById(coords);                
                mine.style.backgroundImage = "url(graphics/mine.svg)";
                mine.style.animationName = "sleeping";
                mine.style.animationDuration = "3s";
                let delay = Math.random();
                mine.style.animationDelay = delay + "s";
                mine.style.animationIterationCount = "infinite";
                --mines;
            }
            --tiles;
        }
    }
    var coordIterator = boardElements.keys();
    for (let i = 0; i < 480; i++) { // Every non-mine tile is checked for adjacent mines
        let uCoords = coordIterator.next().value;
        if (boardElements.get(uCoords) == "mine") {
            continue;
        }
        let proximityCount = 0;
        let x = getX(uCoords); // Coordinates are split into x & y and used to perform a circular check around the tile
        let y = getY(uCoords);
        for (let i = 0; i < 8; i++) {
            let drift = driftPattern[i];
            let axis = axisPattern[i];
            switch (axis) {
                case "x":
                    x += drift;
                    break;
                case "y":
                    y += drift;
                    break;
            }
            if (boardElements.get(toUnderCoords(x, y)) == "mine")
            ++proximityCount;
        }
        if (proximityCount > 0) { // Record the bubble value and assign the apropriate visual
            boardElements.set(uCoords, "bubl" + proximityCount);
            document.getElementById(uCoords).style.backgroundImage = "url(graphics/bubl" + proximityCount + ".svg)";
        }
    }
}

var serum = 0, drinks = 1, recipe = 100;
function storeSerum(amount) { // Determines and executes the 'crafting' of a new drink based on a bubble's value
    serum += parseInt(amount);
    if (serum >= recipe) {
        ++drinks;
        serum -= recipe;
        swatch = document.getElementById("drinks");
        swatch.innerText = "0" + drinks;
        if (drinks > 2) {
            swatch.style.color = "lightgreen";
        } else {
            swatch.style.color = "white";
        }        
        document.getElementById("tagLine").innerText = "You crafted a bubble drink!";
    }
    document.getElementById("serumMonitor").innerText = "Bubble serum: " + serum + "/" + recipe;
}

var boomTile;
function boomProtocol(uCoords) { // Called whenever a mine is revealed during the game
    if (drinks > 0) {
        consumeDrink(uCoords);
    } else {
        isPlaying = false;
        if (movesLeft < 96) { // End game random message
            displayTag("boom");
        } else {
            document.getElementById("tagLine").innerText = "Pff...";
        }
        boomTile = uCoords;
        setTimeout(awaken, 500); // Line 155
        loseDialog(uCoords);
    }
}
sothedMines = 0;
function consumeDrink(uCoords) {
    swatch = document.getElementById("drinks");
    bom = document.getElementById(uCoords);
    displayTag("drink");
    ++sothedMines;
    --drinks;
    ++movesLeft;
    bom.style.backgroundImage = "url(graphics/soothed.svg)";
    updateFlagSwatch(--flagCounter);
    swatch.innerText = "0" + drinks;
    if (drinks == 0) {
        swatch.style.color = "darkred";
    } else {
        if (drinks < 3) {
            swatch.style.color = "white";
        }
    }
}
var wrongFlags = 0;
function awaken() { // Separated from boomProtocol() to convey a brief suspence before ending the game.
    document.getElementById(boomTile).style.backgroundImage = "url(graphics/mine_awaken.svg)";
    let coordIterator = boardCover.keys();
    for (let i = 0; i < 480; i++) { // Mark all erroneous flags for play review purposes.
        let oCoords = coordIterator.next().value;
        if (boardCover.get(oCoords) == "highSus" && boardElements.get(convertCoords(oCoords)) != "mine") {
            document.getElementById(oCoords).style.backgroundImage = "url(graphics/falseFlag.svg)";
            ++wrongFlags;
        }
    }
    calculateScore();
}

function burstProtocol(uCoords) { // Called when revealing a blank/empty tile
    let blanks = [uCoords]; // blanks[] and statuses[] keep track of every blank tile that's encountered during this process.
    let statuses = ["blank"]; // The triggering tile is already included and used as starting point.
    let bSize = 1;
    let allFound = false;
    let animationDelay = 0.0;
    while(allFound == false) {
        allFound = true;
        let focusCoords;
        for (let i = 0; i < bSize; i++) { // Search the records for a blank tile that hasn't yet been processed.
            const uCoords = blanks[i];
            if (statuses[i] == "blank") {
                allFound = false;
                focusCoords = uCoords;
                statuses[i] = "checked";
                boardElements.set(uCoords, "checked");
                break;
            }
        }
        if (allFound == true) {
            displayTag("progress"); 
            break;
        }
        let x = getX(focusCoords); // The tile's coordinates are then use to perform a circular check.
        let y = getY(focusCoords);
        for (let i = 0; i < 8; i++) {
            let drift = driftPattern[i];
            let axis = axisPattern[i];
            switch (axis) {
                case "x": x += drift; break;
                case "y": y += drift; break;
            }
            let uScanCoords = toUnderCoords(x, y);
            if (boardElements.has(uScanCoords)) { // Avoid revealing innexistent tiles (i.e outside of the board edge)
                let result = boardElements.get(uScanCoords);
                let oScanCoords = convertCoords(uScanCoords);
                redundancyCheck = boardCover.get(oScanCoords); // Avoid revealing already-revealed tiles
                if (redundancyCheck != "revealed") {
                    if (redundancyCheck == "highSus") {
                        updateFlagSwatch(++flagCounter);
                    }
                    document.getElementById(oScanCoords).style.opacity = "0%";
                    boardCover.set(oScanCoords, "revealed");
                    --movesLeft; // Update game win condition appropriately.
                    let animatedTile = document.getElementById(uScanCoords); // Apply animation.
                    animationDelay += 0.005;
                    animatedTile.style.animationDelay = animationDelay + "s";
                    animatedTile.style.animationName = "burst";
                }
                if (result == "blank") { // If the examined tile is elligible, it is scheduled for processing.
                    blanks[bSize] = uScanCoords;
                    statuses[bSize++] = "blank";
                }
            }
        }
    }
}

function successProtocol() {
    isPlaying = false;
    displayTag("success");
    let coordIterator = boardCover.keys();
    for (let i = 0; i < 480; i++) { // Remove bubbles and reveal the mines. Game Won.
        let oCoords = coordIterator.next().value;
        if (boardCover.get(oCoords) != "revealed" ) {
            document.getElementById(oCoords).style.transitionDuration = "1200ms";
            document.getElementById(oCoords).style.opacity = "0%";
        } else {
            document.getElementById(convertCoords(oCoords)).style.transitionDuration = "1200ms";
            document.getElementById(convertCoords(oCoords)).style.opacity = "0%";
        }
    }
    calculateScore();
}

function calculateScore() {
    let tactics = drinks / 2 + serum;
    let sneakyness = 99 - flagCounter - wrongFlags;
    let score = tactics + sneakyness;
    let scoreText = "SCORE: " + score + " PTS.";
    let topScore = localStorage.getItem("topScore");
    let serumMonitor = document.getElementById("serumMonitor");
    if (!topScore) {
        localStorage.setItem("topScore", "0");
        topScore = 0;
    }
    if (score > parseInt(topScore)) {
        serumMonitor.innerText = "NEW TOP " + scoreText + " — you beat " + topScore;
        localStorage.setItem("topScore", score);
    } else {
        serumMonitor.innerText = scoreText + " — top score " + topScore;
    }
}
