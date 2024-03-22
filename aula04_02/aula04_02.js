var utils = new Utils(300, 200, 255, 0.1, 0.2, 0.5, 0.5);

var xi = -0.4;
var yi = -0.4;
var xf = 0.4;
var yf = 0.4;

var vertices = [xi, yi, xf, yf, xi, yf, xi, yi, xf, yf, xf, yi];

utils.initShader({
  vertexShader: `#version 300 es
precision mediump float;

in vec2 aPosition;
uniform float scalarValue;

void main(){
gl_PointSize = 10.0;
gl_Position = vec4(scalarValue*aPosition, 0.0, 1.0);
}`,
});

utils.initBuffer({ vertices });
utils.linkBuffer();

scalarValue = 0, speed = 100;
function render() {
  utils.linkUniformVariable({
    shaderName: "scalarValue",
    value: scalarValue,
  });

  utils.drawElements({ method: "TRIANGLES" });
  scalarValue += 0.01;

  setTimeout(render, speed)
}

render()
