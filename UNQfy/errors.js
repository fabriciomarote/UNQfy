// Error personalizado
class APIError extends Error {
    constructor(name, statusCode, errorCode, message = null) {
      super(message || name);
      this.name = name;
      this.status = statusCode;
      this.errorCode = errorCode;
    }
 }

 class InvalidURLError extends APIError { 
    constructor() {
      super('InvalidURLError', 404, 'RESOURCE_NOT_FOUND');
    }  
 }

 class BadRequestError extends APIError { 
  constructor() {
    super('InvalidURLError', 400, 'BAD_REQUEST');
  }  
}

 class RelatedResourceNotFoundError extends APIError {
  constructor() {
    super('RelatedResourceNotFoundError', 404, 'RELATED_RESOURCE_NOT_FOUND');
  }  
 }

 class ResourceNotFoundError extends APIError {  //InvalidUrlError, no existe la cancion buscada
  constructor() {
    super('ResourceNotFound', 404, 'RESOURCE_NOT_FOUND');
  }  
 }

  class ResourceAlreadyExistsError extends APIError {
    constructor() {
      super('ExistsObjectError', 409, 'RESOURCE_ALREADY_EXISTS');
    } 
  }

  class InternalServerError extends APIError {
    constructor() {
      super('InternalServerError', 500, 'INTERNAL_SERVER_ERROR');
    } 
  }

 function errorHandler(err, req, res, next) {
  console.error(err); // imprimimos el error en consola
  // Chequeamos que tipo de error es y actuamos en consecuencia
  if (err instanceof InvalidURLError){
    res.status(err.status);
    res.json({status: err.status, errorCode: err.errorCode});
  } else if (err.type === 'entity.parse.failed'){
    // body-parser error para JSON invalido
    res.status(err.status);
    res.json({status: err.status, errorCode: 'BAD_REQUEST'});
  }
  else if (err instanceof BadRequestError){
    res.status(err.status);
    res.json({status: err.status, errorCode: err.errorCode});
  }
  else if (err instanceof RelatedResourceNotFoundError){
    res.status(err.status);
    res.json({status: err.status, errorCode: err.errorCode});  
  }
  else if (err instanceof ResourceNotFoundError){
    res.status(err.status);
    res.json({status: err.status, errorCode: err.errorCode});  
  }
  else if (err instanceof ResourceAlreadyExistsError){
    res.status(err.status);
    res.json({status: err.status, errorCode: err.errorCode});  
     
  } else {
    // continua con el manejador de errores por defecto
    next(err);
  }
}
 
 module.exports = {
    errorHandler,
    ResourceNotFoundError,
    ResourceAlreadyExistsError,
    RelatedResourceNotFoundError,
    InvalidURLError,
    BadRequestError,
    InternalServerError
};