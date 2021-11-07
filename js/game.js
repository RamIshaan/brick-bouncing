
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
            setInterval(this.moveBall.bind(this), this.gameProgressInterval);
        }
    }

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
        var x = parseInt(this.bar.getAttribute("x"));
        var newXPosition = Math.max(0, x-this.barShiftBy);
        this.bar.setAttribute("x", newXPosition);
    }

    moveBarRight(){
        var x = parseInt(this.bar.getAttribute("x"));
        var xEnd = x + this.barWidth;
        var newXEnd = Math.min(this.boardWidth, xEnd + this.barShiftBy);
        var newX = newXEnd - this.barWidth;
        this.bar.setAttribute("x", newX);
    
    }

    moveBall(){
        
        var oldCy = parseInt(this.ball.getAttribute("cy"));
        var newCy = oldCy - this.ballRadius;
        if (newCy <= 0) {
            this.ball.setAttribute("cy", this.boardHeight);
        } 
        else {
            this.ball.setAttribute("cy", newCy);
        }
    }

}





// helper functions




