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
  out vec4 fColor;

  void main(){
    vec2 onePixel = vec2(1.0, 1.0) / uTextureSize;
    vec4 left = texture(uSampler, textureCoords + onePixel * vec2(-1, 0));
    vec4 right = texture(uSampler, textureCoords + onePixel * vec2(+1, 0));
    vec4 bottom = texture(uSampler, textureCoords + onePixel * vec2(0, -1));
    vec4 top = texture(uSampler, textureCoords + onePixel * vec2(0, +1));

    fColor = abs(right - left) + abs(top - bottom);
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

  utils.drawElements({ method: "TRIANGLES" });

  count = count + 1;
  setTimeout(function () {
    render();
  }, speed);
}

render();
