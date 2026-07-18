import { Router } from "express";
import { emailVerification, googleAuth, Login, logOut, refreshAccessToken, sendOtp, uploadAvatar, userdetails } from "../controllers/auth.controllers.js";
import { upload,uploadprofile } from "../middleware/multer.middleware.js";
import { authmiddleware } from "../middleware/auth.middleware.js";
import { fetchAllNotification } from "../controllers/notification.controller.js";


const AuthRouter = Router()

AuthRouter.get('/getotp',upload.none(),sendOtp)
AuthRouter.post('/getotp',upload.none(),sendOtp)
AuthRouter.post('/Register',upload.none(),emailVerification)
AuthRouter.post('/login',upload.none(),Login)
AuthRouter.post('/refresh-token',upload.none(),refreshAccessToken)
AuthRouter.get('/details',authmiddleware, userdetails)
AuthRouter.post('/logout',authmiddleware,logOut)
AuthRouter.post('/update-avatar', uploadprofile.single('avatar'), authmiddleware,uploadAvatar)
AuthRouter.post("/google", upload.none(), googleAuth);



export {AuthRouter}