const bcrypt = require('bcrypt')

// check if user is logged in
module.exports.isLoggedIn = (req,res,next) => {
    if(!req.session.userID) {
        return res.redirect('/login')
    }
    next()
}