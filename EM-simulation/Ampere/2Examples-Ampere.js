let wiresTot=[], wires1=[], wires2=[], wires3=[], theta=-Math.PI/2;
wiresTot.push(wires1, wires2, wires3);
let canvasExamples, width = $('#drawing-holder').width(), height = $('#drawing-holder').height();
let lengthCircuit2 = width/3, heightCircuit2 = height/2, diam3=[Math.min(width, height)/6, Math.min(width, height)/3, Math.min(width, height)*4/6];
const dTheta=0.01, mu0= 4*Math.PI*Math.pow(10, -7);
let circuitSelected = 1;
let playing=false, changes=true;

let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
  changes = true;
  playing=false;
}
function currentSlide(n) {
  showSlides(slideIndex = n);
}
function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}

$(".play").on('click', function(){playing=true; changes=true;});
$('#circuit3-switch').on('change', function(){
    if (this.value === 'C_1'){
        circuitSelected = 0;
    }
    else if (this.value ==='C_2'){
        circuitSelected = 1;
    }
    else {
        circuitSelected = 2;
    }
    changes = true;
})

function setup(){
    canvasExamples = createCanvas(width, height);
    canvasExamples.parent('#drawing-holder');
    frameRate(60);
    background(0);
    wires1.push(new Wire(circuit.x, circuit.y, 5, 0));
    for (let i=-lengthCircuit2; i<lengthCircuit2; i+=15){
        wires2.push(new Wire(circuit.x+i, circuit.y, 5, 0));
    }
    let diameterWires3= [(diam3[0]+diam3[1])/4, (diam3[1]+diam3[2])/4];

    for (let i=0; i<2; i++){
        let theta=0;
        for (let theta=0; theta<2*Math.PI; theta+=15/diameterWires3[i]){
            let posX = circuit.x+ diameterWires3[i]*Math.cos(theta);
            let posY = circuit.y+diameterWires3[i]*Math.sin(theta);
            let sign;
            if (i===0){sign=+1;} else {sign=-1;}
            wires3.push(new Wire(posX, posY, sign*5, 0));
        }

    }
}

let circuit = {
    diam:200, //initial diameter
    x:$('#drawing-holder').width()/2, //centered
    y: $('#drawing-holder').height()/2, //centered

    drawCircuit(diam) {
        push();
        stroke(100);
        strokeWeight(1);
        noFill();
        translate(this.x, this.y);
        ellipse(0, 0, diam, diam);
        pop();
    },
    drawPath(){
        //have arc being bolder as we go on it--> from angle -PI/2 to angle
        push();
        strokeWeight(2);
        stroke(100, 40, 100);
        noFill();
        translate(this.x, this.y);
        arc(0,0, this.diam, this.diam, 3*Math.PI/2, theta);
        pop();
    },
    drawCircuit2(totLength, totHeight){
        push();
        stroke(100);
        noFill();
        translate(this.x, this.y);
        rect(-totHeight/2 ,-totLength/2, totHeight, totLength)
    }

};

const Wire= class {
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
        this.color = 0;
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
            //negative current is represented by vector 3D notation (small dot in the middle)
            strokeWeight(3);
            ellipse(this.x, this.y, this.widthInner, this.widthInner);
            strokeWeight(1);
        }
    }
}
vectorB= { //describes the green vector B and the small increase element dl at position (diam/2, theta)
    x: circuit.x,
    y:circuit.y-circuit.diam/2,
    length : 0,
    scaling :2000,
    r:[],

    updateAngle(){ //recursion of the angle
        if (theta<=Math.PI) {theta+=dTheta;
        } else {theta=-Math.PI;}
        if (theta>=-Math.PI/2-dTheta&&theta<-Math.PI/2){
            playing=false;
            theta=-Math.PI/2;
        }
    },
    updateAngle2(){},
    updateAngle3(){},
    update (distance, wires) { //update will redraw each arrow
        //update the position as we change the angle or the diameter
        this.x = circuit.x + distance / 2 * cos(theta);
        this.y = circuit.y + distance / 2 * sin(theta);
        //update the angle for the arrow
        let Bvect = calculateB(wires,this.x,this.y);
        this.length= vectorLength(Bvect)/mu0*this.scaling;
        //draw the arrow
        let angle = (atan2(Bvect[1], Bvect[0] )); //orientate geometry to the position of the cursor (draw arrows pointing to cursor)
        push(); //move the grid
        translate(this.x, this.y);

        stroke(0);
        fill(40, 200, 40, 200);
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
        rotate(theta); //arrow on the circuit
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
        text("B", (3*this.length*Math.cos(angle)+5), (3*this.length*Math.sin(angle)+5));
        pop(); //reset the grid!
    }
};
/*function to calculate the value of B at a point [x, y] */
function calculateB(setOfWires, x, y){
    let Bx=0;
    let By=0;
    //if several wires: we add linearly their contributions
    for (let j=0; j<setOfWires.length; j++){
        let distance = dist(x, y, setOfWires[j].x, setOfWires[j].y);
        const BConst= mu0/2/Math.PI/Math.pow(distance, 2)*setOfWires[j].value;

        let r = [x-setOfWires[j].x, y-setOfWires[j].y];
        //rotate and multiply by value
        Bx+=-BConst*r[1];
        By+= BConst*r[0];
    }
    return [Bx, By];
}
function vectorLength(vector) {
    let modulus=0;
    for (let i=0; i<vector.length; i++) {modulus+= Math.pow(vector[i],2); }
    return Math.sqrt(Math.pow(vector[0], 2)+Math.pow(vector[1], 2));
}
function checkStartPos(){
    if (!playing && theta>=-Math.PI/2&& theta<=-Math.PI/2+dTheta){
        return true;
    }else{
        return false;
    }
}
function draw(){
    if(playing||changes) {
        background(255);
        push();
        noFill();
        strokeWeight(2);
        stroke(50);
        rect(5, 5, width - 10, height - 10);
        pop();

        for (let i = 0; i < wiresTot[slideIndex - 1].length; i++) {
            wiresTot[slideIndex - 1][i].drawWire();
        }
        if (slideIndex === 1) {
            circuit.drawCircuit(circuit.diam);
            vectorB.update(circuit.diam, wires1);
        }
        else if (slideIndex === 2) {
            circuit.drawCircuit2(lengthCircuit2, heightCircuit2);
        }
        else if (slideIndex === 3) {
            circuit.drawCircuit(diam3[circuitSelected]);
            vectorB.update(diam3[circuitSelected], wires3);
        }

        if (playing) {
            vectorB.updateAngle();
        }
        changes=false;
    }


}