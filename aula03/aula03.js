var canvas = document.getElementById("canvas");
canvas.width = 800;
canvas.height = 600;

var downX, downY, moveX, moveY, isDown;

var gl = canvas.getContext("webgl2");
gl.clearColor(0.1, 0.2, 0.3, 0.4);
gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

var maxX = canvas.width,
  maxY = canvas.height;

const convertCoords = (x, y) => {
  gpuCoords = {
    min: {
      x: -1,
      y: -1,
    },
    max: {
      x: 1,
      y: 1,
    },
  };

  var convertedX =
    (x / maxX) * (gpuCoords.max.x - gpuCoords.min.x) + gpuCoords.min.x;
  var convertedY =
    -1 * ((y / maxY) * (gpuCoords.max.y - gpuCoords.min.y) + gpuCoords.min.y);

  return { convertedX, convertedY };
};

const render = () => {
  var downConvertedCoords = convertCoords(downX, downY);
  var moveConvertedCoords = convertCoords(moveX, moveY);
  vertices = [
    downConvertedCoords.convertedX,
    downConvertedCoords.convertedY,
    downConvertedCoords.convertedX,
    moveConvertedCoords.convertedY,
    moveConvertedCoords.convertedX,
    moveConvertedCoords.convertedY,
    downConvertedCoords.convertedX,
    downConvertedCoords.convertedY,
    moveConvertedCoords.convertedX,
    downConvertedCoords.convertedY,
    moveConvertedCoords.convertedX,
    moveConvertedCoords.convertedY,
  ];

  var bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  var vertexShader = `#version 300 es
    precision mediump float;
    
    in vec2 aPosition;
    
    void main(){
    gl_PointSize = 10.0;
    gl_Position = vec4(aPosition, 0.0, 1.0);
    }`;

  var redColor = Math.abs(downX - moveX) / gl.canvas.width;

  var fragmentShader = `#version 300 es
    precision highp float;
    out vec4 fColor;
    uniform float redColor;
    void main(){
       fColor=vec4(redColor, 0.0, 0.0, 1.0);
    }`;

  var vertShdr = gl.createShader(gl.VERTEX_SHADER);
  var fragShdr = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(vertShdr, vertexShader);
  gl.shaderSource(fragShdr, fragmentShader);
  gl.compileShader(vertShdr);
  gl.compileShader(fragShdr);

  if (!gl.getShaderParameter(vertShdr, gl.COMPILE_STATUS)) {
    var msg =
      "Vertex shader failed to compile.  The error log is:" +
      "<pre>" +
      gl.getShaderInfoLog(vertShdr) +
      "</pre>";
    alert(msg);
  }

  if (!gl.getShaderParameter(fragShdr, gl.COMPILE_STATUS)) {
    var msg =
      "Fragment shader failed to compile.  The error log is:" +
      "<pre>" +
      gl.getShaderInfoLog(fragShdr) +
      "</pre>";
    alert(msg);
  }

  var program = gl.createProgram();
  gl.attachShader(program, vertShdr);
  gl.attachShader(program, fragShdr);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    var msg =
      "Shader program failed to link.  The error log is:" +
      "<pre>" +
      gl.getProgramInfoLog(program) +
      "</pre>";
    alert(msg);
  }

  gl.useProgram(program);
  var colorLoc = gl.getUniformLocation(program, "redColor");
  gl.uniform1f(colorLoc, redColor);
  var positionLoc = gl.getAttribLocation(program, "aPosition");
  gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(positionLoc);

  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);
};

canvas.addEventListener("mouseup", (e) => {
  isDown = false;
});

canvas.addEventListener("mousedown", (e) => {
  isDown = true;
  downX = e.offsetX;
  downY = e.offsetY;
});

canvas.addEventListener("mousemove", (e) => {
  if (isDown) {
    moveX = e.offsetX;
    moveY = e.offsetY;
    render();
  }
});
