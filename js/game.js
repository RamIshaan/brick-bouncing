
class Game {

    constructor(width, height) {
        this.boardWidth = width;
        this.boardHeight = height;
        
        this.brickHeight = 30;
        this.brickWidth = 50;
        this.brickColor = "orange";
        this.brickGap = 5;
        this.numRows = 6;
        
        this.barWidth = 2*this.brickWidth;
        this.barHeight = 10;
        this.barShiftBy = 10;
        this.barColor = "white";

        this.ballColor = "red";
        this.ballRadius = 12;
        this.ballMoveBy = this.ballRadius / 2;
        this.ballDirection = "up";
        this.ballTimer = null;

        // game elements
        this.svgElement = document.getElementsByTagName("svg")[0];
        this.bar = null;
        this.ball = null;

        this.gameInProgress = false;
        this.gameProgressInterval = 30;

        this.buildGameUI();
        // TODO: undertsand JS closures better
        document.onkeydown = this.handleKeyPressed(this);
    }

    start() {
        if (!this.gameInProgress) {
            this.gameInProgress = true;
            this.ballTimer = window.setInterval(this.play.bind(this), this.gameProgressInterval);
        }
    }

    stop() {
        if (this.gameInProgress) {
            this.gameInProgress = false;
            window.clearInterval(this.ballTimer);
        }
    }

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
        newRect.setAttribute("id", new Date().getTime()+"_"+x);
        newRect.setAttribute("x", x );
        newRect.setAttribute("y", y);
        newRect.setAttribute("width", this.brickWidth);
        newRect.setAttribute("height", this.brickHeight);
        newRect.setAttribute("fill", this.brickColor);
        newRect.setAttribute("class", "brick");
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
        this.bar = rect;
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
        this.ball = circle;
        this.svgElement.appendChild(circle);
    }

    handleKeyPressed(self){
        return function eventHandler(event) {
            if(event.keyCode == 37){
                self.moveBarLeft();
            }
            if(event.keyCode == 39){
                self.moveBarRight();
            }
            if(event.keyCode == 32){
                self.start();
            }
        }
    }

    moveBarLeft(){
        if (this.gameInProgress) {
            var x = parseInt(this.bar.getAttribute("x"));
            var newXPosition = Math.max(0, x-this.barShiftBy);
            this.bar.setAttribute("x", newXPosition);
        }
    }

    moveBarRight(){
        if (this.gameInProgress) {
            var x = parseInt(this.bar.getAttribute("x"));
            var xEnd = x + this.barWidth;
            var newXEnd = Math.min(this.boardWidth, xEnd + this.barShiftBy);
            var newX = newXEnd - this.barWidth;
            this.bar.setAttribute("x", newX);
        }
    }

    play(){
        this.moveBall(); 
        if(this.collideBricks() 
            || this.collideGameBar() 
            || this.collideTopWall()
            || this.collideLeftWall()
            || this.collideRightWall()){
            
                this.changeBallDirection();
        }
        else if (this.collideBottomWall()) {
            this.stop();
        }
    }

    changeBallDirection(){
        if(this.ballDirection == "up") {
            this.ballDirection = "down";
        } else if (this.ballDirection == "down") {
            this.ballDirection = "up";
        } else if (this.ballDirection == "lup") {
            this.ballDirection = "rup";
        } else if (this.ballDirection == "rup") {
            this.ballDirection = "lup";
        }else if (this.ballDirection == "ldown") {
            this.ballDirection = "rdown";
        }else if (this.ballDirection == "rdown") {
            this.ballDirection = "ldown";
        }
    }

    moveBall(){
        var oldCx = parseInt(this.ball.getAttribute("cx"));
        var oldCy = parseInt(this.ball.getAttribute("cy"));
        var newCx = oldCx;
        var newCy = oldCy;
        if(this.ballDirection == "lup") {
            newCx = oldCx - this.ballMoveBy;
            newCy = oldCy - this.ballMoveBy;
        } else if (this.ballDirection == "ldown") {
            newCx = oldCx - this.ballMoveBy;
            newCy = oldCy + this.ballMoveBy;
        } else if (this.ballDirection == "rup") {
            newCx = oldCx + this.ballMoveBy;
            newCy = oldCy - this.ballMoveBy;
        } else if (this.ballDirection == "rdown") {
            newCx = oldCx + this.ballMoveBy;
            newCy = oldCy + this.ballMoveBy;
        } else if (this.ballDirection == "up") {
            newCx = oldCx;
            newCy = oldCy - this.ballMoveBy;
        } else if (this.ballDirection == "down") {
            newCx = oldCx;
            newCy = oldCy + this.ballMoveBy;
        }

        // TODO: ball border checks
        this.ball.setAttribute("cx", newCx);
        this.ball.setAttribute("cy", newCy);
    }

    getBallCoordinates(){
        var cx = parseInt(this.ball.getAttribute("cx"));
        var cy = parseInt(this.ball.getAttribute("cy"));
        var cxLow = cx - this.ballRadius;
        var cxHigh = cx + this.ballRadius;
        var cyLow = cy - this.ballRadius;
        var cyHigh = cy + this.ballRadius;
        return [cxLow, cxHigh, cyLow, cyHigh];
    }

    collideBricks(){
        var coordinates = this.getBallCoordinates();
        var cxLow = coordinates[0];
        var cxHigh = coordinates[1];
        var cyLow = coordinates[2];
        var cyHigh = coordinates[3];

        var bricksHit = false;

        var allBricks = document.getElementsByClassName("brick");
        for(let brickNum = 0; brickNum < allBricks.length; brickNum++) {
            var brick = allBricks[brickNum];
            var xLow = parseInt(brick.getAttribute("x"));
            var xHigh = xLow + this.brickWidth;
            var yLow = parseInt(brick.getAttribute("y"));
            var yHigh = yLow + this.brickHeight;
            if(this.collides(xLow, xHigh, yLow, yHigh, cxLow, cxHigh, cyLow, cyHigh)){
                brick.parentNode.removeChild(brick);
                bricksHit = true;
            }
        }

        return bricksHit;
    }

    collideLeftWall(){
        var coordinates = this.getBallCoordinates();
        var cxLow = coordinates[0];
        var cxHigh = coordinates[1];
        var cyLow = coordinates[2];
        var cyHigh = coordinates[3];

        var xLow = -this.ballRadius;
        var xHigh = 0;
        var yLow = 0;
        var yHigh = this.boardHeight;

        return this.collides(xLow, xHigh, yLow, yHigh, cxLow, cxHigh, cyLow, cyHigh);
    }

    collideRightWall(){
        var coordinates = this.getBallCoordinates();
        var cxLow = coordinates[0];
        var cxHigh = coordinates[1];
        var cyLow = coordinates[2];
        var cyHigh = coordinates[3];

        var xLow = this.boardWidth;
        var xHigh = this.boardWidth + this.ballRadius;
        var yLow = 0;
        var yHigh = this.boardHeight;

        return this.collides(xLow, xHigh, yLow, yHigh, cxLow, cxHigh, cyLow, cyHigh);
    }

    collideTopWall(){
        var coordinates = this.getBallCoordinates();
        var cxLow = coordinates[0];
        var cxHigh = coordinates[1];
        var cyLow = coordinates[2];
        var cyHigh = coordinates[3];

        var xLow = 0;
        var xHigh = this.boardWidth;
        var yLow = -this.ballRadius;
        var yHigh = 0;

        return this.collides(xLow, xHigh, yLow, yHigh, cxLow, cxHigh, cyLow, cyHigh);
    }

    collideBottomWall(){
        var coordinates = this.getBallCoordinates();
        var cxLow = coordinates[0];
        var cxHigh = coordinates[1];
        var cyLow = coordinates[2];
        var cyHigh = coordinates[3];

        var xLow = 0;
        var xHigh = this.boardWidth;
        var yLow = this.boardHeight;
        var yHigh = this.boardHeight + this.ballRadius;

        return this.collides(xLow, xHigh, yLow, yHigh, cxLow, cxHigh, cyLow, cyHigh);
    }

    collideGameBar(){
        var coordinates = this.getBallCoordinates();
        var cxLow = coordinates[0];
        var cxHigh = coordinates[1];
        var cyLow = coordinates[2];
        var cyHigh = coordinates[3];

        var xLow = parseInt(this.bar.getAttribute("x"));
        var xHigh = xLow + this.barWidth;
        var yLow = parseInt(this.bar.getAttribute("y"));
        var yHigh = yLow + this.barHeight;
        if(this.collides(xLow, xHigh, yLow, yHigh, cxLow, cxHigh, cyLow, cyHigh)){
            return true;
        }
        else {
            return false;
        }
    }

    collides(xLow, xHigh, yLow, yHigh, cxLow, cxHigh, cyLow, cyHigh){
        var xInRange = (cxLow >= xLow && cxLow <= xHigh) || (cxHigh >= xLow && cxHigh <= xHigh);
        var yInRange = (cyLow >= yLow && cyLow <= yHigh) || (cyHigh >= yLow && cyHigh <= yHigh);
        return xInRange && yInRange;
    }

}
