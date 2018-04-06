/*
Authors:Alper Şahıstan, Barış Poyraz
ID: 21501207, 21401952
CS465 Assignment 2 - The Fox Animator
*/

var gl;
var canvas;

var program;
var instanceMatrix = mat4();
var theta =10;

var movement = 0;

rectangularVertices = 
[
    vec4( -0.5, -0.5,  0, 1.0 ),
    vec4( -0.5,  0.5,  0, 1.0 ),
    vec4( 0.5,  0.5,  0, 1.0 ),
    vec4( 0.5, -0.5,  0, 1.0 ),
];

var fox;

var Head;
var mouth;

var torso;
var neck;

var leftFrontUpperLeg;
var leftRearUpperLeg;
var rightFrontUpperLeg;
var rightRearUpperLeg;

var leftFrontLowerLeg;
var leftRearLowerLeg;
var rightFrontLowerLeg;
var rightRearLowerLeg;

var leftFrontPaw;
var leftRearPaw;

var rightFrontPaw;
var rightRearPaw;

var tailBase;
var tailBody;
var tailTip;

circularVertices = [];

var stack = [];

var pointsArray = [];

var projectionMatrix; 

var modelViewMatrix;
var modelViewMatrixLoc;

var colorsArray = [];

var headColors = [];    //-
var noseColors = [];
var noseTipColors = [];
var leftEarColors = [];
var rightEarColors = [];

var mouthColors = [];

var torsoLowerPoints = []; //-
var torsoLowerColors = []; //-

var torsoUpperPoints = []; //-
var torsoUpperColors = []; //-

var neckPoints = []; //-
var neckColors = []; //-

var frontUpperLegColors = [];
var rearUpperLegColors = [];

var frontLowerLegColors = [];
var rearLowerLegColors = [];

var frontPawColors = []; //-
var rearPawColors = []; //-

var tailBaseColors = []; //-
var tailBodyColors = []; //-
var tailTipColors = []; //-
var tailTipTipColors = [];

var previousSliderValueInX = 0;
var differenceInX = 0;

var previousSliderValueInY = -0.5;
var differenceInY = 0;

//Animation Keyframes
var keyFrames = [];

var loadButton = document.getElementById("load_button");

function scale4(a, b, c) {
    var result = mat4();
    result[0][0] = a;
    result[1][1] = b;
    result[2][2] = c;
    return result;
 }

 function quad(a, b, c, d) {

     pointsArray.push(rectangularVertices[a]); 
     pointsArray.push(rectangularVertices[b]); 
     pointsArray.push(rectangularVertices[c]); 
     pointsArray.push(rectangularVertices[d]);
       
}

function ellipsoid()
{
    var v2 = new vec4(0,0,0,1);
    circularVertices.push(v2);

    for (i = 0; i <= 36 ; i+= 1)
    {
        var j = i * 10 * Math.PI/180;

        var v1 = new vec4 (0.5 * Math.sin(j), 0.5 * Math.cos(j), 0, 1);

        circularVertices.push(v1);

    }
    console.log(  circularVertices.length )
    
    for(k = 0; k < circularVertices.length; k++){
        pointsArray.push(circularVertices[k]);
    }
}
//-------Render Functions--------

//----PRIMITIVES-----
//---Forms a rectangle---
function drawrectangle(transform, colors)
{
    instanceMatrix = mult(modelViewMatrix, transform );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4);
}

//---Forms a ellipsoid---
function drawEllipsoid(transform, colors)
{
    //BURAYA BAK
    instanceMatrix = mult(modelViewMatrix, transform );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );;
    gl.drawArrays( gl.TRIANGLE_FAN, 4, 38); 
    
}
//---Forms a right triangle ---
function drawRTriangle(transform, colors)
{
    instanceMatrix = mult(modelViewMatrix, transform );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 3);
}

//-----RENDER METHODS FOR BODY PARTS-----

//---Forms the Torso---
function drawTorso()
{
    instanceMatrix = scale4(6, 1.9, 0);
    drawrectangle(instanceMatrix, torsoUpperColors);
    
    instanceMatrix = translate(0.0, -0.9, 0.0);
    instanceMatrix = mult(instanceMatrix, scale4(6, 1.9, 0));
    drawEllipsoid(instanceMatrix, torsoLowerColors);
}

//---Forms the Neck---
function drawNeck()
{
    instanceMatrix = translate(-2.6, 1.0, 0.0);
    instanceMatrix = mult(instanceMatrix, rotate(106, 0,0,1))
    instanceMatrix = mult(instanceMatrix, scale4(2.3, 1.4, 0) );
    drawrectangle(instanceMatrix, neckColors);
}

//---Forms the Front Upper Legs---
function drawFrontUpperLeg()
{
    instanceMatrix = translate(-2.2, -1.4, 0.0);
    instanceMatrix = mult(instanceMatrix, rotate(50, 0,0,1))
    instanceMatrix = mult(instanceMatrix, scale4(0.6, 1.7, 0) );
    drawrectangle(instanceMatrix, frontUpperLegColors);
}

//---Forms the Rear Upper Legs---
function drawRearUpperLeg()
{
    instanceMatrix = translate(2.3, -1.6, 0.0);
    instanceMatrix = mult(instanceMatrix, rotate(20, 0,0,1))
    instanceMatrix = mult(instanceMatrix, scale4(-1.7, 2.7, 0) );
    drawRTriangle(instanceMatrix, rearUpperLegColors);
}

//---Form the Front Lower Legs---
function drawFrontLowerLeg()
{
    instanceMatrix = translate(-1.6, -2.6, 0.0);
    instanceMatrix = mult(instanceMatrix, scale4(0.5, 1.8, 0) );
    drawrectangle(instanceMatrix, frontLowerLegColors);
}

//---Form the Rear Lower Legs---
function drawRearLowerLeg()
{
    instanceMatrix = translate(3.4, -3.0, 0.0);
    instanceMatrix = mult(instanceMatrix, scale4(0.4, 1.6, 0) );
    drawrectangle(instanceMatrix, rearLowerLegColors);
}

//---Form the Front Paws---
function drawFrontPaws()
{
    instanceMatrix = translate(-2.0, -3.5, 0.0);     
    instanceMatrix = mult(instanceMatrix, rotate(90, 0,0,1));
    instanceMatrix = mult(instanceMatrix, scale4(0.5, -1.3, 0) );
    drawRTriangle(instanceMatrix, frontPawColors);
}

//---Form the Rear Paws---
function drawRearPaws()
{
    instanceMatrix = translate(2.95, -3.7, 0.0);  
    instanceMatrix = mult(instanceMatrix, rotate(90, 0,0,1));
    instanceMatrix = mult(instanceMatrix, scale4(0.5, -1.3, 0) );
    drawRTriangle(instanceMatrix, rearPawColors);
}

//---Form the Tail Base---
function drawTailBase()
{
    instanceMatrix = translate(4.2, 0.7, 0);
    instanceMatrix = mult(instanceMatrix, rotate(0, 0, 0, 1));
    instanceMatrix = mult(instanceMatrix, scale4(3, 0.95, 0));
    drawEllipsoid(instanceMatrix, tailBaseColors);
}

//---Form the Tail Body---
function drawTailBody()
{
    instanceMatrix = translate(5.4, 0.7, 0.0);  
    instanceMatrix = mult(instanceMatrix, scale4(3, 1.10, 0))
    drawEllipsoid(instanceMatrix, tailBodyColors);
}

//---Form the Tail Tip---
function drawTailTip()
{
    instanceMatrix = translate(7, 0.7, 0.0);  
    instanceMatrix = mult(instanceMatrix, scale4(3, 1.15, 0));
    drawEllipsoid(instanceMatrix, tailTipColors);

    instanceMatrix = translate(8.0, 0.7, 0.0);
    instanceMatrix = mult(instanceMatrix, scale4(2.0, 0.8, 0.0));
    instanceMatrix = mult(instanceMatrix, rotate(225, 0,0,1));
    instanceMatrix = mult(instanceMatrix, scale4(0.8, 0.8, 0.0));
    drawRTriangle(instanceMatrix, tailTipTipColors);
}

//---Form the Head---
function drawHead()
{
    instanceMatrix = translate(-3.5, 1.9, 0.0);
    instanceMatrix = mult(instanceMatrix, scale4(2.7, 2.2, 0) );
    drawEllipsoid(instanceMatrix, headColors);

    instanceMatrix = translate(-4.7, 1.4, 0.0);
    instanceMatrix = mult(instanceMatrix, rotate(15, 0,0,1));
    instanceMatrix = mult(instanceMatrix, scale4(1.2, 0.7, 0.0));
    drawrectangle(instanceMatrix, noseColors);

    instanceMatrix = translate(-5.46, 1.19, 0.0);
    instanceMatrix = mult(instanceMatrix, rotate(15, 0,0,1));
    instanceMatrix = mult(instanceMatrix, scale4(-0.4, 0.7, 0.0));
    drawRTriangle(instanceMatrix, noseTipColors);

    instanceMatrix = translate(-3.1, 3.2, 0.0);
    instanceMatrix = mult(instanceMatrix, rotate(0, 0,0,1));
    instanceMatrix = mult(instanceMatrix, scale4(1.2, -1.2, 0.0));
    drawRTriangle(instanceMatrix, rightEarColors);

    instanceMatrix = translate(-3.4, 3.2, 0.0);
    instanceMatrix = mult(instanceMatrix, rotate(0, 0,0,1));
    instanceMatrix = mult(instanceMatrix, scale4(1.2, -1.2, 0.0));
    drawRTriangle(instanceMatrix, leftEarColors);

}

//---Form the Mouth---
function drawMouth(){
    instanceMatrix = translate(-4.4, 1.07, 0.0);  
    instanceMatrix = mult(instanceMatrix, rotate(88, 0,0,1));
    instanceMatrix = mult(instanceMatrix, scale4(0.5, -1.5, 0));
    drawRTriangle(instanceMatrix, mouthColors);
}

//Source :https://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html
function resize()
{
    // Lookup the size the browser is displaying the canvas.
    var displayWidth  = canvas.clientWidth ;
    var displayHeight = canvas.clientWidth * 0.35;
 
  // Check if the canvas is not the same size.
  if (canvas.width  != displayWidth ||
    canvas.height != displayHeight) {
 
    // Make the canvas the same size
        canvas.width  = displayWidth;
        canvas.height = displayHeight;
    }
}

window.onload = function init(){
    canvas = document.getElementById( "gl-canvas" );

    resize();
    gl = WebGLUtils.setupWebGL( canvas );
       
    if ( !gl ) { alert( "WebGL isn't available" ); 
    }
    //  Configure WebGL       
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0, 0, 0, 1 );  
    
    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    instanceMatrix = mat4();

    projectionMatrix = ortho(-canvas.width/100, canvas.width/100, -canvas.height/100, canvas.height/100,-5.0,5.0);
    modelViewMatrix = mat4();

    //look up for Uniforms
    gl.uniformMatrix4fv(gl.getUniformLocation( program, "modelViewMatrix"), false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( gl.getUniformLocation( program, "projectionMatrix"), false, flatten(projectionMatrix) );

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");

    initializeColors();
    
    cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    //gl.bufferData( gl.ARRAY_BUFFER, flatten(noseColors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );
    
    
    quad(0,1,2,3);
    ellipsoid();
    
    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );    

    //look up for Attributes        
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    
    m = new mat4();

    var mouthT = new transformValues (-3.3, 1.2,0,0,0,0,1,1,0); 
    mouth = new limb(m, mouthT, drawMouth, null);

    var headT = new transformValues (-2.6, 1,0,0,0,0,1,1,0); 
    Head = new limb(m, headT, drawHead, mouth);

    var neckT = new transformValues (-2.2,0.5,0,0,0,0,1,1,0); 
    neck = new limb(m, neckT, drawNeck, Head);

    
    var leftFrontPawT = new transformValues (-1.5,-3.4,0,0,0,0,1,1,0); 
    leftFrontPaw = new limb(m, leftFrontPawT, drawFrontPaws, null);

    var rightFrontPawT = new transformValues (-1.5, -3.4,0,0,0,0,1,1,0);
    rightFrontPaw = new limb(translate(0,0,-0.0001), rightFrontPawT, drawFrontPaws, null);


    var leftFrontLowerLegT = new transformValues (-1.5,-2,0,0,0,0,1,1,0);
    leftFrontLowerLeg = new limb(m, leftFrontLowerLegT, drawFrontLowerLeg, leftFrontPaw);
    
    var rightFrontLowerLegT = new transformValues (-1.5,-2,0,0,0,0,1,1,0); 
    rightFrontLowerLeg = new limb(m, rightFrontLowerLegT, drawFrontLowerLeg, rightFrontPaw);


    var leftFrontUpperLegT = new transformValues (-2.8,-1,0,0,0,0,1,1,0); 
    leftFrontUpperLeg = new limb(m, leftFrontUpperLegT, drawFrontUpperLeg, leftFrontLowerLeg);

    var rightFrontUpperLegT = new transformValues (-2.8,-1,0,0,0,1,1,0); 
    rightFrontUpperLeg = new limb(m, rightFrontUpperLegT, drawFrontUpperLeg, rightFrontLowerLeg);


    var leftRearPawT = new transformValues (3.4,-3.5,0,0,0,0,1,1,0); 
    leftRearPaw = new limb(m, leftRearPawT, drawRearPaws, null);

    var rightRearPawT = new transformValues (3.4,-3.5,0,0,0,0,1,1,0); 
    rightRearPaw = new limb(m, rightRearPawT, drawRearPaws, null);


    var leftRearLowerLegT = new transformValues (3.4,-2.4,0,0,0,0,1,1,0); 
    leftRearLowerLeg = new limb(m, leftRearLowerLegT, drawRearLowerLeg, leftRearPaw);

    var rightRearLowerLegT = new transformValues (3.4,-2.4,0,0,0,0,1,1,0); 
    rightRearLowerLeg = new limb(m, rightRearLowerLegT, drawRearLowerLeg, rightRearPaw);


    var leftRearUpperLegT = new transformValues (2.1,-0.8,0,0,0,0,1,1,0); 
    leftRearUpperLeg = new limb(m, leftRearUpperLegT, drawRearUpperLeg, leftRearLowerLeg);

    var rightRearLowerLegT = new transformValues (2.1,-0.8,0,0,0,0,1,1,0); 
    rightRearUpperLeg = new limb(m, rightRearLowerLegT, drawRearUpperLeg, rightRearLowerLeg);

    var tailTipT= new transformValues (5.6, 0.8,0,0,0,0,1,1,0); 
    tailTip = new limb(m, tailTipT, drawTailTip, null);

    var tailBodyT = new transformValues (4.3,0.8,0,0,0,0,1,1,0); 
    tailBody = new limb(m, tailBodyT, drawTailBody, tailTip);

    var tailBaseT = new transformValues (3,0.8,0,0,0,0,1,1,0); 
    tailBase = new limb(m, tailBaseT, drawTailBase, tailBody);


    var torsoT = new transformValues (0,0,0,0,0,0,1,1,0); 
    torso = new limb(m, torsoT, drawTorso, leftFrontUpperLeg, leftRearUpperLeg, neck, tailBase, rightFrontUpperLeg, rightRearUpperLeg);
    
    var otherLimbs = [Head, mouth, neck, torso, leftFrontUpperLeg,
         leftFrontLowerLeg, leftFrontPaw, rightFrontUpperLeg,
         rightFrontLowerLeg, rightFrontPaw, leftRearUpperLeg,
         leftRearLowerLeg, leftRearPaw, rightRearUpperLeg,
         rightRearLowerLeg, rightRearPaw, tailBase, tailBody, tailTip];

    var foxT = new transformValues (0,0,0,0,0,0,1,1,0); 
    fox = new model(m, foxT, torso, otherLimbs);
    
    render();
}

var f = 1;

var play = false;
var rewindToStart = true;

function render()
{
    if(play){
        playAnimation();
    }
    else
        traverseModel(fox.root);
    requestAnimFrame(render);


}

//---------------------SLIDER FUNCTIONS------------------------------

//REFERENCE: https://stackoverflow.com/questions/31344723/onchanged-event-get-value-prior-to-changing-in-html-input-tag-type-range
function translateX(value){

    differenceInX =  fox.root.posX - value;
    fox.root.posX= value;
    
    var m = fox.root.transform;
    m = mult(m, translate(-differenceInX,  -differenceInY, fox.root.posZ));

    fox.root.transform = m;
    differenceInX = 0;
}

//REFERENCE: https://stackoverflow.com/questions/31344723/onchanged-event-get-value-prior-to-changing-in-html-input-tag-type-range
function translateY(value){
    differenceInY =  fox.root.posY - value;
    fox.root.posY = value;
    
    var m = fox.root.transform;
    m = mult(m, translate(-differenceInX, - differenceInY, fox.root.posZ));

    fox.root.transform = m;
    differenceInY = 0;
}

var scaleRate = 1;

function scale(value)
{
    scaleRate = value / torso.scaX ;
    torso.scaX = value;
    torso.scaY = value;
    
    var m = torso.transform;
    m = mult(m, scale4(scaleRate,  scaleRate, 1));

    torso.transform = m;
    scaleRate = 1;
}

function rotateLimb(aLimb, offsetX, offsetY, value)
{
    var rot = (aLimb.rotZ - value); 
    aLimb.rotZ = (value);

    var m = aLimb.transform;
    m = mult(m, translate(aLimb.posX + offsetX,
            aLimb.posY + offsetY,
            aLimb.posZ));
    m = mult(m, rotate(rot, 0,0,1));
    m = mult(m, translate(-aLimb.posX - offsetX,
        -aLimb.posY - offsetY,
        -aLimb.posZ));
    aLimb.transform = m;
}

var index = 0

function toggleAnimation(){
    play = !play;
    index = 0;
    f=1;
    rewindToStart = true;
}


function playAnimation(){
    if(rewindToStart){
        console.log("start");
        /*var curmodel = copyModel(fox);
        var curFrame = new keyFrame(curmodel);
        easeInOut(fox, curFrame, keyFrames[0], 1, 1);*/
        //traverseModel(fox.root);
        for(i = 0; i < fox.limbs.length; i++)
        {
            fox.limbs[i].transform = new mat4();
            //fox.limbs[i].rotZ = 0;
        }
        fox.root.transform = new mat4();
        var curmodel = copyModel(fox);
        var curFrame = new keyFrame(curmodel);
        easeInOut(fox, curFrame, keyFrames[0], 1, 1);
        for(i = 0; i < fox.limbs.length; i++)
        {
            fox.limbs[i].transform = new mat4();
            fox.limbs[i].transform = mult (keyFrames[0].model.limbs[i].transform, fox.limbs[i].transform);
        }
        fox.root.transform = keyFrames[0].model.root.transform;
        /*fox = copyModel(keyFrames[0].model);
        fox.root.transform = new mat4();*/
        traverseModel(fox.root);   
        rewindToStart = false;
    }
    if(f > 30 && index < keyFrames.length-2)
    {
        index++;
        f=1;
    }

    else if(f <= 30)
    {
        easeInOut(fox, keyFrames[index], keyFrames[index+1], f, 30);
        f = (f+1);
        traverseModel(fox.root);
    }
    else {
        var curmodel2 = new keyFrame(fox);
        easeInOut(fox, curmodel2, keyFrames[0], 1, 1);
        //traverseModel(fox.root);

        for(i = 0; i < fox.limbs.length; i++)
        {
            fox.limbs[i].transform = new mat4();
            //fox.limbs[i].rotZ = keyFrames[keyFrames.length-1].model.limbs[i].rotz;
        }
        fox.root.transform = new mat4();

        traverseModel(fox.root);

       /*var curmodel = copyModel(fox);
        var curFrame = new keyFrame(curmodel);
        easeInOut(fox, curFrame, keyFrames[0], 1, 1);*/
        index = 0;
        ndex = 0;
        f=1;
    rewindToStart = true;
        //toggleAnimation();
    }
}

function addFrame(){
    var frame = new keyFrame(copyModel(fox));
    keyFrames.push(frame);
    keyFrames[keyFrames.length-1].model.root.transform = fox.root.transform
}

/*function addFrame(index){
    var frame = new keyFrame(copyModel(fox));
    keyFrames[index] = frame;
}*/

//REFERENCE:https://stackoverflow.com/questions/10559660/how-can-i-build-a-json-string-in-javascript-jquery
//REFERENCE:https://stackoverflow.com/questions/34156282/how-do-i-save-json-to-local-text-file
function saveFrames(){
    var savedKeyFrames = [];
    var str = "keyframe";
    var key = "";
    var i;
    
    for(i = 0; i < keyFrames.length; i++){
        key = str + i;
        savedKeyFrames[i] = {};
        savedKeyFrames[i][key] = keyFrames[i];
    }
    
    var savedKeyFramesToJSON = JSON.stringify(savedKeyFrames);
    alert(savedKeyFramesToJSON);
    
    var fileName = new Date();
    
    var a = document.createElement("a");
    var downloadJSON = new Blob([savedKeyFramesToJSON], {type: "text/plain"});
    a.href = URL.createObjectURL(downloadJSON);
    
    a.download = fileName;
    a.click();
}

//REFERENCE: File API & FileReader API
function loadFrames(){
    var choosenKeyFramesList = loadButton.files[0];
    var reader = new FileReader();
    var contentText;
    
    reader.onload = function(){
        contentText = reader.result;
    }
    reader.readAsText(choosenKeyFramesList);    
        
    reader.onloadend = function(){
        contentText = reader.result;
        
        var contentToJSON = JSON.parse(contentText);
        var i;
        var str = "keyframe";
        var key = "";
        //RESET OR ADD TO THE REST???
        keyFrames = [];
        
        
        
        for(i = 0; i < contentToJSON.length; i++){
            key = str + i;
            console.log("aaaaaa");
            console.log(contentToJSON[i][key]);
            var model = contentToJSON[i][key];
            keyFrames.push(model);
        }
    }  
}

function initializeColors(){
    for(i = 0 ; i <= 3; i++)
        headColors.push(vec4(0.0, 0.0, 0.0, 1.0));
    headColors.push(vec4(0.8, 0.37, 0.07, 1.0));

    for(i = 0; i <= 5; i++)
        headColors.push(vec4(0.4, 0.28, 0.28, 1.0));
    for(i = 0; i <= 9; i++)
        headColors.push(vec4(0.8, 0.37, 0.07, 1.0));
    for(i = 0; i <= 9; i++)
        headColors.push(vec4(0.8, 0.78, 0.76, 1.0));
    for(i = 0; i <= 7; i++)
        headColors.push(vec4(0.8, 0.37, 0.07, 1.0));
    for(i = 0; i <= 2; i++)
        headColors.push(vec4(0.4, 0.28, 0.28, 1.0));

    
    noseColors.push(vec4(0.8, 0.78, 0.76, 1.0));
    noseColors.push(vec4(0.8, 0.37, 0.07, 1.0));
    noseColors.push(vec4(0.8, 0.37, 0.07, 1.0));
    noseColors.push(vec4(0.8, 0.78, 0.76, 1.0));
    
    noseTipColors.push(vec4(0.6, 0.6, 0.6, 1.0));
    noseTipColors.push(vec4(0.0, 0.0, 0.0, 1.0));
    noseTipColors.push(vec4(0.0, 0.0, 0.0, 1.0));
    
    leftEarColors.push(vec4(0.7, 0.58, 0.4, 1.0));
    leftEarColors.push(vec4(0.7, 0.39, 0.1, 1.0));
    leftEarColors.push(vec4(0.6, 0.29, 0.07, 1.0));
    
    rightEarColors.push(vec4(0.64, 0.52, 0.36, 1.0));
    rightEarColors.push(vec4(0.64, 0.35, 0.04, 1.0));
    rightEarColors.push(vec4(0.54, 0.25, 0.03, 1.0));
    
    mouthColors.push(vec4(0.8, 0.78, 0.76, 1.0));
    mouthColors.push(vec4(0.8, 0.78, 0.76, 1.0));
    mouthColors.push(vec4(0.8, 0.37, 0.07, 1.0));

    for(i = 0 ; i <= 3; i++)
        torsoLowerColors.push(vec4(0.0, 0.0, 0.0, 1.0));
    torsoLowerColors.push(vec4(0.8, 0.37, 0.07, 1.0));

    for(i = 0; i <= 7; i++)
        torsoLowerColors.push(vec4(0.8, 0.37, 0.07, 1.0));
    for(i = 0; i <= 19; i++)
        torsoLowerColors.push(vec4(0.8, 0.78, 0.76, 1.0));
    for(i = 0; i <= 11; i++)
        torsoLowerColors.push(vec4(0.8, 0.37, 0.07, 1.0));
    
    for(i = 0; i < 4; i++)
        torsoUpperColors.push(vec4(0.8, 0.37, 0.07, 1.0));
    
    neckColors.push(vec4(0.8, 0.37, 0.07, 1.0));
    neckColors.push(vec4(0.8, 0.78, 0.76, 1.0));
    neckColors.push(vec4(0.8, 0.78, 0.76, 1.0));
    neckColors.push(vec4(0.8, 0.37, 0.07, 1.0));
        
    
    frontUpperLegColors.push(vec4(0.8, 0.37, 0.07, 1.0));
    frontUpperLegColors.push(vec4(0.8, 0.78, 0.76, 1.0));
    frontUpperLegColors.push(vec4(0.8, 0.37, 0.07, 1.0));
    frontUpperLegColors.push(vec4(0.43, 0.3, 0.17, 1.0));

    rearUpperLegColors.push(vec4(0.43, 0.3, 0.17, 1.0));
    rearUpperLegColors.push(vec4(0.8, 0.37, 0.07, 1.0));
    rearUpperLegColors.push(vec4(0.8, 0.37, 0.07, 1.0));
    
    frontLowerLegColors.push(vec4(0.8, 0.37, 0.07, 1.0));
    frontLowerLegColors.push(vec4(0.8, 0.37, 0.07, 1.0));
    frontLowerLegColors.push(vec4(0.43, 0.3, 0.17, 1.0));
    frontLowerLegColors.push(vec4(0.8, 0.37, 0.07, 1.0));
    
    rearLowerLegColors.push(vec4(0.8, 0.37, 0.07, 1.0));
    rearLowerLegColors.push(vec4(0.43, 0.3, 0.17, 1.0));
    rearLowerLegColors.push(vec4(0.43, 0.3, 0.17, 1.0));
    rearLowerLegColors.push(vec4(0.8, 0.37, 0.07, 1.0));
    
    frontPawColors.push(vec4(0.0, 0.0, 0.0, 1.0));
    frontPawColors.push(vec4(0.8, 0.37, 0.07, 1.0));
    frontPawColors.push(vec4(0.8, 0.37, 0.07, 1.0));
    
    rearPawColors.push(vec4(0.0, 0.0, 0.0, 1.0));
    rearPawColors.push(vec4(0.8, 0.37, 0.07, 1.0));
    rearPawColors.push(vec4(0.8, 0.37, 0.07, 1.0));
    
    for(i = 0 ; i <= 3; i++)
        tailBaseColors.push(vec4(0.0, 0.0, 0.0, 1.0));
    tailBaseColors.push(vec4(0.43, 0.3, 0.17, 1.0));
    for(i = 0; i <= 9; i++)
        tailBaseColors.push(vec4(0.43, 0.3, 0.17, 1.0));

    for(i = 0; i <= 9; i++)
        tailBaseColors.push(vec4(0.8, 0.37, 0.07, 1.0));
    for(i = 0; i <= 9; i++)
        tailBaseColors.push(vec4(0.8, 0.37, 0.07, 1.0));
    for(i = 0; i <= 9; i++)
        tailBaseColors.push(vec4(0.43, 0.3, 0.17, 1.0));

    for(i = 0 ; i <= 3; i++)
        tailBodyColors.push(vec4(0.0, 0.0, 0.0, 1.0));
    tailBodyColors.push(vec4(0.43, 0.3, 0.17, 1.0));
    for(i = 0; i <= 9; i++)
        tailBodyColors.push(vec4(0.43, 0.3, 0.17, 1.0));
    for(i = 0; i <= 9; i++)
        tailBodyColors.push(vec4(0.8, 0.37, 0.07, 1.0));
    for(i = 0; i <= 7; i++)
        tailBodyColors.push(vec4(0.8, 0.37, 0.07, 1.0));
    for(i = 0; i <= 11; i++)
        tailBodyColors.push(vec4(0.43, 0.3, 0.17, 1.0));
    
    for(i = 0 ; i <= 3; i++)
        tailTipColors.push(vec4(0.0, 0.0, 0.0, 1.0));
    tailTipColors.push(vec4(0.43, 0.3, 0.17, 1.0));
    for(i = 0; i <= 9; i++)
        tailTipColors.push(vec4(0.43, 0.3, 0.17, 1.0));
    for(i = 0; i <= 9; i++)
        tailTipColors.push(vec4(0.8, 0.37, 0.07, 1.0));
    for(i = 0; i <= 7; i++)
        tailTipColors.push(vec4(0.8, 0.37, 0.07, 1.0));
    for(i = 0; i <= 11; i++)
        tailTipColors.push(vec4(0.43, 0.3, 0.17, 1.0));
    
    tailTipTipColors.push(vec4(0.43, 0.3, 0.17, 1.0));
    tailTipTipColors.push(vec4(0.85, 0.7, 0.7, 1.0));
    tailTipTipColors.push(vec4(0.75, 0.42, 0.12, 1.0));
}