let frictionStatic, frictionDynamic, angleRamp, mass;
let forwardForce, reaction, friction, weight;
let starty, startx;
let yPos = 0, xPos = 0, angle = 0, time=0, time1=0;
let equation1, equation2;
let canvas;
let img;

function setup() {
    canvas = createCanvas(500, 500);
    canvas.parent("canvas");
    angleMode(DEGREES);
    resetSketch();

    //Question
    img = loadImage("question1.jpg");

}

function resetSketch() {
    updateValues();

    forwardForce=(mass*9.81*sin(angleRamp));
    weightCos=(mass*9.81*cos(angleRamp));
    reaction = mass*9.81*cos(angleRamp);
    friction = frictionStatic*reaction;
    weight=mass*9.81;


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
    line(-262, -270*tan(angleRamp), 4, 0);
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
    if(angleRamp===45){
    rotate(-angleRamp);
    weightUnresolved();
  }
    pop();




}

function updateValues() {
    mass = parseFloat($("#mass").val());
    frictionStatic = parseFloat($("#frictionStatic").val());
    angleRamp = parseFloat($("#angle").val());
}

function draw() {
    resetSketch();
    document.getElementById("playButton").value = (isRunning) ? "Reset":"Play";


    starty = -270*tan(angleRamp)-15+(angleRamp/3);
    startx = -230;
    friction = frictionStatic*reaction;
    reaction = mass*9.81*cos(angleRamp);
    forwardForce=(mass*9.81*sin(angleRamp));
    weight=mass*9.81;

    //Block sliding
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
   push();
    fill('blue');
    stroke('blue');
    rotate(-90);
    translate(245, -200);
    beginShape();
    vertex(-235, -5);
    vertex(-245, -5);
    vertex(-245, -70-friction);
    vertex(-255, -70-friction);
    vertex(-240, -90-friction);
    vertex(-225, -70-friction);
    vertex(-235, -70-friction);
    endShape(CLOSE);
    pop();

}

function arrow() {
  fill('green');
  stroke('green');
  push();
  rotate(90);
  translate(235, 245);
  beginShape();
  vertex(-235, -5);
  vertex(-245, -5);
  vertex(-245, -70-forwardForce);
  vertex(-255, -70-forwardForce);
  vertex(-240, -90-forwardForce);
  vertex(-225, -70-forwardForce);
  vertex(-235, -70-forwardForce);
  endShape(CLOSE);
  pop();
}

function weightUnresolved() {
  fill(255,0,0,63);
  noStroke();
  push();
  translate(-350, -320);
  beginShape();
  translate(0, -270*tan(angleRamp));
  vertex(185, 410);
  vertex(185, 510+weight);
  vertex(175, 510+weight);
  vertex(190, 530+weight);
  vertex(205, 510+weight);
  vertex(195, 510+weight);
  vertex(195, 410);
  endShape(CLOSE);
  pop();

}
