import express from "express";

import contactsController from "../../controllers/contacts-controller.js";

import {authenticate, upload, isEmptyBody, isValidId} from "../../middlewares/index.js";

import {validateBody} from "../../decorators/index.js";

import {contactAddSchema, contactUpdateFavoriteSchema} from "../../models/Contact.js";

const contactAddValidate = validateBody(contactAddSchema)
const contactUpdateFavoriteValidate = validateBody(contactUpdateFavoriteSchema)

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", contactsController.getAll);

contactsRouter.get("/:contactId", contactsController.getById);

contactsRouter.post("/", upload.single("avatar"), isEmptyBody, contactAddValidate, contactsController.add);

contactsRouter.put("/:contactId", isEmptyBody, contactAddValidate, contactsController.updateById);

contactsRouter.patch("/:contactId/favorite", isValidId, isEmptyBody, contactUpdateFavoriteValidate, contactsController.updateFavorite);

contactsRouter.delete("/:contactId", contactsController.deleteById);

export default contactsRouter;