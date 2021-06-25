var boardElements = new Map();
var boardFog = new Map();

function drawGameBoard() {
    let gameBoard = document.createElement("div");
    gameBoard.id = "gameBoard";
    for (let x = 0; x < 16; x++) {
        let row = document.createElement("div");
        row.className = "row";
        for (let y = 0; y < 30; y++) {
            // cellContainer: Holds two overlapping elements
            let cellContainer = document.createElement("div");            
            cellContainer.className = "cellContainer";
            row.appendChild(cellContainer);
            //
            let cell = document.createElement("div");            
            cell.className = "cell";
            let coords = x + "u" + y;
            cell.id = coords;
            cell.style.zIndex = "1";
            boardElements.set(coords, "blank");
            cellContainer.appendChild(cell);
            //
            let coverCell = document.createElement("div");            
            coverCell.className = "coverCell";
            let coverCoords = x + "o" + y;
            coverCell.id = coverCoords;
            coverCell.style.zIndex = "9";
            coverCell.style.backgroundImage = "url(graphics/cover.svg)";
            boardFog.set(coverCoords, "covered");
            cellContainer.appendChild(coverCell);
        }
        gameBoard.appendChild(row);
    }
    document.getElementById("gameArea").appendChild(gameBoard);
}

function populate(startCoords) {
    // console.log("populate" + startCoords);
    let mines = 99;
    let cells = 480;
    while (mines > 0) {
        var coordIterator = boardElements.keys();
        for (let i = 0; i < 480; i++) {
            let coords = coordIterator.next().value;
            if (coords == startCoords || boardElements.get(coords) == "mine") {
                continue;
            }
            let dieRoll = Math.random();
            if (dieRoll <= mines / cells) {
                boardElements.set(coords, "mine");
                document.getElementById(coords).style.backgroundImage = "url(graphics/mine.svg)";
                --mines;
            }
            boardFog.set(coords, "covered");
            --cells;
        }
    }
    var coordIterator = boardElements.keys();
    for (let i = 0; i < 480; i++) {
        let coords = coordIterator.next().value;
        if (boardElements.get(coords) == "mine") {
            continue;
        }
        let proximityCount = 0;
        let x = getX(coords);
        let y = getY(coords);

        if (boardElements.get(toUnderCoords(--x, y)) == "mine")
            ++proximityCount;
        if (boardElements.get(toUnderCoords(x, --y)) == "mine")
            ++proximityCount;
        if (boardElements.get(toUnderCoords(++x, y)) == "mine")
            ++proximityCount;
        if (boardElements.get(toUnderCoords(++x, y)) == "mine")
            ++proximityCount;
        if (boardElements.get(toUnderCoords(x, ++y)) == "mine")
            ++proximityCount;
        if (boardElements.get(toUnderCoords(x, ++y)) == "mine")
            ++proximityCount;
        if (boardElements.get(toUnderCoords(--x, y)) == "mine")
            ++proximityCount;
        if (boardElements.get(toUnderCoords(--x, y)) == "mine")
            ++proximityCount;
        if (proximityCount > 0) {
            boardElements.set(coords, "bubl");
            document.getElementById(coords).style.backgroundImage = "url(graphics/bubl" + proximityCount + ".svg)";
            //document.getElementById(coords).style.backgroundImage = "url(graphics/mine.svg)";
        }
    }
    //reveal(convertCoords(startCoords));
}

function revealCascade(uCoords) {
    // console.log("revealCascade");
    let axisProgression = ["x", "y", "x", "x", "y", "y", "x", "x"];
    let driftProgression = [-1, -1, 1, 1, 1, 1, -1, -1];
    let blanks = [uCoords];
    let statuses = ["blank"];
    let bSize = 1;
    let allFound = false;
    while(allFound == false) {
        allFound = true;
        let focusCoords;
        for (let i = 0; i < bSize; i++) {
            const uCoords = blanks[i];
            //console.log("array uCoords " + uCoords);
            if (statuses[i] == "blank") {
                allFound = false;
                focusCoords = uCoords;
                statuses[i] = "busted";
                boardElements.set(uCoords, "busted");
                //document.getElementById(convertCoords(uCoords)).style.opacity = "0%";
                break;
            }
        }
        if (allFound == true) {
            displayTag("progress"); 
            break;
        }
        //console.log("focusCoords " + focusCoords);
        let x = getX(focusCoords);
        let y = getY(focusCoords);
        for (let i = 0; i < 8; i++) {
            let drift = driftProgression[i];
            let axis = axisProgression[i];
            switch (axis) {
                case "x": x += drift; break;
                case "y": y += drift; break;
            }
            let uScanCoords = toUnderCoords(x, y);
            //console.log("scanCoords " + uScanCoords);
            if (boardElements.has(uScanCoords)) {
                let result = boardElements.get(uScanCoords);
                let oScanCoords = convertCoords(uScanCoords);
                redundancyCheck = boardFog.get(oScanCoords);
                //redundancyCheck = document.getElementById(oScanCoords).style.opacity;
                if (redundancyCheck != "revealed") {
                    document.getElementById(oScanCoords).style.opacity = "0%";
                    boardFog.set(oScanCoords, "revealed");
                    --movesLeft;
                }
                if (result == "blank") {
                    blanks[bSize] = uScanCoords;
                    statuses[bSize++] = "blank";
                }
            }
        }
    }
}

var boomCell;
function boomProtocol(uCoords) {
    gameStatus = false;
    if (movesLeft < 191) {
        displayTag("boom");
    } else {
        document.getElementById("tagLine").innerText = "Try and try again";
    }
    boomCell = uCoords;
    setTimeout(awaken, 250);    
    console.log("continue");
}
function awaken() {
    console.log("awaken");
    document.getElementById(boomCell).style.backgroundImage = "url(graphics/mine_awaken.svg)";
    let coordIterator = boardFog.keys();
    for (let i = 0; i < 480; i++) {
        let oCoords = coordIterator.next().value;
        if (boardFog.get(oCoords) == "sus" && boardElements.get(convertCoords(oCoords)) != "mine") {
            document.getElementById(oCoords).style.backgroundImage = "url(graphics/falseFlag.svg)";
        }
    }
}

function successProtocol() {
    gameStatus = false;
    displayTag("success");
    //alert("Game Won");
    let coordIterator = boardFog.keys();
    for (let i = 0; i < 480; i++) {
        let oCoords = coordIterator.next().value;
        if (boardFog.get(oCoords) != "revealed" ) {
            document.getElementById(oCoords).style.transitionDuration = "1200ms";
            document.getElementById(oCoords).style.opacity = "0%";
        } else {
            document.getElementById(convertCoords(oCoords)).style.transitionDuration = "1200ms";
            document.getElementById(convertCoords(oCoords)).style.opacity = "0%";
        }
    }
}