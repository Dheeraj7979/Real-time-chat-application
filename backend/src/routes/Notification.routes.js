import { Router } from "express";
import { authmiddleware } from "../middleware/auth.middleware.js";
import { deleteNotification, fetchAllNotification } from "../controllers/notification.controller.js";


export const notificationRouter = Router()

notificationRouter.route('/all').get(authmiddleware,fetchAllNotification)
notificationRouter.route('/delete').delete(authmiddleware,deleteNotification)

