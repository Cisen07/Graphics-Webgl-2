var scene = null;
var camera = null;
var renderer = null;

var mesh = null;
var id = null;

// var paths = ['/modelResource/camero-2010-low-poly-obj/', '/modelResource/sword-01-obj/', '/modelResource/low-poly-fox-by-pixelmannen-obj/', '/modelResource/sonic-the-hedgehog-obj/', '/modelResource/nike-air-max-low-poly-obj/', '/modelResource/minion-obj/', '/modelResource/tree-obj/', '/modelResource/football-soccer-ball-obj/']
// var files = ['camero-2010-low-poly', 'sword-01', 'low-poly-fox-by-pixelmannen', 'sonic-the-hedgehog', 'nike-air-max-low-poly', 'minion', 'tree', 'football-soccer-ball']
var paths = ['/modelResource/football-soccer-ball-obj/', '/modelResource/low-poly-fox-by-pixelmannen-obj/', '/modelResource/camero-2010-low-poly-obj/']
var files = ['football-soccer-ball', 'low-poly-fox-by-pixelmannen', 'camero-2010-low-poly']
var scale = 1
var initScale = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
initScale[0] = 0.03
initScale[1] = 0.03
initScale[2] = 1
var rX = 0
var rY = 0
var rZ = 0
var tX = 0
var tY = 0
var tZ = 0
var th = 0
var eye_x = 60
var eye_y = 60
var eye_z = 60
var up_x = 0
var up_y = 1
var up_z = 0
var tempMa1
var tempMa
var isOrtho = false
var fogFlag = false
var testA = 0
var testB = 0
var testC = 0

window.onload = function init() {
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('mainCanvas')
    });
    renderer.setClearColor(0x000000);
    scene = new THREE.Scene();
    
    // 相机
    camera = new THREE.OrthographicCamera(-5, 5, 3.75, -3.75, 0.1, 1000);
    // camera = new THREE.OrthographicCamera(window.innerWidth/-2,window.innerWidth/2,window.innerHeight/2,window.innerHeight/-2,1,1000);
    camera.position.set(eye_x+testA, eye_x+testB, eye_x+testC);
    camera.up = new THREE.Vector3(up_x, up_y, up_z);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(camera);
    
    // 加载模型
    scale = initScale[th]
    matrialLoader(scene, paths[th], files[th], scale, rX, rY, rZ, tX, tY, tZ);

    // 坐标轴
    var size = 5;  // 表示轴的线的大小。默认值为1
    var axesHelper = new THREE.AxesHelper( size );
    scene.add( axesHelper );
    
    // 光线
    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(20, 10, 5);
    scene.add(light);
    
    // 雾化
    if(fogFlag) {
        scene.fog = new THREE.Fog(0xffffff,100,120);
    }
    // scene.autoUpdate = true;

    id = setInterval(draw, 20);
    draw();

    document.onkeydown = function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode == 74) { // J
            console.log(scale)
            console.log(scale)
            console.log(scale/initScale[th])
            if(scale/initScale[th] >= 0.5) {
                scale = (scale/initScale[th]-0.1)*initScale[th];
                console.log(scale)
                removeAnObj(scene);
                // removeAnObj(scene);
                matrialLoader(scene, paths[th], files[th], scale, rX, rY, rZ, tX, tY, tZ);
            } else {
                alert("不能再小了")
            }
        }
        if (e && e.keyCode == 76) { // L
            if(scale/initScale[th] <= 3) {
                scale = (scale/initScale[th]+0.1)*initScale[th];
                console.log(scale)
                removeAnObj(scene);
                // removeAnObj(scene);
                matrialLoader(scene, paths[th], files[th], scale, rX, rY, rZ, tX, tY, tZ);
            } else {
                alert("不能再大了")
            }
        }
        if (e && e.keyCode == 65) {  // A 左
            var tempMa1 = [eye_x, eye_y, eye_z];
            var tempMa = aVec3_mult_aMat3(tempMa1, rotateY(1));
            console.log(tempMa)
            eye_x = tempMa[0];
            eye_y = tempMa[1];
            eye_z = tempMa[2];
            
            tempMa1 = [up_x, up_y, up_z];
            tempMa = aVec3_mult_aMat3(tempMa1, rotateY(1));
            up_x = tempMa[0];
            up_y = tempMa[1];
            up_z = tempMa[2];

            camera.position.set(eye_x+testA, eye_y+testB, eye_z+testC);
            camera.up = new THREE.Vector3(up_x, up_y, up_z);
            camera.lookAt(new THREE.Vector3(0, 0, 0));
        }
        if (e && e.keyCode == 68) { // D 右
            tempMa1 = [eye_x, eye_y, eye_z];
            tempMa = aVec3_mult_aMat3(tempMa1, rotateY(-1));
            console.log(tempMa)
            eye_x = tempMa[0];
            eye_y = tempMa[1];
            eye_z = tempMa[2];
            
            tempMa1 = [up_x, up_y, up_z];
            tempMa = aVec3_mult_aMat3(tempMa1, rotateY(-1));
            up_x = tempMa[0];
            up_y = tempMa[1];
            up_z = tempMa[2];

            camera.position.set(eye_x+testA, eye_y+testB, eye_z+testC);
            camera.up = new THREE.Vector3(up_x, up_y, up_z);
            camera.lookAt(new THREE.Vector3(0, 0, 0));
        }
        if (e && e.keyCode == 83) { // S 下
            tempMa1 = [eye_x, eye_y, eye_z];
            tempMa = aVec3_mult_aMat3(tempMa1, rotateX(-1));
            console.log(tempMa)
            eye_x = tempMa[0];
            eye_y = tempMa[1];
            eye_z = tempMa[2];
            
            tempMa1 = [up_x, up_y, up_z];
            tempMa = aVec3_mult_aMat3(tempMa1, rotateY(-1));
            up_x = tempMa[0];
            up_y = tempMa[1];
            up_z = tempMa[2];

            camera.position.set(eye_x+testA, eye_y+testB, eye_z+testC);
            camera.up = new THREE.Vector3(up_x, up_y, up_z);
            camera.lookAt(new THREE.Vector3(0, 0, 0));
        }
        if (e && e.keyCode == 87) { // W 上
            tempMa1 = [eye_x, eye_y, eye_z];
            tempMa = aVec3_mult_aMat3(tempMa1, rotateX(1));
            console.log(tempMa)
            eye_x = tempMa[0];
            eye_y = tempMa[1];
            eye_z = tempMa[2];
            
            tempMa1 = [up_x, up_y, up_z];
            tempMa = aVec3_mult_aMat3(tempMa1, rotateX(1));
            up_x = tempMa[0];
            up_y = tempMa[1];
            up_z = tempMa[2];

            camera.position.set(eye_x+testA, eye_y+testB, eye_z+testC);
            camera.up = new THREE.Vector3(up_x, up_y, up_z);
            camera.lookAt(new THREE.Vector3(0, 0, 0));
        }
        if (e && e.keyCode == 80) { // P
            if(isOrtho) {
                //切换成透视投影摄像机
                camera = new THREE.PerspectiveCamera(1.8, 1, 0.1, 1000);
                camera.position.set(eye_x+testA, eye_x+testB, eye_x+testC);
                camera.up = new THREE.Vector3(up_x, up_y, up_z);
                camera.lookAt(new THREE.Vector3(0, 0, 0));
                document.getElementById("idForOrtho").innerHTML="now: Perspective";
            } else {
                //切换成正交投影摄像机
                camera = new THREE.OrthographicCamera(-5, 5, 3.75, -3.75, 0.1, 1000);
                camera.position.set(eye_x+testA, eye_x+testB, eye_x+testC);
                camera.up = new THREE.Vector3(up_x, up_y, up_z);
                camera.lookAt(new THREE.Vector3(0, 0, 0));
                document.getElementById("idForOrtho").innerHTML="now: Ortho";
            }
            isOrtho = !isOrtho;
        }
    };
    document.getElementById("choice").onchange = function(event) {
        var newValue = parseInt(event.target.value);
        th = newValue;
        removeAnObj(scene);
        scale = 1*initScale[th]
        matrialLoader(scene, paths[th], files[th], scale, rX, rY, rZ, tX, tY, tZ);
    }
    document.getElementById("dejavu").onclick = function() {
        tX = tY = tZ = 0;
        rX = rY = rZ = 0;
        removeAnObj(scene);
        matrialLoader(scene, paths[th], files[th], scale, rX, rY, rZ, tX, tY, tZ);
    }
    document.getElementById("dejavu2").onclick = function() {
        scale = 1*initScale[th];
        eye_x = eye_y = eye_z = 60;
        up_x = up_z = 0;
        up_y = 1;
        removeAnObj(scene);
        matrialLoader(scene, paths[th], files[th], scale, rX, rY, rZ, tX, tY, tZ);
        camera.position.set(eye_x+testA, eye_y+testB, eye_z+testC);
        camera.up = new THREE.Vector3(up_x, up_y, up_z);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
    }
    document.getElementById("goUpper").onclick = function() {
        tY += 0.1;
        removeAnObj(scene);
        matrialLoader(scene, paths[th], files[th], scale, rX, rY, rZ, tX, tY, tZ);
    }
    document.getElementById("goLower").onclick = function() {
        tY -= 0.1;
        removeAnObj(scene);
        matrialLoader(scene, paths[th], files[th], scale, rX, rY, rZ, tX, tY, tZ);
    }
    document.getElementById("goLefter").onclick = function() {
        tX -= 0.1;
        removeAnObj(scene);
        matrialLoader(scene, paths[th], files[th], scale, rX, rY, rZ, tX, tY, tZ);
    }
    document.getElementById("goRighter").onclick = function() {
        tX += 0.1;
        removeAnObj(scene);
        matrialLoader(scene, paths[th], files[th], scale, rX, rY, rZ, tX, tY, tZ);
    }
    document.getElementById("goFronter").onclick = function() {
        tZ += 0.1;
        removeAnObj(scene);
        matrialLoader(scene, paths[th], files[th], scale, rX, rY, rZ, tX, tY, tZ);
    }
    document.getElementById("goMoreBack").onclick = function() {
        tZ -= 0.1;
        removeAnObj(scene);
        matrialLoader(scene, paths[th], files[th], scale, rX, rY, rZ, tX, tY, tZ);
    }
    document.getElementById("rotateX1").onclick = function() {
        rX += 0.3;
        removeAnObj(scene);
        matrialLoader(scene, paths[th], files[th], scale, rX, rY, rZ, tX, tY, tZ);
    }
    document.getElementById("rotateX2").onclick = function() {
        rX -= 0.3;
        removeAnObj(scene);
        matrialLoader(scene, paths[th], files[th], scale, rX, rY, rZ, tX, tY, tZ);
    }
    document.getElementById("fog").onclick = function() {
        if(fogFlag) {
            scene.fog = null;
            document.getElementById("fog").innerHTML="开启雾化";
            fogFlag = false;
        } else {
            scene.fog = new THREE.Fog(0xffffff,100,120);
            document.getElementById("fog").innerHTML="关闭雾化";
            fogFlag = true;
        }
    }
    
    // document.getElementById("rotateY1").onclick = function() {
    //     rY += 0.3;
    //     removeAnObj(scene);
    //     matrialLoader(scene, paths[th], files[th], scale, rX, rY, rZ, tX, tY, tZ);
    // }
    // document.getElementById("rotateY2").onclick = function() {
    //     rY -= 0.3;
    //     removeAnObj(scene);
    //     matrialLoader(scene, paths[th], files[th], scale, rX, rY, rZ, tX, tY, tZ);
    // }
    // document.getElementById("rotateZ1").onclick = function() {
    //     rZ += 0.3;
    //     removeAnObj(scene);
    //     matrialLoader(scene, paths[th], files[th], scale, rX, rY, rZ, tX, tY, tZ);
    // }
    // document.getElementById("rotateZ2").onclick = function() {
    //     rZ -= 0.3;
    //     removeAnObj(scene);
    //     console.log(rZ)
    //     matrialLoader(scene, paths[th], files[th], scale, rX, rY, rZ, tX, tY, tZ);
    // }
}


function draw() {
    renderer.render(scene, camera);
}

