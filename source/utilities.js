function getX(coords) {
    let extractX = RegExp(/\d+(?=[uo])/);
    return parseInt(coords.match(extractX));
}
function getY(coords) {
    let extractY = RegExp(/(?<=[uo])\d+/);
    return parseInt(coords.match(extractY));
}

function toUnderCoords(x, y) {
    return x + "u" + y;
}

function toOverCoords(x, y) {
    return x + "o" + y;
}

function convertCoords(coords) {
    //console.log("convertCoords"); 
    let plane = RegExp(/[uo]/);
    //console.log("from " + coords);
    if (coords.match(plane) == "o") {
        return getX(coords) + "u" + getY(coords);
        //console.log("to " + getX(coords) + "u" + getY(coords));
    } else {
        return getX(coords) + "o" + getY(coords);
        //console.log("to " + getX(coords) + "o" + getY(coords));
    }
}

function displayTag(type) { //boom, success
    console.log("tagLine");
    let boomCollection = [
        "Are these mines or depth charges?...",
        "It's probably the high pressure to blame.",
        "Good grief!",
        "Let's name this one Nemo.",
        "Why are there mines down here anyway?",
        "Well, at least you didn't fudge it sooner",
        "Darnit! You blew it!",
        "OwO",
        "Ahh! Tough luck. But at least the mine looks cute.",
        "That's clearly an invitation to try again."
    ];
    let successCollection = [
        "True to the Name. Congratulations!",
        "Good job! We can now sneak past them.",
        "Great job! keep quiet though.",
        "All sleeping?! What was the point then?",
        "Phew, good thing you got through this.",
    ];
    let progressCollection = [
        "Good!",
        "It's coming along nicely",
        "Great going kid! Don't get cocky.",
        "Nice!",
        "Oh, wow!",
        "Nice move!",
        "Would you look at that!",
        "Yes!",
        "No such thing as too many cascades.",
        "That was a good move."
    ]
    let dangerCollection = [ //NOT USED
        "Yikes!",
        "Careful now...",
        "How many?!",
        "It must be a family reunion",
        "Let's... try somwhere else",
    ]
    let collection;
    switch (type) {
        case "boom":
            collection = boomCollection;
            break;
        case "progress":
            collection = progressCollection;
            break;
        case "danger":
            collection = dangerCollection;
            break;
        case "success":
            collection = successCollection;
            break;
    }
    picker = Math.floor(Math.random() * collection.length);
    console.log(picker);
    let tagLine = collection[picker];
    document.getElementById("tagLine").innerText = tagLine;
}