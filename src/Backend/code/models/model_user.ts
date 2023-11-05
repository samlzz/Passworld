import { Schema, model, Document, Types } from 'mongoose';

export interface IPassw extends Document {
    _id: Types.ObjectId;
    categName?: string;
    titre: string;
    siteAddress: string;
    identifier: string;
    mdp: string;
    icoLink?: string;
}
export interface ICateg {
    _id?: Types.ObjectId;
    name: string;
    passwords: Array<IPassw>;
}
type PswByCategType = ICateg[];

interface IUser extends Document {
    _id: Types.ObjectId;
    email: string;
    motDePasse: string;
    allPassw: IPassw[];
    pswByCateg: PswByCategType;
}

const pswSchema = new Schema<IPassw>({
    categName: String,
    titre: { type: String, required: true },
    siteAddress: { type: String, required: true },
    identifier: { type: String, required: true },
    mdp: { type: String, required: true },
    icoLink: String,
});
const notNullValidator = {
    validator(value: IPassw[] | null): boolean {
        return value == null ? false : value.every((item) => item != null);
    },
    message: 'Un objet `null` n’est pas autorisé',
};

const categSchema = new Schema<ICateg>({
    name: { type: String, required: true },
    passwords: { type: [pswSchema], validate: notNullValidator },
});

const userSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    motDePasse: { type: String, required: true },
    allPassw: { type: [pswSchema], required: true, validate: notNullValidator },
    pswByCateg: { type: [categSchema], required: true },
});

export const User = model<IUser>('User', userSchema, 'Users');
