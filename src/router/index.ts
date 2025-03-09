import {Router} from "express";
import userController from "../controllers/userController";
import authMiddleware from "../middlewares/authModdleware";

const router = Router()

//auth
router.post('/registration', userController.registration)
router.post('/login', userController.login)
//users

router.get('/profiles/:username', authMiddleware, userController.getUserByUsername)
// router.patch('/profiles/:id',authMiddleware, userController.editUserById)
// router.delete('/profiles/:id',authMiddleware, userController.deleteUserById)

export default router;