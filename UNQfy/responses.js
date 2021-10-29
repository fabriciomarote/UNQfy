class ErrorResponse extends Error {
    constructor(msgError) {
        super(msgError);
    }
}

class DuplicatedError extends Error {
    constructor(msgError) {
        super(msgError);
    }
}

module.exports = { ErrorResponse, DuplicatedError };