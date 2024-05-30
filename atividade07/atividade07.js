var utils = new Utils();

// Colocaremos aqui os dado que passaremos para a GPU
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

var cubeTextureCoords = [
  // coca
  [0, 1],
  [0.333, 1],
  [0.333, 0.5],
  [0, 0.5],
  // hamburguer
  [0.333, 0.5],
  [0.667, 0.5],
  [0.667, 1.0],
  [0.333, 1.0],
  // pizza
  [0.667, 0.5],
  [1.0, 0.5],
  [1.0, 1.0],
  [0.667, 1.0],
  // sorvete
  [0.0, 0.5],
  [0.333, 0.5],
  [0.333, 0.0],
  [0.0, 0.0],
  // batata
  [0.333, 0.5],
  [0.667, 0.5],
  [0.667, 0.0],
  [0.333, 0.0],
  // acai
  [0.667, 0.5],
  [1.0, 0.5],
  [1.0, 0.0],
  [0.667, 0.0],
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
  1,
  5,
  6,
  2,
  cubeTextureCoords[4],
  cubeTextureCoords[5],
  cubeTextureCoords[6],
  cubeTextureCoords[7]
); // Superior
makeFace(
  0,
  3,
  7,
  4,
  cubeTextureCoords[8],
  cubeTextureCoords[9],
  cubeTextureCoords[10],
  cubeTextureCoords[11]
); // Inferior
makeFace(
  3,
  2,
  6,
  7,
  cubeTextureCoords[12],
  cubeTextureCoords[13],
  cubeTextureCoords[14],
  cubeTextureCoords[15]
); // Direita
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
  4,
  5,
  6,
  7,
  cubeTextureCoords[20],
  cubeTextureCoords[21],
  cubeTextureCoords[22],
  cubeTextureCoords[23]
); // Traseira

utils.initShader({
  vertexShader: `#version 300 es
precision mediump float;

in vec3 aPosition;
in vec3 aColor;
in vec2 aTextureCoord;
out vec2 vTextureCoord;

/*
 ToDo: Coloque aqui variáveis uniformes para a
  câmera, como o uViewMatrix e uProjectionMatrix
 vistos em aulas anteriores
*/

uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

/*
 ToDo: Coloque aqui variáveis uniformes para os ângulos
 de rotação. Como uPitch e uYaw
*/

uniform float uPitch;
uniform float uYaw;


uniform vec3 theta;  // Ângulos de rotação para x, y, z
uniform vec3 uTranslation;  // Vetor de translação
uniform float uScale;  // Fator de escala
out vec3 vViewPosition;  // Posição do ponto de vista para cálculo no fragment shader
out vec4 vColor;  // Cor para interpolação

void main() {
    // Cálculo das matrizes de rotação baseadas em ângulos theta
    vec3 c = cos(radians(theta));
    vec3 s = sin(radians(theta));
    float cosuYaw = cos(uYaw);
    float sinuYaw = sin(uYaw);
    float cosuPitch = cos(uPitch);
    float sinuPitch = sin(uPitch);

    mat4 rx = mat4(1.0,  0.0,  0.0, 0.0,
                   0.0,  c.x,  s.x, 0.0,
                   0.0, -s.x,  c.x, 0.0,
                   0.0,  0.0,  0.0, 1.0);

    mat4 ry = mat4(c.y, 0.0, -s.y, 0.0,
                   0.0, 1.0,  0.0, 0.0,
                   s.y, 0.0,  c.y, 0.0,
                   0.0, 0.0,  0.0, 1.0);

    mat4 rz = mat4(c.z, s.z, 0.0, 0.0,
                  -s.z,  c.z, 0.0, 0.0,
                   0.0,  0.0, 1.0, 0.0,
                   0.0,  0.0, 0.0, 1.0);

    // Matriz de escala
    mat4 scaleMatrix = mat4(
        uScale, 0.0,    0.0,    0.0,
        0.0,    uScale, 0.0,    0.0,
        0.0,    0.0,    uScale, 0.0,
        0.0,    0.0,    0.0,    1.0
    );

    // Matriz de translação
    mat4 translationMatrix = mat4(
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        uTranslation.x, uTranslation.y, uTranslation.z, 1.0
    );

   // Todo: Crie as matrizes de rotação da câmera com o uPitch e uYaw
    mat4 cameraRotationx = mat4(1.0,  0.0,  0.0, 0.0,
                   0.0,  cosuPitch,  sinuPitch, 0.0,
                   0.0, -sinuPitch,  cosuPitch, 0.0,
                   0.0,  0.0,  0.0, 1.0);

    mat4 cameraRotationy = mat4(cosuYaw, 0.0, -sinuYaw, 0.0,
                   0.0, 1.0,  0.0, 0.0,
                   sinuYaw, 0.0,  cosuYaw, 0.0,
                   0.0, 0.0,  0.0, 1.0);

    // Todo: Adicione as matrizes relacionadas à câmera à esquerda da translação do objeto. 
    mat4 modelMatrix = uProjectionMatrix * cameraRotationy * cameraRotationx * uViewMatrix * translationMatrix * scaleMatrix * rz * ry * rx ;
   
    vec4 transformedPosition = modelMatrix * vec4(aPosition, 1.0);

    gl_Position = transformedPosition;
    vViewPosition = vec3(transformedPosition);
    vTextureCoord = aTextureCoord;
}
`,
  fragmentShader: `#version 300 es
precision mediump float;

in vec4 vColor;  // Cor vinda do vertex shader
in vec2 vTextureCoord;
in vec3 vViewPosition; // Posição do vértice vinda do vertex shader

uniform sampler2D uSampler;
uniform vec2 uTextureSize;
uniform float uKernel[9];

out vec4 fColor;

uniform float uOuterCutOff; // Ângulo externo para suavização na borda do cone

void main() {
    vec2 onePixel = vec2(1.0, 1.0) / uTextureSize;

    vec4 colorSum = vec4(0.0);
    colorSum += texture(uSampler, vTextureCoord + onePixel * vec2(-1, -1)) * uKernel[0];
    colorSum += texture(uSampler, vTextureCoord + onePixel * vec2( 0, -1)) * uKernel[1];
    colorSum += texture(uSampler, vTextureCoord + onePixel * vec2( 1, -1)) * uKernel[2];
    colorSum += texture(uSampler, vTextureCoord + onePixel * vec2(-1,  0)) * uKernel[3];
    colorSum += texture(uSampler, vTextureCoord + onePixel * vec2( 0,  0)) * uKernel[4];
    colorSum += texture(uSampler, vTextureCoord + onePixel * vec2( 1,  0)) * uKernel[5];
    colorSum += texture(uSampler, vTextureCoord + onePixel * vec2(-1,  1)) * uKernel[6];
    colorSum += texture(uSampler, vTextureCoord + onePixel * vec2( 0,  1)) * uKernel[7];
    colorSum += texture(uSampler, vTextureCoord + onePixel * vec2( 1,  1)) * uKernel[8];

    fColor = colorSum;
    fColor.a = 1.0;
}
`,
});

// Mandaremos o vértice, lembrando agora que leremos o vetor de três em três.
utils.initBuffer({ vertices });
utils.linkBuffer({ reading: 3 });

utils.initBuffer({ vertices: textureCoords });
utils.linkBuffer({ variable: "aTextureCoord", reading: 2 });

var deliciousImage = new Image();
deliciousImage.src = "texturas/delicia.png";
deliciousImage.onload = function () {
  var deliciousTexture = utils.initTexture(deliciousImage);
  utils.activateTexture(deliciousTexture, 0);
};

// Agora vamos fazer o cubo rotacionar.
var theta = [0.0, 0.0, 0.0]; // Rotações nos eixos X, Y, Z

// Variações a serem aplicadas para gerar a animação
var rotation_x = 0.0;
var rotation_y = 0.0;
var rotation_z = 0.0;

// Agora vamos mover o cubo.
var translation = [0.0, 0.0, 0.0];

var translation_x = 0.0;
var translation_y = 0.0;
var translation_z = 0.0;

// Agora vamos aumentar o tamanho do cubo.
var uScale = 1;
var scale = 0;

// Velocidade da animação
var speed = 100;

// Suavização: Reduz o ruído com menos intensidade do que o desfoque gaussiano.
var kernelSmooth = [1 / 8, 1 / 8, 1 / 8, 1 / 8, 0, 1 / 8, 1 / 8, 1 / 8, 1 / 8];

// Nenhum: Não faz nada
var kernelNone = [0, 0, 0, 0, 1, 0, 0, 0, 0];

// Aguçamento: Acentua as bordas e detalhes da imagem.
var kernelSharpening = [0, -1, 0, -1, 5, -1, 0, -1, 0];

// Realce de Borda: Destaca as bordas na imagem ao subtrair a intensidade dos pixels vizinhos do pixel central.
var kernelEdgeEnhancement = [-1, -1, -1, -1, 8, -1, -1, -1, -1];

var kernel = kernelNone;

document.getElementById("slider").onchange = function (event) {
  speed = 100 - event.target.value;
};

/************************************************/

document.getElementById("RotationX").onclick = function (event) {
  rotation_x = -rotation_x;
};

document.getElementById("RotationStartX").onclick = function (event) {
  rotation_x = 10;
};

document.getElementById("RotationStopX").onclick = function (event) {
  rotation_x = 0;
};

/************************************************/

document.getElementById("RotationY").onclick = function (event) {
  rotation_y = -rotation_y;
};

document.getElementById("RotationStartY").onclick = function (event) {
  rotation_y = 10;
};

document.getElementById("RotationStopY").onclick = function (event) {
  rotation_y = 0;
};

/************************************************/

document.getElementById("RotationZ").onclick = function (event) {
  rotation_z = -rotation_z;
};

document.getElementById("RotationStartZ").onclick = function (event) {
  rotation_z = 10;
};

document.getElementById("RotationStopZ").onclick = function (event) {
  rotation_z = 0;
};

/************************************************/
document.getElementById("ScaleDirection").onclick = function (event) {
  scale = -scale;
};

document.getElementById("ScaleStart").onclick = function (event) {
  scale = 0.01;
};

document.getElementById("ScaleStop").onclick = function (event) {
  scale = 0;
};

/************************************************/
document.getElementById("TranslationX").onclick = function (event) {
  translation_x = -translation_x;
};

document.getElementById("TranslationStartX").onclick = function (event) {
  translation_x = 0.01;
};

document.getElementById("TranslationStopX").onclick = function (event) {
  translation_x = 0;
};

/************************************************/

document.getElementById("TranslationY").onclick = function (event) {
  translation_y = -translation_y;
};

document.getElementById("TranslationStartY").onclick = function (event) {
  translation_y = 0.01;
};

document.getElementById("TranslationStopY").onclick = function (event) {
  translation_y = 0;
};

/************************************************/

document.getElementById("TranslationZ").onclick = function (event) {
  translation_z = -translation_z;
};

document.getElementById("TranslationStartZ").onclick = function (event) {
  translation_z = 0.01;
};

document.getElementById("TranslationStopZ").onclick = function (event) {
  translation_z = 0;
};

document.getElementById("Smooth").onclick = function (event) {
  kernel = kernelSmooth;
};

document.getElementById("Sharpening").onclick = function (event) {
  kernel = kernelSharpening;
};

document.getElementById("EdgeEnhancement").onclick = function (event) {
  kernel = kernelEdgeEnhancement;
};

document.getElementById("None").onclick = function (event) {
  kernel = kernelNone;
};

/************************************************/
// Capture os eventos do teclado
/************************************************/
var cameraPosition = { x: 0, y: 0, z: 5 };
var cameraRotation = { pitch: 0, yaw: 0 };

document.addEventListener("keydown", function (event) {
  var tSpeed = 0.1; // Velocidade de movimento da câmera
  var rSpeed = 0.01; // Velocidade de rotação da câmera.

  switch (event.key) {
    // ToDo: Escolha teclas do teclado para movimentar a câmera.
    case "W":
    case "w":
      cameraPosition.z -= tSpeed;
      break;
    case "A":
    case "a":
      cameraPosition.x -= tSpeed;
      break;
    case "S":
    case "s":
      cameraPosition.z += tSpeed;
      break;
    case "D":
    case "d":
      cameraPosition.x += tSpeed;
      break;
    case "Z":
    case "z":
      cameraPosition.y += tSpeed;
      break;
    case "X":
    case "x":
      cameraPosition.y -= tSpeed;
      break;
    case "ArrowUp":
      cameraRotation.pitch += rSpeed;
      break;
    case "ArrowDown":
      cameraRotation.pitch -= rSpeed;
      break;
    case "ArrowLeft":
      cameraRotation.yaw -= rSpeed;
      break;
    case "ArrowRight":
      cameraRotation.yaw += rSpeed;
      break;
  }
  updateViewMatrix();
});

function updateViewMatrix() {
  var viewMatrix = mat4.create(); // Cria uma nova matriz 4x4
  var up = vec3.fromValues(0, 1, 0); // Direção 'up' do mundo, geralmente o eixo Y
  var target = vec3.fromValues(
    cameraPosition.x,
    cameraPosition.y,
    cameraPosition.z - 1
  );
  mat4.lookAt(
    viewMatrix,
    [cameraPosition.x, cameraPosition.y, cameraPosition.z],
    target,
    up
  );

  // ToDo: Envie a nova matriz viewMatrix, cameraRotation.pitch e
  //  cameraRotation.yaw para o shader. Provavelmente nas variáveis
  // uViewMatrix, uPitch e uYaw
  utils.linkUniformMatrix({
    shaderName: "uViewMatrix",
    value: viewMatrix,
    kind: "4fv",
  });

  // Enviar os ângulos de rotação para o shader
  utils.linkUniformVariable({
    shaderName: "uPitch",
    value: cameraRotation.pitch,
    kind: "1f",
  });
  utils.linkUniformVariable({
    shaderName: "uYaw",
    value: cameraRotation.yaw,
    kind: "1f",
  });
}

/************************************************/

/***************************************************
Agora vamos tratar da câmera
***************************************************/

// ToDo: Crie uma projeção em perspectiva
var projectionPerspectiveMatrix = mat4.create();

mat4.perspective(
  projectionPerspectiveMatrix,
  (45 * Math.PI) / 180,
  1.0,
  0.1,
  100
);
// ToDo: Ligue a matriz de projeção com o shader. Use
// provavelmente um variável de nome uProjectionMatrix
// no shader

utils.linkUniformMatrix({
  shaderName: "uProjectionMatrix",
  value: projectionPerspectiveMatrix,
  kind: "4fv",
});

// ToDo: Crie uma matriz de visualização olhando para o centro do cubo.
var viewMatrix = mat4.create();

mat4.lookAt(viewMatrix, [0, 0, 5], [0, 0, 0], [0, 1, 0]);
// ToDo: Ligue a matriz de visualização com o shader.
// Provavelmente com o nome uViewMatrix no shader

utils.linkUniformMatrix({
  shaderName: "uViewMatrix",
  value: viewMatrix,
  kind: "4fv",
});

function render() {
  theta[0] += rotation_x;
  theta[1] += rotation_y;
  theta[2] += rotation_z;

  translation[0] += translation_x;
  translation[1] += translation_y;
  translation[2] += translation_z;

  uScale += scale;

  utils.linkUniformVariable({ shaderName: "theta", value: theta, kind: "3fv" });

  utils.linkUniformVariable({
    shaderName: "uTranslation",
    value: translation,
    kind: "3fv",
  });

  utils.linkUniformVariable({
    shaderName: "uScale",
    value: uScale,
    kind: "1f",
  });

  utils.linkUniformVariable({
    shaderName: "uKernel",
    value: kernel,
    kind: "1fv",
  });

  utils.drawElements({ method: "TRIANGLES" });

  setTimeout(render, speed);
}
render();
