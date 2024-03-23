var utils = new Utils(300, 200, 255, 0.1, 0.2, 0.5, 0.5);

var outlinePositions = [
    { x: 5, y: 5 }, { x: 5, y: 6 }, { x: 5, y: 7 }, { x: 5, y: 8 }, { x: 5, y: 9 },
    { x: 5, y: 10 }, { x: 5, y: 11 }, { x: 5, y: 12 }, { x: 5, y: 13 }, { x: 5, y: 14 },
    { x: 5, y: 15 }, { x: 6, y: 5 }, { x: 7, y: 5 }, { x: 8, y: 5 }, { x: 9, y: 5 },
    { x: 10, y: 5 }, { x: 11, y: 5 }, { x: 12, y: 5 }, { x: 13, y: 5 }, { x: 14, y: 5 },
    { x: 6, y: 14.5 }, { x: 7, y: 14 }, { x: 8, y: 13.5 }, { x: 9, y: 13 }, { x: 10, y: 12.5 },
    { x: 11, y: 12 }, { x: 12, y: 11.5 }, { x: 13, y: 11 }, { x: 14, y: 10.5 }, { x: 15, y: 5 },
    { x: 15, y: 6 }, { x: 15, y: 7 }, { x: 15, y: 8 }, { x: 15, y: 9 }, { x: 15, y: 10 }
];
var outlinePixels = [];

var filledPositions = [];
var filledPixels = [];

function fillShape() {
    print(filledPositions, filledPixels)
}

function printOutline() {
    print(outlinePositions, outlinePixels)
}

function print(positions, pixels) {
    console.log(filledPositions)
    for (var i = 0; i < positions.length; i++) {
        var { x, y } = utils.convertCoords({
            x: positions[i].x,
            y: positions[i].y,
            minX: 0,
            maxX: 20,
            minY: 0,
            maxY: 20,
            flipX: 1,
            flipY: 1
        });

        pixels.push(x)
        pixels.push(y)
    }
}

function computeNeighbors(pixel) {
    let neighbors = [];
    if (outlinePositions.some(p => p.x < pixel.x - 1 && p.y < pixel.y)) {
        neighbors.push({ x: pixel.x - 1, y: pixel.y });
    }
    if (outlinePositions.some(p => p.x > pixel.x + 1 && p.y > pixel.y)) {
        neighbors.push({ x: pixel.x + 1, y: pixel.y });
    }
    if (outlinePositions.some(p => p.x < pixel.x && p.y < pixel.y - 1)) {
        neighbors.push({ x: pixel.x, y: pixel.y - 1 });
    }
    if (outlinePositions.some(p => p.x > pixel.x && p.y > pixel.y + 1)) {
        neighbors.push({ x: pixel.x, y: pixel.y + 1 });
    }
    return neighbors;
}

function isOutlinePixel(pixel) {
    return outlinePositions.some(p => p.x === pixel.x && p.y === pixel.y);
}

function isPixelInStack(pixel, stack) {
    return stack.some(p => p.x === pixel.x && p.y === pixel.y);
}

function wasPixelInStack(pixel) {
    return filledPositions.some(p => p.x === pixel.x && p.y === pixel.y);
}

function pps() {
    let stack = [];
    let seed = { x: 10, y: 10 }; //TODO trocar pra usar elementos dentro da figura (respeitando o outline)
    stack.push(seed);

    while (stack.length !== 0) {
        let pixel = stack.pop() //pixel é o P
        filledPositions.push(pixel)
        let neighbors = computeNeighbors(pixel);

        for (let neighbor of neighbors) {
            if (!isOutlinePixel(neighbor) && !isPixelInStack(neighbor, stack) && !wasPixelInStack(neighbor)) {
                stack.push(neighbor);
            }
        }
    }
}

printOutline();
pps();
fillShape();

console.log("outlinePixels: " + outlinePixels)
console.log("filledPixels: " + filledPixels)

utils.initBuffer({ vertices: outlinePixels });
utils.initShader();
utils.linkBuffer({ variable: "aPosition", reading: 2 });
utils.drawElements();

utils.initBuffer({ vertices: filledPixels });
utils.initShader({
    fragmentShader: `#version 300 es
precision highp float;
out vec4 fColor;
void main(){
   fColor=vec4(1, 1, 0.0, 1.0);
}`}); //TODO permitir selecionar a cor de preenchimento via variáveis
utils.linkBuffer({ variable: "aPosition", reading: 2 });
utils.drawElements();