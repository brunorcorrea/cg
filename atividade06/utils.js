class Utils {

    constructor({width = 400, height = 400, r = 0.6, g = 0.2, b = 0.6, a = 1} = {}){
	var canvas = document.getElementById('canvas');

	canvas.width = width;
	canvas.height = height;
	
	this.gl = canvas.getContext('webgl2');
	console.log(this.gl);
	this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.clearColor(r, g, b, a);
	
	this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);
    }

    initBuffer({vertices = [-1, -1, 0, 1, 1, -1]} = {}){
	

	var bufferId = this.gl.createBuffer();
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufferId);
	
	this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices),
			   this.gl.STATIC_DRAW);

	this.vertices = vertices;

    }


    initShader(
	{vertexShader = `#version 300 es
precision mediump float;

in vec2 aPosition;

void main(){
gl_PointSize = 10.0;
gl_Position = vec4(aPosition, 0.0, 1.0);
}`,
fragmentShader = `#version 300 es
precision highp float;
out vec4 fColor;
void main(){
   fColor=vec4(1.0, 1.0, 0.0, 1.0);
}`}={}){
	var vertShdr = this.gl.createShader( this.gl.VERTEX_SHADER );
	var fragShdr = this.gl.createShader( this.gl.FRAGMENT_SHADER );
	this.gl.shaderSource( vertShdr, vertexShader);
	this.gl.shaderSource( fragShdr, fragmentShader);
	this.gl.compileShader( vertShdr );
	this.gl.compileShader( fragShdr );
	
	if ( !this.gl.getShaderParameter(vertShdr, this.gl.COMPILE_STATUS) ) {
	    var msg = "Vertex shader failed to compile.  The error log is:"
		+ "<pre>" + this.gl.getShaderInfoLog( vertShdr ) + "</pre>";
	    alert( msg );
	}
  
	if ( !this.gl.getShaderParameter(fragShdr, this.gl.COMPILE_STATUS) ) {
	    var msg = "Fragment shader failed to compile.  The error log is:"
		+ "<pre>" + this.gl.getShaderInfoLog( fragShdr ) + "</pre>";
	    alert( msg );
	}

	var program = this.gl.createProgram();
	this.gl.attachShader( program, vertShdr );
	this.gl.attachShader( program, fragShdr );
	this.gl.linkProgram( program );

	if ( !this.gl.getProgramParameter(program, this.gl.LINK_STATUS) ) {
	    var msg = "Shader program failed to link.  The error log is:"
		+ "<pre>" + this.gl.getProgramInfoLog( program ) + "</pre>";
	    alert( msg );
	}
	console.log(program);
	this.gl.useProgram(program);

	this.program = program;
    }

    linkBuffer({variable = "aPosition", reading = 2}={}){
	var positionLoc = this.gl.getAttribLocation(this.program, variable);
	this.gl.vertexAttribPointer(positionLoc, reading, this.gl.FLOAT, false, 0, 0);
	this.gl.enableVertexAttribArray(positionLoc);
	this.reading = reading;
    }

    drawElements({start = 0, end = this.vertices.length/this.reading, method = "POINTS"}={}){
	this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);
	this.gl.drawArrays(this.gl[method], start, end);
    }

    convertCoords({
	x = 0, y = 0,
	minX = 0,
	maxX = this.gl.canvas.width,
	minY = 0,
	maxY = this.gl.canvas.height,
	flipX = 1,
	flipY = -1	
    } = {}){
	return {
	    x : flipX*(2*(x-minX)/(maxX-minX)-1),
	    y : flipY*(2*(y-minY)/(maxY-minY)-1)	    
	}
    }

    initMouseMoveEvent(callback){
	var canvas = this.gl.canvas;
	var isDown = false;
	var downX, downY, moveX, moveY;
	
	canvas.addEventListener('mouseup', () => {
	    isDown = false;
	});

	canvas.addEventListener('mousedown', (e) => {
	    isDown = true;

	    downX = e.offsetX;
	    downY = e.offsetY;
	});

	canvas.addEventListener('mousemove', (e) => {
	    if (isDown){	    
		moveX = e.offsetX;
		moveY = e.offsetY;

		callback(downX, downY, moveX, moveY);
	    }
	});	
    }

    linkUniformVariable({shaderName = "redColor", value = 1, kind = "1f"} = {}){
	var colorLoc = this.gl.getUniformLocation(this.program, shaderName);
	this.gl[`uniform${kind}`](colorLoc, value);
    }
	
	initTexture(image) {
        var texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);

	this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.MIRRORED_REPEAT);
	this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.MIRRORED_REPEAT);    
    	

	this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
	this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);

	return texture;
    }

    activateTexture(texture, position){
	this.gl.activeTexture(this.gl.TEXTURE0 + position);
	this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

    }


}

