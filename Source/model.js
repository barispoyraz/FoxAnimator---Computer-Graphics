/*
* Authors:Alper Şahıstan, Barış Poyraz
* ID: 21501207, 21401952
* CS465 Assignment 2 - Hierarchical Modeling: Modeling and Animating a Quadruped Animal
* Instructor: Uğur Güdükbay
* model.js
* 
* Description: This javascript file contains the essential functions
* for our project. The functions in this file are related with
* creating, copying our model and its limbs, and also traversing our
* model. In order to have a hierarchy in the code and readability, we 
* seperated these essential functions into these javascript file.
*
*/


/*
* transformValues(posx, posy, posz, thetax, thetay, thetaz, scalex, scaley, scalez)
*
* Parameters: posx, posy, posz, thetax, thetay, thetaz, scalex, scaley, scalez
* posx stores the position value of our model and each of the limbs in the x axis 
* posy stores the position value of our model and each of the limbs in the y axis 
* posz stores the position value of our model and each of the limbs in the z axis 
* thetax stores the rotation value of our model and each of the limbs in the x axis
* thetay stores the rotation value of our model and each of the limbs in the y axis
* thetaz stores the rotation value of our model and each of the limbs in the z axis
* scalex stores the scale ratio of our model and each of the limbs in the x axis
* scaley stores the scale ratio of our model and each of the limbs in the y axis
* scalez stores the scale ratio of our model and each of the limbs in the z axis
*
* Description: This function is a parameter to our model and limbs constructor. In order
* to make things easier we seperated the values so that we create transformValues type object
* and pass that object to our model and limbs constructor.
*
*/
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
    this.scalez = scalez;
}

/*
* limb(transform, transformVal, renderMethod, children)
*
* Parameters: transform, transformVal, renderMethod, children
* transform stores a transform matrix
* transformVal stores the individual transform values and also it is used to control the sliders
* renderMethod is the draw function of the respective limb
* children stores a list of its children (they are also limb objects)
*
* Description: This function creates limb object from the given parameters.
* Initially, the transform variable is a new mat4() instance, however the main
* importance of that variable is to control the rotations, positions, scaling to
* that limb and to its children.
*
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
    this.scaZ = transformVal.scalez;

    this.draw = renderMethod;
    this.getTransform = function (i)
    {
        switch(i)
        {
            case 0:
                return this.posX;
                break;
            case 1:
                return this.posY;
                break;
            case 2:
                return this.posZ;
                break;
            case 3:
                return this.rotX;
                break;
            case 4:
                return this.rotY;
                break;
            case 5:
                return this.rotZ;
                break;
            case 6:
                return this.scaX;
                break;
            case 7:
                return this.scaY;
                break;
            case 8:
                return this.scaZ;
                break;
              
        }
    }

    this.children =[];
    for (i = 3; i < children != null && i< arguments.length; i++)
        this.children.push(arguments[i]);
}

/*
* copyLimb(aLimb)
*
* Parameters: aLimb
* aLimb is a limbs object that is to be copied by the copy constructor
*
* Description: This function is a copy constructor for the limb objects.
* This function is created in order to create keyframes by capturing the model
* and its limbs at that time. Since using the original values of the model affects the 
* general model, this function is used to make keyframes apply the changes. It takes
* all the transformationValues of the limbs object and creates its own transformValues object.
* Then recursively, it calls its children to apply the same logic. At the end, this function returns
* our copy constructed limb.
*
*/
function copyLimb(aLimb){
    var rtn;

    var cT = new transformValues(aLimb.posX, aLimb.posY,
    aLimb.posZ,aLimb.rotX,aLimb.rotY,aLimb.rotZ,
    aLimb.scaX,aLimb.scaY,aLimb.scaZ);
    var i = 0;
    var children = [];
 
   
    while(aLimb.children[i] != null && children.length>0)
    {
        var child = copyLimb(aLimb.children[i]);
        children[i] = child;
        i++;
    }
    var m = new mat4();
    //var t = mult(m, aLimb.transform);
    rtn = new limb(new mat4(), cT, aLimb.draw, children);

    return rtn;
}

/*
* model(transform, transformVal, rootLimb, limbs)
*
* Parameters:
* transform stores the transformation matrix
* transformVal contains the transformValues object of that model
* rootLimb contains the root object of the limb hierarchy, which in our case is the torso
* limbs is an array which contains all the limb objects
*
* Description: This function is the constructor for our model which in our case is the fox
* Within model, it have root and limbs, root is the limb object for the model, so that the model
* can act like a limb.
* 
*/
function model(transform, transformVal, rootLimb, limbs)
{

    this.root = new limb (transform, transformVal, null, rootLimb);

    //this.torso =  rootLimb;
    this.limbs = limbs;
    
}

/*
* copyModel(aModel)
*
* Parameters: aModel
* aModel is the model object that is to be copied within this function
*
* Description: This function is the copy constructor for the model object.
* The purpose of this function is same with the copyLimbs function. At first,
* this function creates a transformValues object by getting the values from the 
* parameter. Then, within a loop, it calls the copyLimb function in order copy
* the limbs as well. At the end, it creates a new model object but with same values 
* as in the parameter one, and it returns this model.
*
*/
function copyModel(aModel){
    var rtn;
    var i =0;
    
    var cT = new transformValues(aModel.root.posX, aModel.root.posY,
    aModel.root.posZ,aModel.root.rotX,aModel.root.rotY,aModel.root.rotZ,
    aModel.root.scaX,aModel.root.scaY,aModel.root.scaZ);


    //var torso = copyLimb(aModel.rootLimb);

    var limbs = [];

    while (aModel.limbs[i] != null)
    {   
        limbs[i] = copyLimb(aModel.limbs[i]);
        i++;
    }

    //var root = copyLimb(aModel.root);
    var  x = aModel.transform;

    rtn = new model(x, cT, limbs[3], limbs);

    return rtn;

}

/*
* traverseModel(root)
*
* Parameters: root
* root is the limb that acts like a model
*
* Description: This function traverses through the children,
* and apply the transformations to all the root's children.
* The affect on limbs depend on the parameter since,
* it calls itself and its children draw functions. Recursively, the 
* children calls themselves and their children as well.
*
*/
function traverseModel(root)
{

    stack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, root.transform);

    var i = root.children.length-1;
    while (root.children[i] != null && i >= root.children.length/2)
    {
        traverseModel(root.children[i]);
        i--;
    }
    if(root.draw!= null)
        root.draw();
    while (root.children[i] != null && root.children.length>0 )
    {
        traverseModel(root.children[i]);
        i--;
    } 

    modelViewMatrix = stack.pop();
}