let frictionStatic, frictionDynamic, angleRamp, mass;
let starty, startx;
let yPos = 0, xPos = 0, angle = 0;
let canvas;


function setup() {
    canvas = createCanvas(500, 500);
    canvas.parent("canvas");
    angleMode(DEGREES);
    resetSketch();

}

function resetSketch() {
    updateValues();

    translate(350, 320);
    starty = -270*tan(angleRamp)-15+(angleRamp/3);
    startx = -230;

    //Point mass
    noFill();
    background(255);
    strokeWeight(2);
    stroke(0);
    ellipse(startx + (mass / 2.7), starty - (mass / 2.7), 30 + mass, 30 + mass);

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

    /*if(isShown){
        fill(255, 0, 0);
        text("Normal Force", 130, 60);
        fill(0, 255, 0);
        text("Weight", 95, 150);
        fill(0, 0, 255);
        text("Friction", 20, 40);

        //Reaction
        stroke(255, 0, 0)
        line(134 + (mass / 5), 30 - (mass / 5), 70, 90);
        line(134 + (mass / 5), 30 - (mass / 5), 120, 30);
        line(134 + (mass / 5), 30 - (mass / 5), 135, 45);

        //Weight
        stroke(0, 255, 0);
        line(80, 80, 80, 150 + (mass / 5));
        line(70, 140, 80, 150 + (mass / 5));
        line(90, 140, 80, 150 + (mass / 5));

        //Friction
        stroke(0, 0, 255);
        line(70, 90, 40 - (frictionStatic / 5), 60 - (frictionStatic / 5));
        line(40, 80, 40 - (frictionStatic / 5), 60 - (frictionStatic / 5));
        line(60, 60, 40 - (frictionStatic / 5), 60 - (frictionStatic / 5));
    }*/
}

function updateValues() {
    frictionDynamic = parseFloat($("#frictionDynamic").val());
    frictionStatic = parseFloat($("#frictionStatic").val());
    mass = parseFloat($("#mass").val());
    angleRamp = parseFloat($("#angle").val());
}

function draw() {
    resetSketch();
    document.getElementById("playButton").value = (isRunning) ? "Reset":"Play";


    starty = -270*tan(angleRamp)-15+(angleRamp/3);
    startx = -230;

    if(isRunning){
        if (xPos >= 240 || yPos >= 240) {
            xPos = 240;
            yPos = 240;
        }
        if (frictionStatic > 0) {
            push();
            translate(startx + xPos + (mass / 2.7), starty + yPos - (mass / 2.7));
            rotate(angle);
            ellipseMode(CENTER);
            rectMode(CENTER);
            stroke(0);
            ellipse(0, 0, 30 + mass, 30 + mass);
            fill(0, 110, 175);
            rect(0, 0, 5, 30 + mass);
            angle = angle + 5+angleRamp;
            pop();

            //The ball moves down the slope, moves slower with friction
            xPos = xPos + 1 - frictionDynamic;
            yPos = ((starty+19)/startx)*xPos - frictionDynamic / 100;
        } else {
            stroke(0);
            ellipse(startx + xPos + (mass / 2.7), starty + yPos - (mass / 2.7), 30 + mass, 30 + mass);
            rectMode(CENTER);
            fill(0, 110, 175);
            rect(startx + xPos + (mass / 2.7), starty + yPos - (mass / 2.7), 5, 30 + mass);
            xPos = xPos + 2 - (frictionDynamic / 50);
            yPos = yPos + 2 - (frictionDynamic / 50);
        }
    } else {
        yPos = 0;
        xPos = 0;

    }
}
