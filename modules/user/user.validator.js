module.exports = class userValidator {

    constructor() { }

    signup(){
        return {
            name: 'required|string|min:3|max:50',
            contact_number: 'required|string|min:10|max:10',
            email: 'required|email',
            password: [
              'required',
              'string',
              'min:8',
              'regex:/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/',
            ],
            age: 'required|integer|min:7|max:99',
            courses: 'required',
          }
    }


  login(){
      return {
          email: 'required|email',
          password: [
            'required',
            'string'
          ],
        }
    }
  google_login() {
    return {
      authToken : 'required'
    }
  }

}