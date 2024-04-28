var sceneSize = 200
var utils = new Utils({
  width: sceneSize * 3, // três colunas
  height: sceneSize * 2, // duas linhas
});

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

const makeFace = (v1, v2, v3, v4) => {
    var triangles = [v1, v2, v3, v1, v3, v4];
  
    for (let i = 0; i < triangles.length; i++) {
      const triangle = triangles[i];
      cubeVertices[triangle].forEach((vertex) => {
        vertices.push(vertex);
      });
    }
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
  uniform vec3 theta;
  uniform mat4 uViewMatrix; // Matriz da câmera
  uniform mat4 uProjectionMatrix; // Matriz de projeção
  in vec2 textCoords;
  uniform sampler2D uSampler;
  out vec2 textureCoords;


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
      gl_Position = uProjectionMatrix * uViewMatrix * rz * ry * rx * vec4(aPosition, 1.0);
      textureCoords = textCoords;
    }`,
  fragmentShader: `#version 300 es
      precision highp float;
      uniform sampler2D uSampler; // Sampler para a textura em gl.TEXTURE0
      in vec2 textureCoords;

      out vec4 fColor;
      void main(){
        fColor = texture(uSampler, textureCoords);

      }`,
});

utils.initBuffer({ vertices: vertices });
utils.linkBuffer({ variable: "aPosition", reading: 3 });

var projectionOrthoMatrix = mat4.create();
var size = 1; // Metade da largura/altura total desejada
var centerX = 0; // Posição X central da janela de projeção
var centerY = 0; // Posição Y central da janela de projeção
mat4.ortho(projectionOrthoMatrix,
  centerX - size, // esquerda
  centerX + size, // direta
  centerY - size, // baixo
  centerY + size, // cima
  0.1, // Quão perto objetos podem estar da câmera
  // antes de serem recortados
  100.0); // Quão longe objetos podem estar da câmera antes
// de serem recortados

utils.linkUniformMatrix({
  shaderName: "uProjectionMatrix",
  value: projectionOrthoMatrix,
  kind: "4fv"
});

// Criando uma matriz de visualização frontal de um cubo parado na origem
var viewMatrixFront = mat4.create();
mat4.lookAt(viewMatrixFront,
  [0, 0, 5], // Posição da câmera (X,Y,Z)
  [0, 0, 0], // Posição para onde a câmera olha
  [0, 1, 0]); // Vetor UP, orientação da câmera

// Criando uma matriz de visualização em vista superior de um cubo parado na origem
var viewMatrixTop = mat4.create();
mat4.lookAt(viewMatrixTop,
  [0, 5, 0],
  [0, 0, 0],
  [0, 0, -1]);

// Visão lateral esquerda de um cubo parado na origem
var viewMatrixSide = mat4.create();
mat4.lookAt(viewMatrixSide,
  [-5, 0, 0],
  [0, 0, 0],
  [0, 1, 0]
);

// Visão da frente e lateral esquerda de um cubo parado na origem
var viewMatrixFrontSide = mat4.create();
mat4.lookAt(viewMatrixFrontSide,
  [-5, 0, 5],
  [0, 0, 0],
  [0, 1, 0]
);

// Visão isométrica de um cubo parado na origem
var viewMatrixIsometric = mat4.create();
mat4.lookAt(viewMatrixIsometric,
  [-5, 5, 5],
  [0, 0, 0],
  [0, 1, 0]
);

//Uma matriz isométrica para ver a parte traseira, de baixo e da direita de um cubo parado na origem.
var viewMatrixIsometric2 = mat4.create();
mat4.lookAt(viewMatrixIsometric2,
  [5, -5, 5],
  [0, 0, 0],
  [0, 1, 0]
);

var theta = [0, 0, 0];
var transform_x = 1;
var transform_y = 0;
var transform_z = 0;
var speed = 100;

var gl = utils.gl;
var textureAbacaxi = gl.createTexture();
var textureLaranja = gl.createTexture();
var textureMaca = gl.createTexture();
var textureMorango = gl.createTexture();
var texturePessego = gl.createTexture();
var textureUva = gl.createTexture();

var imageAbacaxi = new Image();
var imageLaranja = new Image();
var imageMaca = new Image();
var imageMorango = new Image();
var imagePessego = new Image();
var imageUva = new Image();

imageAbacaxi.onload = function () {
    textureAbacaxi = utils.initTexture(imageAbacaxi)
}

imageLaranja.onload = function () {
    textureLaranja = utils.initTexture(imageLaranja)
}

imageMaca.onload = function () {
    textureMaca = utils.initTexture(imageMaca)
}

imageMorango.onload = function () {
  textureMorango = utils.initTexture(imageMorango)
}

imagePessego.onload = function () {
    texturePessego = utils.initTexture(imagePessego)
}

imageUva.onload = function () {
  textureUva = utils.initTexture(imageUva)
}

imageAbacaxi.src = 'texturas/abacaxi.jpg';
imageLaranja.src = 'texturas/laranja.png';
imageMaca.src = 'texturas/maca.webp';
imageMorango.src = 'texturas/morango.jpg';
imagePessego.src = 'texturas/pessego.png';
imageUva.src = 'texturas/uva.png';

var textureCoordinates = [
  // Front face
  0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
  0.0, 0.0, 1.0, 1.0, 0.0, 1.0,
  // Back face
  0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
  0.0, 0.0, 1.0, 1.0, 0.0, 1.0,
  // Top face
  0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
  0.0, 0.0, 1.0, 1.0, 0.0, 1.0,
  // Bottom face
  0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
  0.0, 0.0, 1.0, 1.0, 0.0, 1.0,
  // Right face
  0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
  0.0, 0.0, 1.0, 1.0, 0.0, 1.0,
  // Left face
  0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
  0.0, 0.0, 1.0, 1.0, 0.0, 1.0,
];


utils.initBuffer({ vertices: textureCoordinates });
utils.linkBuffer({ reading: 2, variable: "textCoords" });

function render() {
  utils.linkUniformVariable({
    shaderName: "theta",
    value: theta,
    kind: "3fv",
  });

  utils.linkUniformMatrix({
    shaderName: "uProjectionMatrix",
    value: projectionOrthoMatrix,
    kind: "4fv",
  });


  // Primeira célula
  utils.activateTexture(textureAbacaxi, 0);
  utils.linkUniformVariable({ shaderName: "uSampler", value: 0, kind: "1i" })
  utils.drawScene({
    method: "TRIANGLES", viewport: {
      x: 0, y: sceneSize,
      width: sceneSize,
      height: sceneSize
    }
  });

  // Segunda célula
  utils.linkUniformMatrix({
    shaderName: "uViewMatrix",
    value: viewMatrixTop,
    kind: "4fv"
  });
  utils.activateTexture(textureLaranja, 1);
  utils.linkUniformVariable({ shaderName: "uSampler", value: 1, kind: "1i" })
  utils.drawScene({
    method: "TRIANGLES", viewport: {
      x: sceneSize, y: sceneSize,
      width: sceneSize,
      height: sceneSize
    }
  });

  // Terceira célula
  utils.linkUniformMatrix({
    shaderName: "uViewMatrix",
    value: viewMatrixSide,
    kind: "4fv"
  });
  utils.activateTexture(textureMaca, 2);
  utils.linkUniformVariable({ shaderName: "uSampler", value: 2, kind: "1i" })
  utils.drawScene({
    method: "TRIANGLES",

    viewport: {
      x: 2 * sceneSize, y: sceneSize,

      width: sceneSize,
      height: sceneSize
    }
  });

  // Quarta Célula
  utils.linkUniformMatrix({
    shaderName: "uViewMatrix",
    value: viewMatrixFrontSide,
    kind: "4fv"
  });
  utils.activateTexture(textureMorango, 3);
  utils.linkUniformVariable({ shaderName: "uSampler", value: 3, kind: "1i" })
  utils.drawScene({
    method: "TRIANGLES",
    viewport: {
      x: 0, y: 0,
      width: sceneSize,
      height: sceneSize
    }
  });
  // Quinta Célula
  utils.linkUniformMatrix({
    shaderName: "uViewMatrix",
    value: viewMatrixIsometric,
    kind: "4fv"
  });
  utils.activateTexture(texturePessego, 4);
  utils.linkUniformVariable({ shaderName: "uSampler", value: 4, kind: "1i" })
  utils.drawScene({
    method: "TRIANGLES",
    viewport: {
      x: sceneSize, y: 0,
      width: sceneSize,
      height: sceneSize
    }
  });
  // Sexta célula
  utils.linkUniformMatrix({
    shaderName: "uViewMatrix",
    value: viewMatrixIsometric2,
    kind: "4fv"
  });
  utils.activateTexture(textureUva, 5);
  utils.linkUniformVariable({ shaderName: "uSampler", value: 5, kind: "1i" })
  utils.drawScene({
    method: "TRIANGLES",
    viewport: {
      x: 2 * sceneSize, y: 0,
      width: sceneSize,
      height: sceneSize
    }
  });

  theta[0] += transform_x;
  theta[1] += transform_y;
  theta[2] += transform_z;

  setTimeout(
    render, speed
  );
}

render();