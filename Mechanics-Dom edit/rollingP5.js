let frictionStatic, frictionDynamic, angleRamp, mass;
let yPos = 82, xPos = 82, angle = 0;
let canvas;

function setup() {
    canvas = createCanvas(500, 500);
    canvas.parent("canvas");
    angleMode(DEGREES);
    resetSketch();
}

function resetSketch() {
    updateValues();
    //Point mass
    noFill();
    background(255);
    strokeWeight(2);
    stroke(0);
    ellipseMode(CENTER);
    rectMode(CENTER);
    ellipse(82 + (mass / 2.7), 82 - (mass / 2.7), 30 + mass, 30 + mass);
    fill(0, 110, 175);
    rect(87, 76.5, 5, 30 + mass);

    // Ramp
    noFill();
    line(30, 50, 300, 320);
    line(300, 320, 200, 320);

    //Angle
    noFill();
    arc(300, 320, 70, 70, PI, PI + QUARTER_PI);

    if(isShown){
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
    }
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

    if(isRunning){
        if (xPos >= 300 || yPos >= 300) {
            xPos = 300;
            yPos = 300;
        }
        if (frictionStatic > 1) {
            push();
            translate(xPos + (mass / 2.7), yPos - (mass / 2.7));
            rotate(angle);
            ellipseMode(CENTER);
            rectMode(CENTER);
            stroke(0);
            ellipse(0, 0, 30 + mass, 30 + mass);
            fill(0, 110, 175);
            rect(0, 0, 5, 30 + mass);
            angle = angle + 10;
            pop();

            //The ball moves down the slope, moves slower with friction
            xPos = xPos + 1 - (frictionDynamic / 50);
            yPos = yPos + 1 - (frictionDynamic / 50);
        } else {
            stroke(0);
            ellipse(xPos + (mass / 2.7), yPos - (mass / 2.7), 30 + mass, 30 + mass);
            rectMode(CENTER);
            fill(0, 110, 175);
            rect(xPos + (mass / 2.7), yPos - (mass / 2.7), 5, 30 + mass);
            xPos = xPos + 2 - (frictionDynamic / 50);
            yPos = yPos + 2 - (frictionDynamic / 50);
        }
    } else {
        yPos = 82;
        xPos = 82;
        resetSketch();
    }
}
