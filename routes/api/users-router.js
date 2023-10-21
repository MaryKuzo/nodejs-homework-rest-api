import express from 'express';

import {authenticate, upload} from '../../middlewares/index.js';
import {validateBody} from "../../decorators/index.js";
import usersController from '../../controllers/users-controller.js';
import { emailSchema } from '../../models/User.js';

const userEmailValidate = validateBody(emailSchema);

const usersRouter = express.Router();

usersRouter.patch('/avatars', authenticate, upload.single('avatarURL'), usersController.updateAvatar)

usersRouter.get("/verify/:verificationCode", usersController.verifyEmail);

usersRouter.post("/verify", userEmailValidate, usersController.resendVerifyEmail);

export default usersRouter