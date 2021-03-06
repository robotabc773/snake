 // Warn if overriding existing method
  if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
	
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}
                                         
if(Array.prototype.contains)
    console.warn("Overriding existing Array.prototype.contains. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .contains method to Array's prototype to call it on any array
Array.prototype.contains = function (thing) {
    // if the other array is a falsy value, return false
    if (!this)
        return false;
    
    //start by assuming the array doesn't contain the thing
    var result = false;
    for (var i = 0, l=this.length; i < l; i++) 
      {
      //if anything in the array is the thing then change our mind from before
      
      if (this[i] instanceof Array)
        {if (this[i].equals(thing))
          result = true;}
        else
          if (this[i]===thing)
            result = true;
      
    
      } 
     //return the decision we left in the variable, result
    return result;     
}
  
//if(Array.prototype.indexOf)
    //no warnings here because I'm intentionally overriding it, but it should do the same thing in all cases except nested arrays
// attach the .indexOf method to Array's prototype to call it on any array
Array.prototype.indexOf = function (thing) 
  {
    // if the other array is a falsy value, return -1
    if (!this)
        return -1;
    
    //start by assuming the array doesn't contain the thing
    var result = -1;
    for (var i = 0, l=this.length; i < l; i++) 
      {
      //if anything in the array is the thing then change our mind from before
      if (this[i] instanceof Array)
        if (this[i].equals(thing))
          result = i;
        else
          if (this[i]===thing)
            result = i;
      
    
      } 
     //return the decision we left in the variable, result
    return result;
}

var boardWidth = 20;
var boardHeight = 20;
var cellWidth = 20;
var cellHeight = 20;

//Queue of coordinate pairs
var snake = [[0,0]];
//current snake direction (This is Left)
var dir = 2;
//direction to turn snake next update (This is Also Left)
var nextDir = 2;
//How many spaces to grow
var grow = 0;
//Coordinates for food
var food = [Math.ceil(boardWidth/2),Math.ceil(boardHeight/2)];
//canvas for drawing
var canvas = document.getElementById("canvas").getContext("2d");
//The update clock (set in start)
var updateInterval;
//True if game in progress, false otherwise
var isPlaying
//Milliseconds between updates
var speed = 150;

function draw()
{
	$("#canvas")[0].width = cellWidth * boardWidth;
	$("#canvas")[0].height = cellHeight * boardHeight + 20;
	canvas.fillStyle = "blue";
	canvas.strokeStyle = "white";
	canvas.lineWidth = "2"
	
  for(var i = 0; i < boardWidth; i++)
  {
		for(var j = 0; j < boardHeight; j++)
		{
			if(snake.contains([i,j]))
			{
				canvas.fillStyle = "red";
			}
			else if(food.equals([i,j]))
			{
				canvas.fillStyle = "yellow";
			}
			else
			{
				canvas.fillStyle = "blue";
			}
			canvas.fillRect(i*cellWidth,j*cellHeight,cellWidth,cellHeight);
			canvas.strokeRect(i*cellWidth,j*cellHeight,cellWidth,cellHeight);
		}
  }
	canvas.fillStyle = "black";
	canvas.font = "21px Ariel";
	canvas.fillText(snake.length, 0, cellHeight * boardHeight + 20);
}

function update()
{
	dir = nextDir;
	var newPos = addArrayValues(snake[0],getDirVector(dir));
	if(snake.contains(newPos) || newPos[0]==-1 || newPos[0]==boardWidth || newPos[1]==-1 || newPos[1]==boardHeight )
	{
		lose();
		return;
	}
	snake.unshift(newPos);	
	if(grow < 1)
	{
		snake.pop()
	}
	else
	{
		grow--;	
	}
	if(snake[0].equals(food))
	{
		grow+=4;
		do
		{
			food = [Math.floor(Math.random() * boardWidth),Math.floor(Math.random() * boardHeight)]; 
		} while(snake.contains(food))
	}
	draw();
}

function start()
{
	snake = [[0,0]];
	grow = 0;
	dir = 2;
	nextDir = 2;
	do
	{
		food = [Math.floor(Math.random() * boardWidth),Math.floor(Math.random() * boardHeight)]; 
	} while(snake.contains(food))
	updateInterval = setInterval(update,speed);
	isPlaying = true;
	draw();
}
function lose()
{
	isPlaying = false;
	var boardPixelWidth = boardWidth * cellWidth;
	var boardPixelHeight = boardHeight * cellHeight;
	clearInterval(updateInterval);
	canvas.fillStyle = "white";
	canvas.fillRect(boardPixelWidth/2-100, boardPixelHeight/2-50, 200, 100);
	// canvas.fillRect(0,0,400,400);
	canvas.fillStyle = "black";
	canvas.font = "40px Ariel";
	canvas.fillText("YOU LOSE",boardPixelWidth/2-97, boardPixelHeight/2+10);
	canvas.font = "15px Ariel";
	canvas.fillText("Press [Space] to play again", boardPixelWidth/2-80, boardPixelHeight/2+30);
}
	
$(document).keydown(function(event){
	if(event.which == 32)
	{
		if(!isPlaying)
		{
			start();
		}
	}
	if(event.which >= 37 && event.which <= 40)
	{
		var inputDir = event.which - 38;
		if(inputDir == -1) inputDir = 3;
		if((dir+2)%4 != inputDir)
		{
			nextDir = inputDir;
		}
	}
});

function addArrayValues(arr1, arr2)
{
	var temp = [];
	for(i = 0; i < arr1.length; i++)
	{
		temp[i] = arr1[i] + arr2[i];
	}
	return temp;
}

function getDirVector(dir)
{
	switch(dir)
	{
		case 0:
			return [0,-1];
		case 1:
			return [1,0];
		case 2:
			return [0,1];
		case 3:
			return [-1,0];
	}
}

function setSettings()
{
	boardWidth = parseInt($("#boardWidth").val()!=="" ? $("#boardWidth").val() : 20);
	boardHeight = parseInt($("#boardHeight").val()!=="" ? $("#boardHeight").val() : 20);
	cellWidth = Math.ceil(20/boardWidth * 20);
	cellHeight = Math.ceil(20/boardHeight * 20);
	speed = $("#speed").val()!=="" ? 1/parseInt($("#speed").val()) * 150 : 150;
	lose();
	start();
}
	
start();
