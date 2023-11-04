import { Schema, model } from 'mongoose';
var userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
export var User = model('User', userSchema, 'Users');
