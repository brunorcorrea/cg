var utils = new Utils({
  width: 400,
  height: 400,
  r: 0.1,
  g: 0.2,
  b: 0.4,
  a: 0.5,
  preserveDrawingBuffer: true,
});

var vertices = [];
var colors = [];

var flagVertices = [
  [-0.5, -0.5], // Fundo
  [0.5, -0.5],
  [0.5, 0.5],
  [-0.5, 0.5],
  [-0.5, 0.5], // Esquerdo Superior
  [-0.5, 0.1],
  [-0.1, 0.1],
  [-0.1, 0.5],
  [0.1, 0.5], // Direito Superior
  [0.1, 0.1],
  [0.5, 0.1],
  [0.5, 0.5],
  [-0.5, -0.1], // Esquerdo Inferior
  [-0.5, -0.5],
  [-0.1, -0.5],
  [-0.1, -0.1],
  [0.1, -0.1], // Direito Inferior
  [0.1, -0.5],
  [0.5, -0.5],
  [0.5, -0.1],
];

function makeFace(v1, v2, v3, v4, color) {
  var triangles = [v1, v2, v3, v4, v3, v1];

  for (var i = 0; i < triangles.length; i++) {
    var vertexIndex = triangles[i];
    vertices.push(flagVertices[vertexIndex][0]);
    vertices.push(flagVertices[vertexIndex][1]);
  }

  for (var i = 0; i < 6; i++) {
    colors.push(color[0]);
    colors.push(color[1]);
    colors.push(color[2]);
  }
}

utils.initShader({
  vertexShader: `#version 300 es
      precision mediump float;
      in vec3 aColor;
      in vec3 aPosition;
      out vec4 vColor;
  
      uniform vec3 translation;
      uniform vec3 theta;
      uniform vec3 scalar;
  
      void main() {
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
  
        mat4 scalarMatrix = mat4(
          scalar.x, 0.0, 0.0, 0.0,
          0.0, scalar.y, 0.0, 0.0,
          0.0, 0.0, scalar.z, 0.0,
          0.0, 0.0, 0.0, 1.0);
  
        gl_PointSize = 10.0;
        vec4 rotatedPosition = rz * ry * rx * vec4(aPosition, 1.0);
        vec4 translatedPosition = translationMatrix * rotatedPosition;
        gl_Position = scalarMatrix * translatedPosition;
        vColor = vec4(aColor, 1.0);
      }`,
  fragmentShader: `#version 300 es
      precision highp float;
      in vec4 vColor;
      out vec4 fColor;
      void main() {
        fColor = vColor;
      }`,
});

var theta = [0, 0, 0];
var translation = [0, 0, 0];
var translation2 = [0, 0, 0];
var scale = [0, 0, 0];
var scalar = [1, 1, 1];
var transform = [0, 0, 0];
var speed = 100;

var timeoutId;

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

function startRotate() {
  transform = [0, 0, 1];
}

function stopRotate() {
  transform = [0, 0, 0];
}

function changeDirectionRotate() {
  transform = [-transform[0], -transform[1], -transform[2]];
}

function startScale() {
  scale = [0.01, 0.01, 0];
}

function stopScale() {
  scale = [0, 0, 0];
}

function changeDirectionScale() {
  scale = [-scale[0], -scale[1], -scale[2]];
}

function startTranslate() {
  translation2 = [0.01, 0.01, 0];
}

function stopTranslate() {
  translation2 = [0, 0, 0];
}

function changeDirectionTranslate() {
  translation2 = [-translation2[0], -translation2[1], -translation2[2]];
}

function render() {
  utils.linkUniformVariable({
    shaderName: "theta",
    value: theta,
    kind: "3fv",
  });

  utils.linkUniformVariable({
    shaderName: "scalar",
    value: scalar,
    kind: "3fv",
  });

  utils.linkUniformVariable({
    shaderName: "translation",
    value: translation,
    kind: "3fv",
  });

  vertices = [];
  colors = [];
  makeFace(4, 5, 6, 7, [0, 0.7, 0]);

  utils.initBuffer({ vertices });
  utils.linkBuffer();

  utils.initBuffer({ vertices: colors });
  utils.linkBuffer({ variable: "aColor", reading: 3 });

  utils.drawElements({ clear: true, method: "TRIANGLES" });

  vertices = [];
  colors = [];
  makeFace(8, 9, 10, 11, [0, 0.7, 0]);

  utils.initBuffer({ vertices });
  utils.linkBuffer();

  utils.initBuffer({ vertices: colors });
  utils.linkBuffer({ variable: "aColor", reading: 3 });

  utils.drawElements({ clear: false, method: "TRIANGLES" });

  vertices = [];
  colors = [];
  makeFace(12, 13, 14, 15, [0.7, 0, 0]);

  utils.initBuffer({ vertices });
  utils.linkBuffer();

  utils.initBuffer({ vertices: colors });
  utils.linkBuffer({ variable: "aColor", reading: 3 });

  utils.drawElements({ clear: false, method: "TRIANGLES" });

  vertices = [];
  colors = [];
  makeFace(16, 17, 18, 19, [0.7, 0, 0]);

  utils.initBuffer({ vertices });
  utils.linkBuffer();

  utils.initBuffer({ vertices: colors });
  utils.linkBuffer({ variable: "aColor", reading: 3 });

  utils.drawElements({ clear: false, method: "TRIANGLES" });

  vertices = [];
  colors = [];
  makeFace(0, 1, 2, 3, [1, 1, 1]);

  utils.initBuffer({ vertices });
  utils.linkBuffer();

  utils.initBuffer({ vertices: colors });
  utils.linkBuffer({ variable: "aColor", reading: 3 });

  utils.drawElements({ clear: false, method: "TRIANGLES" });

  scalar[0] += scale[0];
  scalar[1] += scale[1];
  theta[2] += transform[2];
  translation[0] += translation2[0];
  translation[1] += translation2[1];

  timeoutId = setRenderTimeout();
}

render();

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("slider").addEventListener("input", function (event) {
    changeSpeed(event.target.value);
  });

  document
    .getElementById("Rotation")
    .addEventListener("click", changeDirectionRotate);
  document
    .getElementById("RotationStart")
    .addEventListener("click", startRotate);
  document.getElementById("RotationStop").addEventListener("click", stopRotate);

  document
    .getElementById("ScaleDirection")
    .addEventListener("click", changeDirectionScale);
  document.getElementById("ScaleStart").addEventListener("click", startScale);
  document.getElementById("ScaleStop").addEventListener("click", stopScale);

  document
    .getElementById("TranslationStart")
    .addEventListener("click", startTranslate);
  document
    .getElementById("TranslationStop")
    .addEventListener("click", stopTranslate);
  document
    .getElementById("Translation")
    .addEventListener("click", changeDirectionTranslate);
});
