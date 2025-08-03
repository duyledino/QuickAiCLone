import express from 'express'
import { auth, userAuth } from '../middleware/auth.js';
import { getCommunity, getCreationsById, getUserInfo, LikeCreation, paymentResult, paymentStatus, upgradePlan } from '../controller/userCreation.js';
import { requireAuth } from '@clerk/express';

const router = express.Router();

const userRoute = (app)=>{
    //optional : can use requireAuth in @clerk/express for check authentication
    router.get('/user_info',userAuth,getUserInfo);
    router.get('/user_creation',userAuth,getCreationsById); 
    router.get('/community',getCommunity); 
    router.post('/likeCreation',userAuth,LikeCreation);
    router.post('/upgradePlan',userAuth,upgradePlan);
    router.get('/payment_result',paymentResult);
    router.get('/payment_status',paymentStatus);
    return app.use("/api/v1/user",router);
}

export default userRoute;