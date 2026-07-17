import { Router } from "express";
import { authmiddleware } from "../middleware/auth.middleware.js";
import { checkIsOnline, fetchPastMessages } from "../controllers/rooms.controller.js";
const RoomsRouter = Router()

RoomsRouter.route('/past-messages').get(authmiddleware,fetchPastMessages)
RoomsRouter.route('/isonline').get(authmiddleware,checkIsOnline)

export default RoomsRouter