import { Router } from "express";
import { authmiddleware } from "../middleware/auth.middleware.js";
import { fetchPastMessages } from "../controllers/rooms.controller.js";
const RoomsRouter = Router()

RoomsRouter.route('/past-messages').get(authmiddleware,fetchPastMessages)


export default RoomsRouter