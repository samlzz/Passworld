import { Schema, model } from 'mongoose';

interface IPassw {
    id?: number;
    categName: string;
    titre: string;
    siteAddress: string;
    identifier: string;
    mdp: string;
    icoLink?: string;
}
interface IUser {
    email: string;
    motDePasse: string;
    allPassw: IPassw[] | [];
    pswByCateg: IPassw[][] | [][];
}

const userSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    motDePasse: { type: String, required: true },
    allPassw: [{ type: Schema.Types.DocumentArray, ref: 'IPassw' }],
    pswByCateg: [[{ type: Schema.Types.DocumentArray, ref: 'IPassw' }]],
});

export const User = model<IUser>('User', userSchema, 'Users');
