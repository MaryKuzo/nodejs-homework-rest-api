import { Schema, model } from "mongoose";
import Joi from "joi";

import { handleSaveError, runValidatorsAtUpdate } from "./hooks.js";

// const nameRegExp = /^[A-Za-zА-Яа-я]+([A-Za-zА-Яа-я]+)?$/;
// const phoneRegExp = /^\(?([0-9]{3})\)? [0-9]{3}-[0-9]{4}$/;
const emailRegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


const contactSchema = new Schema({
    name: {
        type: String,
        required: [true, "Set name for contact"],
        // match: nameRegExp,
    },
    email: {
        type: String,
        required: [true, "Set email for contact"],
        match: emailRegExp,
    },
    phone: {
        type: String,
        required: [true, "Set phone for contact"],
        // match: phoneRegExp,
    },
    favorite: {
        type: Boolean,
        default: false,
    }
}, {versionKey: false, timestamps: true})

contactSchema.post("save", handleSaveError);

contactSchema.pre("findOneAndUpdate", runValidatorsAtUpdate);

contactSchema.post("findOneAndUpdate", handleSaveError);

export const contactAddSchema = Joi.object({
    name: Joi.string().required().messages({
      "any.required": `missing required "name" field`,
    }),
    email: Joi.string().required().pattern(emailRegExp).messages({
      "any.required": `missing required "email" field`,
    }),
    phone: Joi.string().required().messages({
      "any.required": `missing required "phone" field`,
    }),
    favorite: Joi.boolean(),
  });
  

export const contactUpdateFavoriteSchema = Joi.object({
    favorite: Joi.boolean().required(),
})

const Contact = model("contact", contactSchema);

export default Contact;