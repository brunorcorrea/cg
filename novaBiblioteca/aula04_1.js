var utils = new Utils();
var xi = -0.4;
var yi = -0.4;
var xf = 0.4;
var yf = 0.4;

vertices = [
    xi, yi, xf, yf, xi, yf,
    xi, yi, xf, yf, xf, yi,
 ]

utils.initBuffer({vertices});

utils.initShader({
    vertexShader : `#version 300 es
precision mediump float;

in vec2 aPosition;
uniform float transformValue;

void main(){
gl_PointSize = 10.0;
gl_Position = vec4(transformValue+aPosition, 0.0, 1.0);
}`
});

utils.linkBuffer();

transformValue = 0;
speed = 100;
function render(){
    utils.linkUniformVariable({shaderName : "transformValue", value : transformValue});
    utils.drawElements({method : "TRIANGLES"});
    transformValue += 0.01;

    setTimeout(
	render, speed
    );
}
render();
