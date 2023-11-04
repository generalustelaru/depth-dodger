var isPlaying = false;
var virginMap = true; // A blank board;
var movesLeft = 381; // Counts the number of required clicks before winning (480-99). It updates accordingly on single and multiple (burst) reveals.

(
    function() { // Disable default right click behaviour.
        document.addEventListener('contextmenu', function(menu) { 
            markTile();
            menu.preventDefault();
        });
    }
)()

function startGame() { // Sets up initial conditions not accounting for past plays.
    if (isPlaying == false) {
        startButton = document.getElementById("start")
        startButton.innerText = "Reset";
        startButton.setAttribute("onclick", "resetGame()");
        isPlaying = true;
        absentFlags = 99;
        updateFlagSwatch(absentFlags);
        drinks = 1; // Soothing drinks is a new game mechanism. It makes it easier to solve ambiguous configurations.
        serum = 0; // Every single reveal grants an amount of serum (1~8). 100 serum makes 1 salve.
        document.getElementById("serumMonitor").innerText = "Bubble serum: " + serum + "/" + recipe;
        let swatch = document.getElementById("drinks");
        swatch.innerText = "01";
        swatch.style.color = "white";
        let oCoordIterator = boardCover.keys();
        for (let i = 0; i < 480; i++) { // Enables interactions
            let oCoords = oCoordIterator.next().value;
            let coverTile = document.getElementById(oCoords);
            coverTile.setAttribute("onmouseover", "hover(\"" + oCoords + "\")");
            coverTile.setAttribute("onmouseleave", "leave()");
            coverTile.setAttribute("onclick", "revealTile(\"" + oCoords + "\")");
        }   
    } else {
        resetGame();
    }
}

var activeCoverTile; // hover() and leave() are used exclusively to enable right-clicking on tiles.
function hover(oCoords) {
    activeCoverTile = oCoords; // oCoords refers to coordinates of tiles covering the board (over).
}
function leave() {
    activeCoverTile = "";
}

var absentFlags;
function markTile() { // Right-click behaviour.
    if (isPlaying == true && activeCoverTile != "") {
        let coverStatus = boardCover.get(activeCoverTile); // Map holding the state of each tile covering the board (oCoords).
        let coverTile = document.getElementById(activeCoverTile);
        switch (coverStatus) {
            case "covered": 
                boardCover.set(activeCoverTile, "highSus"); // "highSus" means it's "flagged." Wrong placements get corrected at game end.
                coverTile.style.backgroundImage = "url(graphics/highSus.svg)";
                updateFlagSwatch(--absentFlags);
                break;
            case "highSus":
                boardCover.set(activeCoverTile, "lowSus"); // Secondary flagging. lowSus have no impact.
                coverTile.style.backgroundImage = "url(graphics/lowSus.svg)";
                updateFlagSwatch(++absentFlags);
                break;
            case "lowSus":
                boardCover.set(activeCoverTile, "covered");
                coverTile.style.backgroundImage = "url(graphics/covered.svg)";
                break;
        }
        winCheck();
    }
}

function revealTile(oCoords) { // Left-click on a tile.
    if (boardCover.get(oCoords) != "revealed" && boardCover.get(oCoords) != "highSus") {
        if (isPlaying == true) {
            let uCoords = convertCoords(oCoords); // Having two layers means we often need to access both coordiantes. uCoords is for elements on the board (under).
            if (virginMap == true) {
                virginMap = false;
                populateBoard(uCoords); // Board elements get placed only after the first click (see in main.js).
            }
            let coverTile = document.getElementById(oCoords);
            coverTile.style.opacity = "0%"; // Revealed tiles never trully go away.
            boardCover.set(oCoords, "revealed");
            --movesLeft;
            let tileStatus = boardElements.get(uCoords);
            let bubl = RegExp(/bubl/);
            const revealedTile = document.getElementById(convertCoords(oCoords))
            revealedTile.style.opacity = "100%";
            if (tileStatus.match(bubl)) { // The number of mines surounding the bubble translates into serum
                let extract = RegExp(/\d/);
                let vial = tileStatus.match(extract)[0];
                storeSerum(vial);
                revealedTile.style.animationName = "perturb";
            } else {
                switch (tileStatus) {
                    case "blank":
                        burstProtocol(uCoords); // Reveal all connected blank tiles.
                        break;
                    case "mine":
                        boomProtocol(uCoords); // Use a salve or end the game in a loss.
                        break;
                    default:
                        break;
                }
            }
            winCheck();
        }
    }
}

function winCheck() {
    if (movesLeft == 0 && absentFlags == 0) {
        successProtocol(); // Reveal all hidden mines and end the game in a win.
    }
}
