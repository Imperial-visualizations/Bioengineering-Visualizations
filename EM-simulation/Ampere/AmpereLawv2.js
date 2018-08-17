let currentContainer=[], arrows=[],myCanvas, countingFrames=0;
let vectorB, theta=-Math.PI/2;
const dTheta=0.01, mu0= 4*Math.PI*Math.pow(10, -7);
let fieldDisplay=false, playing=false, mouseWasPressed=false, wireSelected=0;
let buttonPlay, buttonPause, buttonField, buttonReset, currentSlider,textCurrentSlider, tagCurrentSlider, tagCurrentSliderMin, tagCurrentSliderMax, diameterSlider, tagDiamSlider;

/* Now the plotly part of declaration */
let trace={x:[],y:[]}, layout, trace2={x:[],y:[]};
let x=[], y=[], r=[];
let B, Bdl=0, Btot, intBdl=0;


function setup(){
    let width = $('#sketch-holder').width(), height = $('#sketch-holder').height();
    myCanvas = createCanvas(width, height);
    myCanvas.parent('sketch-holder');
    frameRate(60);
    //create the first current-carrying wire
    currentContainer.push(new Wire(circuit.x, circuit.y, 5,0));
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
        countingFrame=frameCount;
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
    //what happens when we reset animation
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
        vectorB.update();
        //reset the plot
        args_plot_Bdl(circuit, currentContainer);
        Plotly.react('graph-holder', [trace, trace2], layout, {displayModeBar: false});
    });

    //slider for changing diameter of circuit
    tagDiamSlider= createElement('p', "Diameter of loop:");
    tagDiamSlider.position(buttonReset.x-70, buttonReset.y+buttonReset.height+10);

    diameterSlider = createSlider(1, 350, 150, 5);
    diameterSlider.position(currentSlider.x, tagDiamSlider.y+tagDiamSlider.height);
    diameterSlider.style('width', '200px');

    //get the first plot on the screen
    initialPlot();
}

//defining the looop
let circuit = {
    diam:200,
    x:$('#sketch-holder').width()/2,
    y: $('#sketch-holder').height()/2,


    drawCircuit() {
        this.diam = diameterSlider.value();
        push();
        stroke(100);
        strokeWeight(1);
        noFill();
        translate(this.x, this.y);
        ellipse(0, 0, this.diam, this.diam);

        pop();
    },

    drawPath(){
        //have arc being bolder as we go on it--> from angle -PI/2 to angle

        push();
        strokeWeight(2);
        stroke(100, 40, 100);
        noFill();
        translate(this.x, this.y);
        arc(0,0, this.diam, this.diam, 3*PI/2, theta);
        pop();
    }
}

const Wire= class {
    constructor(x, y, A, index){
        this.x=x;
        this.y=y;
        this.value=A;
        if (A>=0){this.valueSign=1}
        else{this.valueSign=-1}
        this.widthInner=3;
        this.widthOuter=12;
        this.index = index;
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
            //negative current represented by vector 3D notation (small dot in the middle)
            strokeWeight(3);
            ellipse(this.x, this.y, this.widthInner, this.widthInner);
        }
        strokeWeight(1);
        textSize(15);
        text(`I= ${this.value}`, this.x+10, this.y+10);
        fill(255);
        }

    drawField() { //for now only works for 1 wire since we only have concentric circles
        if (fieldDisplay) {
            stroke(0, 150, 50);
            if (this.value!==0) {
                let avoidBug='useless';
                //here: have new ways of tracing the magnetic fields



                //concentric circles
                for (let r = circuit.diam / 3/ Math.abs(this.value); r <= $('#sketch-holder').width() || r <= $('#sketch-holder').width(); r += r) {
                    noFill();
                    //draw small arrow to indicate direction
                    ellipse(this.x, this.y, 2*r, 2*r);
                    //draw arrows to show direction of magnetic fields
                    line(this.x + r, this.y, this.x + r -  this.valueSign* 4, this.y - this.valueSign*4);
                    line(this.x + r, this.y, this.x + r + this.valueSign*4, this.y - this.valueSign*4);
                    line(this.x - r, this.y, this.x - r - this.valueSign*4, this.y + this.valueSign*4);
                    line(this.x - r, this.y, this.x - r + this.valueSign*4, this.y + this.valueSign*4);
                }
            }
        }
    }
};

let  Arrow = class {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.length = 0;
        this.scaling = 2000;
        this.r=[];
    }

    //method

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
        let Bvect = calculateB(currentContainer,this.x,this.y);
        this.length= vectorLength(Bvect)/mu0*this.scaling;

        //draw the arrow
        let angle = (atan2(Bvect[1], Bvect[0] )); //orientate geometry to the position of the cursor (draw arrows pointing to cursor)

        push(); //move the grid
        translate(this.x, this.y);
        stroke(0);
        fill(40, 200, 40);
        rotate(angle);
        beginShape(); //create a shape from vertices
        vertex(0, 0);
        vertex(2 * this.length, -Math.sqrt(2*this.length));
        vertex(2 * this.length, - Math.sqrt(4*this.length));
        vertex(3 * this.length, 0);
        vertex(2* this.length,  Math.sqrt(4*this.length));
        vertex(2 * this.length, Math.sqrt(2*this.length));
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

        //text for the arrows (vector B and small increase element dl
        strokeWeight(1);
        textSize(15);
        text("dl", 7, -7);

        fill(40, 200, 40);
        stroke(0);
        text("B", (3*this.length*cos(angle)+5), (3*this.length*sin(angle)+5));
        pop(); //reset the grid!
    }
}

function addWire(posX, posY){
    let index = currentContainer.length;
    currentContainer.push(new Wire(posX, posY, Math.floor(random(200))/10-10), index);
}

//tool to calculate the length of a vector as an array
function vectorLength(vector) {
    let modulus=0;
    for (let i=0; i<vector.length; i++) {modulus+= Math.pow(vector[i],2); }
    return Math.sqrt(Math.pow(vector[0], 2)+Math.pow(vector[1], 2));
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
    return [Bx, By];
}

/*calculate B.dl at an angle of rotation alpha (equivalent to method using [posX, posY] */
function calculateBdl(loop, B, alpha){
    let dlLength = loop.diam/2*dTheta;
    let dl = [Math.cos(alpha), Math.sin(alpha)];
    const  dl2 = dl.slice(0); //create a copy of dl
    //rotate by  PI/2 to the right
    dl[0]= -dl2[1];
    dl[1]= dl2[0];
    //get right length
    dl[0]=dl[0]*dlLength;
    dl[1]=dl[1]*dlLength;
    let Bdl = B[0]*dl[0]+B[1]*dl[1];
    return Bdl;
}

//return plotly parameters for x and y:
function args_plot_Bdl(loop, wires){
    x=[];
    y=[];
    trace={};
    trace2={};
    intBdl=0;
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

        intBdl+=(Bdl+Bdl2)/2;
    }
    trace = {x:x, y:y, name: 'B.dl', type:'scatter'};
    trace2= {
        x: [x[0]],
        y:[y[0]],
        name:'Line integral' ,
        fill: 'tozeroy',
        type: 'scatter',
        mode: 'lines',
        line: {color: 'green'}
    };

    let minRange, maxRange, min=Math.min(...trace.y), max = Math.max(...trace.y);
            /*
            // the 3 dots allow to spread the array
            // reference:
            // https://codeburst.io/javascript-arrays-finding-the-minimum-maximum-sum-average-values-f02f1b0ce332
            */
    if (min<=0&&max<=0){ //both are less than 0
        minRange = 11*min/10; //a bit smaller than the minimum value
        maxRange = -min/10; //since the minimum is negative, max
    }
    else if (min<=0 && max>=0){ //we have both negative and positive values
        minRange = 11/10*min;
        maxRange = 11/10*max;
    }
    else if (min >= 0 && max >= 0) {
        minRange = -1 / 10 * max;
        maxRange = 11 / 10 * max;
    }
    else {
        minRange = maxRange = min;
    }
    layout.yaxis.range = [minRange, maxRange];
}

//initial plot
function initialPlot(){
    layout = {
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
            title:'B.dl',
            range:[-10*Math.pow(10, -7), 10*Math.pow(10, -7)],
            exponentformat: 'e',
            showexponent: 'all'
        },
        showlegend:false
    };
    args_plot_Bdl(circuit, currentContainer);
    Plotly.newPlot('graph-holder', [trace, trace2], layout, {displayModeBar:false});
}


function draw(){
    background (255);
    circuit.drawCircuit();

    for (let i = 0; i < currentContainer.length; i++) {
        if (theta>=-PI/2&& theta<=-PI/2+dTheta && !playing) {
            countingFrames=0;
            currentContainer[i].updateWirePos();
            currentContainer[i].value = currentSlider.value();
            if (currentContainer[i].value>=0) {currentContainer[i].valueSign=1}
        else  {currentContainer[i].valueSign=-1}
        }
        currentContainer[i].drawWire();
        currentContainer[i].drawField();
        //add the frames

    }

    vectorB.update(); //redraw the arrows

    if (playing) {
        vectorB.updateAngle(); //we update the position of the arrow on the circuit
        countingFrames++;
        trace2.x = trace.x.slice(0, countingFrames+1);
        trace2.y = trace.y.slice(0, countingFrames+1);
        Plotly.react('graph-holder', [trace, trace2],layout, {displayModeBar: false});
    }


    //when we are in pause: we recalculate the plot for plotly
    if (theta>=-PI/2&& theta<=-PI/2+dTheta){ //we are in the start position
        //plotly parameters:
        let intBdl2=intBdl;
        args_plot_Bdl(circuit, currentContainer);
        if (intBdl2!==intBdl) { //we have an update of the data
            $('#Bdl-text').html(`${(intBdl/mu0).toString().slice(0, 4)}*&mu;<sub>0<\sub>`); //print the value of Bdl on the page

            Plotly.react('graph-holder', [trace, trace2], layout, {displayModeBar: false});
        }
    }
    else{ //we are not in start position
        circuit.drawPath();
    }
}

//resize the canvas if the window size changes
function windowResized() {
    let width = $('#sketch-holder').width(), height = $('#sketch-holder').height();
    resizeCanvas(width, height);
}

