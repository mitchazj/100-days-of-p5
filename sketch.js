/* eslint-disable no-undef, no-unused-vars */

const DAY = 4; // change the day being drawn here
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

////////////////////////////////////////////////////////////////////////////////////////////
// DAY 3
////////////////////////////////////////////////////////////////////////////////////////////

window.day3 = {
  // Data
  SET_COLOR: 150,
  UNSET_COLOR: 50,
  grid: { res_x: 60, res_y: 0, w: 0, data: [] },
  snake: {
    body: [{ x: 10, y: 10, direction: 1, length: 7 }],
    state: 0
  },
  // 0 = up, 1 = right, 2 = down, 3 = left

  // Custom methods
  getDisplacedX: function (joint, distance = 1) {
    return joint.direction === 1
      ? joint.x + distance
      : joint.direction === 3
      ? joint.x - distance
      : joint.x;
  },

  getDisplacedY: function (joint, distance = 1) {
    return joint.direction === 0
      ? joint.y - distance
      : joint.direction === 2
      ? joint.y + distance
      : joint.y;
  },

  moveSnake: function (delta) {
    this.snake.state += 0.2 * delta;
    let lead = this.snake.body[0]; // Get the lead joint

    // Are we changing direction this step? (art only for now)
    if (floor(random(1, 4)) === 1) {
      // lead.direction = floor(random(0, 4)); // pure random
      lead.direction += 1;
      if (lead.direction === 4) lead.direction = 0;
    }

    // Have we hit an edge with the leading joint?
    if (lead.x === this.grid.res_x - 1 && lead.direction === 1) {
      lead.direction = 2;
    }
    if (lead.y === this.grid.res_y - 1 && lead.direction === 2) {
      lead.direction = 3;
    }
    if (lead.x === 0 && lead.direction === 3) {
      lead.direction = 0;
    }
    if (lead.y === 0 && lead.direction === 0) {
      lead.direction = 1;
    }

    // Are we moving this step?
    if (this.snake.state > 1) {
      lead.x = this.getDisplacedX(lead);
      lead.y = this.getDisplacedY(lead);
      this.snake.state = 0;
    }

    // For each joint in the snakes body
    for (let l = 0; l < this.snake.body.length; ++l) {
      // Get the joint
      let joint = this.snake.body[l];

      // All along the joint
      for (let c = 0; c < joint.length; ++c) {
        let x = this.getDisplacedX(joint, -1 * c);
        let y = this.getDisplacedY(joint, -1 * c);
        if (x >= 0 && x < this.grid.res_x && y >= 0 && y < this.grid.res_y) {
          // this.grid.data[x][y] = this.SET_COLOR; // correct, but using art for now
          if (floor(random(1, 4)) >= 2) {
            this.grid.data[x][y] = this.SET_COLOR + this.grid.data[x][y] / 5;
          } else {
            this.grid.data[x][y] = this.UNSET_COLOR;
          }
        }
      }

      // Is this the last joint and did we move?
      if (this.snake.state === 0 && l === this.snake.body.length - 1) {
        // Unset the previous point
        let x = this.getDisplacedX(joint, -1 * joint.length);
        let y = this.getDisplacedY(joint, -1 * joint.length);

        if (x >= 0 && x < this.grid.res_x && y >= 0 && y < this.grid.res_y) {
          // this.grid.data[x][y] = this.UNSET_COLOR; // correct, but using art for now
          this.grid.data[x][y] = this.UNSET_COLOR + this.grid.data[x][y] / 2;
        }
      }
    }
  },

  // This is really bad but I hacked it together super quickly and it
  // mostly does the job
  locateX: function (x, y) {
    let gap =
      (height() - this.grid.res_y * this.grid.w) / (this.grid.res_y + 1);
    let start_x =
      width() / 2 -
      (this.grid.res_x * this.grid.w + gap * (this.grid.res_x - 1)) / 2;
    return start_x + x * (this.grid.w + gap);
  },

  locateY: function (x, y) {
    let gap =
      (height() - this.grid.res_y * this.grid.w) / (this.grid.res_y + 1);
    let start_y =
      height() / 2 -
      (this.grid.res_y * this.grid.w + gap * (this.grid.res_y - 1)) / 2;
    return start_y + y * (this.grid.w + gap);
  },

  // Core drawing
  setup: function () {
    this.grid.w = floor(width() / (this.grid.res_x + 1));
    this.grid.res_y = floor((this.grid.res_x + 1) * (height() / width()));
    console.log(this.grid);
    for (let x = 0; x < this.grid.res_x; ++x) {
      this.grid.data.push(
        [...new Array(this.grid.res_y)].map((x) => this.UNSET_COLOR)
      );
    }
    // Place snake in centre
    this.snake.body[0].x = floor(this.grid.res_x / 2);
    this.snake.body[0].y = floor(this.grid.res_y / 2);
  },

  draw: function (p5) {
    // Clear background
    background(13, 15, 19);

    // Put drawings here
    for (let x = 0; x < this.grid.res_x; ++x) {
      for (let y = 0; y < this.grid.res_y; ++y) {
        noStroke();
        fill(31, 134, 181, this.grid.data[x][y]);
        rect(this.locateX(x, y), this.locateY(x, y), this.grid.w, this.grid.w);
      }
    }

    // Update the snake
    this.moveSnake(p5.deltaTime);
  }
};

////////////////////////////////////////////////////////////////////////////////////////////
// DAY 4
////////////////////////////////////////////////////////////////////////////////////////////

window.day4 = {
  // Data
  SET_COLOR: 150,
  UNSET_COLOR: 50,
  grid: { res_x: 10, res_y: 0, w: 0, data: [] },
  snake: {
    body: [{ x: 8, y: 1, direction: 1, length: 22 }],
    state: 0
  },
  halt: 0,
  haltAt: 15000,
  // 0 = up, 1 = right, 2 = down, 3 = left

  // Custom methods
  getDisplacedX: function (joint, distance = 1) {
    return joint.direction === 1
      ? joint.x + distance
      : joint.direction === 3
      ? joint.x - distance
      : joint.x;
  },

  getDisplacedY: function (joint, distance = 1) {
    return joint.direction === 0
      ? joint.y - distance
      : joint.direction === 2
      ? joint.y + distance
      : joint.y;
  },

  jointSnake: function (x, y, direction) {
    let new_head = { x, y, direction, length: 1 };
    this.snake.body.unshift(new_head);
    return this.snake.body[0];
  },

  setColorAlongJoint: function (joint, color, l, a = -1) {
    // Locate the previous point by reverse displacement
    let x = this.getDisplacedX(joint, a * l);
    let y = this.getDisplacedY(joint, a * l);
    // Unset it gracefully
    if (x >= 0 && x < this.grid.res_x && y >= 0 && y < this.grid.res_y) {
      this.grid.data[x][y] = color;
    }
  },

  moveSnake: function (delta) {
    if (this.halt < this.haltAt) this.snake.state += 0.02 * delta;

    let lead = this.snake.body[0]; // Get the lead joint

    // Are we moving this step?
    if (this.snake.state > 1) {
      ++this.halt;

      // Have we hit an edge with the leading joint?
      if (lead.x === this.grid.res_x - 1 && lead.direction === 1) {
        // lead.direction = 2;
        lead = this.jointSnake(lead.x, lead.y, 2);
      } else if (lead.y === this.grid.res_y - 1 && lead.direction === 2) {
        // lead.direction = 3;
        lead = this.jointSnake(lead.x, lead.y, 3);
      } else if (lead.x === 0 && lead.direction === 3) {
        // lead.direction = 0;
        lead = this.jointSnake(lead.x, lead.y, 0);
      } else if (lead.y === 0 && lead.direction === 0) {
        // lead.direction = 1;
        lead = this.jointSnake(lead.x, lead.y, 1);
      } else {
        // No new lead point, so just increment the length of the
        // lead joint.
        ++lead.length; // Increment the lead joint
      }

      // Move the lead forwards
      lead.x = this.getDisplacedX(lead);
      lead.y = this.getDisplacedY(lead);

      // Reset state counter
      this.snake.state = 0;
      // console.log("-----------------------------");

      // For each joint in the snakes body
      for (let l = 0; l < this.snake.body.length; ++l) {
        // Get the joint
        let joint = this.snake.body[l];

        // Is this the last joint?
        if (l === this.snake.body.length - 1) {
          --joint.length; // Decrement the end joint
          // console.log(`lead length ${lead.length}`);
          // console.log(`Trimmed to: ${joint.length}`);
        }

        // Foreach square along the joint, set the color
        for (let c = 0; c < joint.length; ++c) {
          this.setColorAlongJoint(joint, this.SET_COLOR, c);
        }

        // console.log(
        //   `Joint #${l + 1} is ${joint.length} long at ${joint.x}, ${joint.y}`
        // );

        // Is this the last joint?
        if (l === this.snake.body.length - 1) {
          // Unset the last color
          this.setColorAlongJoint(joint, this.UNSET_COLOR, joint.length);

          if (joint.length === 0) {
            // Yeet it away if the joint no longer has length
            // console.log(`>> Removed at: ${joint.length}`);
            let dropped = this.snake.body.pop();
            // Clean up the square left behind because we'll miss it next time.
            this.setColorAlongJoint(dropped, this.UNSET_COLOR, 1);
            // fill(131, 134, 181, 0.5);
            // rect(this.locateX(x, y), this.locateY(x, y), this.grid.w, this.grid.w);
          }
        }
      }
    }
  },

  // This is really bad but I hacked it together super quickly and it
  // mostly does the job
  locateX: function (x, y) {
    let gap =
      (height() - this.grid.res_y * this.grid.w) / (this.grid.res_y + 1);
    let start_x =
      width() / 2 -
      (this.grid.res_x * this.grid.w + gap * (this.grid.res_x - 1)) / 2;
    return start_x + x * (this.grid.w + gap);
  },

  locateY: function (x, y) {
    let gap =
      (height() - this.grid.res_y * this.grid.w) / (this.grid.res_y + 1);
    let start_y =
      height() / 2 -
      (this.grid.res_y * this.grid.w + gap * (this.grid.res_y - 1)) / 2;
    return start_y + y * (this.grid.w + gap);
  },

  // Core drawing
  setup: function () {
    this.grid.w = floor(width() / (this.grid.res_x + 1));
    this.grid.res_y = floor((this.grid.res_x + 1) * (height() / width()));
    console.log(this.grid);
    for (let x = 0; x < this.grid.res_x; ++x) {
      this.grid.data.push(
        [...new Array(this.grid.res_y)].map((x) => this.UNSET_COLOR)
      );
    }
    // Place snake in centre
    // this.snake.body[0].x = floor(this.grid.res_x / 2);
    // this.snake.body[0].y = floor(this.grid.res_y / 2);
  },

  draw: function (p5) {
    // Clear background
    background(13, 15, 19);

    // Put drawings here
    for (let x = 0; x < this.grid.res_x; ++x) {
      for (let y = 0; y < this.grid.res_y; ++y) {
        noStroke();
        fill(31, 134, 181, this.grid.data[x][y]);
        rect(this.locateX(x, y), this.locateY(x, y), this.grid.w, this.grid.w);
      }
    }

    // Update the snake
    this.moveSnake(p5.deltaTime);
  }
};
