//Author: Joao Pereira, Parallel Axis simulation, comments are a good way of procrastinating

//Position tracker variables for dragging the axis
let posTrackerY=150;
let posTrackerX=670;
let posTrackerX2=670;
let posTrackerY2=150;
//Variables used
let angle=0;
let icm;
var width,height,radius,mass;


function setup() {

	canvas = createCanvas(900, 500);
	canvas.parent("p5canvas");
	angleMode(DEGREES);
	rectMode(CENTER);
	ellipseMode(CENTER);
}


//function that draws dotted circle representing circular path that the shapes would follow
function circularPath(x,y){
let radius=Math.sqrt(((670-x)^2)+((150-y)^2));
for(i=0;i<=360;i++){
	push();
	rotate(i);
	if(i%2===0){
		line(670-x,150-y,670-x,148-y);
	}
	pop();
}
}

//slider display function
function vals() {

document.getElementById('widthDisplay').innerHTML = document.getElementById('width').value;
document.getElementById('heightDisplay').innerHTML = document.getElementById('height').value;
document.getElementById('radiusDisplay').innerHTML = document.getElementById('radius').value;
document.getElementById('massDisplay').innerHTML = document.getElementById('mass').value;

}

//Deals with attaching selector options to events
function selector(){
	var w = document.getElementById('width').value;
	var h = document.getElementById('height').value;
	var r = document.getElementById('radius').value;
	var m = document.getElementById('mass').value;

	fill(255,0,0);
	switch(parseFloat(document.getElementById("select").value)) {
    case 1:{
		rect(0,0,15*w,15*h);
		icm=(1/12)*m*((h*h)+(w*w));}
        break;
    case 2:{
		ellipse(0,0,15*r,15*r);
		icm=(0.5)*m*(r*r);}
        break;
		case 3:{
		icm=0.5*m*(r*r);
		ellipse(0,0,15*r,15*r);
		push();
		fill(255);
		ellipse(0,0,13.5*r,13.5*r);
		pop();}
				break;
		case 4:{
		ellipse(0,0,15*r,15*r);
		icm = (2/3)*m*(r*r);}
				break;
		case 5:{
		ellipse(0,0,15*r,15*r);
		icm=(2/3)*m*(r*r);}
		break;
		case 6:{
		ellipse(0,0,15*r,15*r);
		icm=(2/5)*m*(r*r);}
		break;
    default:{
		rect(0,0,15*w,15*h);
		icm=(1/12)*m*((h*h)+(w*w));
	}
}
if(parseFloat(document.getElementById("select").value)===1){
	document.getElementById('recDisplay').style.display='block';
	document.getElementById('roundDisplay').style.display='none';
	}
else{
	document.getElementById('recDisplay').style.display='none';
	document.getElementById('roundDisplay').style.display='block';
	}
	document.getElementById('icm').innerHTML=Math.round(icm*100)/100;
}


function draw(){
	//Determines whether parameters have changed so that clicker returns to original position
	if((width!==document.getElementById('width').value)||(height!==document.getElementById('height').value)||(radius!==document.getElementById('radius').value)){
	posTrackerX2=670;
	posTrackerY2=150;
}
	//Variables for proper rotation of shapes
	let angle=Math.atan((150-posTrackerY)/(670-posTrackerX))*180/3.14;
	let rad=Math.sqrt(((670-posTrackerX)*(670-posTrackerX))+((150-posTrackerY)*(150-posTrackerY)))/15;
	let radius2=Math.sqrt(((670-mouseX)*(670-mouseX))+((150-mouseY)*(150-mouseY)));
	width = document.getElementById('width').value;
	height = document.getElementById('height').value;
	radius = document.getElementById('radius').value;
	mass = document.getElementById('mass').value;

clear();
background(255);
//Making it so shapes 'obey' new axis of rotation
push();
translate(posTrackerX,posTrackerY);
//Code that allows axis of rotation and point mass marker to be dragged

push();
	fill(0);
	ellipse(0,0,7,7);
pop();
//Conditional statement that limits dragger to remain within the boundaries
if(mouseX<894&&mouseX>5&&mouseY<496&&mouseY>6){
if(mouseX>posTrackerX-30&&mouseX<posTrackerX+30&&mouseY>posTrackerY-30&&mouseY<posTrackerY+30){
	$('#p5canvas').css("cursor","grab");
	if(mouseIsPressed){
		$('#p5canvas').css("cursor","grabbing");
		posTrackerX=mouseX;
		posTrackerY=mouseY;
	}
}
else{
	$('#p5canvas').css("cursor","default");
}
}
pop();

//calling upon selector function to know which shape to draw
push();
translate(670,150);
rotate(angle);
vals();
selector();
pop();

//calling circularPath
push();
translate(posTrackerX,posTrackerY);
circularPath(posTrackerX,posTrackerY);
pop();

//Important displayed values
	let md2=mass*rad*rad;
	document.getElementById('md2').innerHTML=Math.round(100*md2)/100;
	let iTot=icm+md2;
	document.getElementById('iTot').innerHTML=Math.round(100*iTot)/100;
}
