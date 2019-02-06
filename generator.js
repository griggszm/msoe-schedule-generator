$(document).ready(function () {
    $('#submit').click(function () {
        var canvas = document.getElementById("myCanvas");
        var data = $('#input').val();
        var json = parseInputToJson(data);
        createImage(json, canvas);
    });
});

function parseInputToJson(input) {
    // store data we're about to generate
    var data = [];

    // iterate line-by-line, parsing each one
    input = input.replace("\t", "");
    var lines = input.split("\n");
    var newLines = [];
    // remove all of the newlines
    for (var i = 0; i < lines.length; i++) {
        if (lines[i].length >= 1 && lines[i].trim().length >= 1) {
            newLines.push(lines[i].trim());
        }
    }
    var chunks = splitIntoChunks(newLines);
    data = parseAllChunks(chunks);
    return data;
}

function splitIntoChunks(linesArray) {
    //parse this into "chunks" of each class - we delimit them by the +/- to start off each line.
    var chunks = [];
    var currentChunk = "";
    for(var i = 0; i < linesArray.length; i++) {
        var line = linesArray[i];
        if(line.includes("+/-")) {
            //end current chunk, begin new one.
            if(currentChunk.length > 0) {
                chunks.push(currentChunk);
            }
            currentChunk = line;
        } else {
            // if it's a desired line, we'll keep it. the only we dont want are start/end date.
            if(!line.includes("/") || line.includes(" / ")) {
                currentChunk += "\n" + line;
            }
        }
    }
    chunks.push(currentChunk);
    return chunks;
}

function parseAllChunks(chunks) {
    var data = [];
    for(var c in chunks) {
        var chunk = chunks[c]
        var json = parseSingleChunk(chunk);
        data.push(json);
    }
    return data;
}

function parseSingleChunk(chunk) {
    var lines = chunk.split("\n");
    var linesCount = lines.length;
    var data = {};
    var startLine = lines[0];
    var teacher = lines[1];
    var meetingsCount = ((linesCount - 2) / 3);
    var startIndex = 2;
    var meetings = [];
    for(var i = 0; i < meetingsCount; i++) {
        var meeting = {};
        meeting['day'] = lines[startIndex];
        startIndex++;

        meeting['time'] = lines[startIndex];
        startIndex++;

        meeting['startTime'] = meeting['time'].substring(0, meeting['time'].indexOf(" "));
        meeting['amOrPm'] = meeting['time'].substring(1+meeting['time'].lastIndexOf(" "), meeting['time'].length);
        meeting['endTime'] = meeting['time'].substring(2+meeting['time'].indexOf("-"), meeting['time'].lastIndexOf(" "));

        meetings.push(meeting);

    }
    for(var i = 0; i < meetingsCount; i++) {
        meetings[i]['location'] = lines[startIndex];
        meetings[i]['room'] = meetings[i]['location'].substring(1+meetings[i]['location'].lastIndexOf(" "), meetings[i]['location'].length)
        startIndex++;
    }
    data['meeting'] = meetings;
    var classCode = startLine.substring(0, startLine.indexOf(" \t"));
    var section = classCode.substring(1+classCode.lastIndexOf(" "), classCode.length);
    classCode = classCode.substring(3, classCode.lastIndexOf(" "));

    var startLineWithoutCode = startLine.substring(1+startLine.indexOf("\t"), startLine.length);
    var teacherName = startLineWithoutCode.substring(0, startLineWithoutCode.indexOf(" \t"));
    data['section'] = section;
    data['teacherName'] = teacherName;
    data['classcode'] = classCode;
    data['startline'] = startLineWithoutCode;
    data['teacher'] = teacher;
    return data;
}

function createImage(data, canvas) {
    var headerSize = 100;
    var blockSizeWidth = canvas.width / 6;

    drawHeaders(canvas, blockSizeWidth, headerSize);
    var early = getEarliestClassTime(data);
    var late = getLatestClassTime(data);
    var size = determineSize(early, late);
    drawTimes(canvas, early, late, size);
    drawLines(canvas, size);
    for(var js in data) {
        var entry = data[js];
        drawEntry(entry, getNextColor());
    }
}

function drawHeaders(canvas, width, height) {
    // the top (height) of the canvas is designated to display the dates
    // this will go:
    // Times -- Monday -- Tuesday -- Wednesday -- Thursday -- Friday

    // paint the entire part black first
    var ctx = canvas.getContext("2d");
    // ctx.strokeStyle = "black";
    // ctx.fillRect(0, 0, width * 6, height);

    ctx.font = "20px Georgia";
    ctx.strokeStyle = "white";
    ctx.strokeText("hi", 0, 0);

    // now add labels in the center with white text
    var texts = ["Times", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    for(var i = 0; i < texts.size; i++) {
        // find the center of this box
        var centerX = (width * i) + (width / 2);
        var centerY = (height / 2);

        // draw the text
        ctx.strokeStyle = "red";
        ctx.strokeText(texts[i], centerX, centerY);
    }
}

function getEarliestClassTime(data) {

}

function getLatestClassTime(data) {

}

function determineSize(early, late) {

}

function drawTimes(canvas, early, late, size) {

}

function drawLines(canvas, size) {

}

function drawEntry(entry, color) {

}


function getNextColor() {

}