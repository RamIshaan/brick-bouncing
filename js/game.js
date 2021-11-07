
class Game {

    constructor(width, height) {
        this.boardWidth = width;
        this.boardHeight = height;
        this.brickHeight = 30;
        this.brickWidth = 50;
        this.brickColor = "orange";
        this.brickGap = 5;
        this.numRows = 4;
        this.barWidth = 2*this.brickWidth;
        this.barHeight = 10;
        this.barColor = "white";
        this.ballColor = "red";
        this.ballRadius = 12;
        this.svgElement = document.getElementsByTagName("svg")[0];

        this.buildGameUI();
    }

    start() {}
    pause() {}

    buildGameUI(){
        this.buildWall();
        this.buildBar();
        this.buildBall();
    }

    buildWall() {
        /**
         * First row:
         *  (0,0) B G (55,0) B G (110, 0) B G (165, 0) B G 
         */
         var x = 0;
         var y = -(this.brickHeight+this.brickGap);
         for(let rowNum = 1; rowNum <= this.numRows;  rowNum++)
         {   
            y = y+this.brickHeight+this.brickGap;
            x = 0;
            for(;x <= this.boardWidth; x=x+this.brickWidth+this.brickGap){
                this.addBrick( x, y);
            }
         }
    }
    
    addBrick( x, y){
        var newRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        newRect.setAttribute("x", x );
        newRect.setAttribute("y", y);
        newRect.setAttribute("width", this.brickWidth);
        newRect.setAttribute("height", this.brickHeight);
        newRect.setAttribute("fill", this.brickColor);
        this.svgElement.appendChild(newRect);
    }

    buildBar() {
       
        var x  = this.boardWidth/2 - this.barWidth/2;
        var y = this.boardHeight - 2*this.barHeight;

        var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        // confif rectangle properties
        rect.setAttribute("id", "bar");
        rect.setAttribute("x", x);
        rect.setAttribute("y", y);
        rect.setAttribute("width", this.barWidth);
        rect.setAttribute("height", this.barHeight);
        rect.setAttribute("fill", this.barColor);
        this.svgElement.appendChild(rect);
    }

    buildBall() {
        var cx = this.boardWidth/2;
        var cy = this.boardHeight - 2*this.barHeight - this.ballRadius;
        var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("id", "ball");
        circle.setAttribute("cx", cx);
        circle.setAttribute("cy", cy);
        circle.setAttribute("r", this.ballRadius);
        circle.setAttribute("fill", this.ballColor);
        this.svgElement.appendChild(circle);
    }

}





function buildGameUI(width, height, numRows) {
    buildWall(width, height, numRows);
    buildBar(145, 180, 60, 8);
    buildBall(175, 170, 10);
    document.onkeydown = _getKeyPressed;
}









// helper functions
function _getSVGBox(){
    return document.getElementsByTagName("svg")[0];
}

function _getBar(){
    return document.getElementById("bar");
}

function _getBall(){
    return document.getElementById("ball");
}



function _getKeyPressed(event){
    if(event.keyCode == 37){
        _moveBarLeft();
    }
    if(event.keyCode == 39){
        _moveBarRight();
    }
    if(event.keyCode == 32){
        setInterval(_moveBall, 50);
    }

}

function _moveBarLeft(){
    var bar = _getBar();
    var x = parseInt(bar.getAttribute("x"));
    var newXPosition = Math.max(0, x-10);
    bar.setAttribute("x", newXPosition);
}

function _moveBarRight(){
    var bar = _getBar();
    var x = parseInt(bar.getAttribute("x"));
    var width = parseInt(bar.getAttribute("width"));
    var xEnd = x+width;
    var newXEnd = Math.min(325, xEnd+10);
    var newX = newXEnd-width;
    bar.setAttribute("x", newX);

}

function _moveBall(){
    var ball = _getBall();
    var oldCy = parseInt(ball.getAttribute("cy"));
    var r = parseInt(ball.getAttribute("r"));
    var newCy = oldCy-r;
    if (newCy <= 0) {
        ball.setAttribute("cy", 200);
    } 
    else {
        ball.setAttribute("cy", newCy);
    }
}