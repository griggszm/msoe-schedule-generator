function createMeeting(day, time, room) {
    if(day === "" || time === "" || room === "") {
        return null;
    }
    var meeting = {};
    meeting['day'] = day;
    meeting['room'] = room;
    meeting['time'] = time;
    if(meeting['time'].includes("AM")) {
        meeting['amOrPm'] = 'AM';
    } else {
        meeting['amOrPm'] = 'PM';
    }
    meeting['time'] = meeting['time'].replace("PM", "").replace("AM", "").replace(/ /g, "");
    meeting['startTime'] = meeting['time'].substring(0, meeting['time'].indexOf("-"));
    meeting['endTime'] = meeting['time'].substring(1+meeting['time'].indexOf("-"), meeting['time'].length);
    return meeting;
}

function createClass(classCode, meeting1, meeting2, meeting3, meeting4, meeting5) {
    var thisClass = {};
    var meetings = [];
    thisClass['classcode'] = classCode;
    if(meeting1 !== null) {
        meetings.push(meeting1);
    }
    if(meeting2 !== null) {
        meetings.push(meeting2);
    }
    if(meeting3 !== null) {
        meetings.push(meeting3);
    }
    if(meeting4 !== null) {
        meetings.push(meeting4);
    }
    if(meeting5 !== null) {
        meetings.push(meeting5);
    }
    thisClass['meeting'] = meetings;
    return thisClass;
}