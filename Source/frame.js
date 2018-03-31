function keyFrame(model)
{
    this.model = model;
}

//
function easeInOut(model, keyFrame1, keyFrame2, framenum, inbetweenerCount)
{
    if(framenum <= inbetweenerCount)
    {
        var t1 = framenum/inbetweenerCount;
        var transformationVal = t1*t1/(2.0 * (t1*t1-t1)+ 1.0);
        var t2 = (framenum-1)/inbetweenerCount;
        transformationVal = transformationVal - (t2*t2/(2.0 * (t2*t2-t2)+ 1.0));
        var k1T;
        var k2T;
        var m;


        for(i = 0; i < 19; i++){
            for(j = 0; j <= 8; j++){
                k1T = keyFrame1.model.limbs[i].getTransform(j);
                k2T = keyFrame2.model.limbs[i].getTransform(j);

                if( k1T != k2T)
                {
                    m = model.limbs[i].transform;
                    m = mult(m, translate( model.limbs[i].posX, model.limbs[i].posY, 0))
                    m = mult (m, rotate(- transformationVal * (k2T- k1T), 0, 0, 1)); 
                    model.limbs[i].transform =  mult(m, translate( -model.limbs[i].posX, -model.limbs[i].posY, 0))
                }
            }    
        }
        
    }
}