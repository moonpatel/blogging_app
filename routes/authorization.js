const express = require('express')
const router = express.Router({ mergeParams: true })
const bcrypt = require('bcrypt')
const User = require('../models/user')
const { isLoggedIn, isRegistered, registerUser } = require('../middleware')

router.route('/signup')
    // signup form
    .get((req, res) => {
        res.render('signup')
    })
    // register user in the database
    .post(isRegistered, registerUser, async (req, res) => {
        res.redirect(`/${username}`)
    })

router.route('/login')
    // login form
    .get((req, res) => {
        res.render('login')
    })
    // log in the user
    .post(async (req, res) => {
        const { username, password } = req.body
        const user = await User.findOne({ username: username })
        const validPassword = await bcrypt.compare(password, user.hash)
        if (!validPassword) {
            return res.redirect('/login')
        }
        req.session.userID = user._id
        req.session.username = user.username
        res.redirect(`/${username}`)
    })

// logout the user
router.post('/logout', isLoggedIn, (req, res, next) => {
    console.log('Logging out')
    req.session.destroy()
    res.redirect('/')
})

module.exports = router