import fs from "fs/promises";
import { randomUUID } from "crypto";
import path from "path";

const contactsPath = path.resolve("db/contacts.json"); // dopasuj do swojej ścieżki

export async function listContacts() {
  const data = await fs.readFile(contactsPath, "utf8");
  return JSON.parse(data);
}

export async function getContactById(contactId) {
  const contacts = await listContacts();
  const id = String(contactId);
  const found = contacts.find((c) => String(c.id) === id);
  return found ?? null;
}

export async function removeContact(contactId) {
  const contacts = await listContacts();
  const id = String(contactId);
  const index = contacts.findIndex((c) => String(c.id) === id);
  if (index === -1) return null;

  const [removed] = contacts.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), "utf8");
  return removed;
}

export async function addContact(name, email, phone) {
  const contacts = await listContacts();
  const id = randomUUID();
  const newContact = { id, name, email, phone };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), "utf8");
  return newContact;
}

export async function updateContact(contactId, data) {
  const contacts = await listContacts();
  const id = String(contactId);

  const index = contacts.findIndex((c) => String(c.id) === id);
  if (index === -1) return null;

  contacts[index] = { ...contacts[index], ...data };
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), "utf8");
  return contacts[index];
}
