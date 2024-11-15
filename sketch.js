
let buses = [];
let passengers = [];
let busColors = ['#FF6347', '#4682B4', '#32CD32'];
let shapes = ['circle', 'square', 'triangle'];
let currentBusIndex = 0;
let currentPassengers = [];
let busX = -300;
let busSpeed = 2;
let busStopped = false;
let busStopPosition = 300;
let passengersBoarded = 0;
let passengersAlighted = 0;
let allPassengersHandled = false;
let flashColor = null;
let particles = [];
let sound;

/*function preload() {
  sound = loadSound('sound.mp3');
}*/ //only working on p5 website

function setup() {
  createCanvas(800, 400);

  //sound.loop();

  buses = [
    { color: busColors[0], passengersOn: 5, passengersOff: 2, passengerShapes: [0, 1, 2, 0, 1] },
    { color: busColors[1], passengersOn: 3, passengersOff: 1, passengerShapes: [2, 0, 1] },
    { color: busColors[2], passengersOn: 4, passengersOff: 3, passengerShapes: [1, 2, 0, 1] },
  ];

  loadNextBus();
}

function draw() {
  if (flashColor) {
    background(flashColor);
  } else {
    background(220);
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();
    if (particles[i].isFinished()) {
      particles.splice(i, 1);
    }
  }

  drawBus(busX, 200);

  if (!busStopped && busX < busStopPosition) {
    busX += busSpeed;
    if (busX >= busStopPosition) {
      busX = busStopPosition;
      busStopped = true;
      loadNextBus();
    }
  }

  let allPassengersBoarded = true;
  let allPassengersAlighted = true;

  for (let p of currentPassengers) {
    if (p.status === 'boarding') {
      allPassengersBoarded = false;
      if (p.x < busX + 170) { 
        p.x += 2;
      } else {
        p.status = 'onboard';
        passengersBoarded++;
      }
      drawPassenger(p); 
    } else if (p.status === 'alighting') {
      allPassengersAlighted = false;
      if (p.x < width) { 
        p.x += 2;
      } else {
        p.status = 'off';
        passengersAlighted++;
      }
      drawPassenger(p); 
    }
  }

  if (busStopped && passengersBoarded === buses[currentBusIndex].passengersOn && passengersAlighted === buses[currentBusIndex].passengersOff) {
    allPassengersHandled = true;
  }

  if (allPassengersHandled) {
    busStopped = false;
    busX += busSpeed;
  }

  if (busX > width) {
    currentBusIndex = (currentBusIndex + 1) % buses.length;
    busX = -300;
    allPassengersHandled = false;
  }
}

function loadNextBus() {
  passengersBoarded = 0;
  passengersAlighted = 0;

  for (let i = 0; i < buses[currentBusIndex].passengersOff; i++) {
    if (currentPassengers[i]) {
      currentPassengers[i].status = 'alighting';
      currentPassengers[i].x = busX + 170;
    }
  }

  let newPassengers = buses[currentBusIndex].passengerShapes.map((shapeIndex, i) => {
    return {
      shape: shapes[shapeIndex],
      color: busColors[(shapeIndex + 1) % busColors.length],
      x: -50 - i * 40, 
      y: 270,
      index: currentPassengers.length + i,
      status: 'boarding'
    };
  });

  currentPassengers = currentPassengers.concat(newPassengers);
}

function drawBus(x, y) {
  fill(buses[currentBusIndex].color);
  rect(x, y, 240, 80, 20); 

  fill(255);
  rect(x + 20, y + 15, 40, 30, 5);  
  rect(x + 70, y + 15, 40, 30, 5);  
  rect(x + 120, y + 15, 40, 30, 5); 

  fill(200);
  rect(x + 170, y + 15, 40, 50, 5);

  fill(0);
  ellipse(x + 50, y + 85, 40, 40);
  ellipse(x + 170, y + 85, 40, 40);

  fill(buses[currentBusIndex].color);
  arc(x + 120, y + 5, 240, 40, PI, TWO_PI);
}

function drawPassenger(passenger) {
  fill(passenger.color);
  if (passenger.shape === 'circle') {
    ellipse(passenger.x, passenger.y, 30, 30);
  } else if (passenger.shape === 'square') {
    rect(passenger.x - 15, passenger.y - 15, 30, 30);
  } else if (passenger.shape === 'triangle') {
    triangle(passenger.x, passenger.y - 15, passenger.x - 15, passenger.y + 15, passenger.x + 15, passenger.y + 15);
  }
}

function mousePressed() {
  flashColor = color(random(255), random(255), random(255));
  setTimeout(() => flashColor = null, 200); 
}

function keyPressed() {
  for (let i = 0; i < 150; i++) { 
    particles.push(new Particle(random(width), random(height)));
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-4, 4); 
    this.vy = random(-4, 4); 
    this.alpha = 255;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 5;
  }

  show() {
    noStroke();
    fill(255, this.alpha);
    ellipse(this.x, this.y, random(10, 20));
  }

  isFinished() {
    return this.alpha <= 0;
  }
}
