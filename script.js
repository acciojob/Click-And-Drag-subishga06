// Your code goes here 
const container = document.querySelector('.items');
const cubes = document.querySelectorAll('.item');

// State variables for the currently dragged element
let activeCube = null;
let offset = { x: 0, y: 0 }; // Stores the offset from the mouse pointer to the cube's top-left corner

/**
 * MOUSE DOWN: Start Dragging
 * @param {MouseEvent} e - The mousedown event
 */
function dragStart(e) {
    // 1. Check if the element clicked is an item
    if (e.target.classList.contains('item')) {
        activeCube = e.target;
        activeCube.classList.add('dragging');
        
        // 2. Get the current position of the cube and the container's boundaries
        const cubeRect = activeCube.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        // 3. Calculate the offset (grab point)
        // This ensures the cube doesn't jump when clicked, but stays centered under the mouse
        // We calculate the difference between where the mouse clicked and the cube's top-left corner
        offset.x = e.clientX - cubeRect.left;
        offset.y = e.clientY - cubeRect.top;

        // 4. Attach global listeners for movement and release
        // Attach to document to ensure drag/drop still works even if mouse leaves the cube
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);
    }
}

/**
 * MOUSE MOVE: Move the Element
 * @param {MouseEvent} e - The mousemove event
 */
function drag(e) {
    if (!activeCube) return; // Only execute if an item is currently active (being dragged)

    // Prevent default browser behavior (e.g., text selection)
    e.preventDefault(); 

    // Get Container and Cube dimensions for boundary calculation
    const containerRect = container.getBoundingClientRect();
    const cubeRect = activeCube.getBoundingClientRect();
    
    // 1. Calculate the new raw position of the top-left corner of the cube
    // New X = Mouse X position - Container X position - Offset X (grab point)
    let newX = e.clientX - containerRect.left - offset.x;
    let newY = e.clientY - containerRect.top - offset.y;

    // 2. BOUNDARY CONSTRAINTS (Clamping)
    
    // Horizontal (X-axis) boundary
    const maxPosX = containerRect.width - cubeRect.width;
    newX = Math.max(0, Math.min(newX, maxPosX));

    // Vertical (Y-axis) boundary
    const maxPosY = containerRect.height - cubeRect.height;
    newY = Math.max(0, Math.min(newY, maxPosY));
    
    // 3. Apply the final constrained position using 'left' and 'top' CSS properties
    activeCube.style.left = `${newX}px`;
    activeCube.style.top = `${newY}px`;
}

/**
 * MOUSE UP: Stop Dragging
 */
function dragEnd() {
    if (!activeCube) return;

    // 1. Clean up
    activeCube.classList.remove('dragging');
    activeCube = null;
    
    // 2. Remove global listeners to stop movement
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', dragEnd);
}

// 4. Initialization: Apply initial absolute positioning and set up listeners
cubes.forEach((cube, index) => {
    // Set initial position if not already set by inline style/data attributes
    // This is crucial for absolute positioning to work correctly before the first drag
    if (!cube.style.left) {
        // Calculate initial grid-like position (e.g., a 5x5 grid)
        const size = 150 + 20; // Cube width + margin/gap
        const cols = 5;
        const row = Math.floor(index / cols);
        const col = index % cols;
        
        cube.style.left = `${col * size + 20}px`;
        cube.style.top = `${row * size + 20}px`;
    }

    // Attach the initial mousedown listener to each cube to start the drag process
    cube.addEventListener('mousedown', dragStart);
});
