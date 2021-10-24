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
      super('InvalidInputError', 400, 'BAD_REQUEST');
    }  
 }

 class InvalidUrlError extends APIError {
  constructor() {
    super('InvalidUrlError', 400, 'RESOURCE_NOT_FOUND');
  }  
 }

  class ExistsObjectError extends APIError {
    constructor() {
      super('ExistsObjectError', 409, 'RESOURCE_ALREADY_EXISTS');
    } 
  }

 function errorHandler(err, req, res, next) {
  console.error(err); // imprimimos el error en consola
  // Chequeamos que tipo de error es y actuamos en consecuencia
  if (err instanceof InvalidInputError){
    res.status(err.status);
    res.json({status: err.status, errorCode: err.errorCode});
  } else if (err.type === 'entity.parse.failed'){
    // body-parser error para JSON invalido
    res.status(err.status);
    res.json({status: err.status, errorCode: 'INVALID_JSON'});
  } else if (err instanceof InvalidUrlError){
    // body-parser error para JSON invalido
    res.status(err.status);
    res.json({status: err.status, errorCode: err.errorCode});
  } else if (err instanceof ExistsObjectError){
    // body-parser error para JSON invalido
    res.status(err.status);
    res.json({status: err.status, errorCode: err.errorCode});
  } else {
    // continua con el manejador de errores por defecto
    next(err);
  }
}
 
 module.exports = {
    errorHandler,
};