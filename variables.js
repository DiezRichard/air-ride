//-----------------------//

let canvas = document.getElementById("myCanvas");
let canvasDiv = document.getElementById("canvasDiv");

canvas.height = canvasDiv.clientHeight;
canvas.width = canvasDiv.clientWidth;

let resFactor=3;
function resizeCanvas() {
let minSide = Math.min(window.innerWidth, window.innerHeight);
canvas.width = minSide * resFactor;
canvas.height = minSide * resFactor;

}

resizeCanvas();

let gl = canvas.getContext("webgl2", {antialias:true},{depth:true});

//-----------------------//

let camera = {
position: {x: 0,y: 10,z:0},

right :{ x: 1, y: 0, z: 0 },

up : { x: 0, y: 1, z: 0 },

forward : { x: 0, y: 0, z: -1 },
velocity : { x: 0, y: -0.1, z: 0},

rotation:{x:0,y:0,z:0},
speed:0.7,
near:1,
far:1000,
fov:60
};

//-----------------------//

//let lightDir = { x: 0, y: 0, z: -1 }

let rotationSpeed = 0.05;

let moveSpeed = camera.speed;

let radian = Math.PI / 180;

let f= 1 / Math.tan((camera.fov / 2)*(radian));

let aspectR=canvas.width/canvas.height;

let pMatrix = [
 [f / aspectR, 0, 0, 0],
 [0, f, 0, 0],
 [0, 0, (camera.far + camera.near) / (camera.near - camera.far), (2 * camera.far * camera.near) / (camera.near - camera.far)],
 [0, 0, -1, 0]
];


//-----------------------//

let globalScale = 1;

let animationSpeed = 500;

let meshes = [];

let gridSize=12;
let cellSize=2;
let tileScale=5;

let frequency=0.007;
let beef=40.0;
//let random = Math.random() * 10000;
let randomSeed = Math.random() * 10000; // nueva semilla al iniciar o resetear

let octaves=2;
let persistence=2;
//-----------------------//


//edges or faces or invertedFaces
let roundType="edges";
let geometryIndex=1;
let bulgeAmount=0.2;
let subdivisions = 1;
let roundingFactor=0;
let cellSpacingFactor=1;
let isInwardFaces=false;
let assetList=[];
let assetListSnow=[];
let assetListAutumn=[];

if(roundType==="invertedFaces")
{
 isInwardFaces=true;
}


let offSet = Math.round(gridSize*cellSize*tileScale*cellSpacingFactor)/2;


//-----------------------//
let btnFontSize = window.innerHeight * 0.03;

function updateFontSize(){
if(window.innerWidth>window.innerHeight)
{
 btnFontSize = window.innerWidth * 0.03;
}
}

window.addEventListener('resize', updateFontSize);

// Listener para cambio de orientación
window.addEventListener('orientationchange', updateFontSize);

// Inicializa el tamaño correctamente al cargar
updateFontSize();







// Initialize variables for frame timing
let frameCount = 0;
let totalFrameTime = 0; // Total time accumulated over a period
let lastFrameTime = performance.now(); // Time of the last frame

// Create and style the display element
let fpsDisplay = document.createElement('div');
fpsDisplay.style.position = 'fixed';
fpsDisplay.style.bottom = '10%';
fpsDisplay.style.left = '2%';
fpsDisplay.style.padding = '5px 10px';
fpsDisplay.style.borderRadius='10px';
fpsDisplay.style.background = 'rgba(0, 0, 0, 0.3)';
fpsDisplay.style.color = '#ffffff';
//fpsDisplay.style.fontFamily = 'Arial, sans-serif';
fpsDisplay.style.fontSize = btnFontSize + 'px';
//document.body.appendChild(fpsDisplay);

//-----------------------//

let triDisplay = document.createElement('div');
triDisplay.style.position = 'fixed';
triDisplay.style.bottom = '2%';
triDisplay.style.left = '2%';
triDisplay.style.padding = '5px 10px';
triDisplay.style.borderRadius='10px';
triDisplay.style.background = 'rgba(0, 0, 0, 0.3)';
triDisplay.style.color = '#ffffff';
//triDisplay.style.fontFamily = 'Arial, sans-serif';
triDisplay.style.fontSize = '16px';
//document.body.appendChild(triDisplay);
triDisplay.style.whiteSpace = "pre-line";
//-----------------------//

// Crear elemento para mostrar Hi-Score
let hiScoreDisplay = document.createElement("div");
hiScoreDisplay.style.position = 'fixed';
hiScoreDisplay.style.bottom = '2%';
hiScoreDisplay.style.left = '2%';
hiScoreDisplay.style.padding = '5px 10px';
hiScoreDisplay.style.borderRadius = '10px';
hiScoreDisplay.style.background = 'rgba(0, 0, 0, 0.3)';
hiScoreDisplay.style.color = '#ffffff';
hiScoreDisplay.style.fontSize = btnFontSize + 'px';
hiScoreDisplay.style.whiteSpace = "pre-line";
document.body.appendChild(hiScoreDisplay);

// Cargar Hi-Score de localStorage
let hiScore = parseInt(localStorage.getItem("hiScore")) || 0;
//hiScoreDisplay.textContent = "Hi-Score: " + hiScore;

//-----------------------//

let polygonQuality = "Low";

//-----------------------//
let difficulty=0.1;
//-----------------------//



let isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

//-----------------------//

let obstacleGrid=[];

obstacleGrid.length=0;

//-----------------------//

let ringPoints=0;

//-----------------------//
