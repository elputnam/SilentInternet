// Animation for Trio Tan
// Incorporates code from
// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/024-perlinnoiseflowfield.html

//Gradient
const Y_AXIS = 1;
let c1, c2, c3, c4;
let rise = 0;
let h;

//Flow field
// var inc = 0.1;
var inc = 100;
// var scl = 10;
var scl = 100;
var cols, rows;
var zoff = 0;
var fr;
var particles = [];
var flowfield;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // colorMode(HSB, 360, 100, 100, 100);
  background(0);

  //Gradient
  c1 = color(0, 102, 153);
  c2 = color(204, 70, 0);
  c3 = color(0, 0.01);
  c4 = color(0, 0.01);
  h = height/2;

  //Flow field
  cols = floor(width / scl);
  rows = floor(height / scl);
  fr = createP('');

  flowfield = new Array(cols * rows);

  for (var i = 0; i < 300; i++) {
    particles[i] = new Particle();
  }

}

function draw() {
  // background(0);
  if (h >= -height){

    //Gradient
    setGradient(0, 0, width, height, c1, c2, Y_AXIS);
    h -= 0.5;
  }
  //rise += 1;

  //Orb
  noStroke();
  for (let i = 0; i < 150; i++){
    fill(255, 150, 0, 1);
    ellipse(width/2, height+h, 5*i);
  }

  if (h >= -height){
    
  }

 

  if (h <= -height){
    setGradient(0, 0, width, height, c3, c4, Y_AXIS);

     //Flow field
    var yoff = 0;
  for (var y = 0; y < rows; y++) {
    var xoff = 0;
    for (var x = 0; x < cols; x++) {
      var index = x + y * cols;
      var angle = noise(xoff, yoff, zoff) * TWO_PI * 4;
      var v = p5.Vector.fromAngle(angle);
      v.setMag(1);
      flowfield[index] = v;
      xoff += inc;
      stroke(0, 50);
      }
      yoff += inc;
      zoff += 0.0003;
      // zoff += 0.3;
    }

    for (var i = 0; i < particles.length; i++) {
      particles[i].follow(flowfield);
      particles[i].update();
      particles[i].edges();
      particles[i].show();
    }
  }
}

function setGradient(x, y, w, h, c1, c2, axis) {
  noFill();
  if (axis === Y_AXIS){
    for (let i = y; i <= y + h; i++) {
      let inter = map(i, y, y + h, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x + w, i);
    }
  }
}

class Particle {
  constructor() {
    this.pos = createVector(width/2, random(height));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxspeed = 4;
    // this.maxspeed = 10;
    this.prevPos = this.pos.copy();
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  follow(vectors) {
    var x = floor(this.pos.x / scl);
    var y = floor(this.pos.y / scl);
    var index = x + y * cols;
    var force = vectors[index];
    this.applyForce(force);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  show() {
    stroke(0, 255, 255, 10);
    strokeWeight(1);
    line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
    this.updatePrev();
  }

  updatePrev() {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
  }

  edges() {
    if (this.pos.x > width) {
      this.pos.x = 0;
      this.updatePrev();
    }
    if (this.pos.x < 0) {
      this.pos.x = width;
      this.updatePrev();
    }
    if (this.pos.y > height) {
      this.pos.y = 0;
      this.updatePrev();
    }
    if (this.pos.y < 0) {
      this.pos.y = height;
      this.updatePrev();
    }

  }

}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}
