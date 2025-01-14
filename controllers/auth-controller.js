import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import gravatar from "gravatar"

import User from "../models/User.js";

import { HttpError, cloudinary } from "../helpers/index.js";

import { ctrlWrapper } from "../decorators/index.js";

const {JWT_SECRET} = process.env;

const signup = async(req, res)=> {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(user) {
        throw HttpError(409, `${email} already in use`)
    }

    const avatarSize = 200; // Розмір аватара (пікселі)
    const avatarURL = gravatar.url(email, { s: `${avatarSize}`, d: 'retro' });

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({...req.body, avatarURL, password: hashPassword});

    res.status(201).json({
        username: newUser.username,
        email: newUser.email,
        avatarURL: newUser.avatarURL
    })
}

const signin = async(req, res)=> {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user) {
        throw HttpError(401, "Email or password invalid"); // throw HttpError(401, "Email not found");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare) {
        throw HttpError(401, "Email or password invalid");
    }

    const payload = {
        id: user._id,
    }

    const token = jwt.sign(payload, JWT_SECRET, {expiresIn: "23h"});
    await User.findByIdAndUpdate(user._id, {token});
    
    res.json({
        token,
    })
}

const getCurrent = async(req, res)=> {
    const {username, email} = req.user;

    res.json({
        username,
        email,
    })
}

const signout = async(req, res)=> {
    const {_id} = req.user;
    await User.findByIdAndUpdate(_id, {token: ""});

    res.json({
        message: "Signout success"
    })
}

export default {
    signup: ctrlWrapper(signup),
    signin: ctrlWrapper(signin),
    getCurrent: ctrlWrapper(getCurrent),
    signout: ctrlWrapper(signout),
}