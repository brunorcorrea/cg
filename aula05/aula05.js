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

    uniform vec3 theta;

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

      gl_PointSize = 10.0;
      gl_Position = rz * ry * rx * vec4(aPosition, 1.0);
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

var theta = [0, 0, 20];
var transform_x = 3;
var transform_y = 1;
var transform_z = 2;
var speed = 100;
function render() {
  utils.linkUniformVariable({
    shaderName: "theta",
    value: theta,
    kind: "3fv",
  });

  utils.drawElements({ method: "TRIANGLES" });

  theta[0] += transform_x;
  theta[1] += transform_y;
  theta[2] += transform_z;

  setTimeout(render, speed);
}

render();
