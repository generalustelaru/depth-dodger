

function updateFlagSwatch(counter) { // There are enough different circumstances for this to be a dedicated function
    let counterString;
    let swatch = document.getElementById("mineCount");
    if (counter >= 0) {
        swatch.style.color = "white";
        if (counter < 10) {
            counterString = "0" + counter;
        } else {
            counterString = counter;
        }
        swatch.innerText = counterString;    
    } else {
        swatch.innerText = "00";
        swatch.style.color = "red";
    }
    
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

function convertCoords(coords) { // used extensively throught to access stacked tiles
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
        "Maybe you should have brought more salves."
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
        "Great going, kid! Don't get cocky.",
        "Nice!",
        "Oh, wow!",
        "Nice find!",
        "Would you look at that!",
        "Yes!",
        "No such thing as too many bursts.",
        "What a nice suprise!"
    ]
    let collection;
    switch (type) {
        case "boom":
            collection = boomCollection;
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

