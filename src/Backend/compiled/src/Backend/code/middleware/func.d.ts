import exp from 'express';
import { CryptedPsw } from '../models/model_user';
export declare const useError: (res: exp.Response, error: Error | {
    err: string;
}, statusCode?: number) => exp.Response<any, Record<string, any>>;
export declare const useReturn: <T>(res: exp.Response, message: string | null, statusCode?: number, data?: T) => exp.Response<any, Record<string, any>>;
export declare const getEnvVar: (res: exp.Response, isUserId?: boolean) => string;
export declare const encrypt: (mdp: string, userID: string) => CryptedPsw;
export declare const decrypt: (mdp: CryptedPsw, userId: string) => string;
