vertexShaderLightSingle = `#version 300 es
precision highp float;

in vec3 position;
in vec4 color;
in vec3 normal;

uniform mat4 projection;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform mat4 lightMatrix;

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

uniform int isCell;

out vec4 vColor;
out vec4 vFragPosLightSpace;

void main(){
    // Normales y vectores de luz/vista
    vec3 norm = normalize(mat3(viewMatrix * modelMatrix) * normal);
    vec3 light1 = normalize(mat3(viewMatrix) * lightDir1);
    vec3 fragPosView = vec3(viewMatrix * (modelMatrix * vec4(position, 1.0)));
    vec3 viewDir = normalize(viewPos - fragPosView);

    // Lighting básico
    float diff = max(dot(norm, light1), 0.0);
    float spec = pow(max(dot(norm, normalize(light1 + viewDir)), 0.0), shininess);

    vec3 ambient  = ambientColor * ambientStrength;
    vec3 diffuse  = lightColor * diff * diffuseStrength;
    vec3 specular = lightColor * spec * specularStrength;
    vec3 lighting = ambient + diffuse + specular;

    // Base color
    vec3 baseColor = color.rgb;

 // Biomas simples por segmentos en Z
if(isCell == 1){
    float depth = camPosZ / tileScale / 2.0;
    float modDepth = mod(depth, 600.0);

    vec3 green = vec3(0.0, 0.6, 0.0);
    vec3 white = vec3(0.9);
    vec3 brown = vec3(0.55, 0.27, 0.07);

    float segmentSize = 200.0;
    float range = 20.0;

    vec3 c1, c2;
    if(modDepth < segmentSize){
        c1 = white; c2 = brown;
    } else if(modDepth < segmentSize * 2.0){
        c1 = brown; c2 = green;
    } else {
        c1 = green; c2 = white;
    }

    float local = mod(modDepth, segmentSize);
    float t = clamp((local - (segmentSize - range)) / range, 0.0, 1.0);
    baseColor = mix(c1, c2, t);

float h = position.y/2.0;
h = clamp(h, 0.0, 1.0);
h = pow(h, 2.0);
float invH = h-1.0;
baseColor = mix(baseColor * 0.85, baseColor, invH);
  
}

    // Salida final
    vColor = vec4(lighting * baseColor, color.a);
    vFragPosLightSpace = lightMatrix * modelMatrix * vec4(position, 1.0);
    gl_Position = projection * viewMatrix * modelMatrix * vec4(position, 1.0);
}
`;


fragmentShaderSource = 
`#version 300 es
precision mediump float;

in vec4 vColor;
in vec4 vFragPosLightSpace;

uniform sampler2D shadowMap;
uniform vec3 light1;

out vec4 fragColor;

// ---- PCF Shadow Mapping ----
float calculateShadow() {
  vec3 projCoords = vFragPosLightSpace.xyz / vFragPosLightSpace.w;
  projCoords = projCoords * 0.5 + 0.5;
  
  if (projCoords.z > 1.0 || projCoords.x < 0.0 || projCoords.x > 1.0 || projCoords.y < 0.0 || projCoords.y > 1.0)
    return 0.0;
  
  float currentDepth = projCoords.z;
  float bias = 0.02;
  float shadow = 0.0;
  float texelSize = 1.0 / 4096.0;
  
  for (int x = -1; x <= 0; x++) {
    for (int y = -1; y <= 0; y++) {
      float pcfDepth = texture(shadowMap, projCoords.xy + vec2(x, y) * texelSize).r;
      shadow += currentDepth - bias > pcfDepth ? 0.3 : 0.0;
    }
  }
  shadow /= 4.0;
  return shadow;
}

void main() {
  float shadow = calculateShadow();
  vec3 finalColor = vColor.rgb * (1.0 - shadow);
  fragColor = vec4(finalColor, vColor.a);
}
`;



//-----------------------//
let camPosZLocation;
let tileScaleLocation;
let cameraPositionZLocation;
let cameraPositionXLocation;
let meshPositionZLocation;
let meshPositionXLocation;
let positionAttributeLocation;
let colorAttributeLocation;
let normalAttributeLocation;
let projectionUniformLocation;
let viewMatrixUniformLocation;
let modelMatrixUniformLocation;

let lightDirLocation;
let lightDir= [-0.1, 0.1, 0.1];
let lightPos = [-0.1 * 1.0, 0.1 * 1.0, 0.1 * 1.0];
let viewPosLocation;
let ambientColorLocation;
let lightColorLocation;
let shininessLocation;
let ambientStrengthLocation;
let diffuseStrengthLocation;
let specularStrengthLocation;

let uIsCell;

let vertexBuffer;
let colorBuffer;
let normalBuffer;

let shadowFramebuffer;
let shadowDepthTexture;
let shadowColorTexture;
let shadowMapLocation;
let aPosition;
let uModelMatrix;
let uLightMatrix;
let lightMatrixLocation;
let lightShaderProgram;
let cameraShaderProgram;
//-----------------------//

function initShadowMap() {
  
  // ---- 1. Crear framebuffer ----
  shadowFramebuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, shadowFramebuffer);
  
  // ---- 2. Crear textura de profundidad ----
  shadowDepthTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, shadowDepthTexture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.DEPTH_COMPONENT24, // WebGL2 depth format
    4096,
    4096,
    0,
    gl.DEPTH_COMPONENT,
    gl.UNSIGNED_INT,
    null
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  
  // ---- 3. Adjuntar profundidad al framebuffer ----
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, shadowDepthTexture, 0);
  
  // No necesitamos color si solo vamos a depth
  gl.drawBuffers([]); // opcional en WebGL2 para depth-only framebuffer
  
  // ---- 4. Chequear estado ----
  if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
    console.error("Error creando shadow framebuffer");
  }
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  
  // ---- 5. Shaders del shadow map ----
  const vsSource = `#version 300 es
  in vec3 position;
  uniform mat4 lightMatrix;
  uniform mat4 modelMatrix;
  void main() {
    gl_Position = lightMatrix * modelMatrix * vec4(position, 1.0);
  }`;
  
  const fsSource = `#version 300 es
  precision highp float;
  void main() {
    // Depth-only framebuffer, no color output necesario
  }`;
  
  // ---- 6. Compilar shader ----
  function compileShader(src, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("Error compilando shader:", gl.getShaderInfoLog(shader));
    }
    return shader;
  }
  
  const vs = compileShader(vsSource, gl.VERTEX_SHADER);
  const fs = compileShader(fsSource, gl.FRAGMENT_SHADER);
  
  // ---- 7. Crear programa de shadow ----
  lightShaderProgram = gl.createProgram();
  gl.attachShader(lightShaderProgram, vs);
  gl.attachShader(lightShaderProgram, fs);
  gl.linkProgram(lightShaderProgram);
  if (!gl.getProgramParameter(lightShaderProgram, gl.LINK_STATUS)) {
    console.error("Error linkeando lightShaderProgram:", gl.getProgramInfoLog(lightShaderProgram));
  }
  
  // ---- 8. Localizar atributos y uniforms ----
  aPosition = gl.getAttribLocation(lightShaderProgram, "position");
  uLightMatrix = gl.getUniformLocation(lightShaderProgram, "lightMatrix");
  uModelMatrix = gl.getUniformLocation(lightShaderProgram, "modelMatrix");
  
//  console.log("shadow program WebGL2 cargado correctamente");
}
//-----------------------//

function initWebGL() {
  
  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);
  gl.enable(gl.DEPTH_TEST);
  
  // ---- Shaders ----
  let vertexShaderSource = vertexShaderLightSingle;
  
  // ---- Compilar shaders ----
  function compileShader(src, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("Error compilando shader:", gl.getShaderInfoLog(shader));
    }
    return shader;
  }
  
  const vs = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
  const fs = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
  
  // ---- Programa principal ----
  cameraShaderProgram = gl.createProgram();
  gl.attachShader(cameraShaderProgram, vs);
  gl.attachShader(cameraShaderProgram, fs);
  
  // WebGL2: binding de atributos explícito opcional
  gl.linkProgram(cameraShaderProgram);
  if (!gl.getProgramParameter(cameraShaderProgram, gl.LINK_STATUS)) {
    console.error("Error linkeando cameraShaderProgram:", gl.getProgramInfoLog(cameraShaderProgram));
  }
  gl.useProgram(cameraShaderProgram);
  
  // ---- Localizar atributos y uniforms ----
  positionAttributeLocation = gl.getAttribLocation(cameraShaderProgram, "position");
  colorAttributeLocation = gl.getAttribLocation(cameraShaderProgram, "color");
  normalAttributeLocation = gl.getAttribLocation(cameraShaderProgram, "normal");
  
  projectionUniformLocation = gl.getUniformLocation(cameraShaderProgram, "projection");
  viewMatrixUniformLocation = gl.getUniformLocation(cameraShaderProgram, "viewMatrix");
  modelMatrixUniformLocation = gl.getUniformLocation(cameraShaderProgram, "modelMatrix");
  
  let lightDir1Location = gl.getUniformLocation(cameraShaderProgram, "lightDir1");
  let lightDir2Location = gl.getUniformLocation(cameraShaderProgram, "lightDir2");
  viewPosLocation = gl.getUniformLocation(cameraShaderProgram, "viewPos");
  ambientColorLocation = gl.getUniformLocation(cameraShaderProgram, "ambientColor");
  lightColorLocation = gl.getUniformLocation(cameraShaderProgram, "lightColor");
  shininessLocation = gl.getUniformLocation(cameraShaderProgram, "shininess");
  ambientStrengthLocation = gl.getUniformLocation(cameraShaderProgram, "ambientStrength");
  diffuseStrengthLocation = gl.getUniformLocation(cameraShaderProgram, "diffuseStrength");
  specularStrengthLocation = gl.getUniformLocation(cameraShaderProgram, "specularStrength");
  
  camPosZLocation = gl.getUniformLocation(cameraShaderProgram, "camPosZ");
  tileScaleLocation = gl.getUniformLocation(cameraShaderProgram, "tileScale");
  cameraPositionZLocation = gl.getUniformLocation(cameraShaderProgram, "cameraPositionZ");
  cameraPositionXLocation = gl.getUniformLocation(cameraShaderProgram, "cameraPositionX");
  meshPositionZLocation = gl.getUniformLocation(cameraShaderProgram, "meshPositionZ");
  meshPositionXLocation = gl.getUniformLocation(cameraShaderProgram, "meshPositionX");
  
  shadowMapLocation = gl.getUniformLocation(cameraShaderProgram, "shadowMap");
  lightMatrixLocation = gl.getUniformLocation(cameraShaderProgram, "lightMatrix");
  uIsCell = gl.getUniformLocation(cameraShaderProgram, "isCell");
  
  // ---- Buffers ----
  vertexBuffer = gl.createBuffer();
  colorBuffer = gl.createBuffer();
  normalBuffer = gl.createBuffer();
  
  // ---- Valores iniciales de uniform ----
  gl.uniform3f(lightDir1Location, -0.1, 1.0, 0.1);
  gl.uniform3f(lightDir2Location, 0.5, 0.5, -0.5);
  gl.uniform3f(viewPosLocation, 0.0, 0.0, 0.0);
  gl.uniform3f(ambientColorLocation, 1.0, 1.0, 0.0);
  gl.uniform3f(lightColorLocation, 1.0, 1.0, 0.0);
  gl.uniform1f(shininessLocation, 100.0);
  
  // ---- Bind shadow map a unidad 0 ----
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, shadowDepthTexture);
  gl.uniform1i(shadowMapLocation, 0);
  
//console.log("main program loaded (WebGL2 compatible)");
}
//-----------------------//

function drawMeshGl(mesh) {
  
  // Posiciones
  gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
  
  // Colores
  gl.bindBuffer(gl.ARRAY_BUFFER, mesh.colorBuffer);
  gl.enableVertexAttribArray(colorAttributeLocation);
  gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);
  
  // Normales
  gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normalBuffer);
  gl.enableVertexAttribArray(normalAttributeLocation);
  gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);
  
  // Uniforms de luz
  
  gl.uniform3fv(viewPosLocation, mesh.viewPos);
  gl.uniform3fv(ambientColorLocation, mesh.ambientColor);
  gl.uniform3fv(lightColorLocation, mesh.lightColor);
  
  gl.uniform1f(ambientStrengthLocation, mesh.ambientStrength);
  gl.uniform1f(diffuseStrengthLocation, mesh.diffuseStrength);
  gl.uniform1f(specularStrengthLocation, mesh.specularStrength);
  gl.uniform1f(shininessLocation, mesh.shininess);
  
  // Bind del IBO
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
  
  // Dibujar usando indices
  gl.drawElements(gl.TRIANGLES, mesh.vertexCount, gl.UNSIGNED_SHORT, 0);
}

//-----------------------//

function drawMeshShadow(mesh, lightMatrix) {
  gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer);
  gl.enableVertexAttribArray(aPosition);
  gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
  
//  gl.uniformMatrix4fv(uModelMatrix, false, mesh.modelMatrix);
  gl.uniformMatrix4fv(uLightMatrix, false, lightMatrix);
  
  // Bind del IBO
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
  
  gl.drawElements(gl.TRIANGLES, mesh.vertexCount, gl.UNSIGNED_SHORT, 0);
}

//-----------------------//



//-----------------------//

initShadowMap();

initWebGL();