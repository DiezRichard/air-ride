

function matrixTimesVector(v, matrix) {
let x1 = v.x * matrix[0][0] + v.y * matrix[1][0] + v.z * matrix[2][0];
let y1 = v.x * matrix[0][1] + v.y * matrix[1][1] + v.z * matrix[2][1];
let z1 = v.x * matrix[0][2] + v.y * matrix[1][2] + v.z * matrix[2][2];

let vec = { x: x1, y: y1, z: z1 };

return vec;
}

//-----------------------//

function cross(v1,v2)
{
let vx = v1.y*v2.z-v1.z*v2.y;
let vy = v1.x*v2.z-v1.z*v2.x;
let vz = v1.x*v2.y-v1.y*v2.x;

let newV={x:vx,y:vy,z:vz};

return newV;
};

//-----------------------//

function vectorSub(v1,v2)
{
let newV={x:(v1.x-v2.x),y:(v1.y-v2.y),z:(v1.z-v2.z)};

return newV;
}

//-----------------------//

function vectorAdd(v1, v2)
{
let newV = { x: v1.x + v2.x, y: v1.y + v2.y, z: v1.z + v2.z };

return newV;
}

//-----------------------//

function normV(v)
{
let len=(Math.sqrt((v.x*v.x+v.y*v.y+v.z*v.z)));
//len=Math.floor(len);
let newV={x:v.x/len,y:v.y/len,z:v.z/len};

return newV;
}

//-----------------------//

function dotP(v1,v2)
{
let result= v1.x*v2.x+v1.y*v2.y+v1.z*v2.z;

return result;
}

//-----------------------//

function vectorMultif(v, f)
{
let newV= {x:v.x*f,y:v.y*f,z:v.z*f};

return newV;
}

//-----------------------//

function meshByMatrix(mesh, matrix) {
for (let i = 0; i < mesh.length; i++) {
const tri = mesh[i];

for (let j = 0; j < 3; j++) {
const v = tri[j];

const x = v.x;
const y = v.y;
const z = v.z;

v.x = x * matrix[0][0] + y * matrix[0][1] + z * matrix[0][2] + matrix[0][3];
v.y = x * matrix[1][0] + y * matrix[1][1] + z * matrix[1][2] + matrix[1][3];
v.z = x * matrix[2][0] + y * matrix[2][1] + z * matrix[2][2] + matrix[2][3];
v.w = x * matrix[3][0] + y * matrix[3][1] + z * matrix[3][2] + matrix[3][3];
}
// No es necesario tocar tri.color, tri.visible, etc., ya están en el objeto
}

// No retorna nada porque modifica in-place
}

//-----------------------//


function normalizeVector(vector) 
{
let length = vectorLength(vector);
return { x: vector.x / length, y: vector.y / length, z: vector.z / length };
}

//-----------------------//

function vectorLength(vector) 
{
return Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
}

//-----------------------//

function calculateTriangleNormal(triangle) 
{
// Calculate the cross product of two vectors formed by the triangle's vertices
let v1 = vectorFromVertices(triangle[0], triangle[1]);
let v2 = vectorFromVertices(triangle[0], triangle[2]);

let normal = {
x: v1.y * v2.z - v1.z * v2.y,
y: v1.z * v2.x - v1.x * v2.z,
z: v1.x * v2.y - v1.y * v2.x
};

return normal;
}

//-----------------------//

function vectorFromVertices(v1, v2) {
return { x: v2.x - v1.x, y: v2.y - v1.y, z: v2.z - v1.z };
}

//-----------------------//

function matrixMultiply(matrix1, matrix2)
{
let result = [];
for (let i = 0; i < matrix1.length; i++) {
result[i] = [];
for (let j = 0; j < matrix2[0].length; j++) {
let sum = 0;
for (let k = 0; k < matrix1[0].length; k++) {
sum += matrix1[i][k] * matrix2[k][j];
}
result[i][j] = sum;
}
}
return result;
}

//-----------------------//

function createRotationMatrix(axis, angle) {
let cos = Math.cos(angle);
let sin = Math.sin(angle);
let t = 1 - cos;

let matrix = [
[t * axis.x * axis.x + cos, t * axis.x * axis.y - sin * axis.z, t * axis.x * axis.z + sin * axis.y, 0],
[t * axis.x * axis.y + sin * axis.z, t * axis.y * axis.y + cos, t * axis.y * axis.z - sin * axis.x, 0],
[t * axis.x * axis.z - sin * axis.y, t * axis.y * axis.z + sin * axis.x, t * axis.z * axis.z + cos, 0],
[0, 0, 0, 1]
];

return matrix;
}

//-----------------------//

function centerMeshOnGround(mesh) {
let minX = Infinity, maxX = -Infinity;
let minZ = Infinity, maxZ = -Infinity;
let minY = Infinity;

for (let tri of mesh) {
for (let v of tri) {
if (v.x < minX) minX = v.x;
if (v.x > maxX) maxX = v.x;
if (v.z < minZ) minZ = v.z;
if (v.z > maxZ) maxZ = v.z;
if (v.y < minY) minY = v.y;
}
}

let offsetX = (minX + maxX) / 2;
let offsetZ = (minZ + maxZ) / 2;

for (let tri of mesh) {
for (let v of tri) {
v.x -= offsetX;
v.z -= offsetZ;
v.y -= minY; // base toca suelo
}
}
}

function centerMesh(mesh) {
let minX = Infinity, maxX = -Infinity;
let minY = Infinity, maxY = -Infinity;
let minZ = Infinity, maxZ = -Infinity;

for (let tri of mesh) {
for (let v of tri) {
if (v.x < minX) minX = v.x;
if (v.x > maxX) maxX = v.x;
if (v.y < minY) minY = v.y;
if (v.y > maxY) maxY = v.y;
if (v.z < minZ) minZ = v.z;
if (v.z > maxZ) maxZ = v.z;
}
}

let offsetX = (maxX + minX) / 2;
let offsetY = (maxY + minY) / 2;
let offsetZ = (maxZ + minZ) / 2;

for (let tri of mesh) {
for (let v of tri) {
v.x -= offsetX;
v.y -= offsetY;
v.z -= offsetZ;
}
}
}

//-----------------------//

function precalcularNormal(mesh) {
for (let tri of mesh) {
let [v0, v1, v2] = tri;

// Vector U = v1 - v0
let ux = v1.x - v0.x;
let uy = v1.y - v0.y;
let uz = v1.z - v0.z;

// Vector V = v2 - v0
let vx = v2.x - v0.x;
let vy = v2.y - v0.y;
let vz = v2.z - v0.z;

// Producto cruzado U × V
let nx = uy * vz - uz * vy;
let ny = uz * vx - ux * vz;
let nz = ux * vy - uy * vx;

// Normalizar
let len = Math.hypot(nx, ny, nz);
if (len < 0.0001) {
nx = ny = nz = 0; // triángulo degenerado
} else {
nx /= len;
ny /= len;
nz /= len;
}

// Asignar normal a los 3 vértices
v0.normal = { x: nx, y: ny, z: nz };
v1.normal = { x: nx, y: ny, z: nz };
v2.normal = { x: nx, y: ny, z: nz };

// (opcional) Guardar también en tri.normal si quieres
tri.normal = { x: nx, y: ny, z: nz };
}
}

//-----------------------//

function computeRotationMatrix(axis, angle) {
let x = axis.x, y = axis.y, z = axis.z;
let len = Math.hypot(x, y, z);
if (len === 0) return mat4.identity();

x /= len; y /= len; z /= len;

let s = Math.sin(angle);
let c = Math.cos(angle);
let t = 1 - c;

return [
[t*x*x + c, t*x*y - s*z, t*x*z + s*y, 0],
[t*x*y + s*z, t*y*y + c, t*y*z - s*x, 0],
[t*x*z - s*y, t*y*z + s*x, t*z*z + c, 0],
[0, 0, 0, 1],
];
}

function computeRotationMatrixXYZ(rotX, rotY, rotZ) {
let cx = Math.cos(rotX), sx = Math.sin(rotX);
let cy = Math.cos(rotY), sy = Math.sin(rotY);
let cz = Math.cos(rotZ), sz = Math.sin(rotZ);

// Matriz de rotación compuesta Rz * Ry * Rx
return [
[
cy * cz,
cz * sx * sy - cx * sz,
cx * cz * sy + sx * sz,
0
],
[
cy * sz,
cx * cz + sx * sy * sz,
-cz * sx + cx * sy * sz,
0
],
[
-sy,
cy * sx,
cx * cy,
0
],
[0, 0, 0, 1]
];
}

//-----------------------//

function multiplyMatrices(...matrices) {
return matrices.reduce((acc, m) => matrixMultiply(acc, m));
}

//-----------------------//

function toWorldView(mesh,rotAxis) {

 // let axis = { x: 0, y: 1, z: 0 }; // eje Y

let rotationMatrix = computeRotationMatrix(rotAxis, rotAngle);

// Matriz de escala 4x4
let scaleMatrix = [
[mesh.scale, 0, 0, 0],
[0, mesh.scale, 0, 0],
[0, 0, mesh.scale, 0],
[0, 0, 0, 1],
];

// Matriz de traslación 4x4
let translationMatrix = [
[1, 0, 0, mesh.position.x],
[0, 1, 0, mesh.position.y],
[0, 0, 1, mesh.position.z],
[0, 0, 0, 1],
];

// Multiplica matrices en orden: T * R * S
let trsMatrix = multiplyMatrices(translationMatrix, rotationMatrix, scaleMatrix);

return trsMatrix;
}

function toWorldView(mesh) {
// Rotación combinada
let rotationMatrix = computeRotationMatrixXYZ(
mesh.rotation.x,
mesh.rotation.y,
mesh.rotation.z
);

// Escala
let scaleMatrix = [
[mesh.scale, 0, 0, 0],
[0, mesh.scale, 0, 0],
[0, 0, mesh.scale, 0],
[0, 0, 0, 1],
];

// Traslación
let translationMatrix = [
[1, 0, 0, mesh.position.x],
[0, 1, 0, mesh.position.y],
[0, 0, 1, mesh.position.z],
[0, 0, 0, 1],
];

// T * R * S
return multiplyMatrices(translationMatrix, rotationMatrix, scaleMatrix);
}
//-----------------------//

function updateViewMatrix() {

let camPosMatrix = [
[1, 0, 0, -camera.position.x],
[0, 1, 0, -camera.position.y],
[0, 0, 1, -camera.position.z],
[0, 0, 0, 1]
];


let rx = createRotationMatrix({ x: 1, y: 0, z: 0 }, camera.rotation.x);
let ry = createRotationMatrix({ x: 0, y: -1, z: 0 }, camera.rotation.y);
let rz = createRotationMatrix({ x: 0, y: 0, z: 1 }, camera.rotation.z);


let rotationMatrix = matrixMultiply(rx, ry, rz);


camera.forward = matrixTimesVector({ x: 0, y: 0, z: -1 }, rotationMatrix);

camera.up = matrixTimesVector({ x: 0, y: 1, z: 0 }, rotationMatrix);
camera.right = matrixTimesVector({ x:1, y: 0, z: 0 }, rotationMatrix);

return matrixMultiply(rotationMatrix, camPosMatrix);
}

//-----------------------//

function transposeMatrix(m) {
 return [
m[0][0], m[1][0], m[2][0], m[3][0],
m[0][1], m[1][1], m[2][1], m[3][1],
m[0][2], m[1][2], m[2][2], m[3][2],
m[0][3], m[1][3], m[2][3], m[3][3],
 ];
}

//-----------------------//
/*
function uploadMeshToGPU(mesh) {
let vertices = [];
let colors = [];
let normals = [];

for (let tri of mesh) {
for (let v of tri) {
vertices.push(v.x, v.y, v.z);
colors.push(
tri.color.r,
tri.color.g,
tri.color.b,
tri.color.a !== undefined ? tri.color.a : 1.0
);
normals.push(v.normal.x, v.normal.y, v.normal.z);
}
}

mesh.vertexCount = mesh.length * 3;

mesh.vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

mesh.colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, mesh.colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

mesh.normalBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normalBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
}
*/

//-----------------------//
let fsButton = document.createElement('div');
function createFullScreenButton() {

fsButton.innerText = '⛶'; // símbolo típico de fullscreen
fsButton.style.position = 'fixed';
fsButton.style.bottom = '2%';
fsButton.style.right = '20%';
fsButton.style.padding = '5px 10px';
fsButton.style.borderRadius='10px';
fsButton.style.background = 'rgba(0, 0, 0, 0.3)';
fsButton.style.color = '#ffffff';
fsButton.style.fontFamily = 'Arial, sans-serif';
fsButton.style.fontSize = (window.innerWidth * 0.03) + 'px';
fsButton.style.cursor = 'pointer';
fsButton.style.userSelect = 'none';
fsButton.style.zIndex = '9999';

fsButton.addEventListener('click', () => {
if (!document.fullscreenElement) {


document.documentElement.requestFullscreen().catch(err => {
console.warn(`Error al entrar en fullscreen: ${err.message}`);
});
} else {
document.exitFullscreen();
}

//crashed=true;
//resetButton.click()
});

document.body.appendChild(fsButton);
}

//createFullScreenButton()

//-----------------------//



function createConfigButton() {
let configButton = document.createElement('div');
configButton.innerText = '⚙️'; // ícono configuración
configButton.style.position = 'fixed';
configButton.style.right = '2vw';

configButton.style.padding = '5px 10px';
configButton.style.borderRadius = '10px';
configButton.style.background = 'rgba(0, 0, 0, 0.3)';
configButton.style.color = '#ffffff';
configButton.style.fontFamily = 'Arial, sans-serif';
configButton.style.fontSize = btnFontSize + 'px';
configButton.style.cursor = 'pointer';
configButton.style.userSelect = 'none';
configButton.style.zIndex = '9999';

function updateButtonPosition() {
if (window.matchMedia("(orientation: portrait)").matches) {
configButton.style.bottom = '18vw';
fsButton.style.right="25%";
} else {
configButton.style.bottom = '7vw'; fsButton.style.right="15%";
}
}

// actualizar al crear
updateButtonPosition();

// actualizar al rotar o cambiar tamaño
window.addEventListener('resize', updateButtonPosition);
window.addEventListener('orientationchange', updateButtonPosition);

configButton.addEventListener('click', () => {
createConfigPanel();
});

document.body.appendChild(configButton);
}
let lastCameraSpeed = null;
let pause=false;

function setDifficulty(level) {
switch (level) {
case "Easy":
difficulty = 0.05;
break;
case "Normal":
difficulty = 0.1;
break;
case "Hard":
difficulty = 0.2;
break;
}
//console.log("Dificultad seleccionada:", level, "->", difficulty);
}

// ---------------- CONFIG PANEL -----------------
let muteBtn = document.createElement('button');

function createConfigPanel() {
if (document.getElementById("configOverlay")) return;

lastCameraSpeed = cameraSpeed;
cameraSpeed = 0;
pause=true;
let overlay = document.createElement('div');
overlay.id = "configOverlay";
overlay.style.position = 'fixed';
overlay.style.top = '0';
overlay.style.left = '0';
overlay.style.width = '100%';
overlay.style.height = '100%';
overlay.style.background = 'rgba(0,0,0,0.5)';
overlay.style.zIndex = '10000';
overlay.style.display = 'flex';
overlay.style.justifyContent = 'center';
overlay.style.alignItems = 'center';

let panel = document.createElement('div');
panel.id = "configPanel";
panel.style.position = 'relative';
panel.style.padding = '20px';
panel.style.borderRadius = '15px';
panel.style.background = 'rgba(0, 0, 0, 0.85)';
panel.style.color = '#fff';
panel.style.fontFamily = 'Arial, sans-serif';
panel.style.fontSize =btnFontSize + 'px';
panel.style.zIndex = '10001';
panel.style.textAlign = 'center';
panel.style.minWidth = '240px';

// --- Cerrar ---
let closeBtn = document.createElement('div');
closeBtn.innerText = "✖";
closeBtn.style.position = 'absolute';
closeBtn.style.top = '8px';
closeBtn.style.right = '10px';
closeBtn.style.cursor = 'pointer';
closeBtn.style.color = 'red';
closeBtn.fontSize = btnFontSize + 'px';
closeBtn.style.fontWeight = 'bold';
closeBtn.addEventListener('click', () => closeConfigPanel());
panel.appendChild(closeBtn);

// --- Resolution ---
let titleRes = document.createElement('div');
titleRes.innerText = "Resolution:";
titleRes.style.marginBottom = '10px';
panel.appendChild(titleRes);

let buttonContainerR = document.createElement('div');
buttonContainerR.style.display = 'flex';
buttonContainerR.style.justifyContent = 'space-around';
buttonContainerR.style.gap = '10px';

// Mapeo labels a valores de resFactor
const resMap = {
"Low": 1,
"Med": 2,
"High": 3
};

Object.keys(resMap).forEach(level => {
let btn = document.createElement('button');
btn.innerText = level;
btn.style.flex = '1';
btn.style.padding = '8px';
btn.style.borderRadius = '8px';
btn.style.border = 'none';
btn.style.cursor = 'pointer';
btn.style.fontSize = btnFontSize + 'px';
btn.style.fontWeight = 'bold';

// ✅ Rojo si coincide con el valor actual de resFactor
if (resFactor === resMap[level]) {
btn.style.background = 'red';
btn.style.color = 'white';
}

btn.addEventListener('click', () => {
resFactor = resMap[level];
resizeCanvas();
resetButton.click();



document.querySelectorAll('#configPanel button').forEach(b => {
b.style.background = '';
b.style.color = '';
});
btn.style.background = 'red';
btn.style.color = 'white';
closeConfigPanel();
});

buttonContainerR.appendChild(btn);
});

panel.appendChild(buttonContainerR);

// --- Difficulty ---
let titleDiff = document.createElement('div');
titleDiff.innerText = "Difficulty:";
titleDiff.style.margin = '20px 0 10px';
panel.appendChild(titleDiff);

let buttonContainerD = document.createElement('div');
buttonContainerD.style.display = 'flex';
buttonContainerD.style.justifyContent = 'space-around';
buttonContainerD.style.gap = '10px';

// Mapeo valores numéricos a labels
const diffMap = {
"Easy": 0.05,
"Normal": 0.1,
"Hard": 0.2
};

Object.keys(diffMap).forEach(level => {
let btn = document.createElement('button');
btn.innerText = level;
btn.style.flex = '1';
btn.style.padding = '8px';
btn.style.borderRadius = '8px';
btn.style.border = 'none';
btn.style.cursor = 'pointer';
btn.style.fontSize = btnFontSize + 'px';
btn.style.fontWeight = 'bold';

// ✅ Pintar rojo si coincide con el valor actual de difficulty
if (difficulty === diffMap[level]) {
btn.style.background = 'red';
btn.style.color = 'white';
}

btn.addEventListener('click', () => {
setDifficulty(level);

document.querySelectorAll('#configPanel button').forEach(b => {
b.style.background = '';
b.style.color = '';
});
btn.style.background = 'red';
btn.style.color = 'white';
closeConfigPanel();

resetButton.click();
});
buttonContainerD.appendChild(btn);
});
panel.appendChild(buttonContainerD);


// --- Mute Audio ---
let titleAudio = document.createElement('div');
titleAudio.innerText = "Audio:";
titleAudio.style.margin = '20px 0 10px';
panel.appendChild(titleAudio);

let buttonContainerA = document.createElement('div');
buttonContainerA.style.display = 'flex';
buttonContainerA.style.justifyContent = 'center';
buttonContainerA.style.gap = '10px';
panel.appendChild(buttonContainerA);


muteBtn.innerText = muted ? "Unmute" : "Mute";
muteBtn.style.flex = '1';
muteBtn.style.padding = '8px';
muteBtn.style.borderRadius = '8px';
muteBtn.style.border = 'none';
muteBtn.style.cursor = 'pointer';
muteBtn.style.fontSize = btnFontSize + 'px';
muteBtn.style.fontWeight = 'bold';
muteBtn.style.background = muted ? '' : 'red';
muteBtn.style.color = muted ? '' : 'white';

muteBtn.addEventListener('click', () => {
toggleMute(); // llama a tu función de mute global
muteBtn.innerText = muted ? "Unmute" : "Mute";

if (muted) {
muteBtn.style.background = '';
muteBtn.style.color = '';
} else {
muteBtn.style.background = 'red';
muteBtn.style.color = 'white';
}
});

buttonContainerA.appendChild(muteBtn);
buttonContainerA.appendChild(muteBtn);
panel.appendChild(buttonContainerA);



overlay.appendChild(panel);
document.body.appendChild(overlay);

overlay.addEventListener('click', (e) => {
if (e.target === overlay) closeConfigPanel();
});
}

function closeConfigPanel() {
let overlay = document.getElementById("configOverlay");
if (overlay) {
document.body.removeChild(overlay);
// restaurar velocidad
if (lastCameraSpeed !== null) {
cameraSpeed = lastCameraSpeed;
lastCameraSpeed = null;
pause=false;
}
}
}

createConfigButton();

//-----------------------//




let resetButton;
function createResetButton() {
let canClick = true; // flag de cooldown

resetButton = document.createElement('div');
resetButton.innerText = 'RESTART';
resetButton.style.position = 'fixed';
resetButton.style.top = '50%';
resetButton.style.left = '50%';
resetButton.style.transform = 'translate(-50%,-50%)';
resetButton.style.padding = '10px';
resetButton.style.borderRadius = '10px';
resetButton.style.background = 'rgba(0, 0, 0, 0.3)';
resetButton.style.color = '#ffffff';
resetButton.style.fontSize = (window.innerWidth * 0.1) + 'px';
resetButton.style.cursor = 'pointer';
resetButton.style.userSelect = 'none';
resetButton.style.zIndex = '9999';
resetButton.style.display = "none";

resetButton.addEventListener('click', () => {
if (!canClick) return; // ignorar si está en cooldown


canClick = false;
resetButton.style.opacity = "0.5"; // feedback visual
resetButton.style.pointerEvents = "none"; // bloquea clicks

setTimeout(() => {
canClick = true;
resetButton.style.opacity = "1";
resetButton.style.pointerEvents = "auto";
}, 1000); // 1s de cooldown

// --- tu lógica de reset ---
randomSeed = Math.random() * 10000;
obstacleGrid.length=0;
ringPoints=0;
camera.position.x = 0;
camera.position.y = 50;
camera.position.z = 0;
camera.rotation.x = radian * 45;
camera.rotation.y = 0;
camera.rotation.z = 0;
camera.dirty = true;

crashed = false;
cameraSpeed = 0.5;
leftX = 0;
leftY = 0;
moveDirection = 0;

camPosZ = 0;
triDisplay.textContent = "Score: 0";

playerName = mainCharacters[Math.floor(Math.random() * mainCharacters.length)];
playerAnim = createNameFilter(playerName, 2);
});

document.body.appendChild(resetButton);
}
createResetButton();


//-----------------------//
//reset bottom btn
function createExtraButton() {
let extraButton = document.createElement('div');
extraButton.innerText = 'RESET';
extraButton.style.position = 'fixed';
extraButton.style.bottom = '2%'; // desde abajo
extraButton.style.right = '2%'; // desde la derecha
extraButton.style.padding = '10px';
extraButton.style.borderRadius = '10px';
extraButton.style.background = 'rgba(0, 0, 0, 0.3)';
extraButton.style.color = '#ffffff';
extraButton.style.fontSize = btnFontSize + 'px';
extraButton.style.cursor = 'pointer';
extraButton.style.userSelect = 'none';
extraButton.style.zIndex = '9999';

extraButton.addEventListener('click', () => {
resetButton.click()

});

document.body.appendChild(extraButton);
}

createExtraButton();

//-----------------------//

let startButton;
let begin=false;

function createStartButton() {
let canClick = true; 

startButton = document.createElement('div');
startButton.innerText = 'START';
startButton.style.position = 'fixed';
startButton.style.top = '50%';
startButton.style.left = '50%';
startButton.style.transform = 'translate(-50%,-50%)';
startButton.style.padding = '10px';
startButton.style.borderRadius = '10px';
startButton.style.background = 'rgba(0, 0, 0, 0.5)';
startButton.style.color = '#ffffff';
startButton.style.fontSize = (window.innerWidth * 0.15) + 'px';
startButton.style.cursor = 'pointer';
startButton.style.userSelect = 'none';
startButton.style.zIndex = '9999';
startButton.style.display = "block"; 

startButton.addEventListener('click', async () => {
if (!canClick) return;
canClick = false;
begin=true;
resetButton.click();

document.addEventListener("visibilitychange", () => {
if (document.hidden) {

if(muteBtn.innerText != "Unmute"){toggleMute()}

} else {

if(muteBtn.innerText != "Unmute"){toggleMute()}

}
});

// feedback
startButton.style.opacity = "0.5";
startButton.style.pointerEvents = "none";


playTrack(currentTrack);


startButton.style.display = "none";
});

document.body.appendChild(startButton);
}



function showSpinner() {
 document.getElementById("spinner").style.display = "block";
}

//-----------------------//*

function hideSpinner() {
 document.getElementById("spinner").style.display = "none";
}

//-----------------------//

// ortho(left, right, bottom, top, near, far)
function orthoMatrixRowMajor(left, right, bottom, top, near, far) {
let rl = right - left;
let tb = top - bottom;
let fn = far - near;

return [
[2 / rl, 0, 0, -(right + left) / rl],
[0, 2 / tb, 0, -(top + bottom) / tb],
[0, 0, -2 / fn, -(far + near) / fn],
[0, 0, 0, 1]
];
}

//-----------------------//

function updateLightViewMatrix(){


let eye = [camera.position.x-15, 50, camera.position.z+20]; // posición de la luz
 
let target = [camera.position.x+20, -20, camera.position.z-20]; // hacia donde mira
let up = [0, 1, 0]; // dirección “arriba”

return lookAt(eye, target, up);
}

//-----------------------//

function lookAt(eye, target, up) {
// Calcula vectores
let zAxis = normalize(subtractVectors(eye, target)); // hacia atrás
let xAxis = normalize(cross(up, zAxis)); // derecha
let yAxis = cross(zAxis, xAxis); // arriba

// Matriz row-major: cada sub-array es una fila
return [
[xAxis[0], xAxis[1], xAxis[2], -dot(xAxis, eye)],
[yAxis[0], yAxis[1], yAxis[2], -dot(yAxis, eye)],
[zAxis[0], zAxis[1], zAxis[2], -dot(zAxis, eye)],
[0, 0, 0, 1]
];
}

// Funciones auxiliares
function subtractVectors(a, b) {
return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function normalize(v) {
let len = Math.hypot(v[0], v[1], v[2]);
return [v[0] / len, v[1] / len, v[2] / len];
}

function cross(a, b) {
return [
a[1] * b[2] - a[2] * b[1],
a[2] * b[0] - a[0] * b[2],
a[0] * b[1] - a[1] * b[0]
];
}

function dot(a, b) {
return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
//-----------------------//

function updateMeshNormals(mesh) {
const normals = new Float32Array(mesh.vertices.length); // inicializamos en 0

// asumimos que mesh.indices existe y define triángulos
for (let i = 0; i < mesh.indices.length; i += 3) {
const i0 = mesh.indices[i + 0] * 3;
const i1 = mesh.indices[i + 1] * 3;
const i2 = mesh.indices[i + 2] * 3;

const v0 = [mesh.vertices[i0 + 0], mesh.vertices[i0 + 1], mesh.vertices[i0 + 2]];
const v1 = [mesh.vertices[i1 + 0], mesh.vertices[i1 + 1], mesh.vertices[i1 + 2]];
const v2 = [mesh.vertices[i2 + 0], mesh.vertices[i2 + 1], mesh.vertices[i2 + 2]];

const edge1 = [v1[0]-v0[0], v1[1]-v0[1], v1[2]-v0[2]];
const edge2 = [v2[0]-v0[0], v2[1]-v0[1], v2[2]-v0[2]];

const nx = edge1[1]*edge2[2] - edge1[2]*edge2[1];
const ny = edge1[2]*edge2[0] - edge1[0]*edge2[2];
const nz = edge1[0]*edge2[1] - edge1[1]*edge2[0];

normals[i0 + 0] += nx; normals[i0 + 1] += ny; normals[i0 + 2] += nz;
normals[i1 + 0] += nx; normals[i1 + 1] += ny; normals[i1 + 2] += nz;
normals[i2 + 0] += nx; normals[i2 + 1] += ny; normals[i2 + 2] += nz;
}

for (let i = 0; i < normals.length; i += 3) {
const nx = normals[i + 0];
const ny = normals[i + 1];
const nz = normals[i + 2];
const len = Math.hypot(nx, ny, nz) || 1.0;
normals[i + 0] /= len;
normals[i + 1] /= len;
normals[i + 2] /= len;
}

// subir al buffer ya existente
gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normalBuffer);
gl.bufferSubData(gl.ARRAY_BUFFER, 0, normals); // DYNAMIC_DRAW ya lo definimos en upload

mesh.normals = normals; // actualizar referencia
}

//-----------------------//

function showFloatingText(text, x, y) {
let el = document.createElement("div");
el.innerText = text;

// estilos inline (no dependes de CSS externo)
el.style.position = "absolute";
el.style.left = x + "px";
el.style.top = y + "px";
el.style.fontSize = (window.innerWidth * 0.05) + 'px';
el.style.fontWeight = "bold";
el.style.color = "yellow";
el.style.textShadow = "1px 1px 2px black";
el.style.pointerEvents = "none";
el.style.userSelect = "none";
el.style.opacity = "1";
el.style.transition = "all 1.5s ease-out";

document.body.appendChild(el);

// Forzar reflow antes de animar
requestAnimationFrame(() => {
el.style.transform = "translateY(-50px)";
el.style.opacity = "0";
});

// eliminar después de animar
setTimeout(() => {
el.remove();
}, 1500);
}

//-----------------------//

//-----------------------//

//-----------------------//

//-----------------------//

//-----------------------//

//-----------------------//

//-----------------------//