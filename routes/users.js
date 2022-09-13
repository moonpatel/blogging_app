const express = require('express')
const User = require('../models/user')
const Blog = require('../models/blog')
const { isLoggedIn } = require('../middleware')
const router = express.Router({ mergeParams: true })

// show user profile
router.get('/', isLoggedIn, async (req, res) => {
    const user = await User.findOne({ username: req.params.user })
    console.log(user)
    res.render('user/show', { user })
})
// form to create a blog
router.get('/blogs/new', isLoggedIn, async (req, res) => {
    const user = await User.findOne({ username: req.params.user })
    res.render('blogs/new', { user })
})

router.route('/blogs')
    // show all blogs owned by a user
    .get(isLoggedIn, async (req, res) => {
        const user = await User.findById(req.session.userID).populate('blogs')
        const blogs = user.blogs
        res.render('user/index', { blogs, user })
    })
    // add a new blog to the database
    .post(isLoggedIn, async (req, res) => {
        const blog = new Blog(req.body.blog)
        const user = await User.findById(req.session.userID)
        blog.author = user._id
        user.blogs.push(blog)
        await blog.save()
        await user.save()
        res.redirect(`/${user.username}/blogs/${blog._id}`)
    })

// show a particular blog
router.get('/blogs/:blogId', async (req, res) => {
    const blog = await Blog.findById(req.params.blogId).populate('author','username')
    res.render('blogs/show', { blog })
})
// form for editing blog
router.get('/blogs/:blogId/edit', isLoggedIn, async (req, res) => {
    const blog = await Blog.findById(req.params.blogId)
    res.render('blogs/edit', { blog })
})
// edit blog
router.put('/blogs/:blogId', isLoggedIn, async (req, res) => {
    const { title, content } = req.body.blog
    const blog = await Blog.findByIdAndUpdate(req.params.blogId, { title: title, content: content })
    await blog.save()
    res.redirect(`/${req.params.user}/blogs/${req.params.blogId}`)
})
// delete blog
router.delete('/blogs/:blogId', isLoggedIn, async (req, res) => {
    const author = await User.findOne({ username: req.params.user })
    author.blogs.splice(author.blogs.indexOf(req.params.blogId), 1)     // remove blog id form user document
    await Blog.findByIdAndDelete(req.params.blogId)
    await author.save()
    res.redirect(`/${req.params.user}/blogs`)
})

module.exports = router