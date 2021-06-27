

function updateFlagSwatch(counter) { // There are enough different circumstances for this to be a dedicated function
    let counterString;
    let mineCount = document.getElementById("mineCount");
    if (-1 < counter && counter < 10) {
        counterString = "0" + counter;
    } else {
        counterString = counter;
    }
    if (counter < 0) {
        mineCount.style.color = "red";
    } else {
        mineCount.style.color = "white";
    }
    mineCount.innerText = counterString;

}

function getX(coords) { // Used in circular tile checks (populateBoard() and cascadeProtocol())
    let extractX = RegExp(/^\d+/);
    return parseInt(coords.match(extractX));
}
function getY(coords) {
    let extractY = RegExp(/\d+$/);
    return parseInt(coords.match(extractY));
}

function toUnderCoords(x, y) { // Used to reassemble coordinates in circular tile checks
    return x + "u" + y;
}
function toOverCoords(x, y) {
    return x + "o" + y;
}

function convertCoords(coords) { // used extensively throughout for accessing stacked tiles
    let plane = RegExp(/[uo]/);
    if (coords.match(plane) == "o") {
        return getX(coords) + "u" + getY(coords);
    } else {
        return getX(coords) + "o" + getY(coords);
    }
}

function displayTag(type) { // A series of 'surprise' messages delivered at certain moments.
    let boomCollection = [
        "Are these mines or puffer fish?...",
        "It's probably the high pressure to blame.",
        "Good grief!",
        "Let's name this one Nemo.",
        "Why are mines down here anyway?",
        "Well, at least you lasted somewhat.",
        "Darnit! And you had so much of it figured out!",
        "OwO",
        "Ahh! That's tough luck. Really.",
        "Maybe you should have brought more drinks."
    ];
    let successCollection = [
        "True to the Name. Congratulations!",
        "Good job! We can now sneak past them.",
        "Great job! keep quiet though.",
        "All sleeping?! What was the point then?",
        "Phew! Good thing you got through this.",
    ];
    let progressCollection = [
        "Good!",
        "It's coming along nicely",
        "Great going, kid!",
        "Nice!",
        "Oh, wow!",
        "Nice find!",
        "Would you look at that!",
        "Yes!",
        "No such thing as too many bursts.",
        "What a nice suprise!"
    ]
    let drinkCollection = [
        "You quickly spill the concoction onto the mine's hull.",
        "The batch slips out of your hand but currents take it towards the mine.",
        "You were prepared. The mine now seems content.",
        "Flawless administering!",
        "The mine, thankfully, leaves you alone.",
        "Quick thinking lets you administer the substance before the mine can react.",
        "This mine seems to be enjoying it more than usual!",
        "One more happy mine, one extra chance at life for you.",
        "You give it the drink, but wonder about its effects.",
        "Ah, that's a fair trade.",
        "Bubble drink administered! You're safe."
    ]
    let collection;
    switch (type) {
        case "boom":
            collection = boomCollection;
            break;
        case "drink":
            collection = drinkCollection;
            break;
        case "progress":
            collection = progressCollection;
            break;
        case "success":
            collection = successCollection;
            break;
    }
    picker = Math.floor(Math.random() * collection.length);
    let tagLine = collection[picker];
    document.getElementById("tagLine").innerText = tagLine;
}

function loseDialog(uCoords) {
    /*let gameArea = document.getElementById("gameArea");
    let bombTile = document.getElementById(uCoords);
    let left = bombTile.offsetLeft;
    let top = bombTile.offsetTop;

    let dialog = document.createElement("div");
    dialog.innerText = "Did you bring me anything?";
    dialog.id = "dialog";
    dialog.offsetLeft = left;
    dialog.offsetTop = top;
    let body = document.querySelector("body");
    gameArea.append(dialog);*/
    
    console.log("left: " + left + ", top: " + top);
    console.log("Did you bring me anything?");
}
