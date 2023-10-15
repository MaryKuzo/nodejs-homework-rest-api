import express from "express";

import contactsController from "../../controllers/contacts-controller.js";

import {isEmptyBody} from "../../middlewares/index.js";

import {validateBody} from "../../decorators/index.js";

import {contactAddSchema} from "../../schemas/contact-schemas.js";

const contactAddValidate = validateBody(contactAddSchema)

const contactsRouter = express.Router();

contactsRouter.get("/", contactsController.getAll);

contactsRouter.get("/:contactId", contactsController.getById);

contactsRouter.post("/", isEmptyBody, contactAddValidate, contactsController.add);

contactsRouter.put("/:contactId", isEmptyBody, contactAddValidate, contactsController.updateById);

contactsRouter.delete("/:contactId", contactsController.deleteById);

export default contactsRouter;