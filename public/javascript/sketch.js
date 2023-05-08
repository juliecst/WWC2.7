
// the code is adapted from the class example
// Create connection to Node.JS Server
const socket = io();

let canvas;
let roll = 0;
let pitch = 0;
let yaw = 0;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  createEasyCam();
  background(200);
}
 function draw() {
  xpos = map(roll, 0, windowWidth, -windowWidth/2, windowWidth/2);
  ypos = map(yaw, 0, height, -height/2, height/2);
  zpos = map(pitch,0, width,-width/2, width/2 );

  stroke(250,222,229,20);
  strokeWeight(0.5)
  lights();
  ambientMaterial(123,21,32, 50)
  //translate(xpos, ypos/2,zpos/3);
  translate(roll*4, yaw*4, pitch*5);
  rotateY(frameCount * 0.01);
      rotateZ(mouseX * 0.001);
      rotateX(frameCount *0.001);  
  sphere(30, 16, 14);
   
    
  }
  


//process the incoming OSC message and use them for our sketch
function unpackOSC(message){

  /*-------------

  This sketch works with the Synthien App to use the gyrosensor of an iPhone
  ---------------*/

   //maps phone rotation directly 
   if(message.address == "/gyrosc/gyro"){
     roll = message.args[0]; 
     pitch = message.args[1];
     yaw = message.args[2];
   } 

  //uses the rotation rate to keep rotating in a certain direction
  if(message.address == "/syntien/motion/1/scope1"){
    roll += map(message.args[0],-3,3,-0.1,0.1);
    pitch += map(message.args[1],-3,3,-0.1,0.1);
    yaw += map(message.args[2],-3,3,-0.1,0.1);
  }
}

//Events we are listening for
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Connect to Node.JS Server
socket.on("connect", () => {
  console.log(socket.id);
});

// Callback function on the event we disconnect
socket.on("disconnect", () => {
  console.log(socket.id);
});

// Callback function to recieve message from Node.JS
socket.on("message", (_message) => {

  console.log(_message);

  unpackOSC(_message);

});