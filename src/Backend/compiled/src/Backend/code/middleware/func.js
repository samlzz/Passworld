var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
export var useError = function (res, error, statusCode) {
    if (statusCode === void 0) { statusCode = 500; }
    console.error(error);
    return res.status(statusCode).json(error);
};
export var useReturn = function (res, message, statusCode, data) {
    if (statusCode === void 0) { statusCode = 200; }
    if (data === void 0) { data = null; }
    if (data === null) {
        return res.status(statusCode).json({ msg: message });
    }
    if (message === null) {
        return res.status(statusCode).json(data);
    }
    var toReturn = __assign({ msg: message }, data);
    return res.status(statusCode).json(toReturn);
};
