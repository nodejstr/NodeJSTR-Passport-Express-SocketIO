var express = require('express'),
    fs = require('fs'),
    passport = require('passport')
require('express-namespace')

var env = process.env.NODE_ENV || 'development',
    config = require('./config/config')[env],
    auth = require('./config/midllewares/authorization'),
    mongoose = require('mongoose')

mongoose.connect(config.db, {
    safe:true
})

var models_path = __dirname + '/app/models'
fs.readdirSync(models_path).forEach(function (file) {
    require(models_path + '/' + file)
})

require('./config/passport')(passport, config)
var app = express()
var port = process.env.PORT || 3000
require('./config/express')(app, config, passport)
require('./config/routes')(app, passport, auth)
require('./config/socketio')(app.listen(port),config)
console.log('app started on port ' + port)