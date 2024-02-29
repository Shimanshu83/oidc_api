
const adminValidator = new (require('./admin.validator'))();
const adminService = new (require('./admin.service'))();
const Validator = require('validatorjs');
const responses = require('./admin.response');
const responseHandler = new (require('../../util/baseResponse'))(responses);


module.exports = class adminController {

    async login(req , res ){
        let returnResponse  = {}  ; 
    
        let formData = {
          email : req.body.email, 
          password : req.body.password
        }
        let validation = new Validator( formData , adminValidator.login()); 
    
        if(validation.passes()){
    
          try {
            returnResponse = await adminService.login(formData); 
          } catch (error) {
    
            returnResponse = responseHandler.catch_error(error);
          }
    
        }
        else {
          returnResponse = responseHandler.failure("input_validation_failed" , validation.errors.errors);
        }
    
        res.status(returnResponse.status_code).send(returnResponse);
  }

  async stats(req , res ){
    let returnResponse = {} 

    try {
      returnResponse = await adminService.stats(); 
    } catch (error) {
      returnResponse = responseHandler.catch_error(error);
    }

    res.status(returnResponse.status_code).send(returnResponse);
    

  }


}