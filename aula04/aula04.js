var utils = new Utils(300, 200, 255, 0.1, 0.2, 0.5, 0.5);
utils.initBuffer({vertices : [-1, -1, 0, 1, 1, -1]});
utils.initShader();
utils.linkBuffer({variable : "aPosition", reading : 2})
utils.drawElements()
