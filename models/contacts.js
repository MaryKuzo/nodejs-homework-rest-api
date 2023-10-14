import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

const contactsPath = path.resolve("models", "contacts.json");


const updateContact = contact => fs.writeFile(contactsPath, JSON.stringify(contact, null, 2));

export const getAllContacts = async()=> {
    const buffer = await fs.readFile(contactsPath);
    return JSON.parse(buffer);
}

export const getContactById = async (contactId) => {
    const contacts = await getAllContacts();
    const result = contacts.find(item => item.id === contactId);
    return result || null;
}

export const addContact = async({name, email, phone}) => {
    const contacts = await getAllContacts();
    const newContact = {
        id: nanoid(),
        name,
        email,
        phone,
    };
    contacts.push(newContact);
    await updateContact(contacts);
    return newContact;
}

export const updateContactById = async(contactId, {name, email, phone}) => {
    const contacts = await getAllContacts();
    const index = contacts.findIndex(item => item.id === contactId);
    if(index === -1) {
        return null;
    }
    contacts[index] = { id: contactId, name, email, phone };
    await updateContact(contacts);
    return contacts[index];
}

export const deleteContactById = async (contactId) => {
    const contacts = await getAllContacts();
    const index = contacts.findIndex(item => item.id === contactId);
    if(index === -1) {
        return null;
    }
    
    const [result] = contacts.splice(index, 1);
    await updateContact(contacts);
    return result;
}