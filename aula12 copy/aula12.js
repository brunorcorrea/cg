var utils = new Utils({ width: 800, height: 800 });

utils.initShader({
  vertexShader: `#version 300 es
  precision mediump float;

  in vec2 aPosition;
  in vec2 texCoords;

  out vec2 textureCoords;

  void main(){
    gl_Position = vec4(aPosition, 0.0, 1.0);
    textureCoords = texCoords;
  }`,
  fragmentShader: `#version 300 es
  precision highp float;

  in vec2 textureCoords;

  uniform sampler2D uSampler;
  uniform vec2 uTextureSize;
  uniform float uKernel[9];
  out vec4 fColor;

  void main(){
    vec2 onePixel = vec2(1.0, 1.0) / uTextureSize;

    vec4 colorSum = vec4(0.0);
    colorSum += texture(uSampler, textureCoords + onePixel * vec2(-1, -1)) * uKernel[0];
    colorSum += texture(uSampler, textureCoords + onePixel * vec2( 0, -1)) * uKernel[1];
    colorSum += texture(uSampler, textureCoords + onePixel * vec2( 1, -1)) * uKernel[2];
    colorSum += texture(uSampler, textureCoords + onePixel * vec2(-1,  0)) * uKernel[3];
    colorSum += texture(uSampler, textureCoords + onePixel * vec2( 0,  0)) * uKernel[4];
    colorSum += texture(uSampler, textureCoords + onePixel * vec2( 1,  0)) * uKernel[5];
    colorSum += texture(uSampler, textureCoords + onePixel * vec2(-1,  1)) * uKernel[6];
    colorSum += texture(uSampler, textureCoords + onePixel * vec2( 0,  1)) * uKernel[7];
    colorSum += texture(uSampler, textureCoords + onePixel * vec2( 1,  1)) * uKernel[8];

    fColor = colorSum;
    fColor.a = 1.0;
  }`,
});

/******************************
 Posições do Quadrado
******************************/
var pxi = -0.4;
var pyi = -0.4;
var pxf = 0.4;
var pyf = 0.4;

var vertices = [pxi, pyi, pxi, pyf, pxf, pyf, pxi, pyi, pxf, pyi, pxf, pyf];

/******************************
Posições da Textura
******************************/
var txi = 1.0;
var tyi = 1.0;
var txf = 0.0;
var tyf = 0.0;

var textureCoordinates = [
  txi,
  tyi,
  txi,
  tyf,
  txf,
  tyf,
  txi,
  tyi,
  txf,
  tyi,
  txf,
  tyf,
];

/******************************
 Linkando com a GPU
******************************/
utils.initBuffer({ vertices: vertices });
utils.linkBuffer({ reading: 2, variable: "aPosition" });

utils.initBuffer({ vertices: textureCoordinates });
utils.linkBuffer({ reading: 2, variable: "texCoords" });

/******************************
 Configurando as texturas
******************************/
var textureGatoPersa, textureBolinha;
var gatoPersaSize, bolinhaSize;
var loaded = 0;

// Carregar a imagem de textura
var gatoPersaImage = new Image();
gatoPersaImage.onload = function () {
  textureGatoPersa = utils.initTexture({ image: gatoPersaImage });
  gatoPersaSize = [gatoPersaImage.width, gatoPersaImage.height];
  loaded += 1;
};
gatoPersaImage.src = "texturas/01_gato_persa.webp";

var bolinhasImage = new Image();
bolinhasImage.onload = function () {
  textureBolinha = utils.initTexture({ image: bolinhasImage });
  bolinhaSize = [bolinhasImage.width, bolinhasImage.height];

  loaded += 1;
};
bolinhasImage.src = "texturas/03_bolinhas.webp";

var speed = 500;
var count = 0;

// var kernel = [-1 / 3, -1 / 3, -1 / 3, 0, 0, 0, 1 / 3, 1 / 3, 1 / 3];

// Desfoque Simples: Suaviza a imagem reduzindo os detalhes e as
// variações de intensidade entre os pixels.
// var kernel = [1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9];

// Desfoque Gaussiano: Suaviza a imagem utilizando uma aproximação da
// função Gaussiana, ideal para remoção de ruído.
// var kernel = [
//   1 / 16,
//   1 / 8,
//   1 / 16,
//   1 / 8,
//   1 / 4,
//   1 / 8,
//   1 / 16,
//   1 / 8,
//   1 / 16,
// ];

// Aguçamento: Acentua as bordas e detalhes da imagem.
var kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];

// Realce de Borda: Destaca as bordas na imagem ao subtrair a
// intensidade dos pixels vizinhos do pixel central.
// var kernel = [-1, -1, -1, -1, 8, -1, -1, -1, -1];

// Detecção de Bordas (Sobel Horizontal): Detecta as bordas
// horizontais na imagem.
// var kernel = [-1, 0, 1, -2, 0, 2, -1, 0, 1];

// Detecção de Bordas (Sobel Vertical): Detecta as bordas verticais na
// imagem.
// var kernel = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

// Detecção de Bordas (Prewitt Horizontal): Similar ao Sobel
// horizontal, mas usa pesos iguais para maior suavidade
// var kernel = [-1, 0, 1, -1, 0, 1, -1, 0, 1];

// Detecção de Bordas (Prewitt Vertical): Similar ao Sobel vertical,
// com pesos iguais para detecção vertical.
// var kernel = [-1, -1, -1, 0, 0, 0, 1, 1, 1];

// Laplaciano: Detecção de bordas em todas as direções usando a
// segunda derivada.
// var kernel = [0, 1, 0, 1, -4, 1, 0, 1, 0];

// Laplaciano de 8 conexões: Uma variação do Laplaciano que considera
// conexões diagonais.
// var kernel = [1, 1, 1, 1, -8, 1, 1, 1, 1];

// Desfoque de Caixa: Uma forma básica de desfoque que usa média
// simples.
// var kernel = [1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9];

// Desfoque Binomial (Aproximação Gaussiana): Um desfoque que utiliza
// pesos binomiais para uma aproximação suave da função Gaussiana.
// var kernel = [
//   1 / 16,
//   2 / 16,
//   1 / 16,
//   2 / 16,
//   4 / 16,
//   2 / 16,
//   1 / 16,
//   2 / 16,
//   1 / 16,
// ];

// Suavização: Reduz o ruído com menos intensidade do que o desfoque
// gaussiano.
// var kernel = [1 / 8, 1 / 8, 1 / 8, 1 / 8, 0, 1 / 8, 1 / 8, 1 / 8, 1 / 8];

function render() {
  if (loaded === 2) {
    utils.linkUniformVariable({
      shaderName: "uSampler",
      value: count % 2,
      kind: "1i",
    });

    if (count % 2 == 0) {
      utils.activateTexture(textureGatoPersa, 0);
      utils.linkUniformVariable({
        shaderName: "uTextureSize",
        value: gatoPersaSize,
        kind: "2fv",
      });
    } else {
      utils.activateTexture(textureBolinha, 1);
      utils.linkUniformVariable({
        shaderName: "uTextureSize",
        value: bolinhaSize,
        kind: "2fv",
      });
    }
  }

  utils.linkUniformVariable({
    shaderName: "uKernel",
    value: kernel,
    kind: "1fv",
  });

  utils.drawElements({ method: "TRIANGLES" });

  count = count + 1;
  setTimeout(function () {
    render();
  }, speed);
}

render();
