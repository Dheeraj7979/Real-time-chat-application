import {Router} from 'express'
import { acceptRequest, cancelRequest, findUnknownUsers, friendRequest, rejectRequest, searchFriend, searchUser } from '../controllers/friend.controller.js'
import { authmiddleware } from '../middleware/auth.middleware.js'


const friendRouter = Router()

friendRouter.route('/request').post(authmiddleware,friendRequest)
friendRouter.route('/accept').post(authmiddleware,acceptRequest)
friendRouter.route('/cancel').post(authmiddleware,cancelRequest)
friendRouter.route('/all').get(authmiddleware,searchFriend)
friendRouter.route('/unknown').get(authmiddleware,findUnknownUsers)
friendRouter.route('/reject').delete(authmiddleware,rejectRequest)
friendRouter.route('/search').get(authmiddleware,searchUser)

export {friendRouter}