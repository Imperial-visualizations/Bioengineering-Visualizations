let currentContainer=[], arrows=[],myCanvas;
let vectorB, theta=-Math.PI/2;
const dTheta=0.01, mu0= 4*Math.PI*Math.pow(10, -7); //without the 10^-7 term
let fieldDisplay=false, playing=false, mouseWasPressed=false, canModifySettings=true;
let buttonPlay, buttonPause, buttonField, buttonReset, currentSlider,textCurrentSlider, tagCurrentSlider, tagCurrentSliderMin, tagCurrentSliderMax, diameterSlider, tagDiamSlider;

/* Now the plotly part */

let trace={}, frames = [];
let x=[], y=[], r=[];
let B, Btot;



function setup(){
    let width = $('#sketch-holder').width(), height = $('#sketch-holder').height();
    myCanvas = createCanvas(width, height);
    myCanvas.parent('sketch-holder');
    frameRate(60);
    currentContainer.push(new Wire(circuit.x, circuit.y, Math.floor(random(100))/10));
    vectorB = new Arrow(circuit.x, circuit.y-circuit.diam/2);
    theta=-PI/2;


    //creating buttons for interraction
    buttonPlay = createButton("Play");
    buttonPlay.position(100, 100);
    buttonPlay.mousePressed(function(){
        playing = true;
    });

    buttonPause = createButton("Pause");
    buttonPause.position(buttonPlay.x +buttonPlay.width+10, buttonPlay.y);
    buttonPause.mousePressed(function(){
        playing = false;
    });

    buttonField =createButton("Display Magnetic fields");
    buttonField.position(buttonPlay.x, +buttonPlay.y+buttonPlay.height+10);
    buttonField.mousePressed(function(){
        fieldDisplay= !fieldDisplay;
    });


    //text for slider (telling them that it won't change if the animation is playing)
    textCurrentSlider = createElement('p', "(Value of current and position of wire <br>only changes if animation is on its start position)");
    textCurrentSlider.position(buttonPlay.x-20, buttonField.y+buttonField.height+20);
    textCurrentSlider.style('font-size', '13px');

    tagCurrentSlider = createElement('p', "Current <b>I</b>:");
    tagCurrentSlider.position(buttonPlay.x-70, textCurrentSlider.y+textCurrentSlider.height);
    //slider for changing current
    currentSlider = createSlider(-10, 10, 5, 0.1);
    currentSlider.position(buttonPlay.x, textCurrentSlider.y+textCurrentSlider.height+5);
    currentSlider.style('width', '200px');
    //limits of slider:
    tagCurrentSliderMin = createElement('p', "-10A");
    tagCurrentSliderMin.position(buttonPlay.x+10, currentSlider.y+currentSlider.height*3/4);
    tagCurrentSliderMax = createElement('p', "10A");
    tagCurrentSliderMax.position(currentSlider.x+currentSlider.width-30, currentSlider.y+currentSlider.height*3/4);

    buttonReset= createButton("Reset");
    buttonReset.position(currentSlider.x, currentSlider.y+currentSlider.height+10);
    buttonReset.mousePressed(function(){
        playing=false;
        theta=-PI/2;
        for (let i=0; i<currentContainer.length; i++){
            currentContainer[i].x=circuit.x;
            currentContainer[i].y=circuit.y;
        }

        vectorB.x=circuit.x;
        vectorB.y=circuit.y-circuit.diam/2;
        this.r=[];
        vectorB.updatePosition();
        vectorB.update();
    });
    //slider for changing diameter of circuit
    tagDiamSlider= createElement('p', "Diameter of loop:");
    tagDiamSlider.position(buttonReset.x-70, buttonReset.y+buttonReset.height+10);

    diameterSlider = createSlider(1, 400, 150, 5);
    diameterSlider.position(currentSlider.x, tagDiamSlider.y+tagDiamSlider.height);
    diameterSlider.style('width', '200px');



}


let circuit = {
    diam:200,
    x:$('#sketch-holder').width()/2,
    y: $('#sketch-holder').height()/2,


    drawCircuit() {
        this.diam = diameterSlider.value();
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
        if (A>=0){this.valueSign=1}
        else{this.valueSign=-1}
        this.widthInner=3;
        this.widthOuter=12;

    }

    updateWirePos() {
        let distance =  dist(mouseX, mouseY, this.x, this.y);
        if (mouseIsPressed && distance<=this.widthOuter+10)
        {mouseWasPressed= true}
        if (mouseIsPressed && mouseWasPressed){
            this.x = mouseX;
            this.y = mouseY;
            }
        else if (!mouseIsPressed && mouseWasPressed){mouseWasPressed=false}
    }

    drawWire() {
        //case to move the mouse


        stroke(0);
        fill(255);
        ellipse(this.x, this.y, this.widthOuter, this.widthOuter);
        fill(0);
        strokeWeight(1);
        //change for cross if current is positive, dot if negative
        if (this.valueSign>=0) {
            line(this.x - this.widthInner, this.y - this.widthInner, this.x + this.widthInner, this.y + this.widthInner);
            line(this.x + this.widthInner, this.y - this.widthInner, this.x - this.widthInner, this.y + this.widthInner);
        }
        else {
            strokeWeight(3);
            ellipse(this.x, this.y, this.widthInner, this.widthInner);
        }
        strokeWeight(1);
        textSize(15);
        text("I=" + this.value, this.x+10, this.y+10);
        fill(255);
        }

    drawField() { //could include "show", "hide" field lines

        if (fieldDisplay) {
            stroke(0, 40, 150);
            if (this.value!==0) {
                for (let r = circuit.diam / 3/ Math.abs(this.value); r <= $('#sketch-holder').width() || r <= $('#sketch-holder').width(); r += r) {
                    fill(255, 255, 255, 0);
                    //draw small arrow to indicate direction
                    ellipse(this.x, this.y, r, r);
                    //draw arrows to show direction of magnetic fields
                    line(this.x + r, this.y, this.x + r -  this.valueSign* 4, this.y - this.valueSign*4);
                    line(this.x + r, this.y, this.x + r + this.valueSign*4, this.y - this.valueSign*4);
                    line(this.x - r, this.y, this.x - r - this.valueSign*4, this.y + this.valueSign*4);
                    line(this.x - r, this.y, this.x - r + this.valueSign*4, this.y + this.valueSign*4);
                }
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
        this.r=[];
    }

    //method
    updatePosition() {

    }
    updateAngle(){
        //recursion of the angle
        if (theta<=PI) {
        theta+=dTheta;
        } else {
        theta=-PI;
        }
        if (theta>=-PI/2-dTheta&&theta<-PI/2){
            playing=false;
            theta=-PI/2;
        }
    }

    update () { //update will redraw each arrow
        //update the position as we change the angle or the diameter
        this.x = circuit.x + circuit.diam / 2 * cos(theta);
        this.y = circuit.y + circuit.diam / 2 * sin(theta);

        //update the angle for the arrow
        this.r=[this.x - currentContainer[0].x, this.y - currentContainer[0].y];
        this.length= currentContainer[0].value*currentContainer[0].valueSign/vectorLength(this.r)*this.scaling;

        //draw the arrow
        let angle = (atan2(this.r[1], this.r[0]) +PI/2); //orientate geometry to the position of the cursor (draw arrows pointing to cursor)
        push(); //move the grid
        stroke(0);
        fill(40, 200, 40);
        translate(this.x, this.y);
        rotate(angle);
        beginShape(); //create a shape from vertices
        vertex(0, 0);
        vertex(2 * this.length*currentContainer[0].valueSign, -Math.sqrt(2*this.length));
        vertex(2 * this.length*currentContainer[0].valueSign, - Math.sqrt(4*this.length));
        vertex(3 * this.length*currentContainer[0].valueSign, 0);
        vertex(2* this.length*currentContainer[0].valueSign,  Math.sqrt(4*this.length));
        vertex(2 * this.length*currentContainer[0].valueSign, Math.sqrt(2*this.length));
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
        text("B", (3*this.length*cos(angle)+5)*currentContainer[0].valueSign, (3*this.length*sin(angle)+5)*currentContainer[0].valueSign);

        pop(); //reset the grid!
    }
}

function vectorLength(vector) {
    let modulus=0;
    for (let i=0; i<vector.length; i++) {modulus+= Math.pow(vector[i],2); }
    return Math.sqrt(modulus);
}



function draw(){
    background (255);
    circuit.drawCircuit();

    for (let i = 0; i < currentContainer.length; i++) {
        if (theta>=-PI/2&& theta<=-PI/2+dTheta && !playing) {
            currentContainer[i].updateWirePos();
            currentContainer[i].value = currentSlider.value();
            if (currentContainer[i].value>=0) {currentContainer[i].valueSign=1}
        else  {currentContainer[i].valueSign=-1}
        }
        currentContainer[i].drawWire();
        currentContainer[i].drawField();
    }

    vectorB.update();
    if (playing) {
        vectorB.updateAngle(); //we update the position of the arrow on the circuit

    }


    //when we are in pause: we recalculate the plot for plotly
    else{
        //plotly parameters:
        args_plot_Bdl(circuit, currentContainer);

        Plotly.newPlot('graph-holder', [trace], layout, {displayModeBar:false});

    }

}

//resize the canvas if the window size changes
function windowResized() {
    let width = $('#sketch-holder').width(), height = $('#sketch-holder').height();
    resizeCanvas(width, height);
}



/* Now the plotly part */

/*function to calculate the value of B at a point [x, y] */
function calculateB(wires, x, y){
    let Bx=0;
    let By=0;

    //if several wires: we add linearly their contributions
    for (let j=0; j<wires.length; j++){
        let distance = dist(x, y, wires[j].x, wires[j].y)
        const BConst= mu0/2/Math.PI/Math.pow(distance, 2)*wires[j].value;

        let r = [x-wires[j].x, y-wires[j].y];
        //rotate and multiply by value
        Bx+=-BConst*r[1];
        By+= BConst*r[0];
    }
    //console.log([Bx, By]);
    return [Bx, By];
}

/*calculate B.dl at an angle of rotation alpha (equivalent to method using [posX, posY] */
function calculateBdl(loop, B, alpha){
    let dlLength = loop.diam/2*dTheta;
    let dl = [loop.diam/2*Math.cos(alpha), loop.diam/2*Math.sin(alpha)];
    const dl2=dl; //create a copy of dl
    //rotate by  PI/2 to the right
    dl[0]= -dl2[1];
    dl[1]= dl2[0];

    //get right length
    dl[0]=dl[0]*dlLength/*vectorLength(dl)*/;
    dl[1]=dl[1]*dlLength/*vectorLength(dl)*/;
    //console.log(dl);

    let Bdl = B[0]*dl[0]+B[1]*dl[1];
    return Bdl;
    //testing
    //dl is the problem
    //return  dl[0];
}


//return plotly parameters for x and y:

function args_plot_Bdl(loop, wires){
    x=[];
    y=[];
    trace={};
    let Bdl=0;
    let intBdl=0;
    let Bdl2=0;

    for (let i=-Math.PI/2; i<= 3*Math.PI/2; i+=dTheta) {
        Bdl2=Bdl;
        let posX = loop.x + loop.diam/2 * Math.cos(i);
        let posY = loop.y + loop.diam/2 * Math.sin(i);
        B = calculateB(wires, posX, posY);

        Btot = vectorLength(B); //not needed yet
        Bdl = calculateBdl(loop, B, i);
        x.push(i+Math.PI/2); // + PI/2 so that we can start at 0, but does not affect calculations
        y.push(Bdl);

        intBdl+=(Bdl+Bdl2)/2*dTheta;
        //testing
        //y.push (Btot);
        //when centered: Btot is about constant
    }
    console.log(intBdl/mu0);
    trace = {
        x:x,
        y:y,
        type:'scatter'
    };
}

args_plot_Bdl(circuit, currentContainer);

let layout = {
    title:'Plot of <b>B.dl</b>',
    xaxis: {
        title: 'theta',
        range:[-0.2, 2*Math.PI+0.2],

        autotick: false,
        ticks: 'outside',
        tick0: 0,
        dtick: Math.PI/2,
    },
    yaxis: {
        title:'B.dl'
    }
}

Plotly.newPlot('graph-holder', [trace], layout, {displayModeBar:false});

