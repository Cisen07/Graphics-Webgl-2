function matrialLoader(scene, path, file, scale, rX, rY, rZ, tX, tY, tZ) {
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath(path);
    mtlLoader.load(file+'.mtl', function(materials) {
        materials.preload();
        // model loader
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath(path);
        objLoader.load(file+'.obj', function ( object ) {
            object.position.y = - 95;
            // if has object, add to scene
            if (object.children.length > 0) {
                var t = object.children[0];
                t.scale.set(scale, scale, scale);
                t.rotateX(rX*Math.PI/4);
                t.rotateY(rY*Math.PI/4);
                t.rotateZ(rZ*Math.PI/4);
                t.translateX(5*tX)
                t.translateY(5*tY)
                t.translateZ(5*tZ)
                // t.materials.transparent = true;
                scene.add(t);
            }
        });
    });
}

function removeAnObj(scene) {
    var allChildren = scene.children;
    var lastObject = allChildren[allChildren.length-1];
    if(lastObject instanceof THREE.Mesh){
        scene.remove(lastObject);
        this.numberOfObjects = scene.children.length;
        console.log("remove one");
    }
    console.log("remove fail");
}

function aVec3_mult_aMat3(aVec3, aMat3) {
    var newV = vec3();
    newV[0] = aVec3[0] * aMat3[0][0] + aVec3[1] * aMat3[0][1] + aVec3[2] * aMat3[0][2];
    newV[1] = aVec3[0] * aMat3[1][0] + aVec3[1] * aMat3[1][1] + aVec3[2] * aMat3[1][2];
    newV[2] = aVec3[0] * aMat3[2][0] + aVec3[1] * aMat3[2][1] + aVec3[2] * aMat3[2][2];
    return newV;
}
