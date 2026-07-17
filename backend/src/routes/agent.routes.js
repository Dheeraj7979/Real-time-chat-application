import { Router } from "express";
import { authmiddleware } from "../middleware/auth.middleware.js";
import { agentController } from "../controllers/agent.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const agentRouter = Router()

agentRouter.route('/chat',upload.none()).post(authmiddleware,agentController)

export {agentRouter}