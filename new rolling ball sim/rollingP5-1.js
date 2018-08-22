let frictionStatic, frictionDynamic, angleRamp, mass;
let forwardForce, reaction, friction;
let starty, startx;
let yPos = 0, xPos = 0, angle = 0, time=0;
let canvas;

function setup() {
    canvas = createCanvas(500, 500);
    canvas.parent("canvas");
    angleMode(DEGREES);
    resetSketch();

}

function resetSketch() {
    updateValues();

    forwardForce=(mass*9.81*sin(angleRamp));
    reaction = mass*9.81*cos(angleRamp);
    friction = 0.5*reaction;

    translate(350, 320);
    starty = -270*tan(angleRamp)-15+(angleRamp/3);
    startx = -230;

    //Block
    noFill();
    background(255);
    strokeWeight(2);
    stroke(0);
    push();
    rectMode(CENTER);
    rotate(angleRamp-0.3);
    rect(-240  , -25 , 30 , 30 );
    pop();

    // Ramp
    noFill();
    line(-250, -270*tan(angleRamp), 0, 0);
    stroke('grey');
    line(0, 0, -100, 0);

    //height
    line(-270, 0, -270, -270*tan(angleRamp));
    line(-270, -270*tan(angleRamp), -260, -270*tan(angleRamp));
    line(-270, -270*tan(angleRamp), -280, -270*tan(angleRamp));
    line(-270, 0, -280, 0);
    line(-260, 0, -280, 0);

    //Axis
    line(0, -250, 0, -200);
    line(0, -200, 50, -200);
    line(-10, -240, 0, -250);
    line(10, -240, 0, -250);
    line(40, -190, 50, -200);
    line(40, -210, 50, -200);

    //Angle
    noFill();
    arc(-3, 0, 70, 70, -180, 180+angleRamp);

    /*---------------------------Forces------------------------------*/
    push();
    rotate(angleRamp);
    arrowReaction();
    arrowFriction();
    arrow();
    pop();

}

function updateValues() {
    mass = parseFloat($("#mass").val());
    angleRamp = parseFloat($("#angle").val());
}

function draw() {
    resetSketch();
    document.getElementById("playButton").value = (isRunning) ? "Reset":"Play";


    starty = -270*tan(angleRamp)-15+(angleRamp/3);
    startx = -230;
    friction = 0.5*reaction;
    reaction = mass*9.81*cos(angleRamp);
    forwardForce=(mass*9.81*sin(angleRamp));

    push();
    rectMode(CENTER);
    rotate(angleRamp-0.3);
    stroke(0);
    rect(-240 + xPos , -25 +(xPos/28), 30 , 30 );
    pop();

    if(isRunning&&(forwardForce>=friction)){
      xPos = (1/2)*((forwardForce-friction)/mass)*time*time;
      time=time+0.1;
    }else{
      xPos=0;
      yPos=0;
      time=0;
    }

    if(xPos >=230) {
      xPos=230;
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
