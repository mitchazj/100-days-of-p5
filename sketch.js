/* eslint-disable no-undef, no-unused-vars */

const FRAMERATE = 30;
const enable_record = true;
const duration = 15 * 1000;
const useAspectRatio = true;
const width = () => windowWidth - 20;
const height = () =>
  useAspectRatio ? round((width() * 9) / 16) : windowHeight - 20;

// const cubes = [];
// const makeCube = (x, y, width, height) => {
//   return { x, y, width, height };
// };
const cube = { x: 50, y: 40, width: 250, height: 250, velX: 0, velY: 0 };

function checkCollisions(cube) {
  if (cube.x + cube.width > width() || cube.x < 0) {
    cube.velX = cube.velX * -1;
  }
  if (cube.y + cube.height > height() || cube.y < 0) {
    cube.velY = cube.velY * -1;
  }
}

function setup() {
  createCanvas(width(), height());
  frameRate(FRAMERATE);

  cube.velX = random(0, 0.5);
  cube.velY = random(0, 0.5);

  if (enable_record) {
    document.querySelector("button").addEventListener("click", (e) => {
      e.preventDefault();
      setTimeout(() => {
        startRecording();
        setTimeout(() => stopRecording(), duration);
      }, 100);
    });
  }
}

function draw() {
  // Clear background
  background(13, 15, 19);

  // Put drawings here
  fill(31, 134, 181);
  noStroke();
  rect(cube.x, cube.y, cube.width, cube.height);
  fill(255);
  textStyle(BOLD);
  textSize(140);
  text("p5*", cube.x + 10, cube.height + cube.y);

  // Move cube
  cube.x += cube.velX * deltaTime;
  cube.y += cube.velY * deltaTime;

  // Collision checks
  checkCollisions(cube);
}

// This Redraws the Canvas when resized
windowResized = function () {
  resizeCanvas(width(), height());
};
