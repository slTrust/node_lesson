const obj = {
    message: 'something went wrong'
};
Error.captureStackTrace(obj);
throw obj;