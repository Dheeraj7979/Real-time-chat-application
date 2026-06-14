import { Router } from "express";
import { emailVerification, Login, sendOtp } from "../controllers/auth.controllers.js";
import multer from "multer";

const AuthRouter = Router()

const upload = multer()

AuthRouter.get('/getotp',upload.none(),sendOtp)
AuthRouter.post('/getotp',upload.none(),sendOtp)
AuthRouter.post('/Register',upload.none(),emailVerification)
AuthRouter.post('/login',upload.none(),Login)


export {AuthRouter}