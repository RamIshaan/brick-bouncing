
function buildWall(width, height, numRows) {
    /**
     * this function builds a wall with bricks arranged in numRows
     */
    var svgElement = document.getElementsByTagName("svg")[0];
    
    /**
     * First row:
     *  (0,0) B G (55,0) B G (110, 0) B G (165, 0) B G 
     */
    
    var x = 0;
    var y = 0;
    while (numRows > 0) {
        while(x < 325) {
            addBrick(svgElement, x, y);
            x = x + 55;
        }
        
        x = 0;
        y = y + 35;

        numRows = numRows -1;
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
