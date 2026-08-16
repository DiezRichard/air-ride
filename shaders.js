//~~~~~~~~~~~~~~~~~~~~~~~~~



//~~~~~~~~~~~~~~~~~~~~~~~~~

let vertexShaderLight = `
attribute vec3 position;
attribute vec4 color;
attribute vec3 normal;

uniform mat4 projection;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

uniform vec3 lightDir1;
uniform vec3 lightDir2;
uniform vec3 viewPos;

uniform vec3 ambientColor;
uniform vec3 lightColor;

uniform float ambientStrength;
uniform float diffuseStrength;
uniform float specularStrength;
uniform float shininess;

varying vec4 vColor;

void main() {
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vec3 fragPosView = vec3(viewMatrix * worldPos);
  vec3 norm = normalize(mat3(viewMatrix * modelMatrix) * normal);
  
  vec3 light1 = normalize(mat3(viewMatrix) * lightDir1);
  vec3 light2 = normalize(mat3(viewMatrix) * lightDir2);
  
  vec3 viewDir = normalize(viewPos - fragPosView);
  
  // Suma de direcciones de luz para la especular (half vector)
  vec3 lightSum = normalize(light1 + light2);
  
  float diff = max(dot(norm, light1), 0.0) + max(dot(norm, light2), 0.0);
  float spec = pow(max(dot(norm, lightSum + viewDir), 0.0), shininess);
  
//float spec = max(dot(norm, lightSum + viewDir), 0.0); // sin pow
// o duro:
//float spec = step(0.95, dot(norm, lightSum + viewDir));

  vec3 ambient = ambientColor * ambientStrength;
  vec3 diffuse = lightColor * diff * diffuseStrength;
  vec3 specular = lightColor * spec * specularStrength;
  
  vec3 lighting = ambient + diffuse + specular;
  
  vColor = vec4(lighting * color.rgb, color.a);
  
  gl_Position = projection * viewMatrix * worldPos;
}
`;

//~~~~~~~~~~~~~~~~~~~~~~~~~

let vertexShaderLightSingle = `
attribute vec3 position;
attribute vec4 color;
attribute vec3 normal;

uniform mat4 projection;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

uniform vec3 lightDir1;
uniform vec3 viewPos;

uniform vec3 ambientColor;
uniform vec3 lightColor;

uniform float ambientStrength;
uniform float diffuseStrength;
uniform float specularStrength;
uniform float shininess;

varying vec4 vColor;

void main() {
vec4 worldPos = modelMatrix * vec4(position, 1.0);
vec3 fragPosView = vec3(viewMatrix * worldPos);
vec3 norm = normalize(mat3(viewMatrix * modelMatrix) * normal);

vec3 light1 = normalize(mat3(viewMatrix) * lightDir1);

vec3 viewDir = normalize(viewPos - fragPosView);

// La luz para la especular es solo light1
float diff = max(dot(norm, light1), 0.0);
float spec = pow(max(dot(norm, light1 + viewDir), 0.0), shininess);

vec3 ambient = ambientColor * ambientStrength;
vec3 diffuse = lightColor * diff * diffuseStrength;
vec3 specular = lightColor * spec * specularStrength;

vec3 lighting = ambient + diffuse + specular;

vColor = vec4(lighting * color.rgb, color.a);

gl_Position = projection * viewMatrix * worldPos;
}
`;


//~~~~~~~~~~~~~~~~~~~~~~~~~


// w/floor
vertexShaderLightSingle = `
attribute vec3 position;
attribute vec4 color;
attribute vec3 normal;

uniform mat4 projection;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

uniform vec3 lightDir1;
uniform vec3 viewPos;

uniform vec3 ambientColor;
uniform vec3 lightColor;

uniform float ambientStrength;
uniform float diffuseStrength;
uniform float specularStrength;
uniform float shininess;

uniform float camPosZ;
uniform float tileScale;
uniform float cameraPositionZ;
uniform float cameraPositionX;
uniform float meshPositionZ;
uniform float meshPositionX;

uniform int isCell;

varying vec4 vColor;

// --- función de ruido simple por vértice ---
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
  // --- shading clásico ---
  vec3 norm = normalize(mat3(viewMatrix * modelMatrix) * normal);

//-------------
if(isCell!=1){
  vec3 localPos = position - vec3(0.0, 0.0, 0.0);
  vec3 roundedNormal = normalize(localPos);
  
  // aplicar rotación/escala del modelo igual que a las normales reales
  roundedNormal = normalize(mat3(viewMatrix * modelMatrix) * roundedNormal);
  
  // --- detectar caras planas ---
  float eps = 1e-4;
  int zeros = 0;
  if (abs(norm.x) < eps) zeros++;
  if (abs(norm.y) < eps) zeros++;
  if (abs(norm.z) < eps) zeros++;
  
  // factor de mezcla: solo en bordes/esquinas
  float factor = (zeros < 2) ? 0.4: 0.0;
  
  norm = normalize(mix(norm, roundedNormal, factor));
}
//--------

  vec3 light1 = normalize(mat3(viewMatrix) * lightDir1);
  vec3 fragPosView = vec3(viewMatrix * (modelMatrix * vec4(position, 1.0)));
  vec3 viewDir = normalize(viewPos - fragPosView);

  float diff = max(dot(norm, light1), 0.0);
  float spec = pow(max(dot(norm, normalize(light1 + viewDir)), 0.0), shininess);

  vec3 ambient  = ambientColor * ambientStrength;
  vec3 diffuse  = lightColor * diff * diffuseStrength;
  vec3 specular = lightColor * spec * specularStrength;
  vec3 lighting = ambient + diffuse + specular;

  // ---- color base por defecto: el del vértice ----
  vec3 baseColor = color.rgb;

vec3 displacedPos = position;

//-----------------------

  if (isCell == 1) {
  float depth = camPosZ / tileScale / 2.0;
  float modDepth = mod(depth, 600.0);

  vec3 green = vec3(0.0, 0.6, 0.0);
  vec3 white = vec3(0.9, 0.9, 0.9);
  vec3 brown = vec3(0.55, 0.27, 0.07);

  float segmentSize = 200.0;
  float range = 20.0;
  vec3 c1, c2;
  float r1, r2;

  if (modDepth < segmentSize) {
    c1 = brown; c2 = white; r1 = 2.0; r2 = 0.8;
  } else if (modDepth < segmentSize * 2.0) {
    c1 = white; c2 = green; r1 = 0.8; r2 = 1.0;
  } else {
    c1 = green; c2 = brown; r1 = 1.0; r2 = 2.0;
  }

  float local = mod(modDepth, segmentSize);
  float t = clamp((local - (segmentSize - range)) / range, 0.0, 1.0);

  baseColor = mix(c1, c2, t);
  float reliefStrength = mix(r1, r2, t);

  // coordenadas “suaves” dentro de la celda
  vec2 cellPosF = (vec2(position.x + meshPositionX, position.z + meshPositionZ)) / tileScale;
  vec2 cell0 = floor(cellPosF);
  vec2 f = fract(cellPosF);

  // ruido en las 4 esquinas
  float n00 = rand(cell0);
  float n10 = rand(cell0 + vec2(0.9, 0.0));
  float n01 = rand(cell0 + vec2(0.0, 0.9));
  float n11 = rand(cell0 + vec2(0.9, 0.9));

  // interpolación bilineal
  float noise = mix(mix(n00, n10, f.x), mix(n01, n11, f.x), f.y);

  float colorFactorMin = 0.6;
float colorFactorMax = 1.0;

// definir según el tipo de celda
if (c1 == white || c2 == white) {
  // nieve
  colorFactorMin = 0.6;
  colorFactorMax = 1.0;
} else if (c1 == green || c2 == green) {
  // pasto
  colorFactorMin = 0.6;
  colorFactorMax = 1.0;
} else if (c1 == brown || c2 == brown) {
  // café
  colorFactorMin = 0.6;
  colorFactorMax = 1.0;
}

// aplicar el factor de color con el ruido
float colorFactor = mix(colorFactorMin, colorFactorMax, noise);

  baseColor *= colorFactor;

  // aplicar ruido al relieve
  displacedPos.y += (noise - 0.5) * reliefStrength;
  

float whiteHeightBoost = 0.0;
if (c1 == white && c2 == white) {
  // celda completamente blanca
  whiteHeightBoost = 2.7;
} else if (c1 == brown && c2 == white) {
  // transición café → blanco
  whiteHeightBoost = 2.7 * t; // va aumentando gradualmente
} else if (c1 == white && c2 == green) {
  // transición blanco → verde
  whiteHeightBoost = 2.7 * (1.0 - t); // va disminuyendo
}
displacedPos.y += whiteHeightBoost;
  
  
  
}

//-----------------------

  vColor = vec4(lighting * baseColor, color.a);
  gl_Position = projection * viewMatrix * modelMatrix * vec4(displacedPos, 1.0);
}
`;

