exports.user = {
    hasAuthorization:function (req, res, next) {
        if (req.profile.id != req.user.id) {
            return res.redirect('/')
        }
        next()
    },
    requiresLogin:function (req, res, next) {
        if (!req.isAuthenticated()) {
            return res.redirect('/login')
        }
        next()
    },
    isLogged:function (req, res, next) {
        if (req.isAuthenticated()) {
            return res.redirect('/')
        }
        next()
    }
}