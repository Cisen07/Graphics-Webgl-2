"use strict";

var canvas;
var gl;

var numTimesToSubdivide = 1;    // 递归次数
var points = [];    // 生成的所有顶点的位置

// var NumVertices  = 36; // 用于画立方体的
var NumVertices  = 36; // 用于画3d图形的

var program;
var bufferId;
var colorbufferId;

var c_babyBlue = vec4( 0.6, 1.0, 1.0, 1.0 );
var colorsOfVertexs=[]; // 存放所生成的所有顶点的颜色  

var animflag = false;
var sliderchangeflag = false;

var showOrHideFlag; // 用于向前向后控件的显示与隐藏

var fractal = 0;    // 当前的图形，0表示雪花，1表示二叉树，2表示立方体
// 虽然现在不是分形图形了，但是懒得改了
// 0代表一把椅子，1代表一顶帽子，2代表一把剑

// 以下是 2D 图形变换用到的var
var currentTransformationMatrix = mat4(); // 初始的CTM设为单位矩阵
var currentTransformationMatrixLoc;
var transformationFlag = false;

// a container variable (like a namespace protector)
var app = {};
app.meshes = {};
var objStr = ["modelResource/Chair/Chair.obj", "modelResource/i8cotix2ujuo-Cap/Cap.obj", "modelResource/sword-01-obj/sword-01.obj"]
var allNum; // obj中读取的vertices列表的长度，除以三就是点的数量
var biggestVertice;
var tempI;

var scaleMatrix, modelViewMatrix, projectionMatrix;
var scaleMatrixLoc, modelViewMatrixLoc, projectionMatrixLoc;
var scale = 1.0; // 用来控制缩放的程度

//  极坐标参数
var radius = 1.0;
var theta  = 0.0;
var phi    = 0.0;
//  lookAt函数参数
var eye_x = 0;
var eye_y = 0;
var eye_z = 1;
var eye = vec3(0.0, 0.0, 1.0);
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);

//  平行投影
const near   =  0.2;
const far    =  2.0;
const left   = -2.0;
const right  =  2.0;
const vtop   =  2.0;
const bottom = -2.0;
//  透视投影
const fovy   = 90.0;    //  Field-of-view in Y direction angle (in degrees)
const aspect = 1.0;     //  Viewport aspect ratio

var isOrtho = true;

function initPoints(vertices) {
  allNum = vertices.length;
  NumVertices = allNum / 3;
  biggestVertice = findMax(vertices, allNum);
  for(tempI = 0; tempI < allNum; tempI += 3) {
    points.push(vec4(vertices[tempI]/biggestVertice, vertices[tempI+1]/biggestVertice, vertices[tempI+2]/biggestVertice, 1));
    colorsOfVertexs.push(c_babyBlue);
  }
}

function webGLStarter(meshes) {
  app.meshes = meshes;
    
  // init the points for the sword
  initPoints(app.meshes.sword.vertices)

  // Load shaders
  var program = initShaders( gl, "vertex-shader", "fragment-shader" );
  gl.useProgram( program );

  // deliver points attribue
  bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);	
  gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
  
  var vPosition = gl.getAttribLocation(program, "vPosition" );
  gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0); // DDD
  gl.enableVertexAttribArray(vPosition);
  
  // deliver colors attribue
  colorbufferId = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, colorbufferId );	
  gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsOfVertexs), gl.STATIC_DRAW );
  
  var vColor = gl.getAttribLocation( program, "vColor" );
  gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vColor );

  scaleMatrixLoc = gl.getUniformLocation(program, 'u_scaleMatrix');
  projectionMatrixLoc = gl.getUniformLocation(program, "u_projectionMatrix");
  modelViewMatrixLoc = gl.getUniformLocation(program, "u_modelViewMatrix");

  // deliver currentTransformationMatrix uniform
  currentTransformationMatrixLoc = gl.getUniformLocation(program, "currentTransformationMatrix");
  gl.uniformMatrix4fv(currentTransformationMatrixLoc, false, flatten(currentTransformationMatrix));
}

window.onload = function init() 
{
  canvas = document.getElementById( "gl-canvas" );
  gl = WebGLUtils.setupWebGL( canvas );
  if ( !gl ) { alert( "WebGL isn't available" ); }

  gl.viewport( 0, 0, canvas.width, canvas.height );
  gl.clearColor( 0.5, 0.5, 0.5, 1.0 ); // 灰色背景
  gl.enable(gl.DEPTH_TEST); // 只绘制最前面一层

  OBJ.downloadMeshes({
    'sword': objStr[fractal]
  }, webGLStarter);

  // 键盘控制
  document.onkeydown = function (event) {
    var e = event || window.event || arguments.callee.caller.arguments[0];
    if (e && e.keyCode == 74) { // J
      if(scale >= 0.5) {
        scale -= 0.1;
      } else {
        alert("不能再小了")
      }
    }
    if (e && e.keyCode == 76) { // L
      if(scale <= 3) {
        scale += 0.1;
      } else {
        alert("不能再大了")
      }
    }
    if (e && e.keyCode == 65) { // A 左
      console.log("AAA");
      var tempMa1 = [eye_x, eye_y, eye_z, 1];
      console.log(rotateZ(0.5));
      var tempMa = aVec4_mult_aMat4(tempMa1, rotateZ(-4));
      console.log(tempMa);
      eye_x = tempMa[0];
      eye_y = tempMa[1];
      eye_z = tempMa[2];
    }
    if (e && e.keyCode == 68) { // D 右
      var tempMa1 = [eye_x, eye_y, eye_z, 1];
      var tempMa = aVec4_mult_aMat4(tempMa1, rotateZ(4));
      eye_x = tempMa[0];
      eye_y = tempMa[1];
      eye_z = tempMa[2];
    }
    if (e && e.keyCode == 83) { // S 下
      var tempMa1 = [eye_x, eye_y, eye_z, 1];
      var tempMa = aVec4_mult_aMat4(tempMa1, rotateX(-4));
      console.log("tempMa");
      console.log(tempMa);
      eye_x = tempMa[0];
      eye_y = tempMa[1];
      eye_z = tempMa[2];
    }
    if (e && e.keyCode == 87) { // W 上
      var tempMa1 = [eye_x, eye_y, eye_z, 1];
      var tempMa = aVec4_mult_aMat4(tempMa1, rotateX(4));
      eye_x = tempMa[0];
      eye_y = tempMa[1];
      eye_z = tempMa[2];
    }
    if (e && e.keyCode == 80) { // P
      if(isOrtho) {
        document.getElementById("idForOrtho").innerHTML="now: Perspective";
      } else {
        document.getElementById("idForOrtho").innerHTML="now: Ortho";
      }
      isOrtho = !isOrtho;
    }
    if (e && e.keyCode == 84) { // T est
      var t1 = vec4();
      var t2 = mat4();
      console.log(t1);
      console.log(t2);
    }
  };

  render();

  //*******图形的种类选择监听程序,重新生成顶点，重新绘制
  document.getElementById("fractal").onchange = function(event) {
    var newValue = parseInt(event.target.value);
    fractal = newValue;
    points = [];
    colorsOfVertexs=[];
    OBJ.downloadMeshes({
      'sword': objStr[fractal]
    }, webGLStarter);
    // sliderchangeflag = true;
  }

  //*******复位键监听器
  document.getElementById("dejavu").onclick = function() {
    currentTransformationMatrix = mat4();
    transformationFlag = true;
  }
  //*******漫游复位键监听器
  document.getElementById("dejavu2").onclick = function() {
    eye_x = 0;
    eye_y = 0;
    eye_z = 1;
    scale = 1;
  }

  //*******纵向平移监听器
  document.getElementById("goUpper").onclick = changeY;
  document.getElementById("goLower").onclick = changeY;
  function changeY() {
    var newValue = parseFloat(event.target.value);
    var addTransformationMatrix = mat4();
    addTransformationMatrix[1][3] = newValue;
    currentTransformationMatrix = mult(addTransformationMatrix, currentTransformationMatrix);
    transformationFlag = true;
  };
  //*******横向平移监听器
  document.getElementById("goLefter").onclick = changeX;
  document.getElementById("goRighter").onclick = changeX;
  function changeX() {
    var newValue = parseFloat(event.target.value);
    var addTransformationMatrix = mat4();
    addTransformationMatrix[0][3] = newValue;
    currentTransformationMatrix = mult(addTransformationMatrix, currentTransformationMatrix);
    transformationFlag = true;
  };
  //*******深度平移监听器
  document.getElementById("goFronter").onclick = changeZ;
  document.getElementById("goMoreBack").onclick = changeZ;
  function changeZ() {
    var newValue = parseFloat(event.target.value);
    var addTransformationMatrix = mat4();
    addTransformationMatrix[2][3] = newValue;
    currentTransformationMatrix = mult(addTransformationMatrix, currentTransformationMatrix);
    transformationFlag = true;
  };

  //*******绕画布中心旋转监听器
  document.getElementById("anticlockwise").onclick = changeR;
  document.getElementById("clockwise").onclick = changeR;
  function changeR() {
    var newValue = parseFloat(event.target.value);
    var c = Math.cos( radians(newValue) );
    var s = Math.sin( radians(newValue) );
    var addTransformationMatrix = mat4();
    addTransformationMatrix[0][0] = c;
    addTransformationMatrix[0][1] = -s;
    addTransformationMatrix[1][0] = s;
    addTransformationMatrix[1][1] = c;
    currentTransformationMatrix = mult(addTransformationMatrix,currentTransformationMatrix);
    transformationFlag = true;
  };
  //*******绕图形中心旋转监听器
  document.getElementById("anticlockwise2").onclick = changeR2;
  document.getElementById("clockwise2").onclick = changeR2;
  function changeR2() {
    var newValue = parseFloat(event.target.value);
    var c = Math.cos( radians(newValue) );
    var s = Math.sin( radians(newValue) );
    var deltaX = currentTransformationMatrix[0][3];
    var deltaY = currentTransformationMatrix[1][3];

    var addTransformationMatrix1 = mat4(); // 1 平移
    addTransformationMatrix1[0][3] = - deltaX;
    addTransformationMatrix1[1][3] = - deltaY;
    currentTransformationMatrix = mult(addTransformationMatrix1,currentTransformationMatrix)

    var addTransformationMatrix2 = mat4(); // 2 旋转
    addTransformationMatrix2[0][0] = c;
    addTransformationMatrix2[0][1] = -s;
    addTransformationMatrix2[1][0] = s;
    addTransformationMatrix2[1][1] = c;
    currentTransformationMatrix = mult(addTransformationMatrix2,currentTransformationMatrix)

    var addTransformationMatrix3 = mat4(0); // 3 平移
    addTransformationMatrix3[0][3] = deltaX;
    addTransformationMatrix3[1][3] = deltaY;
    currentTransformationMatrix = add(addTransformationMatrix3,currentTransformationMatrix)

    transformationFlag = true;
  };

  //*******反射监听器
  document.getElementById("reflectX").onclick = reflectXY;
  document.getElementById("reflectY").onclick = reflectXY;
  document.getElementById("reflectO").onclick = reflectXY;
  function reflectXY() {
    var newValue = parseFloat(event.target.value);
    var addTransformationMatrix = mat4();
    switch (newValue) {
    case 1:
      addTransformationMatrix[1][1] = -1;
      break;
    case 2:
      addTransformationMatrix[0][0] = -1;
      break;
    case 3:
      addTransformationMatrix[0][0] = -1;
      addTransformationMatrix[1][1] = -1;
      break;
    }
    currentTransformationMatrix = mult(addTransformationMatrix, currentTransformationMatrix);
    transformationFlag = true;
  }

  //*******变比监听器
  document.getElementById("XPlus").onclick = changeRatio;
  document.getElementById("XMinus").onclick = changeRatio;
  document.getElementById("YPlus").onclick = changeRatio;
  document.getElementById("YMinus").onclick = changeRatio;
  function changeRatio() {
    var newValue = parseFloat(event.target.value);
    var addTransformationMatrix = mat4();
    switch (newValue) {
    case 1:
      addTransformationMatrix[0][0] = 1.2;
      break;
    case 2:
      addTransformationMatrix[0][0] = 0.8;
      break;
    case 3:
      addTransformationMatrix[1][1] = 1.2;
      break;
    case 4:
      addTransformationMatrix[1][1] = 0.8;
    }
    currentTransformationMatrix = mult(addTransformationMatrix, currentTransformationMatrix);
    transformationFlag = true;
  }

  //*******错切监听器
  document.getElementById("shearXPlus").onclick = changeShear;
  document.getElementById("shearXMinus").onclick = changeShear;
  document.getElementById("shearYPlus").onclick = changeShear;
  document.getElementById("shearYMinus").onclick = changeShear;
  function changeShear() {
    var newValue = parseFloat(event.target.value);
    var addTransformationMatrix = mat4();
    switch (newValue) {
    case 1:
      addTransformationMatrix[1][0] = 0.3;
      break;
    case 2:
      addTransformationMatrix[1][0] = -0.3;
      break;
    case 3:
      addTransformationMatrix[0][1] = 0.3;
      break;
    case 4:
      addTransformationMatrix[0][1] = -0.3;
    }
    currentTransformationMatrix = mult(addTransformationMatrix, currentTransformationMatrix);
    transformationFlag = true;
  }

};

function render()
{
  
  gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  scaleMatrix = new Float32Array([
    scale, 0.0,   0.0,   0.0,
    0.0,   scale, 0.0,   0.0,
    0.0,   0.0,   scale, 0.0,
    0.0,   0.0,   0.0,   1.0
  ]);

  if(isOrtho) {
    projectionMatrix = ortho(left, right, bottom, vtop, near, far);
  } else {
    projectionMatrix = perspective(fovy, aspect, near, far);
  }  

  eye = vec3(eye_x, eye_y, eye_z);
  modelViewMatrix = lookAt(eye, at, up);

  gl.uniformMatrix4fv(scaleMatrixLoc, false, scaleMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
  gl.uniformMatrix4fv(currentTransformationMatrixLoc, false, flatten(currentTransformationMatrix));
  gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

  requestAnimFrame(render);
}