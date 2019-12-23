function findMax(vertices, allNum) {
    var maxVertice = getAbs(vertices[0]);
    var tempI;
    for(tempI = 1; tempI < allNum; tempI += 1) {
        if(getAbs(vertices[tempI]) > maxVertice)
        maxVertice = getAbs(vertices[tempI]);
    }
    return maxVertice;
}

function getAbs(num) {
    if(num >= 0)
        return num;
    else
        return 0-num;
}

function aVec4_mult_aMat4(aVec4, aMat4) {
    var newV = vec4();
    newV[0] = aVec4[0] * aMat4[0][0] + aVec4[1] * aMat4[0][1] + aVec4[2] * aMat4[0][2] + aVec4[3] * aMat4[0][3];
    newV[1] = aVec4[0] * aMat4[1][0] + aVec4[1] * aMat4[1][1] + aVec4[2] * aMat4[1][2] + aVec4[3] * aMat4[1][3];
    newV[2] = aVec4[0] * aMat4[2][0] + aVec4[1] * aMat4[2][1] + aVec4[2] * aMat4[2][2] + aVec4[3] * aMat4[2][3];
    newV[3] = aVec4[0] * aMat4[3][0] + aVec4[1] * aMat4[3][1] + aVec4[2] * aMat4[3][2] + aVec4[3] * aMat4[3][3];
    return newV;
}