const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const { isLoggedIn } = require('../middleware')
const router = express.Router({ mergeParams: true })

router.all('*', (req, res, next) => {
    console.log(`${req.path}: `)
    console.log(req.session)
    next()
})

router.get('/signup', (req, res) => {
    res.render('signup')
})

router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body
    const user = new User({ username: username, email: email })
    const salt = await bcrypt.genSalt(12)
    const hash = bcrypt.hashSync(password, salt)
    user.hash = hash
    await user.save()
    req.session.userID = user._id
    res.redirect('/userstatus')
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/userstatus', (req, res) => {
    if (req.session.userID)
        res.send('LOGGED IN')
    else
        res.send('NOT LOGGED IN')
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({ username: username })
    const validPassword = await bcrypt.compare(password, user.hash)
    if(!validPassword) {
        console.log('INCORRECT PASSWORD')
        res.redirect('/login')
    }
    else {
        req.session.userID = user._id
        console.log('CORRECT PASSWORD')
        res.redirect('/userstatus')
    }
})

router.get('/logout',isLoggedIn, (req,res) => {
    delete req.session.userID
    res.redirect('/userstatus')
})

module.exports = router