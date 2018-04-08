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
                        k1T = keyFrame1.model.limbs[i].scaX;
                        k2T = keyFrame2.model.limbs[i].scaX;
                        break;    
                    case 7:
                        k1T = keyFrame1.model.limbs[i].scaY;
                        k2T = keyFrame2.model.limbs[i].scaY;
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
                        case 7:
                            /*m = model.limbs[i].transform;
                            var scaleConst = (-k2T+k1T) / transformationVal;
                            m = mult(m, scale4(scaleConst, scaleConst , 1));
                            model.limbs[i].transform = m;

                            model.limbs[i].scaX = scaleConst;
                            //console.log(model.limbs[i].scaX);
                            model.limbs[i].scaY = scaleConst;*/

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

        k1T = keyFrame1.model.root.posX;
        k2T = keyFrame2.model.root.posX;
        
        k1Ty = keyFrame1.model.root.posY;
        k2Ty = keyFrame2.model.root.posY;
        
        k1Sx = keyFrame1.model.root.scaX;
        k2Sx = keyFrame1.model.root.scaX;
        
        k1Sy = keyFrame1.model.root.scaY;
        k2Sy = keyFrame1.model.root.scaY;
        
        //console.log(transformationVal);
        if(k1T != k2T || k1Ty != k2Ty)
        {

            var m = torso.transform;
    m = mult(m, scale4(scaleRate,  scaleRate, 1));
            
            
            var m = model.root.transform;
            console.log(m);
            model.root.transform = mult(m, translate((k2T - k1T) * - transformationVal, (k2Ty - k1Ty) * - transformationVal, 0));
            
            //model.root.transform = mult(model.root.transform, scale4((k2Sx - k1Sx) / model.root.scaX, (k2Sy- k1Sy) / model.root.scaY, 0));
            
    
            model.root.posX =(k2T - k1T) * transformationVal;
            model.root.posY = (k2Ty - k1Ty) * transformationVal;
            //model.root.scaX = (k2Sx - k1Sx);
            //model.root.scaY = (k2Sy - k1Sy);
            console.log(model.root.posX);//NAN GELİYOR AMA NEDEN ???
        }
        
    }
}