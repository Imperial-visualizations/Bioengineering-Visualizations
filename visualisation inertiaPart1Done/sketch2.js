//Author: Joao Pereira, Parallel Axis simulation, comments are a good way of procrastinating
let positionTrackerX=902;
let positionTrackerY=287;


function setup() {

	canvas = createCanvas(windowWidth, windowHeight);
	canvas.parent("p5canvas");
	angleMode(DEGREES);
	rectMode(CENTER);
	ellipseMode(CENTER);
}

//arrow code
function arrow(x,y,size,length){
	push();
	translate(x,y);
	beginShape();
	vertex(0,-size/4);
	vertex(-5*length*size,-size/4)
	vertex(-5*length*size,-size);
	vertex(-5*length*size-3*size,0);
	vertex(-5*size*length,size);
	vertex(-5*length*size,size/4);
	vertex(0,size/4);
	endShape(CLOSE);
	pop();
}

function draw(){
clear();
background(255);

//Creating my axis
push();
translate(positionTrackerX,positionTrackerY);
let center=ellipse(0.5,0.5,5,5);
for(i=-10000;i<=10000;i=i+2){
	if(i%4===0){
		line(i,0,i+0.2,0);
	}
}
for(i=-10000;i<=10000;i=i+2){
	if(i%4===0){
		line(0,i,0,i+0.2);
	}
}
pop();
if(mouseIsPressed&&mouseX>positionTrackerX-15&&mouseX<positionTrackerX+15&&mouseY>positionTrackerY-15&&mouseY<positionTrackerY+15){
	positionTrackerX=mouseX;
	positionTrackerY=mouseY;
}

}
