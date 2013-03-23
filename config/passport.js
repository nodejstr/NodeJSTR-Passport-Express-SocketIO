var mongoose = require('mongoose')
    , LocalStrategy = require('passport-local').Strategy
    , TwitterStrategy = require('passport-twitter').Strategy
    , User = mongoose.model('User')

module.exports = function (passport, config) {

    passport.serializeUser(function (user, done) {
        done(null, user.id)
    })

    passport.deserializeUser(function (id, done) {
        User.findOne({ _id:id }, function (err, user) {
            done(err, user)
        })
    })

    passport.use(new LocalStrategy({
            passReqToCallback:true
        },
        function (req, username, password, done) {
            User.findOne({ username:username }, function (err, user) {
                if (err) {
                    return done(err)
                }
                if (!user) {
                    return done(null, false, { message:'Unknown user' })
                }
                if (!user.authenticate(password)) {
                    return done(null, false, { message:'Invalid password' })
                }
                return done(null, user)
            })
        }
    ))

    passport.use(new TwitterStrategy({
            consumerKey:config.twitter.clientID,
            consumerSecret:config.twitter.clientSecret,
            callbackURL:config.twitter.callbackURL,
            passReqToCallback:true
        },
        function (req, token, tokenSecret, profile, done) {
            process.nextTick(function () {
                User.findOne({ 'twitter.id':profile.id }, function (err, user) {
                    if (err) { return done(err) }
                    if (!user) {
                        profile._json.token = token;
                        profile._json.tokenSecret = tokenSecret;
                        user = new User({
                            name: profile.displayName
                            , username: profile.username
                            , provider: 'twitter'
                            , twitter: profile._json
                        })
                        user.save(function (err) {
                            if (err) console.log(err)
                            return done(err, user)
                        })
                    }
                    else {
                        return done(err, user)
                    }
                })
            })
        }
    ))
}