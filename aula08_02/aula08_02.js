var utils = new Utils(300, 200, 255, 0.1, 0.2, 0.5, 0.5);

var vertices = [];
var colors = [];

function makeCircleVertices(centerX, centerY, radius, numVertices, color) {
  for (var i = 0; i < numVertices; i++) {
    let angle = (2 * Math.PI * i) / numVertices;
    let x = centerX + radius * Math.cos(angle);
    let y = centerY + radius * Math.sin(angle);

    vertices.push(x);
    vertices.push(y);

    colors.push(color[0]);
    colors.push(color[1]);
    colors.push(color[2]);
  }
}

var squareVertices = [
  [-0.5, -0.5], //quadrado
  [0.5, -0.5],
  [0.5, 0.5],
  [-0.5, 0.5],
  [0.0, -0.45], //losango
  [0.45, 0.0],
  [0.0, 0.45],
  [-0.45, 0.0],
];

function makeFace(v1, v2, v3, v4, color) {
  var triangulos = [v1, v2, v3, v1, v3, v4];

  for (var i = 0; i < triangulos.length; i++) {
    var vertexIndex = triangulos[i];
    vertices.push(squareVertices[vertexIndex][0]);
    vertices.push(squareVertices[vertexIndex][1]);
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
in vec2 aPosition;
out vec4 vColor;

void main(){
gl_PointSize = 10.0;
gl_Position = vec4(aPosition, 0.0, 1.0);
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

makeCircleVertices(0, 0, 0.2, 200, [0.2, 0.2, 1]);

utils.initBuffer({ vertices });
utils.linkBuffer();

utils.initBuffer({ vertices: colors });
utils.linkBuffer({ variable: "aColor", reading: 3 });

utils.drawElements({ method:  "TRIANGLE_FAN" });

var vertices = []
var colors = []

makeFace(7, 6, 5, 4, [0.9, 0.9, 0]);
makeFace(0, 1, 2, 3, [0, 0.5, 0]);

utils.initBuffer({ vertices });
utils.linkBuffer();

utils.initBuffer({ vertices: colors });
utils.linkBuffer({ variable: "aColor", reading: 3 });
utils.drawElements({ clear: false, method: "TRIANGLES" });