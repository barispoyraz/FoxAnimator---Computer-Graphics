var flag = true;
function keyFrame(aModel)
{
    this.model = copyModel(aModel);
}

//
function easeInOut(model, keyFrame1, keyFrame2, framenum, inbetweenerCount)
{
    if(framenum <= inbetweenerCount)
    {
        var t1 = framenum/inbetweenerCount;
        var y2 = t1*t1/(2.0 * (t1*t1-t1)+ 1.0);
        var t2 = (framenum-1)/inbetweenerCount;
        var y1 = (t2*t2/(2.0 * (t2*t2-t2)+ 1.0))
        var transformationVal = y1 - y2;
        var k1T;
        var k2T;
        var m;


        for(i = 0; i < 19; i++){
            for(j = 0; j <= 8; j++){
                switch(j){
                    case 0:
                        k1T = keyFrame1.model.root.posX;
                        k2T = keyFrame2.model.root.posX;
                        break;
                    case 1:
                        k1T = keyFrame1.model.root.posY;
                        k2T = keyFrame2.model.root.posY;
                        break;        
                    case 2:
                        k1T = keyFrame1.model.limbs[i].posZ;
                        k2T = keyFrame2.model.limbs[i].posZ;
                        break;        
                    case 3:
                        k1T = keyFrame1.model.limbs[i].rotX;
                        k2T = keyFrame2.model.limbs[i].rotX;
                        break;      
                    case 4:
                        k1T = keyFrame1.model.limbs[i].rotY;
                        k2T = keyFrame2.model.limbs[i].rotY;
                        break;   
                    case 5:
                        k1T = keyFrame1.model.limbs[i].rotZ;
                        k2T = keyFrame2.model.limbs[i].rotZ;
                        break;      
                    case 6:
                        k1T = keyFrame1.model.root.scaX;
                        k2T = keyFrame2.model.root.scaX;
                        break;    
                    case 7:
                        k1T = keyFrame1.model.root.scaY;
                        k2T = keyFrame2.model.root.scaY;
                        break;    
                    case 8:
                        k1T = keyFrame1.model.limbs[i].scaZ;
                        k2T = keyFrame2.model.limbs[i].scaZ;
                        break;
                }
                

                if( k1T != k2T)
                {

                    switch(j)
                    {
                        case 0:
                        break;
                        case 1:
                        break;
                        case 6:
                            /*m = model.limbs[i].transform;
                            console.log("aaaaaaaa");
                            var scaleConst = (k2T-k1T) * transformationVal;
                            console.log("scaleconst : " + scaleConst);
                            m = mult(m, scale4(2, 2, 1));
                            model.limbs[i].transform = m;

                            model.limbs[i].scaX = scaleConst;
                            model.limbs[i].scaY = scaleConst;*/
                            break;
                        case 7:
                            /*m = model.root.transform;
                            console.log(transformationVal);
                            var scaleConst = (k2T/k1T) * transformationVal ;
                            console.log("scaleconst : " + scaleConst);
                            m = mult(m, scale4(scaleConst, scaleConst, 1));
                            model.root.transform = m;

                            model.root.scaX = scaleConst;
                            model.root.scaY = scaleConst;*/

                        break;

                        default:
                            m = model.limbs[i].transform;
                            m = mult(m, translate( model.limbs[i].posX, model.limbs[i].posY, 0))
                            m = mult (m, rotate(transformationVal * (k2T- k1T), 0, 0, 1)); 
                            model.limbs[i].transform =  mult(m, translate( -model.limbs[i].posX, -model.limbs[i].posY, 0))
                       
                            
                            console.log(model.limbs[i].posX + ", " + model.limbs[i].posY);
        
                            model.limbs[i].rotZ = transformationVal * (k2T- k1T);
                        break;
                    }
                }
            }    
        }

        k1Tx = keyFrame1.model.root.posX;
        k2Tx = keyFrame2.model.root.posX;
        
        k1Ty = keyFrame1.model.root.posY;
        k2Ty = keyFrame2.model.root.posY;
        
        k1S = keyFrame1.model.root.scaX;
        k2S = keyFrame2.model.root.scaX;
         
        //console.log(transformationVal);
        if(k1Tx != k2Tx || k1Ty != k2Ty)
        {
            
            console.log("aa");
            var m = model.root.transform;
            model.root.transform = mult(m, translate((k2Tx - k1Tx) * - transformationVal, (k2Ty - k1Ty) * - transformationVal, 0));
        
            model.root.posX =(k2T - k1T) * transformationVal;
            model.root.posY = (k2Ty - k1Ty) * transformationVal;
        }

        if(k1S != k2S && flag)
        {
            m = model.root.transform;
            console.log(transformationVal);
            var scaleConst = (k2S-k1S);
            console.log("scaleconst : " + scaleConst);
            m = mult(m, scale4(k2S, k2S, 1));
            model.root.transform = m;

            model.root.scaX = scaleConst;
            model.root.scaY = scaleConst;
            flag = false; 
        }

        if (y2 == 1)
        {
            flag = true;
        }
        
    }
}