

function createPlaneMesh(ancho, alto, materialType = "metal", extras = {}) {
let mesh = [];

// Recorrer cada celda
for (let zCell = 0; zCell < alto; zCell++) {
for (let xCell = 0; xCell < ancho; xCell++) {

// Posición base de la celda
let baseX = xCell * cellSize * tileScale;
let baseZ = zCell * cellSize * tileScale;
let posY = 0;

// Recorrer cada cuadrado dentro de la celda
for (let zi = 0; zi < cellSize; zi++) {
for (let xi = 0; xi < cellSize; xi++) {
let x = baseX + xi * tileScale;
let z = baseZ + zi * tileScale;

let tris;

if (roundType === "faces") {
// Usar cubo inflado/hundido
tris = createBulgedCubeTriangles(
x * cellSpacingFactor,
posY * cellSpacingFactor,
z * cellSpacingFactor,
tileScale,
bulgeAmount,
isInwardFaces,
{ bottom: true, front: true, back: true, left: true, right: true },
subdivisions
);
} else {
// Usar cubo normal con bordes redondeados
tris = createRoundedCubeTriangles(
x * cellSpacingFactor,
posY * cellSpacingFactor,
z * cellSpacingFactor,
tileScale,
0,
0,
{ r: 0, g: 0.6, b: 0, a: 1 },
{ bottom: true, front: true, back: true, left: true, right: true },
false
);
}

tris.forEach(tri => {
tri.color = { r: 0, g: 0.6, b: 0, a: 1 };
mesh.push(tri);
});
}
}
}
}

mesh.rotation = { x: 0, y: 0, z: 0 };
mesh.position = {
x: (ancho * cellSize * tileScale) / 2 * globalScale,
y: 0,
z: (alto * cellSize * tileScale) / 2 * globalScale
};
mesh.scale = globalScale;

mesh.lightDir = [1.0, 0.0, 1.0];
mesh.viewPos = [0.0, 0.0, 1.0];


mesh.ambientColor = [1.0, 1.0, 1.0]; // Luz ambiental más neutra y visible
mesh.lightColor = [1.0, 1.0, 1.0]; // Luz blanca casi sin cambio

let materials = {
metal: { ambientStrength: 0.5, diffuseStrength: 0.5, specularStrength: 0.5, shininess: 5 },

plastic: { ambientStrength: 0.5, diffuseStrength: 0.6, specularStrength: 0.2, shininess: 2 },
matte: { ambientStrength: 0.8, diffuseStrength: 0.8, specularStrength: 0.0, shininess: 1 },
};

Object.assign(mesh, materials[materialType] || materials["plastic"]);
Object.assign(mesh, extras);

precalcularNormal(mesh);
uploadMeshToGPU(mesh);
meshes.push(mesh);

mesh.name = "cell";
//console.log(mesh);
}


function pseudoRandom(x, y) {
// mezcla de primos para distribuir los bits
let n = x * 374761393 + y * 668265263;
n = (n ^ (n >> 13)) * 1274126177;
return ((n ^ (n >> 16)) & 0x7fffffff) / 0x7fffffff;
}




function createBinaryGrid(ancho, alto, camPosX, camPosZ, probability) {
let grid = [];

for (let row = 0; row < alto; row++) {
let rowData = [];
for (let col = 0; col < ancho; col++) {

let r = pseudoRandom(col + camPosX + randomSeed, row + camPosZ + randomSeed);

if (row + camPosZ > 2) {
rowData.push(0);
} else {
rowData.push(r < probability ? 1 : 0);
}
}
grid.push(rowData);
}

return grid;
}


let ancho=34;
let alto=50;
let gridArray=Array.from({ length: alto }, () => Array(ancho).fill(0));

function createAssetGrid(ancho, alto, camPosX, camPosZ, probability ) {

let grid = gridArray.map(row => [...row]);
  
  for (let assetIndex = 0; assetIndex < assetList.length; assetIndex++) {
    for (let row = 0; row < alto; row++) {
      for (let col = 0; col < ancho; col++) {
        let r = pseudoRandom(
          col + camPosX + randomSeed + assetIndex * 1000, // offset para que no repita el mismo patrón
          row + camPosZ + randomSeed + assetIndex * 2000
        );
        
        if (row + camPosZ <= 0 && r < probability) {
          let difficulty4fix = 0;
          if (difficulty == 0.05) difficulty4fix = 3;
          if (difficulty == 0.1) difficulty4fix = 1;
          if (difficulty == 0.2) difficulty4fix = 0;
          
          let index = assetIndex + difficulty4fix;
          
          // Si la celda está vacía, ponemos el asset
          if (grid[row][col] === 0) {
            grid[row][col] = index;
          }
        }
      }
    }
  }
  
  return grid;
}

function createAssetGrid(ancho, alto, camPosX, camPosZ, probability) {
  let grid = gridArray.map(row => [...row]);
  
  for (let assetIndex = 0; assetIndex < assetList.length; assetIndex++) {
    for (let row = 0; row < alto; row++) {
      for (let col = 0; col < ancho; col++) {
        let r = pseudoRandom(
          col + camPosX + randomSeed + assetIndex * 1000,
          row + camPosZ + randomSeed + assetIndex * 2000
        );
        
        if (row + camPosZ <= 0 && r < probability) {
          let difficulty4fix = 0;
          if (difficulty == 0.05) difficulty4fix = 3;
          if (difficulty == 0.1) difficulty4fix = 1;
          if (difficulty == 0.2) difficulty4fix = 0;
          
          let index = assetIndex + difficulty4fix;
          
          // Si la celda está vacía, ponemos el asset normal
          if (grid[row][col] === 0) {
            grid[row][col] = index;
          }
        }
        
        // === Asset 5 pseudoaleatorio determinista con menor probabilidad ===
        if (grid[row][col] === 0) {
          let r5 = pseudoRandom(
            col + camPosX + randomSeed + 9999, // offset distinto para 5
            row + camPosZ + randomSeed + 8888
          );
          let probability5 = probability * 0.1; // por ejemplo 20% de probabilidad del resto
          
          if (r5 < probability5) {
            grid[row][col] = 5;
          }
        }
      }
    }
  }
  
  return grid;
}