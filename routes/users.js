const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const Blog = require('../models/blog')
const { isLoggedIn } = require('../middleware')
const router = express.Router({ mergeParams: true })

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
    req.session.username = user.username
    res.redirect('/userstatus')
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', async (req, res) => {
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

router.post('/logout', isLoggedIn, (req, res, next) => {
    req.session.destroy()
    res.redirect('/home')
})

// show user profile
router.get('/:user', isLoggedIn, async (req, res) => {
    const user = await User.findOne({ username: req.params.user })
    res.render('user/show', { user })
})

router.get('/:user/blogs/new', isLoggedIn, async (req, res) => {
    const user = await User.findOne({ username: req.params.user })
    res.render('blogs/new', { user })
})

router.get('/:user/blogs', isLoggedIn, async (req, res) => {
    const user = await User.findById(req.session.userID).populate('blogs')
    const blogs = user.blogs
    res.render('blogs/index', { blogs, user })
})

router.post('/:user/blogs', isLoggedIn, async (req, res) => {
    const blog = new Blog(req.body.blog)
    const user = await User.findById(req.session.userID)
    blog.author = user._id
    user.blogs.push(blog)
    await blog.save()
    await user.save()
    res.redirect(`/${user.username}/blogs/${blog._id}`)
})
router.get('/:user/blogs/:blogId', async (req, res) => {
    const blog = await Blog.findById(req.params.blogId)
    res.render('blogs/show', { blog })
})

module.exports = router