import express from 'express'
import { auth } from '../middleware/auth.js';
import { generateArticle, generateImage, removeBg, reviewResume } from '../controller/aiController.js';
import { upload } from '../config/multer.js';

const router = express.Router();

const myRoute = (app)=>{
    router.post("/article_writter",auth,generateArticle);
    router.post("/image_generator",auth,generateImage);
    router.post("/background_removal",upload.single('image'),auth,removeBg);
    router.post("/resume_reviewer",upload.single('pdf'),auth,reviewResume);
    return app.use("/api/v1/ai",router);
} 

export default myRoute;