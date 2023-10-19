import express from 'express';

import {authenticate, upload} from '../../middlewares/index.js';

import updateAvatar from '../../controllers/users-controller.js'

const usersRouter = express.Router();

usersRouter.patch('/avatars', authenticate, upload.single('avatarURL'), updateAvatar)

export default usersRouter