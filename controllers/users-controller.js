import path  from'path';
import fs from 'fs/promises';
import Jimp from 'jimp';

import User from '../models/User.js';
import {ctrlWrapper} from '../decorators/index.js';

const avatarPath = path.resolve("public", "avatar");

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const {path: temp, filename} = req.file;

  await Jimp.read(temp)
    .then((image) => {
      return image.resize(250, 250).write(temp)
    })
    .catch((err) => {
      console.error(err)
    })

  const avatar = path.join(avatarPath, filename)
  
  try {
    await fs.rename(temp, avatar);
    const image = path.join('avatar', filename);
    await User.findByIdAndUpdate(_id, { avatarURL: image });
    
    

    
    
    res.json({
      status: 'success',
      code: 201,
      message: 'Update avatar success'
    })
 
  } catch (error) {
    await fs.unlink(temp);
    next(error)
  }
};

export default ctrlWrapper(updateAvatar);