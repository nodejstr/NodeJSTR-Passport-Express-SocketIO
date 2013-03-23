var mongoose = require('mongoose')
    , User = mongoose.model('User')
    , Stream = require('twitter-public-stream')
    , restart = false
    , stream = null
    , socket = null

module.exports = function (server, config) {
    var io = require("socket.io").listen(server);

    io.sockets.on('connection', function (sckt) {
        socket = sckt;
        socket.on('startengine', function (data) {
            User.findOne({'twitter.id_str':data.id}, function (err, result) {
                if (err)
                    console.log('e' + err)
                console.log('a' + result.twitter.token);

                var opt = config.twitterStream;
                opt.track = data.track;
                opt.access_token_key = result.twitter.token;
                opt.access_token_secret = result.twitter.tokenSecret;
                stream = new Stream(opt)
                stream.stream();
                streaming(stream)
            });

        });

        socket.on('disconnect', function () {
            console.log('disconnect')
            restart = false
            try {
                stream.destroy()
            } catch (e) {
            }
        });


    });
}

function streaming(stream) {
    stream.on('data', function (json) {
        if(typeof json.user !== 'undefined')
        socket.emit('data', json);
    });

    stream.on('heartbeat', function () {
        console.log('heartbeat')
        socket.emit('heartbeat')
    });

    stream.on('error', function (json) {
        console.log(json)
        socket.emit('error', json);
    });

    stream.on('connected', function (json) {
        socket.emit('connected', json);
    });

    stream.on('close', function (json) {
        socket.emit('close', json)
        if (restart)
            stream.stream();
    });
}


var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({ username: username }, function(err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!user.validPassword(password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }
));