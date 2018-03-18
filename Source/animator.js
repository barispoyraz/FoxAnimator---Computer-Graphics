/*
Author:Alper Şahıstan
ID: 21501207
CS465 Assignment 2 - Simple Animator
*/

var gl;
var trackMouse = false;
var program;
var instanceMatrix = mat4();
var theta =10;

var movement = 0;

var mouthMovement = 0;

rectangularVertices = 
[
    vec4( -0.5, -0.5,  0, 1.0 ),
    vec4( -0.5,  0.5,  0, 1.0 ),
    vec4( 0.5,  0.5,  0, 1.0 ),
    vec4( 0.5, -0.5,  0, 1.0 ),
];

var head;
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

//HTML Elements
var mouthMovementOption = document.getElementById("a");
var choosenOption;


var moveBodyinXaxis = document.getElementById("foxMovementinXaxis");
var moveBodyToInXaxis = 0;

var moveBodyinYaxis = document.getElementById("foxMovementinYaxis");

//Positions
var foxPosition = {
    
    //prevPosition: {
    //    x: 0.0,
    //    y: -0.5,
    //    z: 0.0
    //},
    
    currentPosition: {
        x: 0.0,
        y: -0.5,
        z: 0.0
    }
};

var previousSliderValueInX = 0;
var differenceInX = 0;

var previousSliderValueInY = -0.5;
var differenceInY = 0;

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
    circularVertices.push(v2);
    for (i = 0; i < 360 ; i++)
    {
        var j = i * Math.PI/180;

        var v1 = new vec4 (0.5*Math.sin(j), 0.5*Math.cos(j),1,1);

        //var v2 = new vec4(0,0,0,0);

        circularVertices.push(v1);
        //circularVertices.push(v2);

    }
    console.log(  circularVertices.length )
    for(i = circularVertices.length-1; i >= 0; i--)
        pointsArray.push(circularVertices[i]);
    console.log(pointsArray.length);
}

function limb(transform, renderMethod, childs)
{  
    this.transform = transform;
    this.draw = renderMethod;
    this.childs =[];
    for (i = 2; i < childs != null && i< arguments.length; i++)
        this.childs.push(arguments[i]);
}



function traverseModel(root)
{
    stack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, root.transform);
    root.draw();

    var i = 0;
    while (root.childs[i] != null)
    {
        traverseModel(root.childs[i]);
        i++;
    } 

    modelViewMatrix = stack.pop();
}

//---Render Functions---

//---Forms a rectangle---
function drawrectangle(transform)
{
    instanceMatrix = mult(modelViewMatrix, transform );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4);
}

//---Forms a ellipsoid---
function drawEllipsoid(transform)
{
    instanceMatrix = mult(modelViewMatrix, transform );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.drawArrays( gl.TRIANGLE_FAN, 4, pointsArray.length-5);
}
//---Forms a right triangle ---
function drawRTriangle(transform)
{
    instanceMatrix = mult(modelViewMatrix, transform );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 3);
}

//---Forms the Torso---
function drawTorso()
{
    //SIKINTI VARSA BURAYA BAK!
    instanceMatrix = scale4(6, 1.9, 0);
    drawrectangle(instanceMatrix);

    instanceMatrix = scale4(6, 1.9, 0)
    instanceMatrix = mult(instanceMatrix, translate(0.0, -0.5, 0.0));
    drawEllipsoid(instanceMatrix);
}

//---Forms the Neck---
function drawNeck()
{
    instanceMatrix = translate(-2.6, 1.0, 0.0);
    instanceMatrix = mult(instanceMatrix, rotate(16, 0,0,1))
    instanceMatrix = mult(instanceMatrix, scale4(1.4, 2.3, 0) );
    drawrectangle(instanceMatrix);
}

//---Forms the Front Upper Legs---
function drawFrontUpperLeg()
{
    instanceMatrix = translate(-2.2, -1.4, 0.0);
    instanceMatrix = mult(instanceMatrix, rotate(50, 0,0,1))
    instanceMatrix = mult(instanceMatrix, scale4(0.6, 1.7, 0) );
    drawrectangle(instanceMatrix);
}

//---Forms the Rear Upper Legs---
function drawRearUpperLeg()
{
    instanceMatrix = translate(2.3, -1.6, 0.0);
    instanceMatrix = mult(instanceMatrix, rotate(20, 0,0,1))
    instanceMatrix = mult(instanceMatrix, scale4(-1.7, 2.7, 0) );
    drawRTriangle(instanceMatrix);
}

//---Form the Front Lower Legs---
function drawFrontLowerLeg()
{
    instanceMatrix = translate(-1.6, -2.6, 0.0);
    instanceMatrix = mult(instanceMatrix, scale4(0.5, 1.8, 0) );
    drawrectangle(instanceMatrix);
}

//---Form the Rear Lower Legs---
function drawRearLowerLeg()
{
    instanceMatrix = translate(3.4, -3.0, 0.0);
    instanceMatrix = mult(instanceMatrix, scale4(0.4, 1.6, 0) );
    drawrectangle(instanceMatrix);
}

//---Form the Front Paws---
function drawFrontPaws()
{
    instanceMatrix = translate(-2.0, -3.5, 0.0);     
    instanceMatrix = mult(instanceMatrix, rotate(90, 0,0,1));
    instanceMatrix = mult(instanceMatrix, scale4(0.5, -1.3, 0) );
    drawRTriangle(instanceMatrix);
}

//---Form the Rear Paws---
function drawRearPaws()
{
    instanceMatrix = translate(2.95, -3.7, 0.0);  
    instanceMatrix = mult(instanceMatrix, rotate(90, 0,0,1));
    instanceMatrix = mult(instanceMatrix, scale4(0.5, -1.3, 0) );
    drawRTriangle(instanceMatrix);
}

//---Form the Tail Base---
function drawTailBase()
{
    instanceMatrix = translate(4, 0.7, 0.0);  
    instanceMatrix = mult(instanceMatrix, scale4(3, 0.95, 0));
    drawEllipsoid(instanceMatrix);
}

//---Form the Tail Body---
function drawTailBody()
{
    instanceMatrix = translate(5.4, 0.7, 0.0);  
    instanceMatrix = mult(instanceMatrix, scale4(3, 1.10, 0));
    drawEllipsoid(instanceMatrix);
}

//---Form the Tail Tip---
function drawTailTip()
{
    instanceMatrix = translate(7, 0.7, 0.0);  
    instanceMatrix = mult(instanceMatrix, scale4(3, 1.15, 0));
    drawEllipsoid(instanceMatrix);

    instanceMatrix = translate(8.0, 0.7, 0.0);
    instanceMatrix = mult(instanceMatrix, scale4(2.0, 0.8, 0.0));
    instanceMatrix = mult(instanceMatrix, rotate(225, 0,0,1));
    instanceMatrix = mult(instanceMatrix, scale4(0.8, 0.8, 0.0));
    drawRTriangle(instanceMatrix);
}

//---Form the Head---
function drawHead()
{
    instanceMatrix = translate(-3.5, 1.9, 0.0);
    instanceMatrix = mult(instanceMatrix, scale4(2.7, 2.2, 0) );
    drawEllipsoid(instanceMatrix);

    instanceMatrix = translate(-4.7, 1.4, 0.0);
    instanceMatrix = mult(instanceMatrix, rotate(15, 0,0,1));
    instanceMatrix = mult(instanceMatrix, scale4(1.2, 0.7, 0.0));
    drawrectangle(instanceMatrix);

    instanceMatrix = translate(-5.46, 1.19, 0.0);
    instanceMatrix = mult(instanceMatrix, rotate(15, 0,0,1));
    instanceMatrix = mult(instanceMatrix, scale4(-0.4, 0.7, 0.0));
    drawRTriangle(instanceMatrix);

    instanceMatrix = translate(-3.1, 3.2, 0.0);
    instanceMatrix = mult(instanceMatrix, rotate(0, 0,0,1));
    instanceMatrix = mult(instanceMatrix, scale4(1.2, -1.2, 0.0));
    drawRTriangle(instanceMatrix);

    instanceMatrix = translate(-3.4, 3.2, 0.0);
    instanceMatrix = mult(instanceMatrix, rotate(0, 0,0,1));
    instanceMatrix = mult(instanceMatrix, scale4(1.2, -1.2, 0.0));
    drawRTriangle(instanceMatrix);

}

//---Form the Mouth---
function drawMouth(){
    instanceMatrix = translate(-4.4, 1.07, 0.0);  
    instanceMatrix = mult(instanceMatrix, rotate(88, 0,0,1));
    instanceMatrix = mult(instanceMatrix, scale4(0.5, -1.5, 0));
    drawRTriangle(instanceMatrix);
}

window.onload = function init(){
    var canvas = document.getElementById( "gl-canvas" );
    canvas.width = window.innerWidth;
    gl = WebGLUtils.setupWebGL( canvas );  
    
    moveBodyinXaxis.min = -24.5;
    moveBodyinXaxis.max = 21.1;
    
    moveBodyinYaxis.min = -9.8;
    moveBodyinYaxis.max = 10;
       
    if ( !gl ) { alert( "WebGL isn't available" ); 
    }
    //  Configure WebGL       
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0, 0, 0, 1 ); 
    //webglUtils.resizeCanvasToDisplaySize(gl.canvas);  
    
    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    instanceMatrix = mat4();

    projectionMatrix = ortho(-canvas.width/100, canvas.width/100, -canvas.height/100, canvas.height/100,-5.0,5.0);
    modelViewMatrix = mat4();

    //look up for Uniforms
    gl.uniformMatrix4fv(gl.getUniformLocation( program, "modelViewMatrix"), false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( gl.getUniformLocation( program, "projectionMatrix"), false, flatten(projectionMatrix) );

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix")

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

    //canvas.addEventListener("mousedown", mouseDown);

    function mouseDown(){
            theta+=2;
    }
    
    mapHTMLElementsToEventListeners();

    render();
}
var m = mat4();

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );

    m = mat4();
    neck = new limb(m, drawNeck, null);

    //m = translate(-2.2, -1.4, 0.0);
    //m= mult(m, rotate(theta, 0,0,1));
    //m = mult(m, translate(1.9, 1.0, 0.0));
    leftFrontUpperLeg = new limb(m, drawFrontUpperLeg, leftFrontLowerLeg);
    //m = mat4();
    rightFrontUpperLeg = new limb(m, drawFrontUpperLeg, rightFrontLowerLeg);
    
    leftFrontLowerLeg = new limb(m, drawFrontLowerLeg, leftFrontPaw);
    rightFrontLowerLeg = new limb(m, drawFrontLowerLeg, rightFrontPaw);

    leftRearUpperLeg = new limb(m, drawRearUpperLeg, leftRearLowerLeg);
    rightRearUpperLeg = new limb(m, drawRearUpperLeg, rightRearLowerLeg);

    leftRearLowerLeg = new limb(m, drawRearLowerLeg, leftRearPaw);
    rightRearLowerLeg = new limb(m, drawRearLowerLeg, rightRearPaw);

    
    leftFrontPaw = new limb(m, drawFrontPaws, null);
    rightFrontPaw = new limb(m, drawFrontPaws, null);
    
    leftRearPaw = new limb(m, drawRearPaws, null);
    rightRearPaw = new limb(m, drawRearPaws, null);

    tailBase = new limb(m, drawTailBase, tailBody);
    tailBody = new limb(m, drawTailBody, tailTip);
    tailTip = new limb(m, drawTailTip, null);
    
    
    m = mat4();
    
    /*switch(choosenOption){
        case 0:
            
            break;
        case 1:
            if(mouthMovement <= -0.850 )
                choosenOption = 2;
            m = mult(m, rotate(mouthMovement, 0, 0, 1));
            mouthMovement-=0.01;
            break;
            
        case 2:
            mouthMovement = 0;
            break;
    }*/
    
    
    
    mouth = new limb(m, drawMouth, null);
       
    
    m = mat4();
    
    //m= rotate(theta, 0,0,1);
    head = new limb(m, drawHead, mouth);
    //m = mult(m, rotate(theta, 0,0,1))
    //m= rotate(theta, 0,0,1);
    
    //Move the fox
    m = mult(m, translate(foxPosition.currentPosition.x, foxPosition.currentPosition.y, foxPosition.currentPosition.z));
    //foxPosition.currentPositon.x = foxPosition.currentPositon.x + difference;
    
    
    //m = mult(m, translate(foxPosition.currentPositon.x, foxPosition.currentPositon.y, foxPosition.currentPositon.z));
            
    
    /*switch(moveBodyTo){
        case -5:
            foxPosition.currentPositon.x = foxPosition.currentPositon.x + difference;
            m = mult(m, translate(foxPosition.currentPositon.x, foxPosition.currentPositon.y, foxPosition.currentPositon.z));
            break;         
        case -4:
            foxPosition.currentPositon.x = foxPosition.currentPositon.x + difference;
            m = mult(m, translate(foxPosition.currentPositon.x, foxPosition.currentPositon.y, foxPosition.currentPositon.z));
            break;         
        case -3:
            foxPosition.currentPositon.x = foxPosition.currentPositon.x + difference;
            m = mult(m, translate(foxPosition.currentPositon.x, foxPosition.currentPositon.y, foxPosition.currentPositon.z));
            break;   
        case -2:
            foxPosition.currentPositon.x = foxPosition.currentPositon.x + difference;
            m = mult(m, translate(foxPosition.currentPositon.x, foxPosition.currentPositon.y, foxPosition.currentPositon.z));
            break;
        case -1:
            foxPosition.currentPositon.x = foxPosition.currentPositon.x + difference;
            m = mult(m, translate(foxPosition.currentPositon.x, foxPosition.currentPositon.y, foxPosition.currentPositon.z));
            /*if(movement <= -9)
                movement = 10;
            m = mult(m, translate(movement, 0, 0));
            movement-=0.1;*/
            //break;
        //case 0:
        //    foxPosition.currentPositon.x = foxPosition.currentPositon.x + difference;
        //    m = mult(m, translate(foxPosition.currentPositon.x, foxPosition.currentPositon.y, foxPosition.currentPositon.z));
            /*if(movement <= -9)
                movement = 10;
            m = mult(m, translate(movement, 0, 0));
            movement-=0.2;*/
         //   break;
        /*case 1:
            foxPosition.currentPositon.x = foxPosition.currentPositon.x + difference;
            m = mult(m, translate(foxPosition.currentPositon.x, foxPosition.currentPositon.y, foxPosition.currentPositon.z));
            /*if(movement <= -9)
                movement = 10;
            m = mult(m, translate(movement, 0, 0));
            movement-=0.3;*/
            //break;
        //case 2:
        /*    foxPosition.currentPositon.x = foxPosition.currentPositon.x + difference;
            m = mult(m, translate(foxPosition.currentPositon.x, foxPosition.currentPositon.y, foxPosition.currentPositon.z));
            break;
        case 3:
            m = mult(m, translate(foxPosition.currentPositon.x, foxPosition.currentPositon.y, foxPosition.currentPositon.z));
            foxPosition.currentPositon.x = foxPosition.currentPositon.x + difference;
            break;   
        case 4:
            m = mult(m, translate(foxPosition.currentPositon.x, foxPosition.currentPositon.y, foxPosition.currentPositon.z));
            foxPosition.currentPositon.x = foxPosition.currentPositon.x + difference;
            break;   
        case 5:   
            m = mult(m, translate(foxPosition.currentPositon.x, foxPosition.currentPositon.y, foxPosition.currentPositon.z));
            foxPosition.currentPositon.x = foxPosition.currentPositon.x + difference;
            break;*/
    //}
    
    //m  = mat4();
    //m= rotate(theta, 0,0,1);
    torso = new limb(m, drawTorso, neck, leftFrontUpperLeg, leftRearUpperLeg, rightFrontUpperLeg, rightRearUpperLeg, tailBase, head);

    traverseModel(torso);
    theta +=0.2;

    //modelViewMatrix = mat4();

    requestAnimFrame(render);
}

function mapHTMLElementsToEventListeners(){
    
    mouthMovementOption.addEventListener("change", function(){
        var index = mouthMovementOption.selectedIndex; //0: Open Mouth, 1: Close Mouth
        choosenOption = index;
        
    });
    
    
    moveBodyinXaxis.addEventListener("change", function(){
        moveBodyToInXaxis = parseInt(moveBodyinXaxis.value);
    });
    
}

//REFERENCE: https://stackoverflow.com/questions/31344723/onchanged-event-get-value-prior-to-changing-in-html-input-tag-type-range
function changeAndStorePreviousValueinXaxis(value){
    //alert("current:" + value);
    //alert("previous:" + previousSliderValue);
    
    //console.log("Value is: " + value);
    
    differenceInX = value - previousSliderValueInX;
    foxPosition.currentPosition.x = foxPosition.currentPosition.x + differenceInX;
    previousSliderValueInX = value;
}

//REFERENCE: https://stackoverflow.com/questions/31344723/onchanged-event-get-value-prior-to-changing-in-html-input-tag-type-range
function changeAndStorePreviousValueinYaxis(value){
    console.log("Y value is: " + value);
    
    differenceInY = value - previousSliderValueInY;
    foxPosition.currentPosition.y = foxPosition.currentPosition.y + differenceInY;
    previousSliderValueInY = value;
    
}

