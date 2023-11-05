import { Schema, model } from 'mongoose';
var pswSchema = new Schema({
    categName: String,
    titre: { type: String, required: true },
    siteAddress: { type: String, required: true },
    identifier: { type: String, required: true },
    mdp: { type: String, required: true },
    icoLink: String,
});
var notNullValidator = {
    validator: function (value) {
        return value == null ? false : value.every(function (item) { return item != null; });
    },
    message: 'Un objet `null` n’est pas autorisé',
};
var categSchema = new Schema({
    name: { type: String, required: true },
    passwords: { type: [pswSchema], validate: notNullValidator },
});
var userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    motDePasse: { type: String, required: true },
    allPassw: { type: [pswSchema], required: true, validate: notNullValidator },
    pswByCateg: { type: [categSchema], required: true },
});
export var User = model('User', userSchema, 'Users');
