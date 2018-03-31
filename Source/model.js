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

function copyLimb(aLimb){
    var rtn;

    var cT = new transformValues(aLimb.posX, aLimb.posY,
    aLimb.posZ,aLimb.rotX,aLimb.rotY,aLimb.rotZ,
    aLimb.scaX,aLimb.scaY,aLimb.scaZ);
    var i = 0;
    var children = [];
 
   
    while(aLimb.children[i] != null)
    {
        child = copyLimb(aLimb.children[i]);
        children[i] = child;
        i++;
    }
  
    rtn = new limb(aLimb.transform, cT, aLimb.renderMethod, children);

    return rtn;
}

function model(transform, transformVal, rootLimb, limbs)
{

    this.root = new limb (transform, transformVal, null, rootLimb);

    this.torso =  rootLimb;
    this.limbs = limbs;
    
}

function copyModel(aModel){
    var rtn;
    var i =0;
    
    var cT = new transformValues(aModel.root.getTransform(0), aModel.root.getTransform(1),
    aModel.root.getTransform(2),aModel.root.getTransform(3),aModel.root.getTransform(4),aModel.root.getTransform(5),
    aModel.root.getTransform(6),aModel.root.getTransform(7),aModel.root.getTransform(8));


    var root = new limb(aModel.root.transform, cT, null, aModel.root.children[0]);

    //var torso = copyLimb(aModel.rootLimb);

    var limbs = [];

    while (aModel.limbs[i] != null)
    {   
        limbs[i] = copyLimb(aModel.limbs[i]);
        i++;
    }

    rtn = new model(aModel.transform, cT, root, limbs);

    return rtn;

}

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
    while (root.children[i] != null )
    {
        traverseModel(root.children[i]);
        i--;
    } 

    modelViewMatrix = stack.pop();
}