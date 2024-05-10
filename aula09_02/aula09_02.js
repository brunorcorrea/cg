var utils = new Utils();

var vertices = [];
var colors = [];
var normals = [];

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
  [0.0, 0.0, 0.0], // preto
  [1.0, 0.0, 0.0], // vermelho
  [1.0, 1.0, 0.0], // amarelo
  [0.0, 1.0, 0.0], // verde
  [0.0, 0.0, 1.0], // azul
  [1.0, 0.0, 1.0], // rosa
  [0.0, 1.0, 1.0], // ciano
  [1.0, 1.0, 1.0], // branco
];

function computeProdutoVetorial(A, B, C) {
    let AB = [B[0] - A[0], B[1] - A[1], B[2] - A[2]];
    let AC = [C[0] - A[0], C[1] - A[1], C[2] - A[2]];
  
    let Nx = AB[1] * AC[2] - AB[2] * AC[1];
    let Ny = AB[2] * AC[0] - AB[0] * AC[2];
    let Nz = AB[0] * AC[1] - AB[1] * AC[0];
  
    return [Nx, Ny, Nz];
  }
  

function makeFace(v1, v2, v3, v4) {
  triangulos = [v1, v2, v3, v1, v3, v4];

  let normal = computeProdutoVetorial(cubeVertices[v1], cubeVertices[v2], cubeVertices[v3]);

  for (var i = 0; i < triangulos.length; i++) {
    vertices.push(cubeVertices[triangulos[i]][0]);
    vertices.push(cubeVertices[triangulos[i]][1]);
    vertices.push(cubeVertices[triangulos[i]][2]);

    colors.push(cubeColors[v1][0]);
    colors.push(cubeColors[v1][1]);
    colors.push(cubeColors[v1][2]);

    normals.push(normal[0]);
    normals.push(normal[1]);
    normals.push(normal[2]);
  }
}

makeFace(1, 0, 3, 2);
makeFace(2, 3, 7, 6);
makeFace(3, 0, 4, 7);
makeFace(6, 5, 1, 2);
makeFace(4, 5, 6, 7);
makeFace(5, 4, 0, 1);

utils.initShader({
  vertexShader: `#version 300 es
precision mediump float;

in vec3 aPosition;
in vec3 aColor;
in vec3 aNormal;

out vec4 vColor;

uniform vec3 theta;

uniform vec3 uAmbientLight;
uniform vec3 uLightColor;
uniform vec3 uLightDirection;

void main(){
   // Computando seno e cosseno para cada um dos três eixos;
   vec3 angles = radians(theta);
   vec3 c = cos(angles);
   vec3 s = sin(angles);

   // Matrizes de rotação;
   mat4 rx = mat4( 1.0,  0.0,  0.0, 0.0,
                   0.0,  c.x,  s.x, 0.0,
                   0.0, -s.x,  c.x, 0.0,
                   0.0,  0.0,  0.0, 1.0);

   mat4 ry = mat4( c.y, 0.0, -s.y, 0.0,
                   0.0, 1.0,  0.0, 0.0,
                   s.y, 0.0,  c.y, 0.0,
                   0.0, 0.0,  0.0, 1.0);

   mat4 rz = mat4( c.z, s.z, 0.0, 0.0,
                   -s.z,  c.z, 0.0, 0.0,
                    0.0,  0.0, 1.0, 0.0,
                    0.0,  0.0, 0.0, 1.0);

   mat4 modelMatrix =  rz * ry * rx;
   gl_Position = modelMatrix * vec4(aPosition, 1.0);

   vec3 transformedNormal = mat3(modelMatrix) * aNormal;
   vec3 normal = normalize(transformedNormal);
   float diff = max(dot(normal, -normalize(uLightDirection)), 0.0);
   vec3 diffuse = uLightColor * diff;
   vec3 ambient = uAmbientLight;
   vec3 resultColor = ambient + diffuse;

   vColor = vec4(resultColor * aColor, 1.0);
}`,
  fragmentShader: `#version 300 es
precision mediump float;

in vec4 vColor;
out vec4 fColor;

void main() {
    fColor = vColor;
}`,
});

utils.initBuffer({ vertices });
utils.linkBuffer({ reading: 3 });

utils.initBuffer({ vertices: colors });
utils.linkBuffer({ variable: "aColor", reading: 3 });

utils.initBuffer({ vertices: colors });
utils.linkBuffer({ variable: "aColor", reading: 3 });

utils.initBuffer({ vertices: normals });
utils.linkBuffer({ variable: "aNormal", reading: 3 });

var theta = [0.0, 0.0, 0.0];

var rotation_x = 1.0;
var rotation_y = 4.0;
var rotation_z = 0.0;

var speed = 100;

var uAmbientLight = [0.2, 0.2, 0.2]; // Luz ambiente fraca
var uLightColor = [1, 1, 1]; // Cor da luz
var uLightDirection = [1, 1, 1]; // Posição

function normalizeVector(vec) {
  var len = Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2]);
  vec[0] /= len;
  vec[1] /= len;
  vec[2] /= len;
}
normalizeVector(uLightDirection);

utils.linkUniformVariable({
  shaderName: "uAmbientLight",
  value: uAmbientLight,
  kind: "3fv",
});

utils.linkUniformVariable({
    shaderName: "uLightColor",
    value: uLightColor,
    kind: "3fv",
  });

utils.linkUniformVariable({
shaderName: "uLightDirection",
value: uLightDirection,
kind: "3fv",
});

function render() {
  theta[0] += rotation_x;
  theta[1] += rotation_y;
  theta[2] += rotation_z;

  utils.linkUniformVariable({ shaderName: "theta", value: theta, kind: "3fv" });

  utils.drawElements({ method: "TRIANGLES" });

  setTimeout(render, speed);
}
render();
