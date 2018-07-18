
var value = 255;

var yPos = 82;
var xPos = 82;

var runButton = document.getElementById("Run");
var resetButton = document.getElementById("Reset");

var sliderFriction;

function setup() {
	createCanvas(windowWidth, windowHeight);
  frameRate(80);

	sliderFriction = createSlider(1, 100, 50);
	sliderFriction.position(750, 170);


	sliderAngle = createSlider(0, 180, 45);
	sliderAngle.position(750, 210);

	sliderMass = createSlider(0, 100, 5);
	sliderMass.position(750, 250);

	txt = createDiv('Friction');
  txt.position(670, 182);


	txt1 = createDiv('Angle');
	txt1.position(670, 222);

	txt2 = createDiv('Mass');
	txt2.position(670, 262);

	//Run the simulation
 	var button = createButton("Run");
 	//button.mousePressed(runSketch);

 	//Reset the simulation
   var button = createButton("Reset");
 	//button.mousePressed(resetSketch);


}
/*
function runSketch() {
			//Point Mass
			fill(0, 110, 175);
			background(255);
			yPos = yPos + 1;
	    xPos = xPos + 1;
	    if (yPos > 320) {
	       noFill();
	       noStroke();
		     yPos = 320;

	      }

	    if (xPos > 300) {
	      noFill();
	      noStroke();
	      xPos = 300;
	      }

	   ellipse(xPos , yPos, 30, 30);
	}
}

function resetSketch() {
	xPos = 50;
	yPos = 50;
}*/

function draw() {
	//Point mass
 	fill(0, 110, 175);
	background(255);
	strokeWeight(2);
	stroke(0);
	ellipse(xPos, yPos, 30, 30);
	// Ramp
	noFill();
 	triangle(30, 320, 30, 50, 300, 320);

	//Angle
 	arc(300, 320, 70, 70, PI, PI + QUARTER_PI);

	//forces
	strokeWeight(3);
	stroke(255, 0, 0);
	line(150, 30+(sliderMass.value()/5), 70, 90); //Reaction

	line(80, 80, 80, 150+(sliderMass.value()/5)); //Weight

	line(70, 90, 40-(sliderFriction.value()/5), 60-(sliderFriction.value()/5)); // Friction


	text = createDiv('Reaction Force');
	text.position(160, 120);

	//resetSketch();
	//runSketch();

}
