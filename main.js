let mainCharacters = ["pinkBomberAnim","bomberAnim"];

let playerName = mainCharacters[Math.floor(Math.random() * mainCharacters.length)];


let playerAnim = createNameFilter(playerName, 2);

//-----------------------//

async function loadWSpinner() {
 
 
setGeometry(1)
roundType="edges";
//bulgeAmount=0.1;
subdivisions=1;
roundingFactor=0.0;
cellSpacingFactor =1.0;


 showSpinner();
 
 let mat = "plastic";
 let playerScale = 1;
 
 if (playerName.startsWith("bomberAnim") || playerName.startsWith("pinkBomberAnim")) {
 playerScale = 0.7;}
// if (playerName === "ardilla") playerScale = 0.4;
 
 //~~~~~~~~~~~~~~~~~~~~~~~~

setGeometry(3);

// await loadJsonToProgram("obj/ardilla.json", mat, { scale: 0.6});
 
 
 await loadJsonToProgram("obj/bomberAnim.json", mat, { scale: 1 });
 
 await loadJsonToProgram("obj/pinkBomberAnim.json", mat, { scale: 1 });
 
 animationSpeed = 80;
 setInterval(() => {
playerAnim.next();
 }, animationSpeed);
 
 //~~~~~~~~~~~~~~~~~~~~~~~~~
 
roundType="edges";
let scaleFactor=1.1;


setGeometry(3);
 

let qualityLabel = "Med";


// --- TREE ---
await loadJsonToProgram("obj/tree.json", mat, { scale: 3*scaleFactor, quality: qualityLabel });
let tree = meshes.find(mesh => mesh.name.startsWith("tree_0_" + qualityLabel));
tree.position.y = 50;
tree.quality = qualityLabel;
assetList.push(tree);

// --- PINE 1 ---

await loadJsonToProgram("obj/pine1.json", mat, { scale: 3*scaleFactor, quality: qualityLabel });
let pine1 = meshes.find(mesh => mesh.name.startsWith("pine1_0_" + qualityLabel));
pine1.position.y = 50;
pine1.quality = qualityLabel;
assetList.push(pine1);

// --- PINE 2 ---
await loadJsonToProgram("obj/pine2.json", mat, { scale: 4*scaleFactor, quality: qualityLabel });
let pine2 = meshes.find(mesh => mesh.name.startsWith("pine2_0_" + qualityLabel));
pine2.position.y = 50;
pine2.quality = qualityLabel;
assetList.push(pine2);

// --- SNOW TREE ---
await loadJsonToProgram("obj/snowtree.json", mat, { scale: 3*scaleFactor, quality: qualityLabel });
let snowtree = meshes.find(mesh => mesh.name.startsWith("snowtree_0_" + qualityLabel));
snowtree.position.y = 50;
snowtree.quality = qualityLabel;
assetListSnow.push(snowtree);

// --- SNOW PINE 1 ---
await loadJsonToProgram("obj/snowpine1.json", mat, { scale: 3*scaleFactor, quality: qualityLabel });
let snowpine1 = meshes.find(mesh => mesh.name.startsWith("snowpine1_0_" + qualityLabel));
snowpine1.position.y = 50;
snowpine1.quality = qualityLabel;
assetListSnow.push(snowpine1);

// --- SNOW PINE 2 ---
await loadJsonToProgram("obj/snowpine2.json", mat, { scale: 4*scaleFactor, quality: qualityLabel });
let snowpine2 = meshes.find(mesh => mesh.name.startsWith("snowpine2_0_" + qualityLabel));
snowpine2.position.y = 50;
snowpine2.quality = qualityLabel;
assetListSnow.push(snowpine2);

// --- AUTUMN TREE ---
await loadJsonToProgram("obj/autumntree.json", mat, { scale: 3*scaleFactor, quality: qualityLabel });
let autumntree = meshes.find(mesh => mesh.name.startsWith("autumntree_0_" + qualityLabel));
autumntree.position.y = 50;
autumntree.quality = qualityLabel;
assetListAutumn.push(autumntree);

// --- AUTUMN PINE 1 ---
await loadJsonToProgram("obj/autumnpine1.json", mat, { scale: 3*scaleFactor, quality: qualityLabel });
let autumnpine1 = meshes.find(mesh => mesh.name.startsWith("autumnpine1_0_" + qualityLabel));
autumnpine1.position.y = 50;
autumnpine1.quality = qualityLabel;
assetListAutumn.push(autumnpine1);

// --- AUTUMN PINE 2 ---
await loadJsonToProgram("obj/autumnpine2.json", mat, { scale: 3*scaleFactor, quality: qualityLabel });
let autumnpine2 = meshes.find(mesh => mesh.name.startsWith("autumnpine2_0_" + qualityLabel));
autumnpine2.position.y = 50;
autumnpine2.quality = qualityLabel;
assetListAutumn.push(autumnpine2);

//console.log(qualityLabel+" quality assets loaded");

//~~~~~~~~~~~~~~~~~~~~~~~~~
//RINGS
setGeometry(2);

//cubes,radius,scale
createCubeRing(20, 4, 1);
 
 let ring = meshes.find(mesh => mesh.name.startsWith("cubeRing"));
ring.rotation.x=radian*90;

//~~~~~~~~~~~~~~~~~~~~~~~~~

//DECORATIONS//


subdivisions = 1;
roundingFactor = 0;
bulgeAmount=0;
cellSpacingFactor=1;
 
 await loadJsonToProgram("obj/deadtree.json", mat, { scale: 0.4});
 let deadtree = meshes.find(mesh => mesh.name == "deadtree_0");
 deadtree.position.y = 50;
// assetList.push(deadtree);
assetListSnow.push(deadtree);
// assetListAutumn.push(deadtree);
 
 await loadJsonToProgram("obj/greenSprout.json", mat, { scale: 0.4 });
let greenSprout = meshes.find(mesh => mesh.name == "greenSprout_0");
greenSprout.position.y = 50;
//assetList.push(greenSprout);
//assetListSnow.push(greenSprout);
assetListAutumn.push(greenSprout);

await loadJsonToProgram("obj/roses.json", mat, { scale: 0.4 });
let roses = meshes.find(mesh => mesh.name == "roses_0");
roses.position.y = 50;
assetList.push(roses);
//assetListSnow.push(roses);
//assetListAutumn.push(roses);
 
 await loadJsonToProgram("obj/rock.json", mat, { scale: 1 });
 let rock = meshes.find(mesh => mesh.name == "rock_0");
 rock.rotation.x = -radian * 90;
 
 await loadJsonToProgram("obj/rock2.json", mat, { scale: 1 });
 let rock2 = meshes.find(mesh => mesh.name == "rock2_0");
 rock2.rotation.x = -radian * 90;
 
 //~~~~~~~~~~~~~~~~~~~~~~~~~
 
 bulgeAmount = 0;
 roundingFactor = 0;
 subdivisions = 1;
 cellSpacingFactor = 1;
 createPlaneMesh(34, 50, mat);
 
 
 


 hideSpinner();
}




//~~~~~~~~~~~~~~~~~~~~~~~~~

let viewMatrix=null;

let vpMatrix =null;
 
//~~~~~~~~~~~~~~~~~~~~~~~~~
 
gl.uniformMatrix4fv(
 projectionUniformLocation,
 false,
 new Float32Array(transposeMatrix(pMatrix))
);

//~~~~~~~~~~~~~~~~~~~~~~~~~

function isColliding(obj1, obj2, radiusXZ, radiusY) {
 
 // Ajustes según tipo de objeto
if (obj2.name.includes("pine")) radiusY = 13;

if (obj2.name.includes("Ring")) 
{
 radiusZ = 10;
 radiusY = 6;
}

 let dx = obj1.position.x - obj2.position.x;
 let dz = obj1.position.z - obj2.position.z;
 let dy = obj1.position.y - obj2.position.y;
 
 let distXZ = Math.sqrt(dx * dx + dz * dz);
 
 return distXZ < radiusXZ && Math.abs(dy) < radiusY;
}
//~~~~~~~~~~~~~~~~~~~~~~~~~

let crashed=false;

let cameraSpeed = 0.6;
let deceleration = 0.005;

let camPosX=0;
let camPosZ=0;
let lastCamPosX=null;
let lastCamPosZ=null;

//~~~~~~~~~~~~~~~~~~~~~~~~~

let terrainLists = [assetList, assetListSnow,assetListAutumn];

//~~~~~~~~~~~~~~~~~~~~~~~~~

let segmentLength = 200;

//~~~~~~~~~~~~~~~~~~~~~~~~~

//resetButton.click()
resetButton.style.display="none";

//~~~~~~~~~~~~~~~~~~~~~~~~~

let orientation="landscape";

//-----------------------//

let lastFPSUpdate = performance.now();

//~~~~~~~~~~~~~~~~~~~~~~~~~

let lightViewMatrix=null;
let lightUpdateTimer = 0; 

let lightOrtho = orthoMatrixRowMajor(-250, 250, -200, 200, 0.1, 200);

let skipNames = [];

let elapsedTime=0;

let shadowMeshes = [];

let player = meshes.find(m => m.name.startsWith(playerName));
 
let lightMat=[];

let tLightMat = new Float32Array(16);

let tempModelMatrix=new Float32Array(16);
let tempViewMatrix =new Float32Array(16);

let obstaclesToDraw = [];

let gridSelector=[];

let slotBaseMap = [
 ['tree', 'pine1', 'pine2', 'roses', 'cubeRing'],
 ['autumntree', 'autumnpine1', 'autumnpine2', 'greenSprout','cubeRing'],
 ['snowtree', 'snowpine1', 'snowpine2', 'deadtree','cubeRing']
];

let lastFrameCount=0;

function getTerrainHeightAt(x, z) {
 return noise.perlin2(
  (x+randomSeed) * frequency,
  (z+randomSeed) * frequency
 ) * beef;
}

let localOffset = {
 x: 1.3,
 z: 7.2 //3.65
};
if (orientation === "landscape" && isMobile) {
 localOffset.x = 1.7;
 localOffset.z = 7.2;
}
if (orientation === "landscape" && !isMobile) {
 localOffset.x = 2;
 localOffset.z = 4.6;
}

gridSelector = (orientation === "portrait")
? (isMobile ? [16, 42] : [, 42])
: (isMobile ? [22, 42] : [22, 42]);


let canCollect=true;

const collectedRings = new Set();

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\\
let trisIn=0;

let collisionCount=0;

function main() {
 
 
 
if (!pause) {
 
 
player = meshes.find(m => m.name.startsWith(playerName));


let now = performance.now();
let deltaTime = (now - lastFrameTime) / 1000;
deltaTime = Math.min(deltaTime, 0.1);

//moveSpeed = Math.min(deltaTime * 15 * 3, 1);
lastFrameTime = now;

// ---- FPS Counter ----
frameCount++;

let elapsedTime = now - lastFPSUpdate;
if (elapsedTime >= 500) {
//fpsDisplay.textContent = "FPS: " + frameCount * 2;


lastFrameCount=frameCount*2;
frameCount = 0;
lastFPSUpdate = now;
}

hiScoreDisplay.textContent = "FPS: "+lastFrameCount+"\nScore: " + (-camPosZ+ringPoints) + "\nHi-Score: " + hiScore;
trisIn=0;
// ---- Cámara ----
if (!crashed) {
 
resetButton.style.display = "none";
if (camPosZ % 100 === 0) cameraSpeed += 0.01;

if(begin){

camera.position.z -= cameraSpeed * deltaTime * 100;

}

camera.dirty = true;
} else {
cameraSpeed = 0;//Math.max(cameraSpeed - deceleration * deltaTime * 100, 0);
//camera.position.z -= cameraSpeed * deltaTime * 100;
camera.dirty = true;
}

skipNames = [...playerAnim.getNamesToExclude()];

camPosX = Math.floor(camera.position.x / (cellSize * tileScale));
camPosZ = Math.floor(camera.position.z / (cellSize * tileScale));




// ---- Obstacle Grid ----


if(obstacleGrid.length==0){
 
 obstacleGrid = createAssetGrid(gridSelector[0], gridSelector[1], camPosX, camPosZ, difficulty*0.2);

 
 lastCamPosX=camPosX;
 lastCamPosZ=camPosZ;
}

if (lastCamPosX != camPosX || lastCamPosZ != camPosZ) {
 
//obstacleGrid.length = 0;

obstacleGrid = createAssetGrid(gridSelector[0], gridSelector[1], camPosX, camPosZ, difficulty*0.2);



lastCamPosX=camPosX;
lastCamPosZ=camPosZ;

}


// ---- View Matrix ----
if (!viewMatrix || camera.dirty) viewMatrix = updateViewMatrix();

// ---- Shadow Meshes ----
shadowMeshes.length = 0;
if (player) shadowMeshes.push(player);

// ---- Shadow Pass ----
gl.bindFramebuffer(gl.FRAMEBUFFER, shadowFramebuffer);
gl.viewport(0, 0, 4096, 4096);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
gl.useProgram(lightShaderProgram);

if (!lightViewMatrix) lightViewMatrix = updateLightViewMatrix();

lightUpdateTimer += deltaTime;
if (lightUpdateTimer >= 0.5) {
lightViewMatrix = updateLightViewMatrix();
lightUpdateTimer = 0;
}

lightMat = matrixMultiply(lightOrtho, lightViewMatrix);
tLightMat.set(transposeMatrix(lightMat));

//~~~~~~~~~~~~~~~~~~~~~~~~~

// ---- Precalcular obstacle info ----

obstaclesToDraw.length = 0;

for (let i = 0; i < obstacleGrid.length; i++) {
 for (let j = 0; j < obstacleGrid[i].length; j++) {
  let assetIndex = obstacleGrid[i][j];
  if (assetIndex <= 0) continue;
  
  let slot = (assetIndex - 1) % 5;
  let segmentIndex = Math.floor((-camPosZ - i) / segmentLength);
  segmentIndex = ((segmentIndex % terrainLists.length) + terrainLists.length) % terrainLists.length;
  let wantedBase = slotBaseMap[segmentIndex][slot];
  

  
  // si llega aquí, lo agregamos
  obstaclesToDraw.push({ i, j, wantedBase, localOffset });
 }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~

// ---- Shadow Pass Draw Obstacles ----
for (let obs of obstaclesToDraw) {
let mesh = meshes.find(m => m.name.split('_')[0] === obs.wantedBase);
if (!mesh) continue;

mesh.position.x = (camPosX + obs.j) * cellSize * tileScale - offSet * obs.localOffset.x;
mesh.position.z = (camPosZ + obs.i) * cellSize * tileScale - offSet * obs.localOffset.z;
mesh.position.y = getTerrainHeightAt(mesh.position.x, mesh.position.z) 
mesh.rotation.y = camPosX + obs.j + camPosZ + obs.i;

if (mesh.name.startsWith("cubeRing")) {
 
 mesh.rotation.y = 0;
 mesh.position.y+=8;
 
if(mesh.position.z>player.position.z) {
 
 continue;
}
}

mesh.modelMatrix = toWorldView(mesh);
tempModelMatrix.set(transposeMatrix(mesh.modelMatrix));
gl.uniformMatrix4fv(uModelMatrix, false, tempModelMatrix);
gl.uniformMatrix4fv(uLightMatrix, false, tLightMat);
drawMeshShadow(mesh, tLightMat);
}

//~~~~~~~~~~~~~~~~~~~~~~~~~

// ---- Shadow Pass Player ----
if (player) {
player.modelMatrix = toWorldView(player);
tempModelMatrix.set(transposeMatrix(player.modelMatrix));
gl.uniformMatrix4fv(uModelMatrix, false, tempModelMatrix);
gl.uniformMatrix4fv(uLightMatrix, false, tLightMat);
drawMeshShadow(player, tLightMat);
}

gl.bindFramebuffer(gl.FRAMEBUFFER, null);

//~~~~~~~~~~~~~~~~~~~~~~~~~

// ---- Main Pass ----
gl.useProgram(cameraShaderProgram);
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
gl.clearColor(0.1, 0.1, 0.1, 0.9);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

tempViewMatrix.set(transposeMatrix(viewMatrix));
gl.uniformMatrix4fv(viewMatrixUniformLocation, false, tempViewMatrix);

gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, shadowDepthTexture);
gl.uniform1i(shadowMapLocation, 0);
gl.uniformMatrix4fv(lightMatrixLocation, false, tLightMat);

//~~~~~~~~~~~~~~~~~~~~~~~~~

// ---- Anim Player ----
for (let mesh of meshes) {
 if (mesh.name.startsWith(playerName) && !crashed) {
  
  mesh.rotation.x = -radian * 90;
  
  if (!mesh.lastY) mesh.lastY = 0;
  if (mesh.velocityY === undefined) mesh.velocityY = 0; 
  
  moveMesh(mesh, deltaTime);
  
  mesh.position.x = camera.position.x;
  mesh.position.z = camera.position.z - 40;
  
  mesh.position.y = mesh.lastY;
  

  let targetY = getTerrainHeightAt(mesh.position.x, mesh.position.z) + 7;
  let gravity = -30; 

  if (mesh.lastY > targetY) {
   mesh.velocityY += gravity * deltaTime;
  } else {
   mesh.velocityY = 0; 
  }
  
 
  mesh.lastY += mesh.velocityY * deltaTime;
  

  if (mesh.lastY < targetY) {
   mesh.lastY = targetY;
   mesh.velocityY = 0;
  }
  
  mesh.position.y = mesh.lastY;

  let step = 2; 

  let backHeight = getTerrainHeightAt(mesh.position.x, mesh.position.z+step) + 7;
  let frontHeight = getTerrainHeightAt(mesh.position.x, mesh.position.z-step) + 7;
  
  let slopeX = (frontHeight - backHeight) / (2 * step);
  
if(frontHeight>backHeight && (mesh.position.y-targetY<1)){
 
  let angleX = Math.atan(slopeX);

  mesh.rotation.x = -radian * 90 + angleX;

}


  
 
  camera.position.y = mesh.position.y;
 }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~


// ---- Draw Meshes ----
 for (let mesh of meshes) {

 if (skipNames.includes(mesh.name)) continue;


//~~~~~~~~~~~~~~~~~~~~~~~~~

// TERRAIN
if (mesh.name === "cell") {
 
mesh.position.x = camPosX * cellSize * tileScale * cellSpacingFactor - offSet * ((orientation === "landscape") ? 2.7 : 2.3);
mesh.position.z = camPosZ * cellSize * tileScale * cellSpacingFactor - offSet * ((orientation === "landscape") ? 8: 8);


for (let i = 0; i < mesh.vertices.length; i++) {
 
mesh.vertices[i * 3 + 1] = noise.perlin2(
 (mesh.vertices[i * 3 + 0] + mesh.position.x+randomSeed) * frequency,
 (mesh.vertices[i * 3 + 2] + mesh.position.z+randomSeed) * frequency
) * beef;
}

updateMeshNormals(mesh);

gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer);
gl.bufferSubData(gl.ARRAY_BUFFER, 0, mesh.vertices);

gl.uniform1f(meshPositionZLocation, mesh.position.z);
gl.uniform1f(meshPositionXLocation, mesh.position.x);
gl.uniform1i(uIsCell, 1);

mesh.modelMatrix = toWorldView(mesh);
tempModelMatrix.set(transposeMatrix(mesh.modelMatrix));
gl.uniformMatrix4fv(modelMatrixUniformLocation, false, tempModelMatrix);
gl.uniform1f(camPosZLocation, camera.position.z);
gl.uniform1f(tileScaleLocation, tileScale);
drawMeshGl(mesh);

trisIn+=mesh.indices.length/3;

} else gl.uniform1i(uIsCell, 0);

//~~~~~~~~~~~~~~~~~~~~~~~~~

// PLAYER
if (mesh.name.startsWith(playerName)) {
mesh.modelMatrix = toWorldView(mesh);
tempModelMatrix.set(transposeMatrix(mesh.modelMatrix));
gl.uniformMatrix4fv(modelMatrixUniformLocation, false, tempModelMatrix);
gl.uniform1f(camPosZLocation, camera.position.z);
gl.uniform1f(tileScaleLocation, tileScale);
drawMeshGl(mesh);

trisIn+=mesh.indices.length/3;
}

//~~~~~~~~~~~~~~~~~~~~~~~~~

// OBSTACLES
obstToDraw: for (let obs of obstaclesToDraw) {
 
let baseOfMesh = mesh.name.split('_')[0];
if (baseOfMesh !== obs.wantedBase) continue;

mesh.position.x = (camPosX + obs.j) * cellSize * tileScale - offSet * obs.localOffset.x;
mesh.position.z = (camPosZ + obs.i) * cellSize * tileScale - offSet * obs.localOffset.z;

mesh.position.y = getTerrainHeightAt(mesh.position.x, mesh.position.z) 


mesh.rotation.y = camPosX + obs.j + camPosZ + obs.i;

if(mesh.name.startsWith("cubeRing")){
 
 mesh.rotation.y = 0;
 mesh.position.y+=8;
 mesh.rotation.z+=0.003;
}

// COLLISION
let maxRange = 6, minRange = 4;
let angle = (player.rotation.z * 180 / Math.PI) % 360;
if (angle > 180) angle -= 360;
if (angle < -180) angle += 360;
let t = Math.min(Math.abs(angle) / 90, 1);
let collisionRange = maxRange + t * (minRange - maxRange);

if (isColliding(player, mesh, collisionRange, 10) && (!mesh.name.startsWith("deadtree")&&!mesh.name.startsWith("roses")&&!mesh.name.startsWith("greenSprout"))){
 
 

if(!mesh.name.startsWith("cubeRing")) {
 
crashed = true;
cameraSpeed=0;
camera.position.y=player.position.y;

resetButton.style.display = "block";
hiScore = Math.max(hiScore, (-camPosZ+ringPoints));
localStorage.setItem("hiScore", hiScore);


}else {
 //RINGS
 
 if(!player.lastCollectingZ || Math.abs(camera.position.z-player.lastCollectingZ)>15){
 player.lastCollectingZ=camera.position.z;
 
playRingSound();

obstacleGrid[obs.i][obs.j]=0;

//mesh.rotation.z-=10;

if(!crashed){
 
 
showFloatingText("+50", window.innerWidth/2, window.innerHeight/2);

 ringPoints += 50;
 
}//if crashed
}

//continue obstToDraw;


}//if cubeRing

}//iscolliding 

if(mesh.name.startsWith("cubeRing")) {

if(mesh.position.z>=player.position.z)
 {
  continue obstToDraw;

 }
}
 
 

mesh.modelMatrix = toWorldView(mesh);
tempModelMatrix.set(transposeMatrix(mesh.modelMatrix));
gl.uniformMatrix4fv(modelMatrixUniformLocation, false, tempModelMatrix);
gl.uniform1f(camPosZLocation, camPosZ);
gl.uniform1f(cameraPositionZLocation, camera.position.z);
gl.uniform1f(cameraPositionXLocation, camera.position.x);
gl.uniform1f(tileScaleLocation, tileScale * cellSize);
drawMeshGl(mesh);

trisIn+=(mesh.indices.length/3);

}//obstacles

}//mesh of meshes




//~~~~~~~~~~~~~~~~~~~~~~~~~

if (camera.dirty) camera.dirty = false;

updateGamepadMoveDirection();
updateCamera();
updateCameraHeightByOrientation();


}//pause

requestAnimationFrame(main);

}//Main



//-----------------------//

//window.onload=requestAnimationFrame(main);



//-----------------------//

//let animationSpeed = 200; // ms

function updateCameraHeightByOrientation() {
 
 //resetButton.click()
 
 if (window.innerWidth > window.innerHeight) {
// Landscape
orientation="landscape";

camera.position.y += 10;
camera.rotation.x=radian*5;
// más bajo en landscape
 } else {
// Portrait
orientation="portrait";

camera.position.y += 15;
camera.rotation.x=radian*15;// más alto en portrait
 }
 camera.dirty = true; // obligar actualización de la vista
}


function checkFullscreenLandscape() {
 
 if (!document.fullscreenElement) {
if (document.documentElement.requestFullscreen) {
 document.documentElement.requestFullscreen();
} else if (document.documentElement.webkitRequestFullscreen) { // Safari
 document.documentElement.webkitRequestFullscreen();
} else if (document.documentElement.msRequestFullscreen) { // IE11
 document.documentElement.msRequestFullscreen();
}
 }
}


/*
// Llamadas al cambiar tamaño o rotación
window.addEventListener("resize", checkFullscreenLandscape);
window.addEventListener("orientationchange", checkFullscreenLandscape);
*/

// Detectar cambios de orientación o tamaño
//window.addEventListener("resize", updateCameraHeightByOrientation);
//window.addEventListener("orientationchange", updateCameraHeightByOrientation);

// Llamar una vez al inicio
//updateCameraHeightByOrientation();



window.onload = async () => {
 await loadWSpinner(); // esperamos a que cargue todo
 updateCameraHeightByOrientation(); // setear cámara inicial


createStartButton();
 requestAnimationFrame(main);
 


};





