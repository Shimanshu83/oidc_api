const responses = require('./user.response');
const responseHandler = new (require('../../util/baseResponse'))(responses);

const { genPassword , validPassword } = require('../../util/passwordUtils'); 
const uuid = require('uuid');
const { signToken } = require('../../util/jwtUtil'); 
const userModel = new ( require('./user.model'))() ; 
const {OAuth2Client} = require('google-auth-library');

module.exports = class userService {
    constructor() { }

    async  signup(formData){

        // validate if same contact number and email doesn't exists. 
        let emailExist = await userModel.emailCheck(formData.email) ; 

        if (emailExist.length > 0){
            return responseHandler.failure('email_already_exists'); 
        }

        let contactExist = await userModel.phoneCheck(formData.contact_number); 

        if (contactExist.length > 0 ){
            return responseHandler.failure('phone_already_exists'); 
        }

        // hashing a password. 
        formData.password = genPassword(formData.password); 

        // creating a unique user id 
        formData.uid = uuid.v4(); 

        let userInsertData = await userModel.insertUser(formData); 

        const payload = {
            uid : formData.uid , 
            role : 'user' // adding a static role for now. 
        }

        let jwtToken = await signToken(payload , '24h'); 

        //deleting password from formData 
        delete formData['password']

        //adding role to the user 
        formData['role'] = 'user' ; 

        let responseData = {
            user : formData, 
            jwt_token : jwtToken
        }

        return responseHandler.success( 'user_signup_successfully' , responseData); 
    }

    async login(formData){

        // check if user exists or not 
        let userExist =  await userModel.emailCheck(formData.email) ;

        if (userExist.length == 0){
            return responseHandler.failure('user_not_exist'); 
        }

        let userObj = userExist[0] ; 

        // hash the password and check if it match with the password or not. 
        let passWordValid = validPassword(formData.password , userObj.password) ; 

        if( passWordValid === false){
            return responseHandler.failure('password_do_not_match') ;
        }

        delete userObj['password']
        delete userObj['created_at']
        delete userObj['updated_at']
 
        const payload = {
            uid : userObj['uid'], 
            role : 'user'
        }

        let jwtToken = await signToken(payload , '24h');   
        //adding role to the user 
        userObj['role'] = 'user' ; 

        let responseData = {
            user : userObj, 
            jwt_token : jwtToken
        }

        return responseHandler.success( 'user_login_successfully' , responseData); 

    }


    async google_login(formData){

        const client = new OAuth2Client(process.env.YOUR_GOOGLE_CLIENT_ID);

        const ticket = await client.verifyIdToken({
            idToken : formData.idToken,
            audience :  process.env.YOUR_GOOGLE_CLIENT_ID
        });
        
        const payload = ticket.getPayload() ; 

        // check if email already exits or not
        let userExist =  await userModel.emailCheck(payload.email) ;

        // social_login if social_login 
        let userObj = {} ; 

        if (userExist.length > 0){
            userObj = userExist[0]

        }
        else {

            userObj = {
                email : payload.email , 
                uid : uuid.v4(), 
                name : payload.name 
            }

            await userModel.insertUser(userObj) ; 
        }


        const authPayload = {
            uid : userObj['uid'], 
            role : 'user'
        }

        let jwtToken = await signToken(authPayload , '24h');   

        let responseData = {
            user : {...userObj , role : 'user'}, 
            jwt_token : jwtToken
        }

        return responseHandler.success( 'user_login_successfully' , responseData); 

    
    }


}