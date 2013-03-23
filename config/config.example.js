module.exports = {
    development:{
        root: require('path').normalize(__dirname + '/..'),
        app: {
            name: 'NodeJSTR'
        },
        db:'mongodb://127.0.0.1/nodejstr',
        twitterStream : {
            consumer_key : '',
            consumer_secret : '',
            access_token_key: '',
            access_token_secret : '',
            track : ''
        },
        twitter: {
            clientID: ''
            , clientSecret: ''
            , callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
        }
    }
}
