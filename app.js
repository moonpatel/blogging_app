const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const mongoStore = require('connect-mongo')
const path = require('path')

const app = express()
const port = 3000

const sessionConfig = {
    secret: 'thisisasecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60,
    },
    store: mongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/blogging_app',
        ttl: 1000 * 60 * 60,
        autoRemove: 'native'
    })
}
app.use(session(sessionConfig))     // add session
app.use((req,res,next) => {
    res.locals.username = req.session.username
    next()
})

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
app.get('/', (req, res) => {
    if(!req.session.username) {
        return res.render('home')
    }
    res.redirect(`/${req.session.username}`)
})
app.get('/favicon.ico', (req, res) => res.status(204))

app.use('/', userRoutes)    // authentication
app.use('/blogs', blogRoutes)   // blogs

// page not found
app.all('*', (req, res) => {
    console.log('Page not found', req.path)
})

app.listen(port, () => console.log(`Listening on port ${port}`))