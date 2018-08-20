
var xPos=0;
var yPos=0;
//Resolving forces start position
let angle = 0;
let angle1 = 0;
let angle2 = 0;
let angle3 = 0;

var isRunning; //For Play and Pause button
var isPressed; //For Reset button
var isResolved; //For Resolved button
var isResolvedPlane; //For 2nd resovled button
var changeShape;

var button1, button2, button3, button6, button7, button8;

function setup() {
  createCanvas(windowWidth, windowHeight);

  //Creating sliders and determining position and length
  sliderFriction = createSlider(1, 100, 1);
  sliderFriction.position(650, 230);
  sliderFriction.style('width', '500px');

  sliderFrictionD = createSlider(1, 100, 1);
  sliderFrictionD.position(650, 270);
  sliderFrictionD.style('width', '500px');

  sliderAngle = createSlider(10, 60, 40);
  sliderAngle.position(650, 310);
  sliderAngle.style('width', '500px');

  sliderMass = createSlider(0, 50, 15);
  sliderMass.position(650, 350);
  sliderMass.style('width', '500px');

  //Labels for sliders
  txt = createDiv('Static Friction');
  txt.position(550, 242);

  txt1 = createDiv('Dynamic Friction');
  txt1.position(530, 277);

  txt2 = createDiv('Angle');
  txt2.position(575, 322);

  txt3 = createDiv('Mass');
  txt3.position(575, 362);




  //Run the simulation
  button1 = createButton("Play");
  button1.position(75, 450);
  button1.mousePressed(function() {
    isRunning = true;
  });

  //Pause the sim
  button2 = createButton("Pause");
  button2.position(175, 450);
  button2.mousePressed(function() {
    isRunning = false;
  });

  //Reset the simulation
  button3 = createButton("Reset");
  button3.position(285, 450);
  button3.mousePressed(function() {
    xPos=0;
    yPos=0;
  });

  var button4 = createButton("Show Forces");
  button4.position(725, 400);
  button4.mousePressed(function() {
    isPressed = true;
  });

  var button5 = createButton("Hide Forces");
  button5.position(925, 400);
  button5.mousePressed(function() {
    isPressed = false;
    isResolved = false;
    isResolvedPlane = false;

    //Run, Pause and reset buttons appear again and other reset button disappears
    button1.show();
    button2.show();
    button3.show();
    button8.hide();
    button6.hide();
    button7.hide();
  });


  button6 = createButton("Resolve Forces in y and x");
  button6.position(630, 450);
  button6.mousePressed(function() {
    isResolved = true;
  });

  button7 = createButton("Resolve Forces in Plane");
  button7.position(925, 450);
  button7.mousePressed(function() {
    isResolvedPlane = true;
  });

  button8 = createButton("Reset");
  button8.position(75, 450);
  button8.hide();



  //Labels for forces
  txt3 = createDiv('Normal Force');
  txt3.position(300, 145);
  txt3.style('color', '#ff0000');

  txt4 = createDiv('Weight');
  txt4.position(250, 360);
  txt4.style('color', '#00ff00');

  txt5 = createDiv('Friction');
  txt5.position(90, 145);
  txt5.style('color', '#0000ff');

  txt6 = createDiv('h');

  txt7=createDiv('y');
  txt7.position(330, 160);
  txt8=createDiv('x');
  txt8.position(370, 200);
  text('Parameters', 550, 150, 20, 30);
  txt9=createDiv('Parameters:');
  txt9.position(550, 170);
  txt9.style('font-size', '35px');

  button6.hide();
  button7.hide();

  angleMode(DEGREES);
  frameRate(45);

}

function draw() {

  translate(350, 320);

  var starty = -270*tan(sliderAngle.value())-15+(sliderAngle.value()/3);
  var startx = -230;
  txt6.show();
  txt7.show();
  txt8.show();

  //Point mass
  noFill();
  background(255);
  strokeWeight(2);
  stroke(0);
  var ball =ellipse(startx + (sliderMass.value() / 2.7), starty - (sliderMass.value() / 2.7), 30 + sliderMass.value(), 30 + sliderMass.value());

  // Ramp
  noFill();
  line(-250, (-270*tan(sliderAngle.value())), 0, 0);
  stroke('grey');
  line(0, 0, -100, 0);

  //Height
  line(-270, 0, -270, -270*tan(sliderAngle.value()));
  line(-270, -270*tan(sliderAngle.value()), -260, -270*tan(sliderAngle.value()));
  line(-270, -270*tan(sliderAngle.value()), -280, -270*tan(sliderAngle.value()));
  line(-270, 0, -280, 0);
  line(-260, 0, -280, 0);
  txt6.position(50, 450-270*tan(sliderAngle.value()));

  //Axis
  line(0, -250, 0, -200);
  line(0, -200, 50, -200);
  line(-10, -240, 0, -250);
  line(10, -240, 0, -250);
  line(40, -190, 50, -200);
  line(40, -210, 50, -200);
  //Angle
  arc(-3, 0, 70, 70, -180, 180+sliderAngle.value());



  //Ball rolling
  if (sliderFriction.value() > 1) {
    if (isRunning) {

      //The circle and rectangle rotates around their centres
      push();
      translate(startx + xPos +(sliderMass.value() / 2.7), starty + yPos - (sliderMass.value() / 2.7));
      rotate(angle);
      ellipseMode(CENTER);
      rectMode(CENTER);
      stroke(0);
      var ball2=ellipse(0, 0, 30 + sliderMass.value(), 30 + sliderMass.value());
      fill(0, 110, 175);
      rect(0, 0, 5, 30 + sliderMass.value());
      angle = angle + 5+(sliderAngle.value()/5);
      yPos = ((starty+19)/startx)*xPos - (sliderFrictionD.value() / 100);
      xPos = xPos + 1 - (sliderFrictionD.value() / 100);
      pop();




    } else {
      //Ball stops at its current position

      xPos = xPos;
      yPos = yPos;
      //Ball stops rolling
      stroke(0);
      var ball3 =ellipse(startx+xPos + (sliderMass.value() / 2.7), starty+yPos - (sliderMass.value() / 2.7), 30 + sliderMass.value(), 30 + sliderMass.value());
      rectMode(CENTER);
      fill(0, 110, 175);
      rect(startx + xPos + (sliderMass.value() / 2.7), starty+yPos - (sliderMass.value() / 2.7), 5, 30 + sliderMass.value());

    }
    //Ball stops at the end of the slope
    if (xPos >= 240 ) {
      xPos = 240;
      yPos = 240;
    }
  } else {
    //Ball sliding
    stroke(0);
    var ball4=ellipse(startx + xPos + (sliderMass.value() / 2.7), starty + yPos - (sliderMass.value() / 2.7), 30 + sliderMass.value(), 30 + sliderMass.value());
    rectMode(CENTER);
    fill(0, 110, 175);
    rect(startx + xPos + (sliderMass.value() / 2.7), starty + yPos - (sliderMass.value() / 2.7), 5, 30 + sliderMass.value());
    if (isRunning) {
      //Ball travels slower with friction
      yPos = ((starty+19)/startx)*xPos - (sliderFrictionD.value() / 100);
      xPos = xPos + 1- (sliderFrictionD.value() / 100);
      console.log(xPos);
      console.log(yPos);
    } else {
      xPos = xPos;
      yPos = yPos;
    }
    if (xPos >= 230) {
      xPos = 230;
    }
  }


  if(isPressed) {
    button1.hide();
    button2.hide();
    button3.hide();
    txt6.hide();
    txt7.hide();
    txt8.hide();
    push();
    translate(-350, -320);
    //zoomed in version of slope with new ball
    fill('white');
    rectMode(CORNER);
    stroke('grey');
    rect(30, 50, 400, 300);
    line(30, 50, 430, 350);
    stroke(0);
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
    pop();

    txt3.show();
    txt4.show();
    txt5.show();
    button6.show();
    button7.show();
  } else{
    txt3.hide();
    txt4.hide();
    txt5.hide();
  }

  if (isResolved) {
    //Buttons for making ball roll disappear
    button1.hide();
    button2.hide();
    button3.hide();
    isPressed = false;
    txt6.hide();
    txt7.hide();
    txt8.hide();
    push();
    translate(-350, -320);
    //zoomed in version of slope with new ball
    fill('white');
    rectMode(CORNER);
    stroke('grey');
    rect(30, 50, 400, 300);
    line(30, 50, 430, 350);
    stroke(0);
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
    pop();
  }

  if (isResolvedPlane) {
    push();
    translate(-350, -320);
    button1.hide();
    button2.hide();
    button3.hide();
    txt6.hide();
    txt7.hide();
    txt8.hide();
    isPressed = false;
    isResolved=false;
    fill('white');
    rectMode(CORNER);
    stroke('grey');
    rect(30, 50, 400, 300);
    line(30, 50, 430, 350);
    stroke(0);
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
    pop();
  }

}
