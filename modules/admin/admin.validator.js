module.exports = class adminValidator {

    constructor() { }

    login(){
      return {
          email: 'required|email',
          password: [
            'required',
            'string'
          ],
        }
  }

}