//Starting position of ball on the ramp
let yPos = 82;
let xPos = 82;

//Resolving forces start position
let angle = 0;
let angle1 = 0;
let angle2 = 0;
let angle3 = 0;

var isRunning; //For Play and Pause button
var isPressed; //For Reset button
var isResolved; //For Resolved button
var isResolvedPlane; //For 2nd resovled button

var button1, button2, button3, button8;

function setup() {
  createCanvas(windowWidth, windowHeight);

  //Creating sliders and determining position and length
  sliderFriction = createSlider(1, 100, 1);
  sliderFriction.position(650, 130);
  sliderFriction.style('width', '500px');

  sliderFrictionD = createSlider(1, 100, 1);
  sliderFrictionD.position(650, 170);
  sliderFrictionD.style('width', '500px');

  sliderAngle = createSlider(0, 180, 45);
  sliderAngle.position(650, 210);
  sliderAngle.style('width', '500px');

  sliderMass = createSlider(0, 100, 15);
  sliderMass.position(650, 250);
  sliderMass.style('width', '500px');

  //Labels for sliders
  txt = createDiv('Static Friction');
  txt.position(550, 142);

  txt1 = createDiv('Dynamic Friction');
  txt1.position(530, 177);

  txt2 = createDiv('Angle');
  txt2.position(575, 222);

  txt3 = createDiv('Mass');
  txt3.position(575, 262);


  //Run the simulation
  button1 = createButton("Play");
  button1.position(25, 420);
  button1.mousePressed(function() {
    isRunning = true;
  });

  //Pause the sim
  button2 = createButton("Pause");
  button2.position(125, 420);
  button2.mousePressed(function() {
    isRunning = false;
  });

  //Reset the simulation
  button3 = createButton("Reset");
  button3.position(235, 420);
  button3.mousePressed(function() {
    xPos = 82;
    yPos = 82;
  });

  var button4 = createButton("Show Forces");
  button4.position(725, 300);
  button4.mousePressed(function() {
    isPressed = true;
  });

  var button5 = createButton("Hide Forces");
  button5.position(925, 300);
  button5.mousePressed(function() {
    isPressed = false;
    isResolved = false;
    isResolvedPlane = false;

    //Run, Pause and reset buttons appear again and other reset button disappears
    button1.show();
    button2.show();
    button3.show();
    button8.hide();
  });


  var button6 = createButton("Resolve Forces in y and x");
  button6.position(630, 350);
  button6.mousePressed(function() {
    isResolved = true;
  });

  var button7 = createButton("Resolve Forces in Plane");
  button7.position(925, 350);
  button7.mousePressed(function() {
    isResolvedPlane = true;
  });

  button8 = createButton("Reset");
  button8.position(75, 450);
  button8.hide();

  //Labels for forces
  txt3 = createDiv('Normal Force');
  txt3.position(140, 150);
  txt3.style('color', '#ff0000');

  txt4 = createDiv('Weight');
  txt4.position(80, 250);
  txt4.style('color', '#00ff00');

  txt5 = createDiv('Friction');
  txt5.position(30, 100);
  txt5.style('color', '#0000ff');

  angleMode(DEGREES);
}

function draw() {
  //Point mass
  noFill();
  background(255);
  strokeWeight(2);
  stroke(0);
  ellipse(82 + (sliderMass.value() / 2.7), 82 - (sliderMass.value() / 2.7), 30 + sliderMass.value(), 30 + sliderMass.value());

  // Ramp
  noFill();
  line(30, 50, 300, 320);
  line(300, 320, 200, 320);

  //Angle
  arc(300, 320, 70, 70, PI, PI + QUARTER_PI);

  //Unresolved forces
  if (isPressed) {
    //Reaction
    stroke(255, 0, 0)
    line(134 + (sliderMass.value() / 5), 30 - (sliderMass.value() / 5), 70, 90);
    line(134 + (sliderMass.value() / 5), 30 - (sliderMass.value() / 5), 120, 30);
    line(134 + (sliderMass.value() / 5), 30 - (sliderMass.value() / 5), 135, 45);
    txt3.show();

    //Weight
    stroke(0, 255, 0);
    line(80, 80, 80, 150 + (sliderMass.value() / 5));
    line(70, 140, 80, 150 + (sliderMass.value() / 5));
    line(90, 140, 80, 150 + (sliderMass.value() / 5));
    txt4.show();

    //Friction
    stroke(0, 0, 255);
    line(70, 90, 40 - (sliderFriction.value() / 5), 60 - (sliderFriction.value() / 5));
    line(40, 80, 40 - (sliderFriction.value() / 5), 60 - (sliderFriction.value() / 5));
    line(60, 60, 40 - (sliderFriction.value() / 5), 60 - (sliderFriction.value() / 5));
    txt5.show();


  } else {
    txt3.hide();
    txt4.hide();
    txt5.hide();
  }



  //Ball rolling
  if (sliderFriction.value() > 1) {
    if (isRunning) {

      //The circle and rectangle rotates around their centres
      push();
      translate(xPos + (sliderMass.value() / 2.7), yPos - (sliderMass.value() / 2.7));
      rotate(angle);
      ellipseMode(CENTER);
      rectMode(CENTER);
      stroke(0);
      ellipse(0, 0, 30 + sliderMass.value(), 30 + sliderMass.value());
      fill(0, 110, 175);
      rect(0, 0, 5, 30 + sliderMass.value());
      angle = angle + 10;
      pop();

      //The ball moves down the slope, moves slower with friction
      xPos = xPos + 1 - (sliderFrictionD.value() / 50);
      yPos = yPos + 1 - (sliderFrictionD.value() / 50);
    } else {
      //Ball stops at its current position
      xPos = xPos;
      yPos = yPos;
      //Ball stops rolling
      stroke(0);
      ellipse(xPos + (sliderMass.value() / 2.7), yPos - (sliderMass.value() / 2.7), 30 + sliderMass.value(), 30 + sliderMass.value());
      rectMode(CENTER);
      fill(0, 110, 175);
      rect(xPos + (sliderMass.value() / 2.7), yPos - (sliderMass.value() / 2.7), 5, 30 + sliderMass.value());
    }
    //Ball stops at the end of the slope
    if (xPos >= 300 || yPos >= 300) {
      xPos = 300;
      yPos = 300;
    }
  } else {
    //Ball sliding
    stroke(0);
    ellipse(xPos + (sliderMass.value() / 2.7), yPos - (sliderMass.value() / 2.7), 30 + sliderMass.value(), 30 + sliderMass.value());
    rectMode(CENTER);
    fill(0, 110, 175);
    rect(xPos + (sliderMass.value() / 2.7), yPos - (sliderMass.value() / 2.7), 5, 30 + sliderMass.value());
    if (isRunning) {
      //Ball travels slower with friction
      xPos = xPos + 2 - (sliderFrictionD.value() / 50);
      yPos = yPos + 2 - (sliderFrictionD.value() / 50);
    } else {
      xPos = xPos;
      yPos = yPos;
    }
    if (xPos >= 300 || yPos >= 300) {
      xPos = 300;
      yPos = 300;
    }
  }

  if (isResolved) {
    //Buttons for making ball roll disappear
    button1.hide();
    button2.hide();
    button3.hide();
    isPressed = false;

    //zoomed in version of slope with new ball
    fill('white');
    rectMode(CORNER);
    rect(30, 50, 400, 300);
    line(30, 50, 430, 350);
    ellipse(225, 165, 50, 50);

    //Normal force with arrow
    stroke('red');
    line(210, 185, 290, 80);
    line(290, 80, 285, 105);
    line(290, 80, 265, 95);
    //Frictional force with arrow
    stroke('blue');
    line(100, 104, 200, 177);
    line(100, 104, 130, 110);
    line(100, 104, 120, 135);
    //Weight force with arrow
    stroke(0, 255, 0);
    line(225, 165, 225, 300);
    line(225, 300, 235, 280);
    line(225, 300, 215, 280);

    //Forces rotate into position
    push();
    translate(225, 165);
    rotate(-angle);
    stroke(0);
    line(0, 0, 50, -60);
    line(50, -60, 45, -30);
    line(50, -60, 25, -50);
    angle++;
    if (angle >= 36.87) {
      angle = 36.87;
    }
    pop();

    push();
    translate(290, 80);
    rotate(angle1);
    stroke(0);
    line(0, 0, -35, 50);
    line(0, 0, -25, 20);
    angle1 += 2;
    if (angle1 >= 53.13) {
      angle1 = 53.13;
    }
    pop();

    push();
    translate(200, 177);
    rotate(-angle);
    stroke(0);
    line(0, 0, -75, -60);
    line(-75, -60, -45, -50);
    line(-75, -60, -60, -30);
    angle++;
    if (angle >= 36.87) {
      angle = 36.87;
    }
    pop();

    push();
    translate(100, 104);
    rotate(angle1);
    stroke(0);
    line(0, 0, 60, 40);
    line(0, 0, 20, 30);
    angle1++;
    if (angle1 >= 53.13) {
      angle1 = 53.13;
    }
    pop();

    //Reset button
    button8.show();
    button8.mousePressed(function() {
      angle = 0;
      angle1 = 0;
    });
  }

  if (isResolvedPlane) {
    button1.hide();
    button2.hide();
    button3.hide();
    isPressed = false;
    isResolved=false;
    fill('white');
    rectMode(CORNER);
    stroke(0);
    rect(30, 50, 400, 300);
    line(30, 50, 430, 350);
    ellipse(225, 165, 50, 50);

    stroke('red');
    line(210, 185, 290, 80);
    line(290, 80, 285, 105);
    line(290, 80, 265, 95);
    stroke('blue');
    line(100, 104, 200, 177);
    line(100, 104, 130, 110);
    line(100, 104, 120, 135);
    stroke(0, 255, 0);
    line(225, 165, 225, 300);
    line(225, 300, 235, 280);

    push();
    translate(225, 165);
    rotate(angle2);
    stroke(0);
    line(0, 0, 0, 110);
    line(0, 110, -10, 80);
    line(0, 110, 10, 80);
    angle2++;
    if (angle2 >= 36.87) {
      angle2 = 36.87;
    }
    pop();

    push();
    translate(225, 300);
    rotate(-angle3);
    stroke(0);
    line(0, 0, 0, -80);
    line(0, 0, -10, -20);
    line(0, 0, 10, -20);
    angle3 += 2;
    if (angle3 >= 53.13) {
      angle3 = 53.13;
    }
    pop();

    button8.show();
    button8.mousePressed(function() {
      angle2 = 0;
      angle3 = 0;
    });

  }
}
