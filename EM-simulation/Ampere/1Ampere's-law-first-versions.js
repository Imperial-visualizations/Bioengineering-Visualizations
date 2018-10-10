let currentContainer = [], arrows = [], myCanvas, countingFrames = 0;
let vectorB, theta = -Math.PI / 2, magFieldScaling = 200;
const dTheta = 0.01, mu0 = 4 * Math.PI * Math.pow(10, -7);
let fieldDisplay = false, playing = false, mouseWasPressed = false, someWireClose = false, wireSelected = 0;

/* Now the plotly part of declaration */
let trace = {x: [], y: []}, layout, trace2 = {x: [], y: []};
let x = [], y = [], r = [];
let B, Bdl = 0, Btot, intBdl = 0;


function setup() {
    let width = $('#sketch-holder').width(), height = $('#sketch-holder').height();

    //link the functions to the buttons
    $('#buttonPlay').click(buttonPlayFunction);
    $('#buttonField').click(buttonFieldFunction);
    $('#buttonAddWire').click(buttonAddWireFunction);
    $('#buttonRemoveWires').click(buttonRemoveWiresFunction);
    $('#buttonReset').click(buttonResetFunction);


    myCanvas = createCanvas(width, height);
    myCanvas.parent('sketch-holder');
    frameRate(60);
    //create the first current-carrying wire
    currentContainer.push(new Wire(circuit.x, circuit.y, 5, 0));
    initialPlot();
}

//defining the looop
let circuit = {
    diam: 200, //initial diameter
    x: $('#sketch-holder').width() / 2, //centered
    y: $('#sketch-holder').height() / 2, //centered
    //if want to change the shape of the circuit, this is to alter
    drawCircuit() {
        push();
        stroke(100);
        strokeWeight(1);
        noFill();
        translate(this.x, this.y);
        ellipse(0, 0, this.diam, this.diam);
        pop();
    },

    //this as well so that we follow the circuit
    drawPath(diam) {
        //have arc being bolder as we go on it--> from angle -PI/2 to angle
        push();
        strokeWeight(2);
        stroke(100, 40, 100);
        noFill();
        translate(this.x, this.y);
        arc(0, 0, diam, diam, 3 * Math.PI / 2, theta);
        pop();
    }
};

const Wire = class {
    constructor(x, y, A, index) {
        this.x = x;
        this.y = y;
        this.value = A;
        if (A >= 0) {
            this.valueSign = 1
        }
        else {
            this.valueSign = -1
        }
        this.widthInner = 3;
        this.widthOuter = 12;
        this.index = index;
        this.clicked = false;
        this.color = 0;
    }

    intersect() { //check if we are close to a forbidden area
        let areintersecting = false;
        for (let i = 0; i < currentContainer.length; i++) {
            if (currentContainer[i] != this) {
                if (parseInt(dist(mouseX, mouseY, currentContainer[i].x, currentContainer[i].y)) <= this.widthOuter + 4) {
                    areintersecting = true
                }
            }
        }
        //also case to avoid putting it out of the canvas
        if (mouseIsPressed && (mouseX <= 4 || mouseY <= 4 || mouseX >= width || mouseY >= height - 10)) {
            areintersecting = true;
        }
        return areintersecting;
    }

    pressed() {
        let distance = dist(mouseX, mouseY, this.x, this.y);
        if (distance <= this.widthOuter + 4 && !mouseWasPressed) {
            someWireClose = true;
            if (mouseIsPressed) {
                this.clicked = true;
                mouseWasPressed = true;
            }
        }

        if (this.clicked && !mouseIsPressed) {
            this.clicked = false;
            mouseWasPressed = false;
        }
    }

    updateWirePos() {
        this.pressed();
        if ((!this.intersect()) && this.clicked) {
            this.x = mouseX;
            this.y = mouseY;
        }
    }

    selectingWire() {
        if (this.clicked) {
            wireSelected = this.index;
            $('#currentSlider').val(this.value.toString());
        }
    }

    drawWire() {
        push();
        stroke(this.color);
        noFill();
        ellipse(this.x, this.y, this.widthOuter, this.widthOuter);
        fill(0);
        strokeWeight(1);
        //change for cross if current is positive, dot if negative
        if (this.valueSign >= 0) {
            line(this.x - this.widthInner, this.y - this.widthInner, this.x + this.widthInner, this.y + this.widthInner);
            line(this.x + this.widthInner, this.y - this.widthInner, this.x - this.widthInner, this.y + this.widthInner);
        } else {
            //negative current represented by vector 3D notation (small dot in the middle)
            strokeWeight(3);
            ellipse(this.x, this.y, this.widthInner, this.widthInner);
        }
        strokeWeight(1);
        textSize(15);
        let textI = 'I (' + this.index + ') =' + this.value;
        text(textI, this.x + 10, this.y + 10);
        pop();
    }

    static drawField(wires) { //for now only works for 1 wire since we only have concentric circles
        if (fieldDisplay) {
            stroke(0, 150, 50);
            // if (wires.length === 1) {//concentric circles
            if (wires[0].value !== 0) {
                for (let r = magFieldScaling / 3 / Math.abs(wires[0].value); r <= $('#sketch-holder').width() || r <= $('#sketch-holder').width(); r += r) {
                    push();
                    translate(wires[0].x, wires[0].y);
                    let sign = wires[0].valueSign;
                    noFill();
                    //draw small arrow to indicate direction
                    ellipse(0, 0, 2 * r, 2 * r);
                    //draw arrows to show direction of magnetic fields
                    line(r, 0, r - sign * 4, -sign * 4);
                    line(r, 0, r + sign * 4, -sign * 4);
                    line(-r, 0, -r - sign * 4, sign * 4);
                    line(-r, 0, -r + sign * 4, sign * 4);
                    pop();
                }
            }
            // }
        }
    }
};

vectorB = { //describes the green vector B and the small increase element dl at position (diam/2, theta)
    x: circuit.x,
    y: circuit.y - circuit.diam / 2,
    length: 0,
    scaling: 2000,
    r: [],

    updateAngle() { //recursion of the angle
        if (theta <= Math.PI) {
            theta += dTheta;
        } else {
            theta = -Math.PI;
        }
        if (theta >= -Math.PI / 2 - dTheta && theta < -Math.PI / 2) {
            playing = false;
            theta = -Math.PI / 2;
        }
    },

    update(distance, wires) { //update will redraw each arrow
        //update the position as we change the angle or the diameter
        this.x = circuit.x + distance / 2 * cos(theta);
        this.y = circuit.y + distance / 2 * sin(theta);

        //update the angle for the arrow
        let Bvect = calculateB(wires, this.x, this.y);
        this.length = vectorLength(Bvect) / mu0 * this.scaling;

        //draw the arrow
        let angle = (atan2(Bvect[1], Bvect[0])); //orientate geometry to the position of the cursor (draw arrows pointing to cursor)

        push(); //move the grid
        translate(this.x, this.y);

        stroke(0);
        fill(40, 200, 40, 200);
        rotate(angle);
        beginShape(); //create a shape from vertices
        vertex(0, 0);
        vertex(2 * this.length, -Math.sqrt(2 * this.length));
        vertex(2 * this.length, -Math.sqrt(4 * this.length));
        vertex(3 * this.length, 0);
        vertex(2 * this.length, Math.sqrt(4 * this.length));
        vertex(2 * this.length, Math.sqrt(2 * this.length));
        endShape(CLOSE);

        //draw small increase element dl
        fill(0);
        rotate(-angle);
        rotate(theta); //arrow on the circuit
        strokeWeight(2);
        stroke(200, 0, 200);
        line(0, 0, -6, -10);
        line(0, 0, 6, -10);
        rotate(-theta);

        //text for the arrows (vector B and small increase element dl
        strokeWeight(1);
        textSize(15);
        text("dl", 7, -7);

        fill(40, 200, 40);
        stroke(0);
        text("B", (3 * this.length * Math.cos(angle) + 5), (3 * this.length * Math.sin(angle) + 5));
        pop(); //reset the grid!
    }
};

function addWire(wires) {
    let index = wires.length;
    if (index > 5) { //maximum amount of wires we can add
        $('#buttonAddWire').hide();
    }
    else {
        wires.push(new Wire(index * $('#sketch-holder').width() / 6, 20, 5, index));
        wireSelected = index;
    }
}

//tool to calculate the length of a vector as an array
function vectorLength(vector) {
    let modulus = 0;
    for (let i = 0; i < vector.length; i++) {
        modulus += Math.pow(vector[i], 2);
    }
    return Math.sqrt(Math.pow(vector[0], 2) + Math.pow(vector[1], 2));
}


/*function to calculate the value of B at a point [x, y] */
function calculateB(setOfWires, x, y) {
    let Bx = 0;
    let By = 0;
    //if several wires: we add linearly their contributions
    for (let j = 0; j < setOfWires.length; j++) {
        let distance = dist(x, y, setOfWires[j].x, setOfWires[j].y);
        const BConst = mu0 / 2 / Math.PI / Math.pow(distance, 2) * setOfWires[j].value;

        let r = [x - setOfWires[j].x, y - setOfWires[j].y];
        //rotate and multiply by value
        Bx += -BConst * r[1];
        By += BConst * r[0];
    }
    return [Bx, By];
}

/*calculate B.dl at an angle of rotation alpha (equivalent to method using [posX, posY] */
function calculateBdl(loop, B, alpha) {
    let dlLength = loop.diam / 2 * dTheta; //dl is a fraction of the circle
    let dl = [Math.cos(alpha), Math.sin(alpha)];
    const dl2 = dl.slice(0); //create a copy of dl
    //rotate by  PI/2 to the right and scale by the length
    dl[0] = -dl2[1] * dlLength;
    dl[1] = dl2[0] * dlLength;
    return B[0] * dl[0] + B[1] * dl[1]; //return the value of B.dl
}

/* Now the plotly part */

//return plotly parameters for x and y:
function args_plot_Bdl(loop, wires) {
    x = [];
    y = [];
    trace = {};
    trace2 = {};
    intBdl = 0;
    let Bdl2 = 0;

    for (let i = -Math.PI / 2; i <= 3 * Math.PI / 2; i += dTheta) {
        Bdl2 = Bdl;
        let posX = loop.x + loop.diam / 2 * Math.cos(i);
        let posY = loop.y + loop.diam / 2 * Math.sin(i);
        B = calculateB(wires, posX, posY);

        Btot = vectorLength(B); //not needed yet
        Bdl = calculateBdl(loop, B, i);
        x.push(i + Math.PI / 2); // + PI/2 so that we can start at 0, but does not affect calculations
        y.push(Bdl);

        intBdl += (Bdl + Bdl2) / 2;
    }
    trace = {x: x, y: y, name: 'B.dl', type: 'scatter'};
    trace2 = {
        x: [x[0]],
        y: [y[0]],
        name: 'Line integral',
        fill: 'tozeroy',
        type: 'scatter',
        mode: 'lines',
        line: {color: 'green'}
    };
    let minRange, maxRange, min = Math.min(...trace.y), max = Math.max(...trace.y);
    // the 3 dots allow to spread the array
    if (min <= 0 && max <= 0) { //both are less than 0
        minRange = 11 * min / 10; //a bit smaller than the minimum value
        maxRange = -min / 10; //since the minimum is negative, max
    }
    else if (min <= 0 && max >= 0) { //we have both negative and positive values
        minRange = 11 / 10 * min;
        maxRange = 11 / 10 * max;
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
function initialPlot() {
    layout = {
        title: 'Line integral of <b>B.dl</b> around the loop',
        xaxis: {
            title: 'theta',
            range: [-0.2, 2 * Math.PI + 0.2],
            autotick: false,
            ticks: 'outside',
            tick0: 0,
            dtick: Math.PI / 2,
        },
        yaxis: {
            title: 'B.dl',
            range: [-10 * Math.pow(10, -7), 10 * Math.pow(10, -7)],
            exponentformat: 'e',
            showexponent: 'all'
        },
        showlegend: false
    };
    args_plot_Bdl(circuit, currentContainer);
    Plotly.newPlot('graph-holder', [trace, trace2], layout, {displayModeBar: false});
}

//button functions:
function buttonPlayFunction() {
    playing = !playing;
    if (playing){
        $('#buttonPlay').html('Pause');
    } else {
        $('#buttonPlay').html('Play');
    }

    $('#Current-modifiers, #diameter-modifiers').css('opacity', '0.25');
}

function buttonFieldFunction() {
    fieldDisplay = !fieldDisplay;
}
function buttonAddWireFunction() {
    //only in start condition:
    if (checkStartPos()) {
        addWire(currentContainer);
        $('#buttonRemoveWires').show();
        if (currentContainer.length >= 6) {
            $('#buttonAddWire').hide();
        }
        $('#buttonField').hide();
        fieldDisplay = false;
    }
}
function buttonRemoveWiresFunction() {
    if (checkStartPos()) {
        let currents = currentContainer.length;
        currentContainer.splice(1, currents - 1);
        $('#buttonRemoveWires').hide();
        $('#buttonField').show;
        $('#buttonAddWire').show();
        wireSelected = 0;
    }
}
function buttonResetFunction() {
    playing = false;
    theta = -Math.PI / 2;
    vectorB.x = circuit.x;
    vectorB.y = circuit.y - circuit.diam / 2;
    currentContainer[0].x = circuit.x;
    currentContainer[0].y = circuit.y;
    buttonRemoveWiresFunction(); //remove all the other wires
    //reset the plot
    args_plot_Bdl(circuit, currentContainer);
    Plotly.react('graph-holder', [trace, trace2], layout, {displayModeBar: false});
    $('#Current-modifiers, #diameter-modifiers').css('opacity', '1');
    $('#buttonPlay').html('Play');

}

function updateValuesFromSlider() {
    let val = $('#currentSlider').val();
    currentContainer[wireSelected].value = val;

    if (val >= 0) {
        currentContainer[wireSelected].valueSign = 1;
    } else {
        currentContainer[wireSelected].valueSign = -1;
    }
    $('#currentDynamicDisplay').html(val.toString().slice(0, 3) + " Amps");

    circuit.diam = parseFloat($('#diameterSlider').val()); //update the diameter of the loop
}

function checkStartPos() {
    if (!playing && theta >= -Math.PI / 2 && theta <= -Math.PI / 2 + dTheta) {
        return true;
    } else {
        return false;
    }
}
//resize the canvas if the window size changes
function windowResized() {
    let width = $('#sketch-holder').width(), height = $('#sketch-holder').height();
    resizeCanvas(width, height);
}
//same for plotly
window.onresize = function () {
    Plotly.Plots.resize('graph-holder');
};
function mouseShape() {
    if (checkStartPos()) { //we are in the start position
        if (someWireClose && !mouseWasPressed) {
            $('#sketch-holder').css('cursor', 'grab');
        }
        else if (mouseWasPressed) {
            $('#sketch-holder').css('cursor', 'grabbing');
        }
        else {
            $('#sketch-holder').css('cursor', 'default');
        }
        someWireClose = false;
    }
}

function draw() {
    background(255);
    circuit.drawCircuit();
    for (let i = 0; i < currentContainer.length; i++) {
        if (checkStartPos()) {
            currentContainer[i].selectingWire(); //checks if we are currently selecting the wire
            if (wireSelected === i) {
                currentContainer[i].color = [50, 50, 200];
            }
            else {
                currentContainer[i].color = 0;
            }
            currentContainer[i].updateWirePos();
        }
        currentContainer[i].drawWire(); //always draw the wires
    }
    Wire.drawField(currentContainer);
    vectorB.update(circuit.diam, currentContainer); //redraw the arrows
    mouseShape();

    //when we are in start position:
    if (checkStartPos()) {
        //updates from sliders
        updateValuesFromSlider();
        //display value of wire selected
        $('#wireSelected').html(wireSelected.toString());

        //plotly parameters:
        countingFrames = 0; //we have not started the animation
        let intBdl2 = intBdl;// keep the old value of Bdl
        args_plot_Bdl(circuit, currentContainer);
        if (intBdl2 !== intBdl) { // only if update of the data
            $('#Bdl-text').html(`${(intBdl / mu0).toString().slice(0, 4)}*&mu;<sub>0<\sub>`); //print the value of Bdl on the page
            Plotly.react('graph-holder', [trace, trace2], layout, {displayModeBar: false});
        }
    } else { //we are not in start position
        circuit.drawPath(circuit.diam); //draw the path from start position to current position
    }

    //while we play: we update the plotly graph to have the trace, we update the angle for the arrow
    if (playing) {
        currentContainer[wireSelected].color = 0;
        vectorB.updateAngle(); //we update the position of the arrow on the circuit
        countingFrames++;
        trace2.x = trace.x.slice(0, countingFrames + 1);
        trace2.y = trace.y.slice(0, countingFrames + 1);
        Plotly.react('graph-holder', [trace, trace2], layout, {displayModeBar: false});
        if (!playing) { //the precedent update set playing to false
            $('#Current-modifiers, #diameter-modifiers').css('opacity', 1);
        }
    }
}