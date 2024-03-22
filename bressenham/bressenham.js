var utils = new Utils(300, 200, 255, 0.1, 0.2, 0.5, 0.5);

var vertices = [];

function bressenham() {
  var positions = [1, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 5, 5, 6, 6, 7];

  for (var i = 0; i < positions.length; i = i + 2) {
    var { x, y } = utils.convertCoords({
      x: positions[i],
      y: positions[i + 1],
      minX: 0,
      maxX: 20,
      minY: 0,
      maxY: 20,
      flipX: 1,
      flipY: 1
    });

    vertices.push(x)
    vertices.push(y)
  }
}

bressenham();

console.log(vertices)

utils.initBuffer({ vertices });
utils.initShader();
utils.linkBuffer({ variable: "aPosition", reading: 2 });
utils.drawElements();
