var currentColor = 0;
var colors = ["red", "blue", "orange", "green", "yellow", "brown", "purple", "pink"];

$(document).ready(function () {
    $('#submit').click(function () {
        currentColor = 0;
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


        if(meeting['time'].includes("AM")) {
            meeting['amOrPm'] = 'AM';
        } else {
            meeting['amOrPm'] = 'PM';
        }
        meeting['time'] = meeting['time'].replace("PM", "").replace("AM", "").replace(/ /g, "");
        meeting['startTime'] = meeting['time'].substring(0, meeting['time'].indexOf("-"));
        meeting['endTime'] = meeting['time'].substring(1+meeting['time'].indexOf("-"), meeting['time'].length);

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
    var headerSize = 30;
    var blockSizeWidth = canvas.width / 6;
    var blockHeight = 60;


    var times = getFirstLastClassTime(data);
    var early = times[0];
    var late = times[1];
    var size = determineSize(early, late, blockHeight);
    canvas.height = size + headerSize;
    canvas.style.backgroundColor = "silver";
    drawHeaders(canvas, blockSizeWidth, headerSize);
    drawTimes(canvas, early, late, blockHeight, headerSize);
    for(var js in data) {
        var entry = data[js];
        drawEntry(canvas, entry, getNextColor(), early, blockSizeWidth, blockHeight);
    }

}

function drawHeaders(canvas, width, height) {
    // the top (height) of the canvas is designated to display the dates
    // this will go:
    // Times -- Monday -- Tuesday -- Wednesday -- Thursday -- Friday

    // paint the entire part black first
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "gray";
    ctx.fillRect(0, 0, width * 6, height);

    ctx.font = "14px Arial";
    ctx.strokeStyle = "white";

    // now add labels in the center with white text
    var texts = ["Times", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    // offsets to center text. done experimentally.
    var offsets = [40, 28, 35, 25, 28, 37];
    for(var i = 0; i < texts.length; i++) {
        // find the center of this box
        var centerX = (width * i) + (offsets[i]);
        var centerY = (height / 2) + 5;

        // add the vertical line for this day.
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.moveTo(width * i, 0);
        ctx.lineTo(width * i, canvas.height);
        ctx.stroke();

        // draw the text
        ctx.strokeStyle = "white";
        ctx.strokeText(texts[i], centerX, centerY);
    }
}

function increaseBy12Hours(time) {
    if(time !== 12) {
        time += 12;
    }
    return time;
}

function getFirstLastClassTime(data) {
    var earliestTime = 99;
    var latestTime = -1;
    for(var c in data) {
        var singleClass = data[c];
        for(var m in singleClass['meeting']) {
            var meeting = singleClass['meeting'][m];
            var meetingTime = Number(meeting.startTime.substring(0, meeting.startTime.indexOf(":")));
            var meetingTime2 = Number(meeting.endTime.substring(0, meeting.endTime.indexOf(":"))) + 1;
            meetingTime = Number(meetingTime);
            if(meeting['amOrPm'] === "PM") {
                meetingTime = increaseBy12Hours(meetingTime);
                meetingTime2 = increaseBy12Hours(meetingTime2);
            }
            if(meetingTime < earliestTime) {
                earliestTime = meetingTime;
            }
            if(meetingTime2 > latestTime) {
                latestTime = meetingTime2;
            }
        }
    }
    return [earliestTime-1,latestTime+1];
}

function determineSize(early, late, blockHeight) {
    return (late-early) * blockHeight;
}

function drawTimes(canvas, early, late, size, headerSize) {
    // paint the entire part gray first
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "gray";
    ctx.fillRect(0, 0, 116, canvas.height);

    // first horizontal line
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(0, headerSize);
    ctx.lineTo(canvas.width, headerSize);
    ctx.stroke();
    for(var i = early; i < late; i++) {
        var text;
        if(i <= 12) {
            text = i + ":00 AM";
        } else {
            text = (i - 12) + ":00 PM"
        }

        drawTime(canvas, text, 30, headerSize + (size * (i-early)), size);
    }
}

function drawTime(canvas, time, x, y, size) {
    // draw a single time on the x/y of the canvas


    var ctx = canvas.getContext("2d");

    // find the center of this box
    var centerX = x;
    var centerY = y + (size/2);

    // add the horizontal line for this time.
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(0, y + size);
    ctx.lineTo(canvas.width, y + size);
    ctx.stroke();

    // draw the text
    ctx.strokeStyle = "white";
    ctx.strokeText(time, centerX, centerY);
}

function drawEntry(canvas, entry, color, early, blockWidth, blockHeight) {
    var name = entry.classcode;
    var meetings = entry.meeting;
    for(var m in meetings) {
        var meeting = meetings[m];
        drawMeeting(canvas, meeting, name, meeting.room, color, early, blockWidth, blockHeight);
    }
}

function drawMeeting(canvas, meeting, text, text2, color, early, blockWidth, blockHeight) {
    for (var i = 0; i < meeting.day.length; i++) {
        var day = meeting.day.charAt(i);
        var start = Number(meeting.startTime.substring(0, meeting.startTime.indexOf(":")));
        var end = 1 + Number(meeting.endTime.substring(0, meeting.endTime.indexOf(":")));
        if(meeting['amOrPm'] === "PM") {
            start = increaseBy12Hours(start);
            end = increaseBy12Hours(end);
        }
        drawColorAndText(canvas,text,text2, day, start, end, color, early, blockWidth, blockHeight);
    }
}

function drawColorAndText(canvas,text,text2, day, start, end, color, early, blockWidth, blockHeight) {
    var x0 = dayToCoordinate(day, blockWidth);
    var x1 = x0 + blockWidth;
    var y0 =  blockHeight/2 + hourToCoordinate(start, blockHeight, early);
    var y1 = blockHeight/2 + hourToCoordinate(end, blockHeight, early);

    // first block color
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = color;
    ctx.fillRect(x0, y0, x1-x0, y1-y0);

    // now text
    // draw the text
    var centerX = ((x0 * 2) + x1) / 3;
    var centerY = ((y0 * 2) + y1) / 3;
    ctx.strokeStyle = "black";
    ctx.strokeText(text, centerX, centerY);
    ctx.strokeText(text2, centerX + 5, centerY+20);
}

function dayToCoordinate(day, blockWidth) {
    var dayRepresentation;
    if(day === 'M') {
        dayRepresentation = 1;
    } else if(day === 'T') {
        dayRepresentation = 2;
    } else if(day === 'W') {
        dayRepresentation = 3;
    } else if(day === 'R') {
        dayRepresentation = 4;
    } else if(day === 'F') {
        dayRepresentation = 5;
    }
    return dayRepresentation * blockWidth;
}

function hourToCoordinate(hour, blockHeight, startTime) {
    return (hour - startTime) * blockHeight;
}

function getNextColor() {
    var color = colors[currentColor];
    currentColor++;
    return color;
}