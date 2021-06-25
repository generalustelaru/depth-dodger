var gameStatus = false;
var virginMap = true;
var movesLeft = 381; // 480-99 (381)

(
    function() {
        document.addEventListener('contextmenu', function(menu) {
            markCell();
            menu.preventDefault();
        });
    }
)()

function startGame() {
    if (gameStatus == false) {
        startButton = document.getElementById("start")
        startButton.innerText = "Reset";
        startButton.setAttribute("onclick", "resetGame()");
        gameStatus = true; 
        let oCoordIterator = boardFog.keys();
        for (let i = 0; i < 480; i++) {
            let oCoords = oCoordIterator.next().value;
            let coverCell = document.getElementById(oCoords);
            coverCell.setAttribute("onmouseover", "hover(\"" + oCoords + "\")");
            coverCell.setAttribute("onmouseleave", "leave()");             
            coverCell.setAttribute("onclick", "reveal(\"" + oCoords + "\")");
        }   
    } else {
        resetGame();
    }
}

var activeCell; //for right clicking
function hover(oCoords) {
    activeCell = oCoords;
}

function leave() {
    activeCell = "";
}

function markCell() { // Right click
    if (gameStatus == true && activeCell != "") {
        //console.log("markCell " + activeCell + " " + boardFog.get(activeCell));
        let coverStatus = boardFog.get(activeCell);
        let coverCell = document.getElementById(activeCell);
        switch (coverStatus) {
            case "covered": 
                boardFog.set(activeCell, "sus");
                coverCell.style.backgroundImage = "url(graphics/sus.svg)";
                break;
            case "sus":
                boardFog.set(activeCell, "lowSus");
                coverCell.style.backgroundImage = "url(graphics/lowSus.svg)";
                break;
            case "lowSus":
                boardFog.set(activeCell, "covered");
                coverCell.style.backgroundImage = "url(graphics/covered.svg)";
                break;
        }
    }
}

function reveal(oCoords) { // Left Click
    if (boardFog.get(oCoords) != "revealed") {
        if (gameStatus == true) {
            //console.log("reveal");
            let uCoords = convertCoords(oCoords);
            if (virginMap == true) {
                virginMap = false;
                //console.log(uCoords);
                populate(uCoords);
            }
            let coverCell = document.getElementById(oCoords);
            coverCell.style.opacity = "0%";
            boardFog.set(oCoords, "revealed");
            --movesLeft;
            let cellStatus = boardElements.get(uCoords);
            switch (cellStatus) {
                case "blank": revealCascade(uCoords); break;
                case "mine": boomProtocol(uCoords); break;
                default: break;
            }
            //console.log(movesLeft);
            if (movesLeft == 0) {
                successProtocol();
            }       
        }
    }
    
}
function resetGame() { 
    document.getElementById("tagLine").innerText = "A New Daring Adventure!";
    document.getElementById("gameArea").innerHTML = "";
    virginMap = true;
    movesLeft = 381; // 480-99 (381)
    boardElements = new Map();
    boardFog = new Map();    
    drawGameBoard();
    //let startButton = document.getElementById("start");
    //startButton.setAttribute("onclick", "startGame()");
    //startButton.innerText = "Start";
    gameStatus = false;
    startGame();

}