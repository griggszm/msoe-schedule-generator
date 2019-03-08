var currentColor = 0;
var colors = ["red", "blue", "orange", "green", "yellow", "brown", "purple", "pink"];
var json = [];

$(document).ready(function () {
    $('#submit').click(function () {
        var data = $('#input').val();
        json = parseInputToJson(data);
        displayInSelect(json, document.getElementById("my_classes"))
    });

    $('#create_schedule').click(function () {
        currentColor = 0;
        var canvas = document.getElementById("myCanvas");
        createImage(json, canvas);
        //window.open(document.getElementById("myCanvas").toDataURL());
    });

    $('#clear').click(function() {
        json = [];
        $("#my_classes").empty();

        var canvas = document.getElementById("myCanvas");
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.backgroundColor = "white";
    });

    $('#add').click(function() {
        var meeting1 = getMeeting('1');
        var meeting2 = getMeeting('2');
        var meeting3 = getMeeting('3');
        var meeting4 = getMeeting('4');
        var meeting5 = getMeeting('5');
        var thisClass = createClass($('#classCode').val(), meeting1, meeting2, meeting3, meeting4, meeting5);
        $('#classCode').val("");
        json.push(thisClass);
        displayInSelect(json, document.getElementById("my_classes"))
    });

    openTab(null, 'autofill')
});

/**
 * Gets one of the manually entered meetings from the index page and clears entered values
 */
function getMeeting(num) {
    var meeting = createMeeting($('#meeting' + num + 'Day').val(), $('#meeting' + num + 'Time').val(), $('#meeting' + num + 'Room').val());
    $('#meeting' + num + 'Room').val("");
    $('#meeting' + num + 'Time').val("");
    $('#meeting' + num +  'Day').val("");
    return meeting;
}

/**
 * Displays current classes in the select-box
 */
function displayInSelect(json, selectBox) {
    $("#my_classes").empty();
    for(var e in json) {
        var entry = json[e];
        var option = document.createElement("option");
        option.text = entry.classcode;
        selectBox.add(option)
    }
}

/**
 * Shows a tab on the tabpage
 * Credit: W3Schools
 */
function openTab(evt, tabId) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabId).style.display = "block";
    evt.currentTarget.className += " active";
}