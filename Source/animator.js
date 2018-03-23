/*
Author:Alper Şahıstan
ID: 21501207
CS465 Assignment 2 - Simple Animator
*/

/*BARIŞA NOTLAR:
Hocam eline sağlık iyi olmuş,
bir iki değişiklik yaptım düzenli olsun diye
senin fox objesini kaldırdım yerine limb objesine bir kaç property ekledim,
hepsini transformValues diye obje verince kendi atıyor içine. Sonrasında kodda yapman gereken limb_adı.rotX = 90
falan demek o direkt modelin(MVC) açısını 90 yapıyor(aman dikkat model çizdiğimiz fox değil mvc mannerdaaki model)
pos rot ve sca tutuyor limb artık. Eğer sliderlarla işin olursa tailBase change kısmında yaptığım gibi yap çalışması lazım. 
Real-time hareket işini çözdük zaten.
Dikkatli ol eğer limb construct ederken önce transformValues objesi yaratıp onun initial pozisyonlarını, açılarını, oranlarını veriyosun.
Sonra bu objeyi limbe veriyosun 2. parametre olarak. Zaten init fonksiyonunun içinde limbleri koyduğumuz yerde yaptım örneği var bulabilirsin.
Fakat orda herşeye 0 verdim. O 0ları düzelt eğer sliderlarda o limble iş yapacaksan.
NASI DÜZELTİLİR:
-Draw_limbAdı_ Methodunun decalare edildiği yere git.
-Orda yaptığımız transformationlara bak.
-Scaling hariç hepsini posx, posy, poz, rotx, roty, rotz, scax, scay, scaz sıraysıyla transformValues objesine yaz.
-Eğer slider işi yapmıyorsan zaten bu değerlere ihtiyacın olmamalı.
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
var mouthSlider = document.getElementById("mouth_rotation");
var changed = false;
var countUpClose = 0;
var countUpOpen = 0;

var moveBodyinXaxis = document.getElementById("foxMovementinXaxis");
var moveBodyToInXaxis = 0;

var moveBodyinYaxis = document.getElementById("foxMovementinYaxis");

var rotateTailBaseValue = 0;

//Positions
/*var foxPosition = { 
    currentPosition: {
        x: 0.0,
        y: -0.5,
        z: 0.0
    },
    tail: {
        //Tail üzerinde deneme
        tailBasePosition:{
            initPos:{
                x: 4,
                y: 0.7,
                z: 0.0
            },
            x: 4,
            y: 0.7,
            z: 0.0
        },
        tailBodyPosition:{
            initPos:{
                x: 5.4,
                y: 0.7,
                z: 0.0
            },
            x: 5.4,
            y: 0.7,
            z: 0.0
        },
        tailTipPosition:{
            initPos:{
                x: 10,
                y: 11,
                z: 12
            },
            x: 7,
            y: 8,
            z: 9
        }
    }
};*/

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

function transformValues(posx, posy, posz, thetax, thetay, thetaz, scalex, scaley, scalez)
{
    this.posx = posx;
    this.posy = posy;
    this.posz = posz;
    
    this.thetax = thetax;
    this.thetay = thetay;
    this.thetaz = thetaz;

    this.scalex = scalex;
    this.scaley = scaley;
    this.scaleyz = scalez;
}

/*limb object holds 
*a transform matrix called transform,
*a transformValues object for slider control and individual transform values
*a render/draw method
*a list of its childen
*/
function limb(transform, transformVal, renderMethod, children)
{  
    this.transform = transform;
    this.posX = transformVal.posx;
    this.posY = transformVal.posy;
    this.posZ = transformVal.posz; 

    this.rotX = transformVal.thetax;
    this.rotY = transformVal.thetay;
    this.rotZ = transformVal.thetaz;

    this.scaX = transformVal.scalex;
    this.scaY = transformVal.scaley;
    this.scaZ = transformVal.scaleyz;

    this.draw = renderMethod;
    this.children =[];
    for (i = 3; i < children != null && i< arguments.length; i++)
        this.children.push(arguments[i]);
}



function traverseModel(root)
{
    stack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, root.transform);
    root.draw();

    var i = 0;
    while (root.children[i] != null)
    {
        traverseModel(root.children[i]);
        i++;
    } 

    modelViewMatrix = stack.pop();
}

//-------Render Functions--------

//----PRIMITIVES-----
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

//-----RENDER METHODS FOR BODY PARTS-----

//---Forms the Torso---
function drawTorso()
{
    //SIKINTI VARSA BURAYA BAK!
    instanceMatrix = scale4(6, 1.9, 0);
    drawrectangle(instanceMatrix);
    
    //console.log(torso.transformVal.y);
    instanceMatrix = scale4(6, 1.9, 0);
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
    instanceMatrix = translate(4, 0.7, 0);
    instanceMatrix = mult(instanceMatrix, rotate(rotateTailBaseValue, 0, 0, 1));
    instanceMatrix = mult(instanceMatrix, scale4(3, 0.95, 0));
    drawEllipsoid(instanceMatrix);
}

//---Form the Tail Body---
function drawTailBody()
{
    instanceMatrix = translate(5.4, 0.7, 0.0);  
    instanceMatrix = mult(instanceMatrix, scale4(3, 1.10, 0))
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
    
    //REFERENCE: https://www.w3schools.com/jsreF/prop_range_max.asp
    moveBodyinXaxis.min = -24.5;
    moveBodyinXaxis.max = 21.1;
    
    //REFERENCE: https://www.w3schools.com/jsreF/prop_range_max.asp
    moveBodyinYaxis.min = -9.8;
    moveBodyinYaxis.max = 10;
    
    mouthSlider.max = 0.9;
       
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
    
    m = mat4();
    
    var neckT = new transformValues (0,0,0,0,0,0,1,1,0); 
    neck = new limb(m, neckT, drawNeck, null);
    
    var leftFrontPawT = new transformValues (0,0,0,0,0,0,1,1,0); 
    leftFrontPaw = new limb(m, leftFrontPawT, drawFrontPaws, null);
    var rightFrontPawT = new transformValues (0,0,0,0,0,0,1,1,0);
    rightFrontPaw = new limb(m, rightFrontPawT, drawFrontPaws, null);
    
    var leftFrontLowerLegT = new transformValues (0,0,0,0,0,0,1,1,0);
    leftFrontLowerLeg = new limb(m, leftFrontLowerLegT, drawFrontLowerLeg, leftFrontPaw);
    var rightFrontLowerLegT = new transformValues (0,0,0,0,0,0,1,1,0); 
    rightFrontLowerLeg = new limb(m, rightFrontLowerLegT, drawFrontLowerLeg, rightFrontPaw);
    
    var leftFrontUpperLegT = new transformValues (0,0,0,0,0,0,1,1,0); 
    leftFrontUpperLeg = new limb(m, leftFrontUpperLegT, drawFrontUpperLeg, leftFrontLowerLeg);
    var rightFrontUpperLegT = new transformValues (0,0,0,0,0,0,1,1,0); 
    rightFrontUpperLeg = new limb(m, rightFrontUpperLegT, drawFrontUpperLeg, rightFrontLowerLeg);
    
    var leftRearPawT = new transformValues (0,0,0,0,0,0,1,1,0); 
    leftRearPaw = new limb(m, leftRearPawT, drawRearPaws, null);
    var rightRearPawT = new transformValues (0,0,0,0,0,0,1,1,0); 
    rightRearPaw = new limb(m, rightRearPawT, drawRearPaws, null);

    var leftRearLowerLegT = new transformValues (0,0,0,0,0,0,1,1,0); 
    leftRearLowerLeg = new limb(m, leftRearLowerLegT, drawRearLowerLeg, leftRearPaw);
    var rightRearLowerLegT = new transformValues (0,0,0,0,0,0,1,1,0); 
    rightRearLowerLeg = new limb(m, rightRearLowerLegT, drawRearLowerLeg, rightRearPaw);
    
    var leftRearUpperLegT = new transformValues (0,0,0,0,0,0,1,1,0); 
    leftRearUpperLeg = new limb(m, leftRearUpperLegT, drawRearUpperLeg, leftRearLowerLeg);
    var rightRearLowerLegT = new transformValues (0,0,0,0,0,0,1,1,0); 
    rightRearUpperLeg = new limb(m, rightRearLowerLegT, drawRearUpperLeg, rightRearLowerLeg);

    var tailTipT= new transformValues (0,0,0,0,0,0,1,1,0); 
    tailTip = new limb(m, tailTipT, drawTailTip, null);
    var tailBodyT = new transformValues (0,0,0,0,0,0,1,1,0); 
    tailBody = new limb(m, tailBodyT, drawTailBody, tailTip);
    var tailBaseT = new transformValues (4,0.7,0,0,0,0,1,1,0); 
    tailBase = new limb(m, tailBaseT, drawTailBase, tailBody);
    
    var mouthT = new transformValues (0,0,0,0,0,0,1,1,0); 
    mouth = new limb(m, mouthT, drawMouth, null);

    var headT = new transformValues (0,0,0,0,0,0,1,1,0); 
    head = new limb(m, headT, drawHead, mouth);

    torsoT = new transformValues (0,0,0,0,0,0,1,1,0); 
    torso = new limb(m, torsoT, drawTorso, neck, leftFrontUpperLeg, leftRearUpperLeg, rightFrontUpperLeg, rightRearUpperLeg, tailBase, head);
    
    mapHTMLElementsToEventListeners();

    render();
}
var m = mat4();

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );
    
    if(choosenOption === 1 && changed === true){
        var m = mouth.transform;
        if(countUpClose <= 0.9){
            countUpClose += 0.01;
            m = mult(m, translate(mouth.posX - 0.1, mouth.posY, mouth.posZ));
            m = mult(m, rotate(-0.01, 0, 0 ,1));
            m = mult(m, translate(mouth.posX + 0.1, mouth.posY, mouth.posZ));
            mouth.transform = m;
        }
        else{
            changed = false;
            countUpClose = 0;
        }
    }
    else if(choosenOption === 0 && changed === true){
        var m = mouth.transform;
        if(countUpOpen <= 0.9){
            console.log("aaa111");
            countUpOpen += 0.01;
            m = mult(m, translate(mouth.posX - 0.1, mouth.posY, mouth.posZ));
            m = mult(m, rotate(0.01, 0, 0 ,1));
            m = mult(m, translate(mouth.posX + 0.1, mouth.posY, mouth.posZ));
            mouth.transform = m;
        }
        else{
            changed = false;
            countUpOpen = 0;
        }
    }
    
    //Move the fox
    //m = mult(m, translate(foxPosition.currentPosition.x, foxPosition.currentPosition.y, foxPosition.currentPosition.z));
    //foxPosition.currentPositon.x = foxPosition.currentPositon.x + difference;
    
    
    //m = mult(m, translate(foxPosition.currentPositon.x, foxPosition.currentPositon.y, foxPosition.currentPositon.z));
            
    
    //m  = mat4();
    //m= rotate(theta, 0,0,1);
    

    traverseModel(torso);
    //theta +=0.2;

    //modelViewMatrix = mat4();

    requestAnimFrame(render);
}

function mapHTMLElementsToEventListeners(){
    
    mouthMovementOption.addEventListener("change", function(){
        var index = mouthMovementOption.selectedIndex; //0: Open Mouth, 1: Close Mouth
        choosenOption = index;
        
        //Open Mouth
        if(choosenOption === 0){
            changed = true;
            //var m = mouth.transform;
            //m = mult(m, rotate(-10, 0, 0, 1));
            
            //mouth.transform = m;
            
            //console.log("bb");
        }
        else{
            changed = true;
            mouthMovement = 0;
            //mouthSlider.value = 0;
            //mouthRotation(0);    
            
            //while(mouthSlider.value != 0.9){
            //    mouthRotation(mouthSlider.value);
            //    mouthSlider.value = mouthSlider.value + 0.1;
            //    console.log("aa: "  + mouthSlider.value);
            //}
            
            /*var m = mouth.transform;
            mouthMovement = 0;
            while(mouthMovement <= 0.9){
                console.log("bbbc")
                m = mult(m, translate(mouth.posX - 0.1, mouth.posY, mouth.posZ));
                m = mult(m, rotate(mouthMovement, 0, 0 ,1));
                m = mult(m, translate(mouth.posX + 0.1, mouth.posY, mouth.posZ));
                mouthMovement+=0.01;
                mouth.transform = m;
                traverseModel(mouth);
            }*/
            
            
            /*console.log("1111");
            
            var m = mouth.transform;
            while(mouthMovement >= -0.850){
                console.log("222");
                m = mult(m, rotate(mouthMovement, 0, 0, 1));
                mouthMovement-=0.01;
                mouth.transform = m;
                //traverseModel(mouth);*/
            //}
            
            
            /*var m = mouth.transform;
            m = mult(m, translate(mouth.posX, mouth.posY+0.2, mouth.posZ));
            
            mouth.transform = m;
            console.log("aa");*/
        }
        
        /*var headRotation = head.rotZ - value;
        head.rotZ = value;
    
        var m = head.transform;
        m = mult(m, translate(head.posX - 2.6, head.posY + 0.1, head.posZ));
    
        m = mult(m, rotate(headRotation, 0, 0, 1));
        m = mult(m, translate(-head.posX + 2.6, -head.posY - 0.1, -head.posZ));
     
        head.transform = m;
    
        //console.log("VALUE is: " + value);
    */
        //traverseModel(mouth);
        
    });
    
    
    /*moveBodyinXaxis.addEventListener("change", function(){
        moveBodyToInXaxis = parseInt(moveBodyinXaxis.value);
    });*/
    
}

//REFERENCE: https://stackoverflow.com/questions/31344723/onchanged-event-get-value-prior-to-changing-in-html-input-tag-type-range
function translateX(value){

    differenceInX =  torso.posX - value;
    torso.posX = value;
    
    var m = torso.transform;
    m = mult(m, translate(-differenceInX,  -differenceInY, torso.posZ));

    torso.transform = m;
    differenceInX = 0;
    //traverseModel(torso);
}

//REFERENCE: https://stackoverflow.com/questions/31344723/onchanged-event-get-value-prior-to-changing-in-html-input-tag-type-range
function translateY(value){
    differenceInY =  torso.posY - value;
    torso.posY = value;
    
    var m = torso.transform;
    m = mult(m, translate(-differenceInX, - differenceInY, torso.posZ));

    torso.transform = m;
    differenceInY = 0;
    //traverseModel(torso);
}

function tailBaseChange(value){

    var rot = (tailBase.rotZ - value); 
    tailBase.rotZ = (value);

    var m = tailBase.transform;
    m = mult(m, translate(tailBase.posX - 1,
            tailBase.posY + 0.1,
            tailBase.posZ));
    m = mult(m, rotate(rot, 0,0,1));
    m = mult(m, translate(-tailBase.posX + 1,
        -tailBase.posY - 0.1,
        -tailBase.posZ));
    tailBase.transform = m;

    traverseModel(tailBase);    
}

function headRotation(value){
    var headRotation = head.rotZ - value;
    head.rotZ = value;
    
    var m = head.transform;
    m = mult(m, translate(head.posX - 2.6, head.posY + 0.1, head.posZ));
    
    m = mult(m, rotate(headRotation, 0, 0, 1));
    m = mult(m, translate(-head.posX + 2.6, -head.posY - 0.1, -head.posZ));
    
    head.transform = m;
    
    //console.log("VALUE is: " + value);
    
    traverseModel(head);
}

function mouthRotation(value){
    var mouthRotation = mouth.rotZ - value;
    mouth.rotZ = value;
    
    var m = mouth.transform;
    m = mult(m, translate(mouth.posX - 0.1, mouth.posY, mouth.posZ));
    m = mult(m, rotate(mouthRotation, 0, 0 ,1));
    
    m = mult(m, translate(mouth.posX + 0.1, mouth.posY, mouth.posZ));
    
    mouth.transform = m;
    
    console.log("Mouth rotation value is: " + value);
    
    traverseModel(mouth);
}

function legsRotation(value){
    var legsRotation = leftFrontLowerLeg.rotZ - value;
    leftFrontLowerLeg.rotZ = value;
    
    var m = leftFrontLowerLeg.transform;
    m = mult(m, translate(leftFrontLowerLeg.posX - 3, leftFrontLowerLeg.posY, leftFrontLowerLeg.posZ));
    m = mult(m, rotate(mouthRotation, 0, 0 ,1));
    
    m = mult(m, translate(leftFrontLowerLeg.posX + 3, leftFrontLowerLeg.posY, leftFrontLowerLeg.posZ));
    
    leftFrontLowerLeg.transform = m;
    
    console.log("Leg rotation value is: " + value);
    
    traverseModel(leftFrontLowerLeg);
}
