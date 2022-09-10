const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const path = require('path')

const app = express()
const port = 4000

const sessionConfig = {
    secret: 'thisisasecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60,
    }
}
app.use(session(sessionConfig))     // add session

// requiring routes
const blogRoutes = require('./routes/blogs')
const userRoutes = require('./routes/users')
const cookieParser = require('cookie-parser')

// Connecting database
mongoose.connect('mongodb://localhost:27017/blogging_app')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('Error', err))

// setting parameters
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// ROUTES
app.get('/', (req, res) => res.send('HOME PAGE'))
app.get('/favicon.ico', (req, res) => res.status(204))

app.use('/', userRoutes)
app.use('/blogs', blogRoutes)

// page not found
app.all('*', (req, res) => {
    console.log('Page not found', req.path)
})

app.listen(port, () => console.log(`Listening on port ${port}`))