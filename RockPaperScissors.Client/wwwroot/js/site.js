// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

var connection = new signalR.HubConnectionBuilder().withUrl("/mainHub").build();

connection.on("ReceiveScore", function (score) {
    console.log("Score:")
    console.log(score);

    const name = $("#name").val();
    for (var playerName in score) {
        var playerScore = score[playerName];

        if(playerName === name){
            window.leftScore = playerScore;
            updateLeftScore(playerName);         
        }
        else{
            window.rightScore = playerScore;
            updateRightScore(playerName);            
        }
    }
});

connection.on("ReceiveState", function (state) {
    console.log("State:")
    console.log(state);
    disableButtons();

    const name = $("#name").val();
    for (var playerName in state) {
        var player = state[playerName];
        
        if(playerName !== name){
            window.right = player.selection;
            setRightImageSrc(player.selection+".png");
        }
    }
});

function updateLeftScore(name){
    $("#left-score").text(name + "(" + window.leftScore + ")");
}

function updateRightScore(name){
    $("#right-score").text(name + "(" + window.rightScore + ")");
}

function disableButtons(){
    $("#rock-button, #paper-button, #scissors-button").hide();
}

connection.start().then(function () {
    const name = $("#name").val();
    connection.invoke("Join", name).catch(function (err) {
        return console.error(err.toString());
    });
}).catch(function (err) {
    return console.error(err.toString());
});

window.rock = "rock";
window.paper = "paper";
window.scissors = "scissors";
window.left = window.rock;
window.leftScore = 0;
window.right = window.rock;
window.rightScore = 0;

// Write your JavaScript code.
function setLeftPaper(){
    window.left = window.paper;
    setLeftImageSrc("paper.png");

    const name = $("#name").val();
    connection.invoke("SelectPaper", name).catch(function (err) {
        return console.error(err.toString());
    });
}

function setLeftRock(){
    window.left = window.rock;
    setLeftImageSrc("rock.png");

    const name = $("#name").val();
    connection.invoke("SelectRock", name).catch(function (err) {
        return console.error(err.toString());
    });
}

function setLeftScissors(){
    window.left = window.scissors;
    setLeftImageSrc("scissors.png");

    const name = $("#name").val();
    connection.invoke("SelectScissors", name).catch(function (err) {
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
    window.leftScore++;
    updateLeftScore($("#name").val());
}

function rightWon(){
    $("#result").text("Right Won");
    window.rightScore++;
    updateRightScore("");
}

function draw(){
    $("#result").text("Draw");
}

$("#ready-button").click(function(){
    const name = $("#name").val();
    connection.invoke("Ready", name).catch(function (err) {
        return console.error(err.toString());
    });
});

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