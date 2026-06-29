import {Router} from 'express'
import { acceptRequest, cancelRequest, findUnknownUsers, friendRequest, rejectRequest, searchFriend } from '../controllers/friend.controller.js'
import { authmiddleware } from '../middleware/auth.middleware.js'


const friendRouter = Router()

friendRouter.route('/request').post(authmiddleware,friendRequest)
friendRouter.route('/accept').post(authmiddleware,acceptRequest)
friendRouter.route('/cancel').post(authmiddleware,cancelRequest)
friendRouter.route('/all').get(authmiddleware,searchFriend)
friendRouter.route('/unknown').get(authmiddleware,findUnknownUsers)
friendRouter.route('/reject').delete(authmiddleware,rejectRequest)

export {friendRouter}