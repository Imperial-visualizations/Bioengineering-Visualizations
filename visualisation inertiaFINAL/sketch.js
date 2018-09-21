//Author: Joao Pereira, Moment of Inertia simulation, comments are a good way of procrastinating

//Variables to store slider info for energy, mass and distance respectively
let eSlider, mSlider, dSlider,dSlider2,mSlider2;


let tableShow=1;
let tableOrChart=1;
let theory=false;

//conditional statement for translational transition to occur
let transition=0; //0 is for the initial condition, 1 is for transition
let transition2=0;

//accumulators
let time=0; //general accumulator
let Ltime=0; //Linear accumulator
let Ltime2=0;//Linear accumulator for second ball


function setup() {
	//Initialisation of simulation
	canvas = createCanvas(windowWidth, windowHeight);
	canvas.parent("p5canvas");
	angleMode(DEGREES);
	rectMode(CENTER);
	ellipseMode(CENTER);

}

//arrow code
function arrow(x,y,size,length){
	push();
	translate(x,y);
	beginShape();
	vertex(0,-size/4);
	vertex(-5*length*size,-size/4)
	vertex(-5*length*size,-size);
	vertex(-5*length*size-3*size,0);
	vertex(-5*size*length,size);
	vertex(-5*length*size,size/4);
	vertex(0,size/4);
	endShape(CLOSE);
	pop();
}

function draw(){

	//DOM button events to transition between different tables
	let showButton=document.getElementById('show');
	let rotTable=document.getElementById('rotTable');
	let transTable=document.getElementById('transTable');

	showButton.onclick = function(){ //Even, then odd then even, then odd
		tableShow++;
	}

	if(tableShow%2===0){
		rotTable.style.display='block';
		transTable.style.display='none';
		showButton.innerHTML="Show Translational Values";

	}
	else{
		rotTable.style.display="none";
		transTable.style.display='block';
		showButton.innerHTML="Show Rotational Values";
	}

	//HTML sliders
	let energySlider = document.getElementById("energy");
  let massSlider = document.getElementById("mass1");
  let massSlider2 = document.getElementById("mass2");
  let distanceSlider = document.getElementById("distance1");
	let distanceSlider2 = document.getElementById("distance2");

//HTML slider value display
	let energyDisplay = document.getElementById("energyDisplay");
		energyDisplay.innerHTML = energySlider.value;
			energySlider.oninput = function() {
  			energyDisplay.innerHTML = this.value;
			}
	let massDisplay1 = document.getElementById("massDisplay1");
		massDisplay1.innerHTML = massSlider.value;
			massSlider.oninput = function() {
		  	massDisplay1.innerHTML = this.value;
			}
	let massDisplay2 = document.getElementById("massDisplay2");
		massDisplay2.innerHTML = massSlider2.value;
			massSlider2.oninput = function() {
				 massDisplay2.innerHTML = this.value;
				}
	let distanceDisplay1 = document.getElementById("distanceDisplay1");
			distanceDisplay1.innerHTML = distanceSlider.value;
				distanceSlider.oninput = function() {
					distanceDisplay1.innerHTML = this.value;
				}
		let distanceDisplay2 = document.getElementById("distanceDisplay2");
				distanceDisplay2.innerHTML = distanceSlider2.value;
					distanceSlider2.oninput = function() {
						distanceDisplay2.innerHTML = this.value;
					}

	//Resetting variables to new slider values
	let energy = energySlider.value;
  let mass = massSlider.value;
  let mass2 = massSlider2.value;
  let distance = distanceSlider.value;
	let distance2 = distanceSlider2.value;

	//Variables for mass size
	let size1=mass/15;
	let size2=mass2/15;
	//Checkbox Code
	let checkBox = document.getElementById("myCheck");

	translate(-140,15);
	scale(0.7);

	//Defined variables to describe rotational events for both masses
	let inertia=mass*distance*distance;
	let inertia2=mass2*distance2*distance2;
	let omega=Math.sqrt((2*energy)/inertia);
	let omega2=Math.sqrt((2*energy/inertia2));
	let angle=omega*time*3; //scaling factors for better visual effects
	let angle2=omega2*time*3;
	let velT=Math.round(100*omega*distance)/100;
	let velT2=Math.round(100*omega2*distance2)/100;
	let angMomentum=Math.round(100*omega*inertia)/100;
	let angMomentum2=Math.round(100*omega2*inertia2)/100;

	//Defined variables to describe linear events
	let velocity=Math.sqrt((2*energy)/mass);
	let velocity2=Math.sqrt((2*energy)/mass2);
	let momentum=Math.round(100*mass*velocity)/100;
	let momentum2=Math.round(100*mass2*velocity2)/100;

	//Variables for a better visual Display
	let eDisplay=energy/1000;
	let vDisplay=Math.sqrt((2*eDisplay)/mass); //with scaling factors with more visual effects
	let vDisplay2=Math.sqrt((2*eDisplay)/mass2);
	let	yChange=vDisplay*Ltime;
	let yChange2=vDisplay2*Ltime2;


	//Table Display values through HTML DOM elements manipulation
	//Rotational
	//omega
	document.getElementById('omega1').innerHTML=Math.round(100*omega)/100;
	document.getElementById('omega2').innerHTML=Math.round(100*omega2)/100;
	//tangential velocity
	document.getElementById('velT1').innerHTML=velT;
	document.getElementById('velT2').innerHTML=velT2;
	//angular momentum
	document.getElementById('angMomentum1').innerHTML=angMomentum;
	document.getElementById('angMomentum2').innerHTML=angMomentum2;
	//moments of inertia
	document.getElementById('inertia1').innerHTML=Math.round(100*inertia)/100;
	document.getElementById('inertia2').innerHTML=Math.round(100*inertia2)/100;
	//Translational
	//velocity
	document.getElementById('velocity1').innerHTML=Math.round(100*velocity)/100;
	document.getElementById('velocity2').innerHTML=Math.round(100*velocity2)/100;
	//momentum
	document.getElementById('momentum1').innerHTML=momentum;
	document.getElementById('momentum2').innerHTML=momentum2;

//Plotly barCharts.Values are scaled so all are visible in the bar chart
var trace1 = {
  x: [Math.round(100*velocity)/100,momentum/100,Math.round(10000*omega)/100,velT,angMomentum/1000, Math.round(100*inertia)/200000],
  y: ['Velocity','Momentum','omega', 'Vel_T','angMomentum','Inertia'],
  name: 'Mass #1',
  orientation: 'h',
  marker: {
    color: 'rgb(255,0,0)',
    width: 1
  },
  type: 'bar'
};

var trace2 = {
  x: [
	Math.round(100*velocity2)/100,momentum2/100,100*Math.round(100*omega2)/100,velT2,angMomentum2/1000,Math.round(100*inertia2)/200000],
  y: ['Velocity','Momentum','omega', 'Vel_T','angMomentum','Inertia'],
  name: 'Mass #2',
  orientation: 'h',
  type: 'bar',
  marker: {
    color: 'rgb(0,0,255)',
    width: 1
  }
};
//DOM button events to transition between different tables and bar chart
let cOrTButton=document.getElementById('chartOrTable');
let table=document.getElementById('tableContainer');
let chart=document.getElementById('barChartContainer');

cOrTButton.onclick = function(){ //Even, then odd then even, then odd
	tableOrChart++;
}

if(tableOrChart%2===0){ //if even show table
	table.style.display='block';
	chart.style.display='none';
	cOrTButton.innerHTML="Show Bar Chart";
	showButton.style.display='block';

}
else{ 													//if odd show bar chart
	table.style.display="none";
	chart.style.display='block';
	cOrTButton.innerHTML="Show Table of Values";
	showButton.style.display='none';
}

var data = [trace1, trace2];

var layout = {
  title: 'Rotational & Translational Quantities',
  barmode: 'group'
};

Plotly.newPlot('barChart', data, layout);

//Animation begins
	//resetting at the end of every loop
	clear();
	background(255);
	//Border for part 1 of simulation
	push();
	rect(600,350,800,400);
	pop();

	//Linear motion of mass on the right
	//Mass1
	if (yChange>=200+(size1*3/2)&&transition===0){ //Length of boundary is used as condition for transition
		transition=1;//only travels half of rectangle
		Ltime=0;
		}
		else if (yChange>=400+(size1*3)){//for the rest of the motion, travels the whole rectangle before boucing
			if(transition===1){
				Ltime=0;
			}
		}
		//Mass2
		if (yChange2>=200+(size2*3/2)&&transition2===0){ //Length of boundary is used as condition for bounce
			transition2=1;//only travels half of rectangle
			Ltime2=0;
			}
			else if (yChange2>=400+(size2*3)){//for the rest of the motion, travels the whole rectangle before boucing
				if(transition2===1){
					Ltime2=0;
				}
			}

		//Re-setting value of yChange
		yChange=vDisplay*Ltime;//mass1
		yChange2=vDisplay2*Ltime2;//mass2

		push();
			fill(255,0,0);
			if(transition===0){
				line(800-distance,350-yChange+(size1*1.5),800,350-yChange+(size1*1.5));
				ellipse(800,350-yChange+(size1*1.5),size1*3,size1*3);
			}
			else if(transition===1){
				line(800-distance,550-yChange+(size1*3/2),800,550-yChange+(size1*3/2));
				ellipse(800,550-yChange+(size1*3/2),size1*3,size1*3);
			}
		pop();

		push();
			fill(0,0,255);
			if(transition2===0){
				line(800-distance2,350-yChange2+(size2*3/2),800,350-yChange2+(size2*1.5));
				ellipse(800,350-yChange2+(size2*1.5),size2*3,size2*3);
			}
			else if(transition2===1){
				line(800-distance2,550-yChange2+(size2*3/2),800,550-yChange2+(size2*1.5));
				ellipse(800,550-yChange2+(size2*3/2),size2*3,size2*3);
			}
		pop();
		Ltime2++;
		Ltime++;
		//End of linear mass Code*/

		//Rotating Mass code

		push();
			translate(400,350);//Setting axis of rotation
			ellipse(0,0,5,5);

			push();
				rotate(angle);
				line(0,distance,0,0);
				fill(255,0,0);
				if (checkBox.checked == true){
				arrow(0,distance,3,omega/2);//arrow tracking the rotation
				}
				ellipse(0,distance,size1*3,size1*3)
			pop();
			push();
				fill(0,0,255);
				rotate(angle2);
				line(0,distance2,0,0);
				if (checkBox.checked == true){
				arrow(0,distance2,3,omega2/2);
				}
				ellipse(0,distance2,size2*3,size2*3)
			pop();

		pop();
		//End of rotating mass code

		rect(600,125,800,50);//Title rectangle
		push();
		stroke(0);
		rect(600,575,800,50)
		pop();

	//Code for dotted line Boundary
	for(i=0;i<=19;i++){
		if(i%2===0){
			line(600, 150+(i*21),600 , 170+(i*21));
		}
	}
	time++;
}
