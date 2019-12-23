"use strict";

var canvas;
var gl;

var numTimesToSubdivide = 1;    // 递归次数
var points = [];    // 生成的所有顶点的位置

var NumVertices  = 36; // 用于画立方体的

var program;
var bufferId;
var colorbufferId;

var verticesCube = [ // 立方体的初始顶点位置
  vec4( -0.25, -0.25,  0.25, 1.0 ),
  vec4( -0.25,  0.25,  0.25, 1.0 ),
  vec4(  0.25,  0.25,  0.25, 1.0 ),
  vec4(  0.25, -0.25,  0.25, 1.0 ),
  vec4( -0.25, -0.25, -0.25, 1.0 ),
  vec4( -0.25,  0.25, -0.25, 1.0 ),
  vec4(  0.25,  0.25, -0.25, 1.0 ),
  vec4(  0.25, -0.25, -0.25, 1.0 )
];

var vertexColors = [ // 立方体顶点颜色
  [ 0.0, 0.0, 0.0, 1.0 ],  // black
  [ 1.0, 0.0, 0.0, 1.0 ],  // red
  [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
  [ 0.0, 1.0, 0.0, 1.0 ],  // green
  [ 0.0, 0.0, 1.0, 1.0 ],  // blue
  [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
  [ 0.0, 1.0, 1.0, 1.0 ],  // cyan
  [ 1.0, 1.0, 1.0, 1.0 ]   // white
];

var velocities = [  // 可选的几种速度
    0.03,
    0.06,
    0.1
]
var velocity = velocities[0];   // 当前设定的速度

var colorsOfVertexs=[]; // 存放所生成的所有顶点的颜色
var c1,c2;  // 当前选中的两种颜色
var c_white = vec4( 1.0, 1.0, 1.0, 1.0 );   // 可选的三种颜色
var c_black = vec4( 0.0, 0.0, 0.0, 1.0 );
var c_babyBlue = vec4( 0.6, 1.0, 1.0, 1.0 );
c1 = c_white;
c2 = c_white;

var theta = 0.0;
var thetaLoc;
var centerX=0.0;
var centerXLoc;
var centerY=0.0;
var centerYLoc;

var animflag = false;
var sliderchangeflag = false;
var orientationFlag = false;    // 记录当前旋转的方向
var colorChangeFlag = false;    // 颜色选择改变的标记

var showOrHideFlag; // 用于向前向后控件的显示与隐藏

var fractal = 0;    // 当前的图形，0表示雪花，1表示二叉树，2表示立方体
// 虽然现在不是分形图形了，但是懒得改了
// 0代表一把剑，0代表立方体

// 以下是 2D 图形变换用到的var
var currentTransformationMatrix = mat4(); // 初始的CTM设为单位矩阵
var currentTransformationMatrixLoc;
var transformationFlag = false;

// 以下是改变观察角度用到的var
var viewMatrix = mat4();
var viewMatrixLoc;
// var u_viewMatrix;

// 视点位置
// var eye = vec3(0.2, 0.2, 0.4);
var eye = vec3(-0.0001, -0.00006, 0.000178);
var radius = 1.0;
var theta  = 0.0;
var phi    = 0.0;
var dr = 5.0 * Math.PI/180.0;

// a container variable (like a namespace protector)
var app = {};
app.meshes = {};
var mesh; // 用于使用webgl-obj-loader-master
var objStr = "sword-01-obj/sword-01.obj"

window.onload = function init() 
{
  canvas = document.getElementById( "gl-canvas" );
	gl = WebGLUtils.setupWebGL( canvas );
  if ( !gl ) { alert( "WebGL isn't available" ); }

  mesh = new OBJ.Mesh(objStr);
  // use the included helper function to initialize the VBOs
  OBJ.initMeshBuffers(gl, mesh);

	gl.viewport( 0, 0, canvas.width, canvas.height );
  gl.clearColor( 0.5, 0.5, 0.5, 1.0 ); // 灰色背景
  
  gl.enable(gl.DEPTH_TEST); // 只绘制最前面一层
  gl.enable(gl.BLEND); // 不太确定这两行的作用
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  // 初始化图形
  if(fractal == 0) {

  } else if(fractal == 1) {
    colorCube() 
  }
  
  //******************Load shaders******************************************
	program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );

	//*****************deliver points attribue********************************
	bufferId = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
  
  var vPosition = gl.getAttribLocation(program, "vPosition" );
	gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0); // DDD
  gl.enableVertexAttribArray(vPosition);
	
	//*****************deliver colors attribue********************************
	colorbufferId = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, colorbufferId );	
	gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsOfVertexs), gl.STATIC_DRAW );
	
  var vColor = gl.getAttribLocation( program, "vColor" );
  gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vColor );
  
  //*****************deliver centerXY and theta uniform*********************
	thetaLoc = gl.getUniformLocation( program, "theta" );
	centerXLoc = gl.getUniformLocation( program, "centerX" );
  centerYLoc = gl.getUniformLocation( program, "centerY" );
  
  // 2D
  //***********deliver currentTransformationMatrix uniform******************
  currentTransformationMatrixLoc = gl.getUniformLocation(program, "currentTransformationMatrix");
  gl.uniformMatrix4fv(currentTransformationMatrixLoc, false, flatten(currentTransformationMatrix));
  
  //***********deliver viewMatrix uniform**********************************
  viewMatrixLoc = gl.getUniformLocation(program, "viewMatrix");

	render();

  //*******分形图案的种类选择监听程序,重新生成顶点，重新绘制
  document.getElementById("fractal").onchange = function(event) {
      var newValue = parseInt(event.target.value);
      points = [];
      colorsOfVertexs=[];
      if(newValue == 0) {
        fractal = 0;
        showOrHide(1);
        colorCube();
      } else if(newValue == 1) {
        // draw the sword
      }
      sliderchangeflag = true;
  }





  // document.getElementById("Button3").onclick = function(){radius *= 1.1;};//Increase R
  // document.getElementById("Button4").onclick = function(){radius *= 0.9;};//Decrease R
  // document.getElementById("Button5").onclick = function(){theta += dr;};
  // document.getElementById("Button6").onclick = function(){theta -= dr;};
  // document.getElementById("Button7").onclick = function(){phi += dr;};
  // document.getElementById("Button8").onclick = function(){phi -= dr;};
};

function showOrHide(num) {
  let newClass;
  if(num == 1) {
    newClass = "btn btn-info btn-sm";
    // showOrHideFlag = true;
  } else {
    newClass = "btn btn-info btn-sm disabled";
    // showOrHideFlag = false;
  }
  document.getElementById("goFronter").setAttribute("class",newClass);
  document.getElementById("goMoreBack").setAttribute("class",newClass);
}

function colorCube()
{
  quad( 1, 0, 3, 2 );
  quad( 2, 3, 7, 6 );
  quad( 3, 0, 4, 7 );
  quad( 6, 5, 1, 2 );
  quad( 4, 5, 6, 7 );
  quad( 5, 4, 0, 1 );
}

function quad(a, b, c, d) // 参数是正方形四个顶点的序号
{
  var indices = [ a, b, c, a, c, d ];
  for ( var i = 0; i < indices.length; ++i ) {
    points.push( verticesCube[indices[i]] );
    colorsOfVertexs.push(vertexColors[a]);
  }
}



function render()
{
  gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	if(animflag)    // 如果旋转控制按钮由切换，需要发送旋转角度给shader
	{
    if(orientationFlag) {   // 如果旋转方向控制钮被触发，需要改变旋转方向
      theta -= velocity;
    } else {
      theta += velocity;
    }
    gl.uniform1f(thetaLoc, theta);		
  }; 	
	if(sliderchangeflag) // 如果slider值有变化需要发送Gasket2D 新初始顶点属性数据给shader
	{	
		gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );	
		gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );		
		gl.bindBuffer( gl.ARRAY_BUFFER, colorbufferId );	
		gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsOfVertexs), gl.STATIC_DRAW );	
  }	
  if(transformationFlag) // 2D
  {
    gl.uniformMatrix4fv(currentTransformationMatrixLoc, false, flatten(currentTransformationMatrix));
  }

  // 绘图（绘图前判断要加入视点的变化）
  if(fractal == 0 || fractal == 1) {
    gl.uniformMatrix4fv(viewMatrixLoc, false, flatten(mat4()));
    gl.drawArrays(gl.LINES, 0, points.length);
  } else if(fractal == 2) {
    // eye = vec3(radius*Math.sin(theta)*Math.cos(phi), radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));
    viewMatrix = lookAt(eye, [0, 0, 0], [0, 1, 0]);
    gl.uniformMatrix4fv(viewMatrixLoc, false, flatten(viewMatrix));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
  }

	sliderchangeflag=false;
  transformationFlag=false;

  requestAnimFrame(render);
}