/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Document, Types } from 'mongoose';
export interface CryptedPsw {
    iv: string;
    encryptedMdp: string;
}
export interface IPassw extends Document {
    _id: Types.ObjectId;
    categName?: string;
    titre: string;
    siteAddress: string;
    identifier: string;
    mdp: CryptedPsw;
    icoLink?: string;
}
export interface ICateg extends Document {
    _id: Types.ObjectId;
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
export declare const User: import("mongoose").Model<IUser, {}, {}, {}, Document<unknown, {}, IUser> & IUser & Required<{
    _id: Types.ObjectId;
}>, any>;
export {};
