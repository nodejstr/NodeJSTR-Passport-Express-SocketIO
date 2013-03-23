var mongoose = require('mongoose')

module.exports = function (app, passport, auth) {
    var users = require('../app/controllers/users')
    app.get('/login', auth.user.isLogged, users.login)
    app.get('/signup', auth.user.isLogged, users.signup)
    app.get('/logout', users.logout)
    app.post('/signup', users.create)
    app.post('/login', passport.authenticate('local', {failureRedirect:'/login', successRedirect:'/', failureFlash:true}))
    app.get('/auth/twitter', passport.authenticate('twitter', { failureRedirect:'/login' }), users.signin)
    app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect:'/login' }), users.authCallback)
    app.get('/', auth.user.requiresLogin, users.index)
}