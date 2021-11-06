
function buildGameUI(width, height, numRows) {
    buildWall(width, height, numRows);
    buildBar(145, 180, 60, 8);
    buildBall(175, 170, 10);
    document.onkeydown = _getKeyPressed;
}

function buildWall(width, height, numRows) {
    /**
     * this function builds a wall with bricks arranged in numRows
     */
    var svgElement = document.getElementsByTagName("svg")[0];
    
    /**
     * First row:
     *  (0,0) B G (55,0) B G (110, 0) B G (165, 0) B G 
     */
     var x = 0
     var y = -35
     for(letRowNum = 1;letRowNum <= 3;letRowNum++)
     {
         
        y = y+35;
        x = 0;
        for(;x <= 325; x=x+55)
            {addBrick(svgElement, x, y);
            }
     }
        
         
     
      
    

}

function addBrick(svgElement, x, y){
    var brickWidth = 50;
    var brickHeight = 30;
    var newRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    newRect.setAttribute("x", x );
    newRect.setAttribute("y", y);
    newRect.setAttribute("width",brickWidth);
    newRect.setAttribute("height",brickHeight);
    newRect.setAttribute("fill", "orange");
    svgElement.appendChild(newRect);
}


function buildBar(x, y, width, height) {
    var svgElement = _getSVGBox();
    var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    // confif rectangle properties
    rect.setAttribute("id", "bar");
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", width);
    rect.setAttribute("height", height);
    rect.setAttribute("fill", "white");
    svgElement.appendChild(rect);
}

function buildBall(cx, cy, r) {
    var svgElement = _getSVGBox();
    var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("id", "ball");
    circle.setAttribute("cx", cx);
    circle.setAttribute("cy", cy);
    circle.setAttribute("r", r);
    circle.setAttribute("fill", "white");
    svgElement.appendChild(circle);
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