var xPos = 0;
var yPos = 0;

var isRunning; //For Play and Pause button
var isPressed; //For Reset button

var button1, button2, button3l
var forwardForce, reaction, friction;

var time=0;
var time1=0;
var time2=0;
var time3=0;


function setup() {
  createCanvas(windowWidth, windowHeight);

/*------------------------------------Sliders--------------------------------------*/

  sliderFriction = createSlider(1, 100, 1);
  sliderFriction.position(650, 170);
  sliderFriction.style('width', '350px');

  sliderAngle = createSlider(10, 50, 40);
  sliderAngle.position(650, 230);
  sliderAngle.style('width', '350px');

  sliderForce= createSlider(5, 100, 5);
  sliderForce.position(650, 290);
  sliderForce.style('width', '350px');

  sliderMass = createSlider(5, 20, 5);
  sliderMass.position(650, 350);
  sliderMass.style('width', '350px');


  //Labels for sliders
  txt = createDiv('Static Friction');
  txt.position(550, 180);

  txt2 = createDiv('Angle');
  txt2.position(575, 240);

  txt3 = createDiv('Applied Force');
  txt3.position(550, 300);

  txt4 = createDiv('Mass');
  txt4.position(575, 360);

  /*-------------------------------Buttons-----------------------------------------*/

  //Run the simulation
  button1 = createButton("Play");
  button1.position(75, 450);
  button1.mousePressed(function() {
    isRunning = true;
  });


  //Reset the simulation
  button3 = createButton("Reset");
  button3.position(200, 450);
  button3.mousePressed(function() {
    isRunning=false;
    xPos = 0;
    yPos = 0;
    time3=0;
  });

  //Ask question
  button4 = createButton("Question");
  button4.position(1000, 550);


/*----------------------------Small additions to page---------------------------*/
  txt6 = createDiv('h');

  txt7 = createDiv('y');
  txt7.position(330, 160);
  txt8 = createDiv('x');
  txt8.position(370, 200);
  text('Parameters', 550, 150, 20, 30);
  txt9 = createDiv('Parameters:');
  txt9.position(550, 100);
  txt9.style('font-size', '35px');

  angleMode(DEGREES);
  frameRate(15);

}

function draw() {

  translate(350, 320);

  var starty = -270 * tan(sliderAngle.value());
  var startx = -210;

  forwardForce=(sliderMass.value()*9.81*sin(sliderAngle.value()))+sliderForce.value();
  reaction = sliderMass.value()*9.81*cos(sliderAngle.value());
  friction = (sliderFriction.value()/100)*reaction;

  /*---------------------------Values of forces--------------------------------*/

  let d1 = dist(mouseX, mouseY, -240, -5);
  console.log(d1);
    if(time!==0){
      equation1.hide();
    }
    if(d1<540){
    equation1 = createDiv('F= ' +forwardForce);
    equation1.position(250, 250);
    time++;
  }

  if(time1!==0){
    equation2.hide();
  }
  if(d1<540) {
    equation2 = createDiv('N= ' +reaction);
    equation2.position(200, 100);
    time1++;
  }


  if(time2!==0){
    equation3.hide();
  }
  if(d1<540){
    equation3=createDiv('Fr= ' + friction);
    equation3.position(50, 125);
    time2++;
  }



/*--------------------------------------Block on Ramp---------------------------------*/
  //Rectangle
  noFill();
  background(255);
  strokeWeight(2);
  stroke(0);
  push();
  rectMode(CENTER);
  rotate(sliderAngle.value()-0.3);
  rect(-240  , -25 , 30 , 30 );
  pop();

  // Ramp
  noFill();
  line(-255, (-270 * tan(sliderAngle.value())), 0, 0);
  stroke('grey');
  line(0, 0, -100, 0);

  //Height
  line(-270, 0, -270, -270 * tan(sliderAngle.value()));
  line(-270, -270 * tan(sliderAngle.value()), -260, -270 * tan(sliderAngle.value()));
  line(-270, -270 * tan(sliderAngle.value()), -280, -270 * tan(sliderAngle.value()));
  line(-270, 0, -280, 0);
  line(-260, 0, -280, 0);
  txt6.position(50, 450 - 270 * tan(sliderAngle.value()));

  //Axis
  line(0, -250, 0, -200);
  line(0, -200, 50, -200);
  line(-10, -240, 0, -250);
  line(10, -240, 0, -250);
  line(40, -190, 50, -200);
  line(40, -210, 50, -200);
  //Angle
  arc(-3, 0, 70, 70, -180, 180 + sliderAngle.value());

  /*-----------------------------Forces-------------------------------------------------------------*/

  push();
  rotate(sliderAngle.value());
  arrowReaction();
  arrowFriction();
  arrow();
  pop();

  /*----------------------------Block sliding-------------------------------------*/
  push();
  rectMode(CENTER);
  rotate(sliderAngle.value()-0.3);
  stroke(0);
  rect(-240 + xPos , -25 +(xPos/28), 30 , 30 );
  pop();
  if (isRunning&&(forwardForce>=friction)) {
    xPos = (1/2)*((forwardForce-friction)/sliderMass.value())*time3*time3;
    time3=time3+0.1;
    console.log(time3++)

  } else {
    xPos = xPos;
    yPos = yPos;
  }
  if (xPos >= 230) {
    xPos = 230;
  }


}

function arrowReaction() {
  fill('red');
  stroke('red');
  beginShape();
  vertex(-235, -5);
  vertex(-245, -5);
  vertex(-245, -70-reaction);
  vertex(-255, -70-reaction);
  vertex(-240, -90-reaction);
  vertex(-225, -70-reaction);
  vertex(-235, -70-reaction);
  endShape(CLOSE);

}

function arrowFriction() {
    fill('blue');
    stroke('blue');
    beginShape();
    vertex(-240, -5);
    vertex(-320-friction, -5);
    vertex(-320-friction, 5);
    vertex(-340-friction,-10);
    vertex(-320-friction, -25);
    vertex(-320-friction, -15);
    vertex(-240, -15);
    endShape(CLOSE);

}

function arrow() {
  fill('green');
  stroke('green');
  beginShape();
  vertex(-240, -5);
  vertex(-180+forwardForce, -5);
  vertex(-180+forwardForce, 5);
  vertex(-160+forwardForce, -10);
  vertex(-180+forwardForce, -25);
  vertex(-180+forwardForce, -15);
  vertex(-240, -15);
  endShape(CLOSE);
}
