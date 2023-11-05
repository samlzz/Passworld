import exp from 'express';
export declare const useError: (res: exp.Response, error: Error | {
    err: string;
}, statusCode?: number) => exp.Response<any, Record<string, any>>;
export declare const useReturn: <T>(res: exp.Response, message: string | null, statusCode?: number, data?: T) => exp.Response<any, Record<string, any>>;
