import {Router} from "express";
import userController from "../controllers/userController";
import authMiddleware from "../middlewares/authModdleware";

const router = Router()

//auth
router.post('/registration', userController.registration)
router.post('/login', userController.login)
//users
router.get('/users/:username', authMiddleware, userController.getProfileByUsername)
// router.patch('/users/:username',authMiddleware, userController.editProfileByUsername)
// router.delete('/users/:username',authMiddleware, userController.deleteProfileByUsername)

export default router;