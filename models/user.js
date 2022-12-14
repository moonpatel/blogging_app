const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        required: true
    },
    blogs: [{
        type: Schema.Types.ObjectId,
        ref: 'Blog',
        required: true
    }]
})

module.exports = mongoose.model('User', userSchema)