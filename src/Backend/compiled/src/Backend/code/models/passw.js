import { Schema, model } from 'mongoose';
var psswSchema = new Schema({
    categName: { type: String, required: true },
    titre: { type: String, required: true },
    siteAddress: { type: String, required: true },
    identifier: { type: String, required: true },
    mdp: { type: String, required: true },
    icoLink: String,
});
export var Password = model('Password', psswSchema, 'Passwords');
