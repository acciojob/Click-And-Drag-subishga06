//Your code goes here 

const container = document.querySelector(".items");
const cubes = document.querySelectorAll(".item");

let activeCube = null;
let offsetX = 0;
let offsetY = 0;

// Make each cube draggable
cubes.forEach(cube => {
  cube.style.position = "absolute";
  
  // Place cubes initially in a grid-like formation
  const rect = cube.getBoundingClientRect();
  cube.style.left = rect.left + "px";
  cube.style.top = rect.top + "px";

  cube.addEventListener("mousedown", (e) => {
    activeCube = cube;

    // Calculate mouse offset inside cube
    offsetX = e.clientX - cube.offsetLeft;
    offsetY = e.clientY - cube.offsetTop;

    e.preventDefault();
  });
});

// Move cube with mouse
document.addEventListener("mousemove", (e) => {
  if (!activeCube) return;

  const containerRect = container.getBoundingClientRect();
  const cubeRect = activeCube.getBoundingClientRect();

  // New positions before boundary check
  let newLeft = e.clientX - offsetX;
  let newTop = e.clientY - offsetY;

  // Boundary enforcement
  if (newLeft < containerRect.left) {
    newLeft = containerRect.left;
  }
  if (newTop < containerRect.top) {
    newTop = containerRect.top;
  }
  if (newLeft + cubeRect.width > containerRect.right) {
    newLeft = containerRect.right - cubeRect.width;
  }
  if (newTop + cubeRect.height > containerRect.bottom) {
    newTop = containerRect.bottom - cubeRect.height;
  }

  // Apply new position
  activeCube.style.left = newLeft + "px";
  activeCube.style.top = newTop + "px";
});

// Drop cube on mouse up
document.addEventListener("mouseup", () => {
  activeCube = null;
});
