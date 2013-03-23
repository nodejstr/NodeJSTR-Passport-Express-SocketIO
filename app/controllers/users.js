var mongoose = require('mongoose')
    , User = mongoose.model('User')

exports.login = function (req, res) {
    res.render('users/login', {
        title:'Login',
        message:(req.flash('error')).length > 0 ? req.flash('error') : undefined
    })
}

exports.signup = function (req, res) {
    res.render('users/signup', {
        title:'Sign up'
    })
}

exports.logout = function (req, res) {
    req.logout()
    res.redirect('/')
}

exports.create = function (req, res) {
    var user = new User(req.body)
    user.provider = 'local'
    user.save(function (err) {
        if (err)
            return res.render('users/signup', { errors:err.errors, message:err.message })
        req.logIn(user, function (err) {
            if (err) return next(err)
            return res.redirect('/')
        })
    })
}

exports.signin = function (req, res) {
}

exports.authCallback = function (req, res, next) {
    res.redirect('/')
}

exports.index = function (req, res) {
    res.render('users/index', {
        title:'Home'
    })
}