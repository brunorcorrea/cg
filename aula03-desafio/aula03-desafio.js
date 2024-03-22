var utils = new Utils(300, 200, 255, 0.1, 0.2, 0.5, 0.5);

var vertices = [];

utils.initShader();

function render(startX, startY, endX, endY) {

  var startCoords = utils.convertCoords({x : startX, y: startY})
  var endCoords = utils.convertCoords({x : endX, y: endY})

  var vertices = [
    startCoords.x, startCoords.y,
    endCoords.x, endCoords.y,
    startCoords.x, endCoords.y,
    startCoords.x, startCoords.y,
    endCoords.x, endCoords.y,
    endCoords.x, startCoords.y
  ];

  var redColor = Math.abs(startCoords.x - endCoords.y) /2;
  utils.linkUniformVariable({shaderName: "redColor", value: redColor, kind: "1f"})
  
  utils.initBuffer({ vertices });
  utils.linkBuffer();
  utils.drawElements({method: "TRIANGLES"});
}

utils.initMouseMoveEvent(render);
