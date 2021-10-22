class ErrorResponse extends Error {
    constructor(msgError) {
        super(msgError);
    }
}

module.exports = ErrorResponse;