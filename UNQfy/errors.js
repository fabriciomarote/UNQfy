// Error personalizado
class APIError extends Error {
    constructor(name, statusCode, errorCode, message = null) {
      super(message || name);
      this.name = name;
      this.status = statusCode;
      this.errorCode = errorCode;
    }
 }
 
 class InvalidInputError extends APIError {
    constructor() {
      super('InvalidInputError', 400, 'INVALID_INPUT_DATA');
    }  
 }
 
 module.exports = {
    APIError: APIError,
    InvalidInputError: InvalidInputError,
};