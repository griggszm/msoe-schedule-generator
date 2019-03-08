/**
 * First function called, this is the main function to convert to a json object.
 */
function parseInputToJson(input) {
    // variable for data we're about to generate
    var data = [];

    // iterate line by line, trimming whitespace
    var lines = input.split("\n");
    var newLines = [];
    // remove all of the newlines
    for (var i = 0; i < lines.length; i++) {
        if (lines[i].length >= 1 && lines[i].trim().length >= 1) {
            newLines.push(lines[i].trim());
        }
    }
    var chunks = splitByClass(newLines);
    data = convertClassesToJson(chunks);
    return data;
}

/**
 * Splits the given input into multiple sections, each representing one class.
 * This is not in json format yet, just the same text input as we had before in multiple parts.
 */
function splitByClass(linesArray) {
    //parse this into sections of each class - we delimit them by the +/- to start off each line.
    var classes = [];
    var currentClass = "";
    for(var i = 0; i < linesArray.length; i++) {
        var line = linesArray[i];
        if(line.includes("+/-")) {
            //end current class, begin new one.
            if(currentClass.length > 0) {
                classes.push(currentClass);
            }
            currentClass = line;
        } else {
            // if it's a desired line, we'll keep it. the only we dont want are start/end date.
            if(!line.includes("/") || line.includes(" / ")) {
                currentClass += "\n" + line;
            }
        }
    }
    classes.push(currentClass);
    return classes;
}

/**
 * Calls helper method for each text class, to make it into a json class.
 */
function convertClassesToJson(classes) {
    var data = [];
    for(var c in classes) {
        var singleClass = classes[c]
        var json = classToJson(singleClass);
        data.push(json);
    }
    return data;
}

/**
 * Converts this class into a json representation of the text.
 */
function classToJson(chunk) {
    var lines = chunk.split("\n");
    var linesCount = lines.length;
    var data = {};
    var startLine = lines[0];
    var meetingsCount = ((linesCount - 2) / 3);
    var startIndex = 2;
    var meetings = [];
    for(var i = 0; i < meetingsCount; i++) {
        var meeting = {};
        meeting['day'] = lines[startIndex];
        startIndex++;

        meeting['time'] = lines[startIndex];
        startIndex++;

        // assume AM unless given PM
        if(meeting['time'].includes("PM")) {
            meeting['amOrPm'] = 'PM';
        } else {
            meeting['amOrPm'] = 'AM';
        }

        meeting['time'] = meeting['time'].replace("PM", "").replace("AM", "").replace(/ /g, "");
        meeting['startTime'] = meeting['time'].substring(0, meeting['time'].indexOf("-"));
        meeting['endTime'] = meeting['time'].substring(1+meeting['time'].indexOf("-"), meeting['time'].length);

        meetings.push(meeting);

    }
    for(var i = 0; i < meetingsCount; i++) {
        var location = lines[startIndex];
        meetings[i]['room'] = location.substring(1+location.lastIndexOf(" "), location.length);
        startIndex++;
    }
    data['meeting'] = meetings;
    var classCode = startLine.substring(0, startLine.indexOf(" \t"));
    classCode = classCode.substring(3, classCode.lastIndexOf(" "));

    // remove tabs from class code section
    data['classcode'] = classCode.replace(/\t/g, "");
    return data;
}