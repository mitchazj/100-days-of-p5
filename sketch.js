/* eslint-disable no-undef, no-unused-vars */

const DAY = 2;
const PADDING = 0;
const FRAMERATE = 60;

const duration = 15 * 1000;
const enable_record = false;

const useAspectRatio = true;
const width = () => windowWidth - PADDING;
const height = () => {
  return useAspectRatio ? round((width() * 9) / 16) : windowHeight - PADDING;
};

// Setup p5.js
function setup() {
  createCanvas(width(), height());
  frameRate(FRAMERATE);

  window["day" + DAY].setup();

  if (enable_record) {
    document.querySelector("button").addEventListener("click", (e) => {
      e.preventDefault();
      setTimeout(() => {
        startRecording();
        setTimeout(() => stopRecording(), duration);
      }, 100);
    });
  } else {
    let btn = document.querySelector("button");
    btn.remove();
  }
}

// Draw p5.js
function draw() {
  window["day" + DAY].draw({
    deltaTime: deltaTime
  });
}

// This Redraws the Canvas when resized
windowResized = function () {
  resizeCanvas(width(), height());
};

////////////////////////////////////////////////////////////////////////////////////////////
// TEMPLATE
////////////////////////////////////////////////////////////////////////////////////////////

window.blank = {
  // Data
  idk: { x: 0 },

  // Custom methods
  doSomething: function () {},

  // Core drawing
  setup: function () {},

  draw: function (p5) {
    // Clear background
    background(13, 15, 19);

    // Put drawings here
    // fill(31, 134, 181); // lessgo
  }
};

////////////////////////////////////////////////////////////////////////////////////////////
// DAY 1
////////////////////////////////////////////////////////////////////////////////////////////

window.day1 = {
  // Data
  cube: { x: 50, y: 40, width: 250, height: 250, velX: 0, velY: 0 },

  // Custom methods
  checkCollisions: function (cube) {
    if (cube.x + cube.width > width() || cube.x < 0) {
      cube.velX = cube.velX * -1;
    }
    if (cube.y + cube.height > height() || cube.y < 0) {
      cube.velY = cube.velY * -1;
    }
  },

  // Core drawing
  setup: function () {
    this.cube.velX = random(0, 0.5);
    this.cube.velY = random(0, 0.5);
  },

  draw: function (p5) {
    let cube = this.cube;

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
    cube.x += cube.velX * p5.deltaTime;
    cube.y += cube.velY * p5.deltaTime;

    // Collision checks
    this.checkCollisions(cube);
  }
};

////////////////////////////////////////////////////////////////////////////////////////////
// DAY 2
////////////////////////////////////////////////////////////////////////////////////////////

window.day2 = {
  // Data
  cubes: [],
  cube_count: 40,
  base_color: null,
  lerp_color: null,

  // Custom methods
  createCube: function (x, y, width, height, velX, velY, color) {
    return { x, y, width, height, velX, velY, color };
  },

  createRandomCube: function () {
    let _width = round((random(5, 200) * (width() / 1920)) / 2);
    return this.createCube(
      random(0, width() - _width),
      random(0, height() - _width),
      _width,
      _width,
      random(-0.5, 0.5),
      random(-0.5, 0.5),
      color(31, 134, 181)
    );
  },

  drawCube: function (cube) {
    noStroke();
    fill(cube.color);
    rect(cube.x, cube.y, cube.width, cube.height);
  },

  moveCube: function (cube, p5) {
    cube.x += cube.velX * p5.deltaTime;
    cube.y += cube.velY * p5.deltaTime;
  },

  checkCollisions: function (cube) {
    if (cube.x + cube.width > width() || cube.x < 0) {
      cube.velX = cube.velX * -1;
    }
    if (cube.y + cube.height > height() || cube.y < 0) {
      cube.velY = cube.velY * -1;
    }
  },

  setup: function () {
    this.base_color = color(31, 134, 181, 180);
    this.lerp_color = color(181, 134, 31, 180);

    [...new Array(this.cube_count).keys()].forEach((x) => {
      let eyyy = this.createRandomCube();
      eyyy.color = lerpColor(
        this.base_color,
        this.lerp_color,
        x / this.cube_count
      );
      this.cubes.push(eyyy);
    });
  },

  draw: function (p5) {
    // Clear background
    background(13, 15, 19);

    // Draw and move cubes.
    for (let i = 0; i < this.cubes.length; ++i) {
      let cube = this.cubes[i];
      this.drawCube(cube);
      this.moveCube(cube, p5);
      this.checkCollisions(cube);
    }
  }
};
