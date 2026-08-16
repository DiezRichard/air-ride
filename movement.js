let maxRotation = Math.PI / 4;
 rotationSpeed = 10.0;
let rotationReturnSpeed = 5.0;


function moveMesh(mesh, deltaTime) {
  if (!mesh) return;
  
  let combinedDirection = moveDirectionTouch + moveDirectionGamepad + moveDirectionKeyboard;
  
  if (isSpinning) {
    let elapsed = Date.now() - spinStartTime;
    let t = elapsed * 0.7 / spinDuration;
    
    if (t >= 1) {
      isSpinning = false;
      mesh.rotation.z = spinStartRotation;
    } else {
      mesh.rotation.z = (spinDirection * Math.PI * 2 * t) % (Math.PI * 1.95);
    }
  }
  
  if (!isSpinning) {
    let targetRotation = -combinedDirection * maxRotation;
    mesh.rotation.z += (targetRotation - mesh.rotation.z) * rotationSpeed * deltaTime;
    
    if (combinedDirection === 0) {
      mesh.rotation.z += (0 - mesh.rotation.z) * rotationReturnSpeed * deltaTime;
    }
  }
  
  // Movimiento vertical con onda
  let wave = Math.sin(Date.now() * 0.01) * 0.2;
  mesh.position.y = wave;
  
  // Desplazamiento lateral con velocidad configurable
  //mesh.position.x += combinedDirection +deltaTime;
  
  mesh.dirty = true;
}