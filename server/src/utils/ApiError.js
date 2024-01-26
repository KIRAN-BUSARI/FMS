/* Here we trying to make the errors to send in a proper manner and make errors to easily understand the errors */
class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went Wrong",
        errors = [],
        stack = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack; // To get stack of errors if there are errors
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };