let currentContainer=[], arrows=[];
let  vectorB, theta=-3.14/2, dTheta=0.01;
let fieldDisplay=false, playing=false, mouseWasPressed=false;
let buttonPlay, buttonPause, buttonField, buttonReset, currentSlider, tagCurrentSlider;



function setup(){
    let width = $('#sketch-holder').width(), height = $('#sketch-holder').height();
    let myCanvas = createCanvas(width, height);
    myCanvas.parent('sketch-holder');
    frameRate(60);
    currentContainer.push(new Wire(circuit.x, circuit.y, Math.floor(random(100))/10));
    vectorB = new Arrow(circuit.x, circuit.y-circuit.diam/2);
    let theta=-PI/2;


    //creating buttons for interraction
    buttonPlay = createButton("Play");
    buttonPlay.position(window.innerWidth/3+$('#sketch-holder').width()/8, 100);
    buttonPlay.mousePressed(function(){
        playing = !playing;
    });

    buttonField =createButton("Display Magnetic fields");
    buttonField.position(buttonPlay.x+buttonPlay.width+10, 100);
    buttonField.mousePressed(function(){
        fieldDisplay= !fieldDisplay;
    });


    buttonReset= createButton("Reset");
    buttonReset.position(buttonField.x+buttonField.width+10, 100);
    buttonReset.mousePressed(function(){
        playing=false;
        for (let i=0; i<currentContainer.length; i++){
            currentContainer[i].value=Math.floor(random(100))/10;
            currentContainer[i].x=circuit.x;
            currentContainer[i].y=circuit.y;
        }
        theta=-PI/2;
        vectorB.x=circuit.x;
        vectorB.y=circuit.y-circuit.diam/2;
        this.r=[];
        vectorB.updatePosition();
        vectorB.update();
    });

    currentSlider = createSlider(0, 10, 10, 0.1);
    currentSlider.position(buttonReset.x+buttonReset.width+10, 100);
    currentSlider.style('width', '200px');
    //text for slider

    /*
    tagCurrentSlider= createElement('p', 'Current I');
    tagCurrentSlider= (currentSlider.x+10, currentSlider.y-20);
    */


}




var circuit = {
    diam:200,
    x:$('#sketch-holder').width()/2,
    y: $('#sketch-holder').height()/2,


    drawCircuit() {
        stroke(100);
        strokeWeight(2);
        noFill();
        translate(this.x, this.y);
        ellipse(0, 0, this.diam, this.diam);
        strokeWeight(1);

        stroke(0);
        translate(-this.x, -this.y);
        }
    }


const Wire= class {
    constructor(x, y, A){
        this.x=x;
        this.y=y;
        this.value=A;
        this.widthInner=3;
        this.widthOuter=12;
        this.limitLeft = x-this.widthOuter;
        this.limitRight = x+this.widthOuter;
        this.limitUp = y-this.widthOuter;
        this.limitDown = y+this.widthOuter;
    }

    drawWire() { //we could include before call another condition if to know which wire to move
        //case to move the mouse
        if (mouseIsPressed && (mouseX>= this.limitLeft-30 && mouseX<=this.limitRight+30 && mouseY>=this.limitUp-30 && mouseY<=this.limitDown+30))
        {mouseWasPressed= true}

        if (mouseIsPressed && mouseWasPressed){
        this.x = mouseX;
        this.y = mouseY;
        //changing the definitions of the limits
        this.limitLeft = this.x-this.widthOuter;
        this.limitRight = this.x+this.widthOuter;
        this.limitUp = this.y-this.widthOuter;
        this.limitDown = this.y+this.widthOuter;
            } else if (!mouseIsPressed && mouseWasPressed){mouseWasPressed=false}

        stroke(0);
        fill(255);
        ellipse(this.x, this.y, this.widthOuter, this.widthOuter);
        fill(0);
        strokeWeight(1);
        //change for cross
        line(this.x-this.widthInner, this.y-this.widthInner, this.x+this.widthInner, this.y+this.widthInner);
        line(this.x+this.widthInner, this.y-this.widthInner, this.x-this.widthInner, this.y+this.widthInner);

        //for going out of the page
        //strokeWeight(3);ellipse(this.x, this.y, this.widthInner, this.widthInner);

        strokeWeight(1);
        textSize(15);
        text("I=" + this.value, this.x+10, this.y+10);
        fill(255);
        }

    drawField() { //could include "show", "hide" field lines

        if (fieldDisplay) {
            stroke(0, 40, 150);
            for (let r = circuit.diam / 3; r <= $('#sketch-holder').width() || r <= $('#sketch-holder').width(); r += r) {
                fill(255, 255, 255, 0);
                //draw small arrow to indicate direction
                ellipse(this.x, this.y, r, r);
                //draw arrows to show direction of magnetic fields
                line(this.x+r, this.y, this.x+r-4, this.y-4);
                line(this.x+r, this.y, this.x+r+4, this.y-4);
                line(this.x-r, this.y, this.x-r-4, this.y+4);
                line(this.x-r, this.y, this.x-r+4, this.y+4);

            }
        }
    }
}

let  Arrow = class {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.length = 0;
        this.scaling = 1000;
        this.endpoint=[];
        this.r=[];
    }

    //method
    updatePosition() {
        this.x = circuit.x +circuit.diam/2*cos(theta);
        this.y =circuit.y +circuit.diam/2*sin(theta);

        //recursion of the angle
        if (theta<=PI) {
        theta+=dTheta;
        } else {
        theta=-PI;
        }
        if (theta===-PI/2-dTheta){
            playing=false;
            theta+=dTheta;
        }
    }

    update () { //update will redraw each arrow
        //update the angle
        this.r=[this.x - currentContainer[0].x, this.y - currentContainer[0].y];
        this.length= currentContainer[0].value/vectorLength(this.r)*this.scaling;


        //draw the arrow
        var angle = atan2(this.r[1], this.r[0]) +PI/2; //orientate geometry to the position of the cursor (draw arrows pointing to cursor)
        push(); //move the grid
        stroke(0);
        fill(40, 200, 40);
        translate(this.x, this.y);
        rotate(angle);
        beginShape(); //create a shape from vertices
        vertex(0, 0);
        vertex(2 * this.length, -this.length/4);
        vertex(2 * this.length, - this.length/2);
        vertex(3 * this.length, 0);
        vertex(2* this.length,  this.length/2);
        vertex(2 * this.length, this.length/4);
        endShape(CLOSE);

        //draw small increase element dl
        fill(0);
        rotate(-angle);
        rotate(theta);

        strokeWeight(2);

        stroke(200, 0, 200);
        line(0,0, -6, -10);
        line(0,0, 6, -10);
        rotate(-theta);

        strokeWeight(1);
        textSize(15);
        text("dl", 7, -7);

        fill(40, 200, 40);
        stroke(0);
        text("B", 3*this.length*cos(angle)+5, 3*this.length*sin(angle)+5);

        pop(); //reset the grid!
    }
}

function vectorLength(vector) {
    var modulus=0;
    for (var i=0; i<vector.length; i++) {modulus+= Math.pow(vector[i],2); }
    return Math.sqrt(modulus);
}



function draw(){
    background (255);
    circuit.drawCircuit();


    for (let i = 0; i < currentContainer.length; i++) {
        currentContainer[i].drawWire();
        currentContainer[i].drawField();
    }


    vectorB.update();
    if (playing) { vectorB.updatePosition(); } //we update the position of the arrow on the circuit




}