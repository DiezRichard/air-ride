if (window.location.hostname !== "airride-voxelgl.pages.dev") {
// window.location.href = "https://airride-voxelgl.pages.dev";
}

//load .obj files
function loadObj(file) {
let request = new XMLHttpRequest();
let mesh = [];

request.open("GET", file, false);

request.onreadystatechange = function() {
if (request.readyState === 4 && (request.status === 200 || request.status === 0)) {
let obj = request.responseText;
let lines = obj.split(/\r?\n/);
let vertices = [];

for (let line of lines) {
line = line.trim();
if (line.startsWith("v ")) {
let parts = line.slice(2).replace(/,/g, ".").trim().split(/\s+/);
let v = {
x: parseFloat(parts[0]),
y: parseFloat(parts[1]),
z: parseFloat(parts[2]),
color: { r: 0.5, g: 0.5, b: 0.5, a: 1.0 }
};
vertices.push(v);
}
}

for (let line of lines) {
line = line.trim();
if (line.startsWith("f ")) {
let parts = line.slice(2).trim().split(/\s+/);
let indices = parts.map(p => parseInt(p.split("/")[0]) - 1);

if (indices.length === 3) {
let tri = [
{ ...vertices[indices[0]] },
{ ...vertices[indices[1]] },
{ ...vertices[indices[2]] },
];
tri.visible = true;
tri.color = { r: 0.5, g: 0.5, b: 0.5, a: 1.0 };
mesh.push(tri);
}

if (indices.length === 4) {
let tri1 = [
{ ...vertices[indices[0]] },
{ ...vertices[indices[1]] },
{ ...vertices[indices[2]] },
];
tri1.visible = true;
tri1.color = { r: 0.5, g: 0.5, b: 0.9, a: 1.0 };
mesh.push(tri1);

let tri2 = [
{ ...vertices[indices[0]] },
{ ...vertices[indices[2]] },
{ ...vertices[indices[3]] },
];
tri2.visible = true;
tri2.color = { r: 0.5, g: 0.5, b: 0.9, a: 1.0 };
mesh.push(tri2);
}
}
}
}
};

request.send(null);
return mesh;
}

//-----------------------//

function loadObjToProgram(path, materialType = "plastic", extras = {}) {
let mesh = loadObj(path);

centerMeshOnGround(mesh);
let name = path.split("/").pop().split(".")[0];
mesh.name = name;

mesh.position = { x: 0, y: 0, z: 0 };
mesh.rotation = { x: 0, y: 0, z: 0 };
mesh.scale = globalScale;


mesh.lightDir = [0.0, 0.0, 1.0];
mesh.viewPos = [0.0, 0.0, 0.0];
mesh.ambientColor = [0.1, 0.1, 0.1];
mesh.lightColor = [1.0, 1.0, 1.0];


let materials = {
metal: { ambientStrength: 0.1, diffuseStrength: 1.0, specularStrength: 1.0, shininess: 128 },
plastic: { ambientStrength: 0.1, diffuseStrength: 1.0, specularStrength: 0.1, shininess: 1 },
matte: { ambientStrength: 0.2, diffuseStrength: 1.0, specularStrength: 0.0, shininess: 1 },
};


Object.assign(mesh, materials[materialType] || materials["plastic"]);

Object.assign(mesh, extras);

precalcularNormal(mesh);
uploadMeshToGPU(mesh);
meshes.push(mesh);
}

//-----------------------//


//-----------------------//

function setGeometry(geometryIndex) {
 
 switch (geometryIndex)
 {

case 1:
 
 subdivisions = 5;
 roundingFactor = 0.25;
 cellSpacingFactor = 0.6;
 
 bulgeAmount=0.1;
 
 break;
 
case 2:
 
 subdivisions = 6;
 roundingFactor = 0.25;
 cellSpacingFactor = 0.6;
 bulgeAmount=0.2;
 
 
 break;
 
case 3:
 
 subdivisions = 9;
 roundingFactor = 0.25;
 cellSpacingFactor = 0.6;
 bulgeAmount=0.3;
 
 
 break;
 
 case 4:
 
 subdivisions = 12;
roundingFactor = 0.16;
cellSpacingFactor = 0.85;
bulgeAmount=0.4;
break;

case 5:
 
 subdivisions = 16;
 roundingFactor = 0.18;
 cellSpacingFactor = 0.76;
 bulgeAmount=0.5;
 
 break;
 
 

 
 }
 
}
//global geometry
setGeometry(2)

//-----------------------//


function createBulgedCubeTriangles(
x, y, z, scale,
bulgeAmount = 0.2,
inward = false,
hiddenFaces = {},
subdivisions = 6
) {
let triangles = [];

// Centro del cubo para cálculo de distancia
const centerX = x + scale / 2;
const centerY = - (y + scale / 2);
const centerZ = z + scale / 2;

// Máxima distancia para normalizar bulge
const maxDist = Math.sqrt((scale / 2) ** 2 + (scale / 2) ** 2);

// Definición de caras
const faces = [
{ name: "top", origin: { x: x, y: -y, z: z }, uDir: { x: scale, y: 0, z: 0 }, vDir: { x: 0, y: 0, z: scale }, normal: { x: 0, y: 1, z: 0 } },
{ name: "bottom", origin: { x: x, y: -y - scale, z: z }, uDir: { x: scale, y: 0, z: 0 }, vDir: { x: 0, y: 0, z: scale }, normal: { x: 0, y: -1, z: 0 } },
{ name: "front", origin: { x: x, y: -y, z: z }, uDir: { x: scale, y: 0, z: 0 }, vDir: { x: 0, y: -scale, z: 0 }, normal: { x: 0, y: 0, z: -1 } },
{ name: "back", origin: { x: x, y: -y, z: z + scale }, uDir: { x: scale, y: 0, z: 0 }, vDir: { x: 0, y: -scale, z: 0 }, normal: { x: 0, y: 0, z: 1 } },
{ name: "right", origin: { x: x, y: -y, z: z }, uDir: { x: 0, y: 0, z: scale }, vDir: { x: 0, y: -scale, z: 0 }, normal: { x: 1, y: 0, z: 0 } },
{ name: "left", origin: { x: x + scale, y: -y, z: z }, uDir: { x: 0, y: 0, z: scale }, vDir: { x: 0, y: -scale, z: 0 }, normal: { x: -1, y: 0, z: 0 } }
];

// Map para agrupar vértices únicos:
// clave: "x_y_z" redondeado para evitar errores float
// valor: { base: {x,y,z}, normals: [normal,...], final: {x,y,z} }
let vertexMap = {};

// Para almacenar la rejilla de índices de vértices para cada cara
// Será un array de arrays con keys del vertexMap
let facesVertexKeys = {};

// Primero: recorrer todas las caras y generar vertices base + normals sin aplicar bulge
for (const face of faces) {
if (hiddenFaces[face.name]) continue;

facesVertexKeys[face.name] = [];

for (let i = 0; i <= subdivisions; i++) {
facesVertexKeys[face.name][i] = [];
for (let j = 0; j <= subdivisions; j++) {
let rawU = j / subdivisions;
let rawV = i / subdivisions;

// Posición base sin bulge ni offset
let pos = {
x: face.origin.x + face.uDir.x * rawU + face.vDir.x * rawV,
y: face.origin.y + face.uDir.y * rawU + face.vDir.y * rawV,
z: face.origin.z + face.uDir.z * rawU + face.vDir.z * rawV
};

// Crear clave redondeada para evitar floats
let key = `${pos.x.toFixed(5)}_${pos.y.toFixed(5)}_${pos.z.toFixed(5)}`;

// Agregar o actualizar vertexMap
if (!vertexMap[key]) {
vertexMap[key] = { base: pos, normals: [] };
}
// Importante: en left y right invertimos el inward para la normal
let normalToAdd = { ...face.normal };
if (face.name === "left" || face.name === "right") {
// invertimos normal para que al final la normal promedio sea correcta
normalToAdd.x *= -1;
normalToAdd.y *= -1;
normalToAdd.z *= -1;
}
vertexMap[key].normals.push(normalToAdd);

facesVertexKeys[face.name][i][j] = key;
}
}
}

// Segundo: calcular la posición final de cada vértice con bulge basado en la normal promedio
for (let key in vertexMap) {
let data = vertexMap[key];

// Promediar normales
let nx = 0, ny = 0, nz = 0;
for (let n of data.normals) {
nx += n.x;
ny += n.y;
nz += n.z;
}
let len = Math.sqrt(nx * nx + ny * ny + nz * nz);
if (len > 0) {
nx /= len;
ny /= len;
nz /= len;
}

// Calcular distancia al centro
let dx = data.base.x - centerX;
let dy = data.base.y - centerY;
let dz = data.base.z - centerZ;
let dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
let normalizedDist = dist / maxDist;

// Bulge con inward inverso para left/right
// Si queremos que inward afecte el resultado global:
// Usamos inward para decidir la dirección del bulge general
let direction = inward ? -1 : 1;

// Aquí no invertimos más porque ya invertimos normales en left/right

let offset = bulgeAmount * (1 - normalizedDist ** 2) * direction;

data.final = {
x: data.base.x + nx * offset,
y: data.base.y + ny * offset,
z: data.base.z + nz * offset
};
}

// Tercero: crear triángulos usando las posiciones finales compartidas

for (const face of faces) {
if (hiddenFaces[face.name]) continue;

for (let i = 0; i < subdivisions; i++) {
for (let j = 0; j < subdivisions; j++) {
let v1 = vertexMap[facesVertexKeys[face.name][i][j]].final;
let v2 = vertexMap[facesVertexKeys[face.name][i][j + 1]].final;
let v3 = vertexMap[facesVertexKeys[face.name][i + 1][j]].final;
let v4 = vertexMap[facesVertexKeys[face.name][i + 1][j + 1]].final;

let tris;
switch (face.name) {
case "bottom":
case "left":
case "front":
tris = [
[v1, v2, v3],
[v2, v4, v3]
];
break;
default:
tris = [
[v1, v3, v2],
[v3, v4, v2]
];
break;
}

tris.forEach(verts => {
triangles.push(verts.map(v => ({ ...v })));
});
}
}
}

return triangles;
}
//-----------------------//


function createRoundedCubeTriangles(x, y, z, scale, cellIndex = 0, layerIndex = 0, color, hiddenFaces={}, textured = false) {
 
 let triangles = [];
// Para que tenga el mismo nivel de detalle que el cubo simple
 
 let cx = x + scale / 2;
 let cy = -(y +scale / 2);
 let cz = z + scale / 2;
 
 let faces = [
{ name: "top", origin: { x: x, y: -y, z: z }, uDir: { x: scale, y: 0, z: 0 }, vDir: { x: 0, y: 0, z: scale } },
{ name: "bottom", origin: { x: x, y: -y - scale, z: z }, uDir: { x: scale, y: 0, z: 0 }, vDir: { x: 0, y: 0, z: scale } },
{ name: "front", origin: { x: x, y: -y, z: z }, uDir: { x: scale, y: 0, z: 0 }, vDir: { x: 0, y: -scale, z: 0 } },
{ name: "back", origin: { x: x, y: -y, z: z + scale }, uDir: { x: scale, y: 0, z: 0 }, vDir: { x: 0, y: -scale, z: 0 } },
{ name: "right", origin: { x: x, y: -y, z: z }, uDir: { x: 0, y: 0, z: scale }, vDir: { x: 0, y: -scale, z: 0 } },
{ name: "left", origin: { x: x + scale, y: -y, z: z }, uDir: { x: 0, y: 0, z: scale }, vDir: { x: 0, y: -scale, z: 0 } }
 ];
 
 for (const face of faces) {
if (hiddenFaces[face.name]) continue;

// Generar vértices para la malla subdividida
let verticesGrid = [];

for (let i = 0; i <= subdivisions; i++) {
 verticesGrid[i] = [];
 for (let j = 0; j <= subdivisions; j++) {
let rawU = j / subdivisions;
let rawV = i / subdivisions;

// Posición sin redondear
let pos = {
 x: face.origin.x + face.uDir.x * rawU + face.vDir.x * rawV,
 y: face.origin.y + face.uDir.y * rawU + face.vDir.y * rawV,
 z: face.origin.z + face.uDir.z * rawU + face.vDir.z * rawV
};

// Aplicar redondeado igual que tu función original
let local = { x: pos.x - cx, y: pos.y - cy, z: pos.z - cz };
let half = scale / 2;
let clamped = {
 x: Math.max(-half + roundingFactor, Math.min(half - roundingFactor, local.x)),
 y: Math.max(-half + roundingFactor, Math.min(half - roundingFactor, local.y)),
 z: Math.max(-half + roundingFactor, Math.min(half - roundingFactor, local.z))
};

let offset = {
 x: local.x - clamped.x,
 y: local.y - clamped.y,
 z: local.z - clamped.z
};

let len = Math.sqrt(offset.x ** 2 + offset.y ** 2 + offset.z ** 2);
if (len > 0) {
 let factor = roundingFactor / len;
 offset.x *= factor;
 offset.y *= factor;
 offset.z *= factor;
 local.x = clamped.x + offset.x;
 local.y = clamped.y + offset.y;
 local.z = clamped.z + offset.z;
}

pos.x = cx + local.x;
pos.y = cy + local.y;
pos.z = cz + local.z;

verticesGrid[i][j] = pos;
 }
}

// Crear triángulos con la orientación igual que en createCubeTriangles
for (let i = 0; i < subdivisions; i++) {
 for (let j = 0; j < subdivisions; j++) {
let v1 = verticesGrid[i][j];
let v2 = verticesGrid[i][j + 1];
let v3 = verticesGrid[i + 1][j];
let v4 = verticesGrid[i + 1][j + 1];

let tris;

switch (face.name) {
 case "bottom":
 case "left":
 case "front":
tris = [
 [v1, v2, v3],
 [v2, v4, v3]
];
break;

 case "top":
 case "right":
 case "back":
tris = [
 [v1, v3, v2],
 [v3, v4, v2]
];
break;
}

tris.forEach(verts => {
 triangles.push(verts.map(v => ({ ...v})));
 
});
 }
}
 }
 
 return triangles;
}



//-----------------------//

async function parseJsonFile(path) {
 let jsonData = null;
 
 // Intentar cache primero
 if ('caches' in window) {
  try {
   const cache = await caches.open('my-cache'); // tu cache SW
   const cachedResponse = await cache.match(path);
   if (cachedResponse) {
    const text = await cachedResponse.text();
    try {
     jsonData = JSON.parse(text);
     return jsonData;
    } catch (e) {
     console.error("Error parseando JSON cacheado:", e);
    }
   }
  } catch (e) {
   console.warn("No se pudo acceder al cache:", e);
  }
 }
 
 // Si no está en cache, fetch normal
 try {
  const response = await fetch(path);
  const text = await response.text();
  try {
   jsonData = JSON.parse(text);
  } catch (e) {
   console.error("El archivo descargado no es JSON válido:", e, text);
   jsonData = null;
  }
 } catch (e) {
  console.error("Error obteniendo JSON de la red:", e);
  jsonData = null;
 }
 
 return jsonData;
}

//-----------------------//

function loadJsonMeshes(json, scale = 1) {
 if (!json) return [];
 
 const gridSize = json.gridSize;
 const colorList = json.colorList || [];
 const sprites = json.sprites || [];
 
 const colors = colorList.map(hex => {
let m = hex.match(/^#([0-9a-f]{6})$/i);
if (!m) return { r: 0, g: 0, b: 0, a: 1 };
let v = m[1];
return {
 r: parseInt(v.substring(0, 2), 16) / 255,
 g: parseInt(v.substring(2, 4), 16) / 255,
 b: parseInt(v.substring(4, 6), 16) / 255,
 a: 1
};
 });
 
 let meshesArray = [];
 for (let s = 0; s < sprites.length; s++) {
let spriteMesh = [];
let layersData = sprites[s];

for (let layerIndex = 0; layerIndex < layersData.length; layerIndex++) {
 let layer = layersData[layerIndex];
 
 for (let i = 0; i < gridSize; i++) {
for (let j = 0; j < gridSize; j++) {
 let cellIndex = i * gridSize + j;
 let val = layer[cellIndex] || 0;
 if (val === 0) continue;
 
 let color = colors[val - 1] || { r: 0, g: 0, b: 0, a: 1 };
 
 let hiddenFaces = {
bottom: (i < gridSize - 1 && layer[(i + 1) * gridSize + j] !== 0),
top: (i > 0 && layer[(i - 1) * gridSize + j] !== 0),
right: (j > 0 && layer[i * gridSize + (j - 1)] !== 0),
left: (j < gridSize - 1 && layer[i * gridSize + (j + 1)] !== 0),
front: (layerIndex > 0 && sprites[s][layerIndex - 1][cellIndex] !== 0),
back: (layerIndex < layersData.length - 1 && sprites[s][layerIndex + 1][cellIndex] !== 0),


 };
 
if (json.nameBase !== "ardilla" && !json.nameBase.startsWith("bomberAnim")&&!json.nameBase.startsWith("pinkBomberAnim"))
 {
 hiddenFaces.bottom=true;
 }
 
 let tris;
 
 if(roundType==="edges")
 {
 tris = createRoundedCubeTriangles(
j * scale * cellSpacingFactor,
i * scale * cellSpacingFactor,
layerIndex * scale * cellSpacingFactor,
scale,
cellIndex,
layerIndex,
color,
hiddenFaces);
}

if (roundType === "faces" || roundType === "invertedFaces") {
tris = createBulgedCubeTriangles(
 j * scale * cellSpacingFactor,
 i * scale * cellSpacingFactor,
 layerIndex * scale * cellSpacingFactor,
 scale,
 bulgeAmount, // bulgeAmount (0.3 es inflado suave)
 isInwardFaces, // false = inflar, true = hundir
 hiddenFaces,
 subdivisions
);
}
 
 
 for (let tri of tris) {
tri.color = color;
spriteMesh.push(tri);
 }
}
 }
}

spriteMesh.name = `${json.nameBase || "sprite"}_${s}`;
//centerMeshOnGround(spriteMesh);
meshesArray.push(spriteMesh);
 }
 
 return meshesArray;
}
//-----------------------//

async function loadJsonToProgram(path, materialType = "plastic", extras = {}) {
 let json = await parseJsonFile(path);
 if (!json) {
  console.error("No se pudo cargar o parsear el JSON:", path);
  return;
 }
 
 json.nameBase = path.split("/").pop().split(".")[0];
 
 let meshList = loadJsonMeshes(json);
 
 meshList.forEach((mesh, index) => {
  centerMeshOnGround(mesh);
  
  mesh.position = { x: 0, y: 0, z: 0 };
  mesh.rotation = { x: 0, y: 0, z: 0 };
  mesh.scale = globalScale;

  mesh.lightDir = [1.0, 1.0, 1.0];
  
  
  mesh.viewPos = [0.0, 0.0, 0.0];
  
  mesh.ambientColor = [0.9, 0.9, 0.9];
  mesh.lightColor = [1.0, 1.0, 0.95];
  
  let materials = {
   metal: { ambientStrength: 0.7, diffuseStrength: 0.7, specularStrength: 0.5, shininess: 7 },
   plastic: { ambientStrength: 0.5, diffuseStrength: 0.5, specularStrength: 0.5, shininess: 1 },
   matte: { ambientStrength: 0.6, diffuseStrength: 0.6, specularStrength: 0.0, shininess: 1 },
  };
  
  Object.assign(mesh, materials[materialType] || materials["plastic"]);
  Object.assign(mesh, extras);
  
 if(extras.quality){
  
 mesh.quality=extras.quality;
 mesh.name=mesh.name+"_"+extras.quality;
  }
  
 precalcularNormal(mesh);
 uploadMeshToGPU(mesh);
 meshes.push(mesh);
 });
}


//-----------------------//

function createNameFilter(nameBase, maxIndex) {
return {
nameBase,
maxIndex,
currentIndex: 0,

getCurrentName() {
return `${this.nameBase}_${this.currentIndex}`;
},

next() {
this.currentIndex = (this.currentIndex + 1) % this.maxIndex;
},

// Devuelve array con todos los nombres excepto el actual
getNamesToExclude() {
let exclude = [];
for (let i = 0; i < this.maxIndex; i++) {
if (i !== this.currentIndex) {
exclude.push(`${this.nameBase}_${i}`);
}
}
return exclude;
}
};
}



//-----------------------//

 function generateIBO(mesh) {
 const vertexMap = new Map(); // key -> index
 const indices = [];
 let indexCounter = 0;
 
 function vertexKey(v) {
  return `${v.x.toFixed(5)}_${v.y.toFixed(5)}_${v.z.toFixed(5)}`;
 }
 
 for (let tri of mesh) {
  for (let v of tri) {
   const key = vertexKey(v);
   if (!vertexMap.has(key)) {
    vertexMap.set(key, indexCounter++);
   }
   indices.push(vertexMap.get(key));
  }
 }
 
 return indices; // este es tu IBO
}



function uploadMeshToGPU(mesh) {
 const vertexMap = new Map();
 const vertices = [];
 const colors = [];
 const normals = [];
 const indices = [];
 let indexCounter = 0;
 
 function vertexKey(v) { return `${v.x}_${v.y}_${v.z}`; }
 
 for (let tri of mesh) {
  for (let v of tri) {
   const key = vertexKey(v);
   if (!vertexMap.has(key)) {
    vertexMap.set(key, indexCounter++);
    vertices.push(v.x, v.y, v.z);
    normals.push(v.normal.x, v.normal.y, v.normal.z);
    colors.push(
     tri.color.r,
     tri.color.g,
     tri.color.b,
     tri.color.a !== undefined ? tri.color.a : 1.0
    );
   }
   indices.push(vertexMap.get(key));
  }
 }
 mesh.length=0;
 mesh.normals=new Float32Array(normals);
 mesh.vertices=new Float32Array(vertices);
 mesh.indices=new Float32Array(indices);
 
 mesh.vertexCount = indices.length; // número de indices, no de vértices
 
 mesh.vertexBuffer = gl.createBuffer();
 gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer);
 gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
 
 mesh.normalBuffer = gl.createBuffer();
 gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normalBuffer);
 gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.DYNAMIC_DRAW);
 
 mesh.colorBuffer = gl.createBuffer();
 gl.bindBuffer(gl.ARRAY_BUFFER, mesh.colorBuffer);
 gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
 
 mesh.indexBuffer = gl.createBuffer();
 gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
 gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
}

function createCubeRing(numCubes = 24, radius = 6, scale = 1) {
 let ringMesh = [];
 
 for (let i = 0; i < numCubes; i++) {
  let angle = (i / numCubes) * Math.PI * 2;
  let cosA = Math.cos(angle);
  let sinA = Math.sin(angle);
  
  // posición del centro de este cubo
  let x = cosA * radius;
  let z = sinA * radius;
  let y = 0;
  
  // determinar qué caras ocultar:
  let hiddenFaces = { front: false, back: false, left: false, right: false, top: false, bottom: true };
  
  // vecino anterior y siguiente (para ocultar caras laterales colindantes)
  let prevAngle = ((i - 1 + numCubes) % numCubes) / numCubes * Math.PI * 2;
  let nextAngle = ((i + 1) % numCubes) / numCubes * Math.PI * 2;
  
  let prevPos = { x: Math.cos(prevAngle) * radius, z: Math.sin(prevAngle) * radius };
  let nextPos = { x: Math.cos(nextAngle) * radius, z: Math.sin(nextAngle) * radius };
  
  // dirección radial del cubo actual
  let radial = { x: cosA, z: sinA };
  
  // producto punto para decidir qué cara ocultar
  let leftDir = { x: -sinA, z: cosA }; // vector tangente a la izquierda
  let rightDir = { x: sinA, z: -cosA }; // vector tangente a la derecha
  
  let dotPrev = (prevPos.x - x) * leftDir.x + (prevPos.z - z) * leftDir.z;
  let dotNext = (nextPos.x - x) * rightDir.x + (nextPos.z - z) * rightDir.z;
  
  if (dotPrev > 0) hiddenFaces.left = true;
  if (dotNext > 0) hiddenFaces.right = true;
  
  // generar triángulos del cubo
  let tris;
  
  roundType="faces";
  if (roundType==="faces") {
   tris = createBulgedCubeTriangles(x, y, z, scale, bulgeAmount, false, hiddenFaces, subdivisions);
  } else {
   tris = createRoundedCubeTriangles(x, y, z, scale, 0, 0, { r: 0.5, g: 0.5, b: 0.5, a: 1 }, hiddenFaces);
  }
  
  // rotar cada triángulo alrededor del eje Y para que siga la tangente
  let rotationY = angle; // aquí cada cubo gira según su posición
  let cosRY = Math.cos(rotationY);
  let sinRY = Math.sin(rotationY);
  
  for (let tri of tris) {
   for (let v of tri) {
    let dx = v.x - x;
    let dz = v.z - z;
    // rotación Y
    let rx = dx * cosRY - dz * sinRY;
    let rz = dx * sinRY + dz * cosRY;
    v.x = x + rx;
    v.z = z + rz;
   }
   tri.color = { r: 0.3, g: 0.7, b: 1.0, a: 1 };
   ringMesh.push(tri);
  }
 }
 
 // mesh final
 ringMesh.name = "cubeRing_0";
 centerMeshOnGround(ringMesh);
 
 ringMesh.position = { x: 0, y: 0, z: 0 };
 ringMesh.rotation = { x: 0, y: 0, z: 0 };
 ringMesh.scale = globalScale;
 
 ringMesh.lightDir = [1.0, 1.0, 1.0];
 ringMesh.viewPos = [0.0, 0.0, 0.0];
 ringMesh.ambientColor = [0.9, 0.9, 0.9];
 ringMesh.lightColor = [1.0, 1.0, 0.95];
 
 Object.assign(ringMesh, {
  ambientStrength: 0.5,
  diffuseStrength: 0.5,
  specularStrength: 2.0,
  shininess: 5
 });
 
 precalcularNormal(ringMesh);
 uploadMeshToGPU(ringMesh);
 meshes.push(ringMesh);
 
 
}

function createTorusMesh(numSegments = 18, numTubeSegments = 18, majorRadius = 5, minorRadius = 0.5, scale = 1) {
 let torusMesh = [];
 
 for (let i = 0; i < numSegments; i++) {
  let theta = (i / numSegments) * Math.PI * 2;
  let cosTheta = Math.cos(theta);
  let sinTheta = Math.sin(theta);
  
  for (let j = 0; j < numTubeSegments; j++) {
   let phi = (j / numTubeSegments) * Math.PI * 2;
   let cosPhi = Math.cos(phi);
   let sinPhi = Math.sin(phi);
   
   // centro del tube segment
   let cx = cosTheta * majorRadius;
   let cz = sinTheta * majorRadius;
   let cy = 0;
   
   // posición del vértice
   let x = cx + cosTheta * cosPhi * minorRadius - sinTheta * sinPhi * minorRadius;
   let z = cz + sinTheta * cosPhi * minorRadius + cosTheta * sinPhi * minorRadius;
   let y = cy + sinPhi * minorRadius;
   
   // guardar vértices temporalmente en un grid
   if (!torusMesh[i]) torusMesh[i] = [];
   torusMesh[i][j] = { x, y, z };
  }
 }
 
 // crear triángulos por quads
 let tris = [];
 for (let i = 0; i < numSegments; i++) {
  let nextI = (i + 1) % numSegments;
  for (let j = 0; j < numTubeSegments; j++) {
   let nextJ = (j + 1) % numTubeSegments;
   
   let a = torusMesh[i][j];
   let b = torusMesh[nextI][j];
   let c = torusMesh[nextI][nextJ];
   let d = torusMesh[i][nextJ];
   
   let tri1 = [{ ...a }, { ...b }, { ...d }];
   let tri2 = [{ ...b }, { ...c }, { ...d }];
   
   tri1.color = { r: 0.3, g: 0.7, b: 1.0, a: 1 };
   tri2.color = { r: 0.3, g: 0.7, b: 1.0, a: 1 };
   
   tris.push(tri1);
   tris.push(tri2);
  }
 }
 
 // propiedades del mesh
 tris.name = "cubeRing_0";
 tris.position = { x: 0, y: 0, z: 0 };
 tris.rotation = { x: 0, y: 0, z: 0 };
 tris.scale = globalScale;
 
 tris.lightDir = [1.0, 1.0, 1.0];
 tris.viewPos = [0.0, 0.0, 0.0];
 tris.ambientColor = [0.9, 0.9, 0.9];
 tris.lightColor = [1.0, 1.0, 0.95];
 
 Object.assign(tris, {
  ambientStrength: 0.5,
  diffuseStrength: 0.5,
  specularStrength: 0.5,
  shininess: 1
 });
 
 precalcularNormal(tris);
 uploadMeshToGPU(tris);
 meshes.push(tris);
}