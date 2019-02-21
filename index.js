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