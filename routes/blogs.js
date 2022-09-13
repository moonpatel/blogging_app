const express = require('express')
const Blog = require('../models/blog')
const router = express.Router({ mergeParams: true })

router.get('/', async (req, res) => {
    const blogs = await Blog.find()
    for (let blog of blogs) {
        await blog.populate('author', 'username')
    }
    console.log(blogs)
    res.render('blogs/index', { blogs })
})

router.get('/:blogId', async (req, res) => {
    const blog = await Blog.findById(req.params.blogId)
    res.render('blogs/show', { blog })
})

module.exports = router