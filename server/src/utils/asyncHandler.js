/* Here this is the wrapper of async handler where we can catch the errors we are using this insted of writing async function at the begining of the code */
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise
            .resolve(requestHandler(req, res, next))
            .catch((err) => next(err));
    };
};

export { asyncHandler };