var utils = new Utils(300, 200, 255, 0.1, 0.2, 0.5, 0.5);

var textureCoords = [];
var vertices = [];

var cubeVertices = [
  [-0.5, -0.5, 0.5],
  [-0.5, 0.5, 0.5],
  [0.5, 0.5, 0.5],
  [0.5, -0.5, 0.5],
  [-0.5, -0.5, -0.5],
  [-0.5, 0.5, -0.5],
  [0.5, 0.5, -0.5],
  [0.5, -0.5, -0.5],
];

// var cubeTextureCoords = [
//   // Face frontal
//   [0.0, 0.0],
//   [1 / 3, 0.0],
//   [1 / 3, 1 / 3],
//   [0.0, 1 / 3],
//   // Face traseira
//   [2 / 3, 0.0],
//   [1.0, 0.0],
//   [1.0, 1 / 3],
//   [2 / 3, 1 / 3],
//   // Face superior
//   [1 / 3, 2 / 3],
//   [2 / 3, 2 / 3],
//   [2 / 3, 1.0],
//   [1 / 3, 1.0],
//   // Face inferior
//   [1 / 3, 1 / 3],
//   [2 / 3, 1 / 3],
//   [2 / 3, 2 / 3],
//   [1 / 3, 2 / 3],
//   // Face esquerda
//   [0.0, 1 / 3],
//   [1 / 3, 1 / 3],
//   [1 / 3, 2 / 3],
//   [0.0, 2 / 3],
//   // Face direita
//   [2 / 3, 1 / 3],
//   [1.0, 1 / 3],
//   [1.0, 2 / 3],
//   [2 / 3, 2 / 3],
// ];

var cubeTextureCoords = [
  // Face frontal (sentido anti-horário) //suvete
  [0.0, 0.5],
  [0.333, 0.5],
  [0.333, 0.0],
  [0.0, 0.0],
  // Face traseira (sentido anti-horário) //açai
  [0.667, 0.5],
  [1.0, 0.5],
  [1.0, 0.0],
  [0.667, 0.0],
  // Face superior (sentido anti-horário) //batata
  [0.333, 1.0],
  [0.667, 1.0],
  [0.667, 0.5],
  [0.333, 0.5],
  // Face inferior (sentido anti-horário)
  [0.333, 0.5],
  [0.667, 0.5],
  [0.667, 0.0],
  [0.333, 0.0],
  // Face esquerda (sentido anti-horário) //hamburguer
  [0.333, 0.5],
  [0.667, 0.5],
  [0.667, 1.0],
  [0.333, 1.0],
  // Face direita (sentido anti-horário) //pizza
  [0.667, 0.5],
  [1.0, 0.5],
  [1.0, 1.0],
  [0.667, 1.0],
  // Face superior (sentido anti-horário) //coca
  [0, 1],
  [0.333, 1],
  [0.333, 0.5],
  [0, 0.5],
];

const makeFace = (v1, v2, v3, v4, t1, t2, t3, t4) => {
  var indices = [v1, v2, v3, v4, v3, v1];
  var texCoords = [t1, t2, t3, t4, t3, t1];

  indices.forEach((index, i) => {
    cubeVertices[index].forEach((coord) => vertices.push(coord));
    texCoords[i].forEach((coord) => textureCoords.push(coord));
  });
};

// Criar cada face do cubo
makeFace(
  0,
  1,
  2,
  3,
  cubeTextureCoords[0],
  cubeTextureCoords[1],
  cubeTextureCoords[2],
  cubeTextureCoords[3]
); // Frontal
makeFace(
  4,
  5,
  6,
  7,
  cubeTextureCoords[4],
  cubeTextureCoords[5],
  cubeTextureCoords[6],
  cubeTextureCoords[7]
); // Traseira
makeFace(
  1,
  5,
  6,
  2,
  cubeTextureCoords[8],
  cubeTextureCoords[9],
  cubeTextureCoords[10],
  cubeTextureCoords[11]
); // Superior
makeFace(
  0,
  3,
  7,
  4,
  cubeTextureCoords[12],
  cubeTextureCoords[13],
  cubeTextureCoords[14],
  cubeTextureCoords[15]
); // Inferior
makeFace(
  0,
  1,
  5,
  4,
  cubeTextureCoords[16],
  cubeTextureCoords[17],
  cubeTextureCoords[18],
  cubeTextureCoords[19]
); // Esquerda
makeFace(
  3,
  2,
  6,
  7,
  cubeTextureCoords[20],
  cubeTextureCoords[21],
  cubeTextureCoords[22],
  cubeTextureCoords[23]
); // Direita

utils.initShader({
  vertexShader: `#version 300 es
    precision mediump float;

    in vec3 aPosition;
    in vec2 aTextureCoord;
    out vec2 vTextureCoord;

    uniform vec3 theta;
    uniform vec3 translation;
    uniform float scalar;

    void main(){
      vec3 angles = radians(theta);
      vec3 c = cos(angles);
      vec3 s = sin(angles);

      mat4 rx = mat4(1.0, 0.0, 0.0, 0.0,
        0.0, c.x, s.x, 0.0,
        0.0, -s.x, c.x, 0.0,
        0.0, 0.0, 0.0, 1.0);
  
      mat4 ry = mat4(c.y, 0.0, -s.y, 0.0,
        0.0, 1.0, 0.0, 0.0,
        s.y, 0.0, c.y, 0.0,
        0.0, 0.0, 0.0, 1.0);
  
      mat4 rz = mat4(c.z, s.z, 0.0, 0.0,
        -s.z, c.z, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0);

      mat4 translationMatrix = mat4(
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        translation.x, translation.y, translation.z, 1.0);
  
      gl_PointSize = 10.0;
      vec4 rotatedPosition = rz * ry * rx * vec4(aPosition, 1.0);
      vec4 translatedPosition = translationMatrix * rotatedPosition;
      gl_Position = vec4(scalar * translatedPosition.xyz, 1.0);
      vTextureCoord = aTextureCoord;
    }`,
  fragmentShader: `#version 300 es
    precision highp float;
    in vec2 vTextureCoord;
    out vec4 fColor;
    uniform sampler2D uSampler;

    void main(){
      fColor = texture(uSampler, vTextureCoord);
    }`,
});

utils.initBuffer({ vertices: vertices });
utils.linkBuffer({ variable: "aPosition", reading: 3 });

// Inicializando e linkando as coordenadas de textura
utils.initBuffer({ vertices: textureCoords });
utils.linkBuffer({ variable: "aTextureCoord", reading: 2 });

var pudimImage = new Image();
pudimImage.src = "texturas/delicia.png";
pudimImage.onload = function () {
  var pudimTexture = utils.initTexture(pudimImage);
  utils.activateTexture(pudimTexture, 0);
};

var theta = [0, 0, 0];
var translation = [0, 0, 0];
var transform_x = 0;
var transform_y = 0;
var transform_z = 0;
var speed = 100;
var scale = 0.0;
var scalar = 1.0;
var translation_x = 0;
var translation_y = 0;
var translation_z = 0;

var timeoutId;

function rotateX() {
  transform_x = -1;
}
function rotateStartX() {
  transform_x = 1;
}
function rotateStopX() {
  transform_x = 0;
}

function rotateY() {
  transform_y = -1;
}
function rotateStartY() {
  transform_y = 1;
}
function rotateStopY() {
  transform_y = 0;
}

function rotateZ() {
  transform_z = -1;
}
function rotateStartZ() {
  transform_z = 1;
}
function rotateStopZ() {
  transform_z = 0;
}

function changeScale() {
  scale = -0.01;
}
function startScale() {
  scale = 0.01;
}
function stopScale() {
  scale = 0;
}

function translateChangeX() {
  translation_x = -0.01;
}
function translateStartX() {
  translation_x = 0.01;
}
function translateStopX() {
  translation_x = 0;
}

function translateChangeY() {
  translation_y = -0.01;
}
function translateStartY() {
  translation_y = 0.01;
}
function translateStopY() {
  translation_y = 0;
}

function translateChangeZ() {
  translation_x = -0.01;
  translation_y = -0.01;
}
function translateStartZ() {
  translation_x = 0.01;
  translation_y = 0.01;
}
function translateStopZ() {
  translation_x = 0;
  translation_y = 0;
}

function changeSpeed(newSpeed) {
  speed = 100 - newSpeed;
  if (speed == 100) {
    clearTimeout(timeoutId);
    timeoutId = -1;
  } else if (timeoutId == -1) {
    timeoutId = setRenderTimeout();
  }
}

function setRenderTimeout() {
  return setTimeout(render, speed);
}

function render() {
  utils.linkUniformVariable({
    shaderName: "theta",
    value: theta,
    kind: "3fv",
  });

  utils.linkUniformVariable({
    shaderName: "translation",
    value: translation,
    kind: "3fv",
  });

  utils.linkUniformVariable({
    shaderName: "scalar",
    value: scalar,
  });

  utils.drawElements({ method: "TRIANGLES" });

  scalar += scale;
  theta[0] += transform_x;
  theta[1] += transform_y;
  theta[2] += transform_z;
  translation[0] += translation_x;
  translation[1] += translation_y;
  translation[2] += translation_z;

  timeoutId = setRenderTimeout();
}

render();
