var yPos = 82;
var xPos = 82;
var angle = 0;
var isRunning;
var isPressed;
var isResolvedPlane;
var txt1, txt2, txt3, txt4, txt5;

function setup() {
  createCanvas(windowWidth, windowHeight);


  sliderFriction = createSlider(1, 100, 1);
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
  var button1 = createButton("Play");
  button1.mousePressed(function() {
    isRunning = true;
  });

  //Pause the sim
  var button2 = createButton("Pause");
  button2.mousePressed(function() {
    isRunning = false;
  });

  //Reset the simulation
  var button3 = createButton("Reset");
  button3.mousePressed(function() {
    xPos = 82;
    yPos = 82;
  });

  var button4 = createButton("Show Forces");
  button4.position(750, 300);
  button4.mousePressed(function() {
    isPressed = true;
  });

  var button5 = createButton("Hide Forces");
  button5.position(950, 300);
  button5.mousePressed(function() {
    isPressed = false;
  });


  var button6 = createButton("Resolve Forces in y and x");
  button6.position(650, 350);
  button6.mousePressed(function() {
  });

  var button7 = createButton("Resolve Forces in Plane");
  button7.position(950, 350);
  button7.mousePressed(function() {
    isResolvedPlane = true;
  });
  angleMode(DEGREES);

  txt3 = createDiv('Normal Force');
  txt3.position(175, 150);
  txt3.style('color', '#ff0000');

  txt4 = createDiv('Weight');
  txt4.position(80, 325);
  txt4.style('color', '#00ff00');

  txt5 = createDiv('Friction');
  txt5.position(30, 150);
  txt5.style('color', '#0000ff');

}

function draw() {
  //Point mass
  fill(0, 110, 175);
  background(255);
  strokeWeight(2);
  stroke(0);
  ellipse(82, 82, 30, 30);

  // Ramp
  noFill();
  triangle(30, 320, 30, 50, 300, 320);

  //Angle
  arc(300, 320, 70, 70, PI, PI + QUARTER_PI);

  //Unresolved forces
  if (isPressed) {
    //Reaction
    stroke(255, 0, 0)
    line(150 + (sliderMass.value() / 5), 30 - (sliderMass.value() / 5), 70, 90);
    line(150 + (sliderMass.value() / 5), 30 - (sliderMass.value() / 5), 140, 25);
    line(150 + (sliderMass.value() / 5), 30 - (sliderMass.value() / 5), 150, 40);
    txt3.show();

    //Weight
    stroke(0, 255, 0);
    line(80, 80, 80, 150 + (sliderMass.value() / 5));
    line(70, 140, 80, 150 + (sliderMass.value()/5));
    line(90, 140, 80, 150+(sliderMass.value()/5))
    txt4.show();

    //Friction
    stroke(0, 0, 255);
    line(70, 90, 40 - (sliderFriction.value() / 5), 60 - (sliderFriction.value() / 5));
    line(40, 80, 40 - (sliderFriction.value() / 5), 60 - (sliderFriction.value() / 5));
    line(60, 60, 40 - (sliderFriction.value() / 5), 60 - (sliderFriction.value() / 5));
    txt5.show();

  /*  if(isResolvedPlane){
      //Resolved weight
      line(80, 80, 80*cos(45), (150 + (sliderMass.value() / 5))*cos(45));
      line(80, 80, 80*sin(45), (150 + (sliderMass.value() / 5))*sin(45));

    }*/
  }else {
    txt3.hide();
    txt4.hide();
    txt5.hide();
  }



  //Ball rolling
  if (sliderFriction.value() > 1) {
    if (isRunning) {
      push();
      translate(xPos, yPos);
      rotate(angle);
      ellipseMode(CENTER);
      rectMode(CENTER);
      stroke(0);
      ellipse(0, 0, 30, 30);
      fill(0, 110, 175);
      rect(0, 0, 5, 30);
      angle=angle+10;
      pop();
      xPos = xPos + 1;
      yPos = yPos + 1;
    } else {
      xPos = xPos;
      yPos = yPos;
      stroke(0);
      ellipse(xPos, yPos, 30, 30);
      rectMode(CENTER);
      fill(0, 110, 175);
      rect(xPos, yPos, 5, 30);
    }
    if (xPos >= 300 || yPos >= 300) {
      xPos = 300;
      yPos = 300;

    }
  } else {
    //Ball sliding
    stroke(0);
    ellipse(xPos, yPos, 30, 30);
    rectMode(CENTER);
    fill(0, 110, 175);
    rect(xPos, yPos, 5, 30);
    if (isRunning) {
      xPos = xPos + 1;
      yPos = yPos + 1;
    } else {
      xPos = xPos;
      yPos = yPos;
    }
    if (xPos >= 300 || yPos >= 300) {
      xPos = 300;
      yPos = 300;
    }
  }
}
