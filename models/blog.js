const mongoose = require('mongoose')
const { Schema } = mongoose

const blogSchema = Schema({
    title: String,
    content: String
})

module.exports = mongoose.model('Blog',blogSchema)