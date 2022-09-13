const bcrypt = require('bcrypt')
const User = require('./models/user')

// check if user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.session.userID) {
        return res.redirect('/login')
    }
    next()
}

// check if a particular username is registered
module.exports.isRegistered = async (req, res, next) => {
    const { username } = req.body
    const user = await User.findOne({ username: username })
    if (user) {
        return res.redirect('/login')
    }
    next()
}

// register a user 
module.exports.registerUser = async (req, res, next) => {
    const { username, email, password } = req.body
    const user = new User({ username: username, email: email })
    user.hash = bcrypt.hashSync(password, await bcrypt.genSalt(12))
    await user.save()
    req.session.userID = user._id
    req.session.username = user.username
    next()
}

// user logout
module.exports.userLogout = (req, res, next) => {
    try {
        req.session.destroy()
    } catch (err) {
        console.log('ERROR occured while loggin out')
        next(err)
    }
}

// check if user has permissions for certain actions
module.exports.isAuthor = (req, res, next) => {
    if (req.session.username === req.params.user) {
        next()
    }
    else {
        res.redirect(`/${req.session.username}`)
    }
}