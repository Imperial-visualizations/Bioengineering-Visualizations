let frictionStatic, frictionDynamic, angleRamp, mass;
let forwardForce, reaction, friction, weight;
let starty, startx;
let yPos = 0, xPos = 0, xPos1=0, angle = 0, time=0, time1=0;
let equation1, equation2;
let canvas;
let img;

function setup() {
    canvas = createCanvas(500, 500);
    canvas.parent("canvas");
    angleMode(DEGREES);
    resetSketch();
    


}

function resetSketch() {
    updateValues();
     scale(1.25);
    forwardForce=(mass*9.81*sin(angleRamp));
    weightCos=(mass*9.81*cos(angleRamp));
    reaction = mass*9.81*cos(angleRamp);
    friction = frictionStatic*reaction;
    weight=mass*9.81;


    translate(350, 250);
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
    rect(-240  , -25 , 30 , 30);
    line(-240,-25,-240*cos(angleRamp),30);
    fill(0);
    ellipse(-240*cos(angleRamp), 30, 10, 10);
    line(-240, -40, -240, -10);
    line(-255, -25, -225, -25);
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
    fill(0);
    text('h', -300, (-270*tan(angleRamp))/2 )


    //Angle
    noFill();
    arc(-3, 0, 70, 70, -180, 180+angleRamp);




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
    friction = 0.2*reaction;
    reaction = mass*9.81*cos(angleRamp);
    forwardForce=(mass*9.81*sin(angleRamp));
    weight=mass*9.81;
    let x=((-133680*tan(angleRamp))-217440)/((6480*tan(angleRamp)*tan(angleRamp))-(6480*tan(angleRamp))+1463);
    let y=((270*tan(angleRamp))/266)*(x-4);
    let d1=dist(x, y, -225, -10);
    console.log(d1);
    if(isRunning&&d1<316) {

    push();
    rectMode(CENTER);
    rotate(angleRamp-0.3);
    translate(-240+xPos, -25);
    rotate(angle);
    rect(0, 0, 30 , 30 );
    rotate(-angle);
    line(0, 0, 50*cos(angleRamp),30);
    fill(0);
    ellipse(50*cos(angleRamp), 30, 10, 10);

    angle=angle+5;
    xPos = (1/2)*((forwardForce-friction)/mass)*time*time;
    time=time+0.1;
    if(xPos>=230){
      xPos=0;
      angle=0;
      time=0;
    }
    pop();
  }

    push();
    rotate(angleRamp);
    axis();
    pop();

}





function axis() {
  stroke(125);
  push();
  translate(-200, 100);
  line(0, -250, 0, -200);
  line(0, -200, 50, -200);
  line(-10, -240, 0, -250);
  line(10, -240, 0, -250);
  line(40, -190, 50, -200);
  line(40, -210, 50, -200);
  fill(0);
  text('y', -20, -240);
  text('x', 50, -180);
  pop();
}
