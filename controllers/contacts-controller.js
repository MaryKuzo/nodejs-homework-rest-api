import fs from 'fs/promises';
import path from 'path';

import Contact from "../models/Contact.js";

import { HttpError, cloudinary } from "../helpers/index.js";

import { ctrlWrapper } from "../decorators/index.js";

// const avatarPath = path.resolve("public", "avatar");

const getAll = async (req, res) => {
    const {_id: owner} = req.user;
    const {page = 1, limit = 10} = req.query;
    const skip = (page - 1) * limit;
    const result = await Contact.find({owner}, "-createdAt -updatedAt", {skip, limit}).populate("owner", "username email");
    res.json(result);
}

const getById = async (req, res) => {
    const { contactId } = req.params;
    const {_id: owner} = req.user;

    // const result = await Contact.findOne({_id: id});
    const result = await Contact.findOne({_id: contactId, owner});
    if (!result) {
        throw HttpError(404, `Contact with ${contactId} not found`);
    }
    res.json(result);
}

const add = async (req, res) => {
    const {_id: owner} = req.user;
    // const {path: oldPath, filename} = req.file;
    // const newPath = path.join(avatarPath, filename);

    // await fs.rename(oldPath, newPath);
    // const avatar = path.join("public", "avatar", filename)

    const {url: avatar} = await cloudinary.uploader.upload(req.file.path,{
        folder: "avatar"
    })

    await fs.unlink(req.file.path);
    const result = await Contact.create({...req.body, avatar, owner});
    res.status(201).json(result);
}

const updateById = async (req, res) => {
    const { contactId } = req.params;
    const {_id: owner} = req.user;

    const result = await Contact.findByIdAndUpdate({_id: contactId, owner}, req.body);
    if (!result) {
        throw HttpError(404, `Contact with ${contactId} not found`);
    }
    res.json(result);
}

const updateFavorite = async (req, res) => {
    const { contactId } = req.params;
    const {_id: owner} = req.user;

    const result = await Contact.findOneAndUpdate({_id: contactId, owner}, req.body);
    if (!result) {
        throw HttpError(404, `Contact with ${contactId} not found`);
    }

    res.json(result);
}

const deleteById = async (req, res) => {
    const { contactId } = req.params;
    const {_id: owner} = req.user;

    const result = await Contact.findOneAndDelete({_id: contactId});
    if (!result) {
        throw HttpError(404, `Contact with ${contactId} not found`);
    }

    res.json({
        message: "Delete success"
    })
}

export default {
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById),
    add: ctrlWrapper(add),
    updateById: ctrlWrapper(updateById),
    updateFavorite: ctrlWrapper(updateFavorite),
    deleteById: ctrlWrapper(deleteById),
}