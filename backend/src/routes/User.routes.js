import { Router } from "express";
import { emailVerification, Login, logOut, refreshAccessToken, sendOtp, userdetails } from "../controllers/auth.controllers.js";
import multer from "multer";
import { authmiddleware } from "../middleware/auth.middleware.js";
import { fetchAllNotification } from "../controllers/notification.controller.js";

const AuthRouter = Router()
const upload = multer()

AuthRouter.get('/getotp',upload.none(),sendOtp)
AuthRouter.post('/getotp',upload.none(),sendOtp)
AuthRouter.post('/Register',upload.none(),emailVerification)
AuthRouter.post('/login',upload.none(),Login)
AuthRouter.post('/refresh-token',upload.none(),refreshAccessToken)
AuthRouter.get('/details',authmiddleware, userdetails)
AuthRouter.post('/logout',authmiddleware,logOut)

export {AuthRouter}