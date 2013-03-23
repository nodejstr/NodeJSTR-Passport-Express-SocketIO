var express = require('express')
    , mongoStore = require('connect-mongo')(express)
    , flash = require('connect-flash')
    , viewHelpers = require('./midllewares/view');

module.exports = function (app, config, passport) {
    app.set('showStackError', true)
    app.use(express.compress({
        filter:function (req, res) {
            console.log(res.getHeader('Content-Type'));
            return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
        },
        level:9
    }))
    app.use(express.static(config.root + '/public'))
    app.use(express.logger('dev'))
    app.set('views', config.root + '/app/views')
    app.set('view engine', 'jade')
    app.configure(function () {
        app.use(viewHelpers(config))
        app.use(express.cookieParser())
        app.use(express.bodyParser())
        app.use(express.methodOverride())
        app.use(flash())
        app.use(express.session({
            secret:'nodejstrsecret',
            store:new mongoStore({
                url:config.db,
                collection:'nodejstrsessions'
            })
        }))

        app.use(passport.initialize())
        app.use(passport.session())
        app.use(express.favicon())
        app.use(app.router)
        app.use(function (err, req, res, next) {
            if (~err.message.indexOf('not found')) return next()
            console.error(err.stack)
            res.status(500).render('error/500', { error:err.stack })
        })
        app.use(function (req, res, next) {
            res.status(404).render('error/404', { url:req.originalUrl })
        })
    })
}