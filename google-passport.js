const passport =require("passport")
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
        done(null, user);
});

passport.use(new GoogleStrategy({
        clientID: process.env.YOUR_GOOGLE_CLIENT_ID,
        clientSecret:process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:  process.env.REDIRECT_URL ,
        passReqToCallback   : true
    },
    function(request, accessToken, refreshToken, profile, done) {
            
            console.log('accessToken' , accessToken);
            console.log('accessToken' , profile);
            // need to check if email is there or not 
            // if email is availaible there then  we need 
            // to create a token and all the user data 
            
            return done(null, profile);
    }
));