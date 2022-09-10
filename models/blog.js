const mongoose = require('mongoose')
const { Schema } = mongoose

const blogSchema = Schema({
    title: String,
    content: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Blog',blogSchema)