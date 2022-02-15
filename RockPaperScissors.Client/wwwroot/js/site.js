// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

var connection = new signalR.HubConnectionBuilder().withUrl("/mainHub").build();

connection.on("ShowResult", function (user, message) {
    console.log("show result");
});

connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

window.rock = "rock";
window.paper = "paper";
window.scissors = "scissors";
window.left = window.rock;
window.right = window.rock;

// Write your JavaScript code.
function setLeftPaper(){
    window.left = window.paper;
    setLeftImageSrc("paper.png");

    connection.invoke("SelectPaper").catch(function (err) {
        return console.error(err.toString());
    });
}

function setLeftRock(){
    window.left = window.rock;
    setLeftImageSrc("rock.png");

    connection.invoke("SelectRock").catch(function (err) {
        return console.error(err.toString());
    });
}

function setLeftScissors(){
    window.left = window.scissors;
    setLeftImageSrc("scissors.png");

    connection.invoke("SelectScissors").catch(function (err) {
        return console.error(err.toString());
    });
}

function setRightPaper(){
    window.right = window.paper;
    setRightImageSrc("paper.png");
}

function setRightRock(){
    window.right = window.rock;
    setRightImageSrc("rock.png");
}

function setRightScissors(){
    window.right = window.scissors;
    setRightImageSrc("scissors.png");
}

function setLeftImageSrc(value){
    $("#left-image").attr("src", value);
}

function setRightImageSrc(value){
    $("#right-image").attr("src", value);
}

$("#rock-button").click(function(){
    setLeftRock();
});

$("#paper-button").click(function(){
    setLeftPaper();
});

$("#scissors-button").click(function(){
    setLeftScissors();
});

function leftWon(){
    $("#result").text("Left Won");
}

function rightWon(){
    $("#result").text("Right Won");
}

function draw(){
    $("#result").text("Draw");
}

$("#winner-button").click(function(){
    if(window.left === window.rock){
        if(window.right === window.rock){
            draw();
        }
        if(window.right === window.paper){
            rightWon();
        }
        if(window.right === window.scissors){
            leftWon();
        }
    }
    if(window.left === window.paper){
        if(window.right === window.rock){
            leftWon();
        }
        if(window.right === window.paper){
            draw();
        }
        if(window.right === window.scissors){
            rightWon();
        }
    }
    if(window.left === window.scissors){
        if(window.right === window.rock){
            rightWon();
        }
        if(window.right === window.paper){
            leftWon();
        }
        if(window.right === window.scissors){
            draw();
        }
    }
});