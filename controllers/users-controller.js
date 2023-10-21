import path  from'path';
import fs from 'fs/promises';
import Jimp from 'jimp';

import User from '../models/User.js';
import {ctrlWrapper} from '../decorators/index.js';
import { HttpError, sendEmail } from "../helpers/index.js";
const {BASE_URL} = process.env;

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

const verifyEmail = async(req, res) => {
  const {verificationCode} = req.params;
  const user = await User.findOne({verificationCode});
  if(!user){
      throw HttpError(401, "Email not found")
  }
  await User.findByIdAndUpdate(user._id, {verify: true, verificationCode: ""});

  res.json ({
      message: "Email verify success"
  })
}

const resendVerifyEmail = async(req, res) => {
  const {email} = req.body;
  const user = await User.findOne({email});
  if(!user) {
      throw HttpError(401, "Email not found")
  }
  if(user.verify) {
      throw HttpError(401, "Email already verify")
  }
  const verifyEmail = {
      to: email, 
      subject: "Verify email",
      html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationCode}">Click to verify email</a>`
  };

  await sendEmail(verifyEmail)
  res.json({
      message: "Verify email send success"
  })

}

export default {
  updateAvatar:ctrlWrapper(updateAvatar),
  verifyEmail:ctrlWrapper(verifyEmail),
  resendVerifyEmail:ctrlWrapper(resendVerifyEmail)

};