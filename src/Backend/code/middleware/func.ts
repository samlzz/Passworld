import exp from 'express';

export const useError = (
    res: exp.Response,
    error: Error | { err: string },
    statusCode: number = 500
) => {
    console.error(error);
    return res.status(statusCode).json(error);
};

export const useReturn = <T>(
    res: exp.Response,
    message: string | null,
    statusCode: number = 200,
    data: T | null = null
) => {
    if (data === null) {
        return res.status(statusCode).json({ msg: message });
    }
    if (message === null) {
        return res.status(statusCode).json(data);
    }
    const toReturn: Record<string, unknown> = { msg: message, ...data };
    return res.status(statusCode).json(toReturn);
};
