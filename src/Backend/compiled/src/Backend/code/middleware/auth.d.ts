import exp from 'express';
declare module 'express' {
    interface Request {
        auth: {
            userId: string;
        };
    }
}
export declare const authentified: (req: exp.Request, res: exp.Response, next: exp.NextFunction) => void;
