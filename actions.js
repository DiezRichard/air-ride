let moveDirectionTouch = 0;
let moveDirectionGamepad = 0;
let moveDirectionKeyboard = 0;

// --- Doble tap ---
let lastDirection = 0;
let lastTapTime = 0;
let doubleTapThreshold = 300; // ms
let isSpinning = false;
let spinStartTime = 0;
let spinDuration = 600; // ms duración del giro completo

function checkDoubleTap(direction) {
  const now = Date.now();
  if (
    direction !== 0 &&
    direction === lastDirection &&
    (now - lastTapTime) < doubleTapThreshold
  ) {
    triggerSpin(direction);
    lastDirection = 0;
  } else {
    lastDirection = direction;
    lastTapTime = now;
  }
}

function triggerSpin(direction) {
  isSpinning = true;
  spinStartTime = Date.now();
  spinDirection = -direction; // -1 izq, 1 der
  
}

let spinStartRotation = 0; // ángulo en el que empezó el spin

function triggerSpin(direction) {
  isSpinning = true;
  spinStartTime = Date.now();
  spinDirection = -direction; // -1 izq, 1 der
 // spinStartRotation = 0; // <<< guardar desde dónde parte
}



// --- Teclado ---


let keysPressed = { left: false, right: false };

window.addEventListener("keydown", e => {
  
  // --- Movimiento lateral ---
  if (e.code === "ArrowLeft") {
    if (!keysPressed.left) checkDoubleTap(-1);
    keysPressed.left = true;
  }
  if (e.code === "ArrowRight") {
    if (!keysPressed.right) checkDoubleTap(1);
    keysPressed.right = true;
  }
  
  // actualizar moveDirectionKeyboard según teclas presionadas
  moveDirectionKeyboard = (keysPressed.right ? 1 : 0) + (keysPressed.left ? -1 : 0);
  
  // --- Spacebar ---
  if (e.code === "Space") {
    e.preventDefault(); // evita scroll o focus indeseado
    resetButton.click();
    if (!begin) startButton.click();
  }
});

window.addEventListener("keyup", e => {
  if (e.code === "ArrowLeft") keysPressed.left = false;
  if (e.code === "ArrowRight") keysPressed.right = false;
  
  // recalcular moveDirectionKeyboard
  moveDirectionKeyboard = (keysPressed.right ? 1 : 0) + (keysPressed.left ? -1 : 0);
});

// --- Gamepad conexión ---
if ("getGamepads" in navigator) {
  window.addEventListener("gamepadconnected", e => {
    console.log("Gamepad connected:", e.gamepad);
  });
  window.addEventListener("gamepaddisconnected", e => {
    console.log("Gamepad disconnected:", e.gamepad);
  });
}
let gp = navigator.getGamepads()[0];


let prevDir = 0; // estado anterior

function updateGamepadMoveDirection() {
  gp = navigator.getGamepads()[0];
  if (!gp) return;
  
  let dir = 0;
  
  // --- Start / Select = reset + begin ---
  if (gp.buttons[8]?.pressed || gp.buttons[9]?.pressed) {
    
    startButton.click();
    resetButton.click();
  }
  
  // --- Spin automático con L1 / R1 ---
  if (gp.buttons[4]?.pressed) { // L1
    if (!isSpinning) triggerSpin(-1); // izquierda
  }
  if (gp.buttons[5]?.pressed) { // R1
    if (!isSpinning) triggerSpin(1); // derecha
  }
  
  // --- Movimiento lateral normal ---
  // L2 / D-Pad izquierda
  if (gp.buttons[6]?.pressed || gp.buttons[14]?.pressed) dir = -1;
  // R2 / D-Pad derecha
  if (gp.buttons[7]?.pressed || gp.buttons[15]?.pressed) dir = 1;
  
  // Stick izquierdo X
  const axisX = gp.axes[0] || 0;
  if (axisX < -0.3) dir = -1;
  if (axisX > 0.3) dir = 1;
  
  // --- Edge detection para doble tap ---
  if (dir !== 0 && prevDir === 0) {
    checkDoubleTap(dir);
  }
  
  prevDir = dir;
  moveDirectionGamepad = dir;
}

// --- Detectar toque lateral ---
window.addEventListener('touchstart', e => {
  for (let touch of e.changedTouches) {
    
    moveDirectionTouch = touch.clientX < window.innerWidth / 2 ? -1 : 1;
    checkDoubleTap(moveDirectionTouch); // <<< importante
  }
});
window.addEventListener('touchend', e => {
  moveDirectionTouch = 0;
});
window.addEventListener('touchcancel', e => {
  moveDirectionTouch = 0;
});

// --- Mover cámara lateralmente ---
function updateCamera() {
  if (moveDirectionTouch !== 0) {
    camera.position.x += camera.right.x * moveDirectionTouch * moveSpeed;
    camera.position.y += camera.right.y * moveDirectionTouch * moveSpeed;
    camera.position.z += camera.right.z * moveDirectionTouch * moveSpeed;
    camera.dirty = true;
  }
  
  if (moveDirectionGamepad !== 0) {
    camera.position.x += camera.right.x * moveDirectionGamepad * moveSpeed;
    camera.position.y += camera.right.y * moveDirectionGamepad * moveSpeed;
    camera.position.z += camera.right.z * moveDirectionGamepad * moveSpeed;
    camera.dirty = true;
  }
  
  if (moveDirectionKeyboard !== 0) {
    camera.position.x += camera.right.x * moveDirectionKeyboard * moveSpeed;
    camera.position.y += camera.right.y * moveDirectionKeyboard * moveSpeed;
    camera.position.z += camera.right.z * moveDirectionKeyboard * moveSpeed;
    camera.dirty = true;
  }
}