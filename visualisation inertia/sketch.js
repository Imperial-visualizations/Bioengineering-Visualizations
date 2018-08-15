//Author: Joao Pereira, Moment of Inertia simulation, comments are a good way of procrastinating

//Variables to store slider info for energy, mass and distance respectively
let eSlider, mSlider, dSlider;

//conditional statement for bounce to occur
let bounce=0; //0 is for the initial condition, 1 is for bouncing above and moving down
// and 2 is used for bouncing below and moving up

//accumulators
let time=0; //general accumulator
let Ltime=0; //Linear accumulator


function setup() {
	//Initialisation of simulation
	createCanvas(windowWidth, windowHeight);
	angleMode(DEGREES);
	rectMode(CENTER);
	ellipseMode(CENTER);

	//Creating sliders
	eSlider=createSlider(1,100,5); //energy slider
	eSlider.position(190,600);
	eSlider.style('width', '250px');
	eName=createDiv('Energy(kJ)');
	eName.position(112,608);

	mSlider=createSlider(1,10,5); //mass slider
	mSlider.position(520,600);
	mSlider.style('width', '250px');
	mName=createDiv('Mass(kg)');
	mName.position(458,608);

	dSlider=createSlider(0.1,15,0.5); //distance slider
	dSlider.position(870,600);
	dSlider.style('width', '250px');
	dName=createDiv('Distance(m)');
	dName.position(785,608);

	//Labels for each rectangle
	rotDescription=createDiv('Point mass rotating about a stationary axis');
	rotDescription.position(250,127);

	transDescription=createDiv('Point mass colliding elastically with its boundaries');
	transDescription.position(627,127);

}

function draw(){

	//Values chosen through sliders by user
	let energy=eSlider.value();
	let mass=mSlider.value();
	let distance=dSlider.value();

	//Defined variables to describe rotational events
	let inertia=mass*distance*distance;
	let omega=Math.sqrt((2*energy)/inertia);
	let angle=omega*time;

	//Displaying Moment of inertia of rotational point mass
	if(time!==0){
		iLabel.hide();
		eLabel.hide();
	}
	iLabel=createDiv('Moment of Inertia = '+Math.round(10*inertia)/10);
	iLabel.position(205,530);


	//Displaying instantaneous energy of both masses
	eLabel=createDiv('Energy = '+energy+' J');
	eLabel.position(575,170);


	//Defined variables to describe linear events
	let velocity=Math.sqrt((2*energy)/mass);
	let	yChange=velocity*Ltime;

	//resetting at the end of every loop
	clear();
	background(255);
	//Border for part 1 of simulation
	push();
	stroke(0);
	rect(600,350,800,400);
	rect(600,138,800,25);
	pop();

	//Linear motion of mass on the right

	if (yChange>=200-(mass*3/2)&&bounce===0){ //Length of boundary is used as condition for bounce
		bounce=1;//only travels half of rectangle
		Ltime=0;
		}
		else if (yChange>=400-(mass*3)){//for the rest of the motion, travels the whole rectangle before boucing
			if(bounce===1){
				bounce=2;
				Ltime=0;
			}
			else if(bounce===2){
				bounce=1;
				Ltime=0;
			}
		}
		//Re-setting value of yChange
		yChange=velocity*Ltime;

		push();
			fill(0);
			if(bounce===0){
				ellipse(800,350-yChange,mass*3,mass*3);
			}
			else if(bounce===1){
				ellipse(800,150+yChange+(mass*3/2),mass*3,mass*3);
			}
			else if(bounce===2){
				ellipse(800,550-yChange-(mass*3/2),mass*3,mass*3);
			}
		pop();
		//End of linear mass Code

		//Rotating Mass code

		push();
			translate(400,350);//Setting axis of rotation
			ellipse(0,0,5,5);

			push();
				rotate(angle);
				line(0,distance*10,0,0);
				fill(0);
				ellipse(0,distance*10,mass*3,mass*3)
			pop();
		pop();

	//Code for dotted line Boundary
	for(i=0;i<=19;i++){
		if(i%2===0){
			line(600, 150+(i*21),600 , 170+(i*21));
		}
	}
	Ltime++;
	time++;

}
