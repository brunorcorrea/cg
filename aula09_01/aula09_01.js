var utils = new Utils(300, 200, 255, 0.1, 0.2, 0.5, 0.5);

var vertices = [];
var colors = [];

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
var cubeColors = [
  [1.0, 0.0, 0.0],
  [0.0, 1.0, 0.0],
  [0.0, 0.0, 1.0],
  [1.0, 1.0, 0.0],
  [1.0, 0.0, 1.0],
  [0.0, 1.0, 1.0],
  [0.5, 0.5, 0.5],
  [0.3, 0.7, 0.2],
];

const makeFace = (v1, v2, v3, v4) => {
  var triangles = [v1, v2, v3, v4, v3, v1];

  triangles.forEach((triangle) => {
    cubeColors[v1].forEach((color) => {
      colors.push(color);
    });

    cubeVertices[triangle].forEach((vertice) => {
      vertices.push(vertice);
    });
  });
};

makeFace(0, 1, 5, 4);
makeFace(1, 0, 3, 2);
makeFace(2, 3, 7, 6);
makeFace(3, 0, 4, 7);
makeFace(4, 5, 6, 7);
makeFace(6, 5, 1, 2);

utils.initShader({
  vertexShader: `#version 300 es
    precision mediump float;

    in vec3 aPosition;
    in vec3 aColor;
    out vec4 vColor;

    uniform vec3 translation;
    uniform vec3 theta;
    uniform float scalarValue;

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
      gl_Position = vec4(scalarValue * translatedPosition.xyz, 1.0);
      vColor = vec4(aColor, 1.0);
    }`,
  fragmentShader: `#version 300 es
      precision highp float;
      in vec4 vColor;
      out vec4 fColor;
      void main(){
        fColor = vColor;
      }`,
});

utils.initBuffer({ vertices: vertices });
utils.linkBuffer({ variable: "aPosition", reading: 3 });

utils.initBuffer({ vertices: colors });
utils.linkBuffer({ variable: "aColor", reading: 3 });

var theta = [0, 0, 0];
var translation = [0,0,0];
var scale = 0;
var scalarValue = 1;
var transform_x = 0;
var transform_y = 0;
var transform_z = 0;
var translation_x = 0;
var translation_y = 0;
var translation_z = 0;
var speed = 100;

var timeoutId;

function changeSpeed(newSpeed) {
  speed = 100 - newSpeed;
  if (speed == 100) { //Considera-se que a speed 100 é parado e 0 é mais rápido
    clearTimeout(timeoutId)
    timeoutId = -1
  } else if(timeoutId == -1) {
    timeoutId = blabla()
  }
}

function blabla() {
  return setTimeout(render, speed);
}

function startRotateX() {
  transform_x = 1;
}

function stopRotateX() {
  transform_x = 0;
}

function changeDirectionRotateX() {
  transform_x *= -1;
}

function startRotateY() {
  transform_y = 1;
}

function stopRotateY() {
  transform_y = 0;
}

function changeDirectionRotateY() {
  transform_y *= -1;
}

function startRotateZ() {
  transform_z = 1;
}

function stopRotateZ() {
  transform_z = 0;
}

function changeDirectionRotateZ() {
  transform_z *= -1;
}

function startScale() {
  scale += 0.01;
}

function stopScale() {
  scale = 0;
}

function changeDirectionScale() {
  scale *= -1;
}

function startTranslateX() {
  translation_x = 0.01;
}

function stopTranslateX() {
  translation_x = 0;
}

function changeDirectionTranslateX() {
  translation_x *= -1;
}

function startTranslateY() {
  translation_y = 0.01;
}

function stopTranslateY() {
  translation_y = 0;
}

function changeDirectionTranslateY() {
  translation_y *= -1;
}

function startTranslateZ() {
  translation_z = 0.01;
}

function stopTranslateZ() {
  translation_z = 0;
}

function changeDirectionTranslateZ() {
  translation_z *= -1;
}

function render() {
  utils.linkUniformVariable({
    shaderName: "theta",
    value: theta,
    kind: "3fv",
  });

  utils.linkUniformVariable({
    shaderName: "scalarValue",
    value: scalarValue,
  });

  utils.linkUniformVariable({
    shaderName: "translation",
    value: translation,
    kind: "3fv",
  });

  utils.drawElements({ method: "TRIANGLES" });

  scalarValue += scale;
  theta[0] += transform_x;
  theta[1] += transform_y;
  theta[2] += transform_z;
  translation[0] += translation_x;
  translation[1] += translation_y;
  translation[2] += translation_z;

  timeoutId = blabla();
}

render();

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("slider").addEventListener("input", function(event) {
    changeSpeed(event.target.value);
  });

  document.getElementById("RotationX").addEventListener("click", changeDirectionRotateX);
  document.getElementById("RotationStartX").addEventListener("click", startRotateX);
  document.getElementById("RotationStopX").addEventListener("click", stopRotateX);

  document.getElementById("RotationY").addEventListener("click", changeDirectionRotateY);
  document.getElementById("RotationStartY").addEventListener("click", startRotateY);
  document.getElementById("RotationStopY").addEventListener("click", stopRotateY);

  document.getElementById("RotationZ").addEventListener("click", changeDirectionRotateZ);
  document.getElementById("RotationStartZ").addEventListener("click", startRotateZ);
  document.getElementById("RotationStopZ").addEventListener("click", stopRotateZ);

  document.getElementById("ScaleDirection").addEventListener("click", changeDirectionScale);
  document.getElementById("ScaleStart").addEventListener("click", startScale);
  document.getElementById("ScaleStop").addEventListener("click", stopScale);

  document.getElementById("TranslationStartX").addEventListener("click", startTranslateX);
  document.getElementById("TranslationStopX").addEventListener("click", stopTranslateX);
  document.getElementById("TranslationX").addEventListener("click", changeDirectionTranslateX);

  document.getElementById("TranslationStartY").addEventListener("click", startTranslateY);
  document.getElementById("TranslationStopY").addEventListener("click", stopTranslateY);
  document.getElementById("TranslationY").addEventListener("click", changeDirectionTranslateY);

  document.getElementById("TranslationStartZ").addEventListener("click", startTranslateZ);
  document.getElementById("TranslationStopZ").addEventListener("click", stopTranslateZ);
  document.getElementById("TranslationZ").addEventListener("click", changeDirectionTranslateZ);
});
