const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const mongoStore = require('connect-mongo')
const cookieParser = require('cookie-parser')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const path = require('path')

// const sessionConfig = require('./sessionConfig')

const sessionConfig = {
    secret: 'thisisasecret',
    resave: false,
    saveUninitialized: false,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60,
    },
    // session store
    store: mongoStore.create({
        mongoUrl: 'mongodb://127.0.0.1:27017/blogging_app',
        ttl: 1000 * 60 * 60,
        autoRemove: 'native'
    })
}

const app = express()
const port = 3000

// Connecting database
mongoose.connect('mongodb://127.0.0.1:27017/blogging_app')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('Error', err))

app.use(methodOverride('_method'))
app.use(session(sessionConfig))     // add session
app.use((req, res, next) => {
    res.locals.username = req.session.username
    next()
})
app.use((req, res, next) => {
    console.log(`Path: ${req.method} ${req.path}`)
    next()
})

// requiring routes
const blogRoutes = require('./routes/blogs')
const userRoutes = require('./routes/users')
const authRoutes = require('./routes/authorization')


// setting parameters
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// ROUTES
app.get('/', (req, res) => {
    if (!req.session.username) {
        console.log('you have to log in')
        return res.render('home')
    }
    res.redirect(`/${req.session.username}`)
})
app.get('/favicon.ico', (req, res) => res.status(204))

app.use('/', authRoutes)    // authentication
app.use('/blogs', blogRoutes)   // blogs
app.use('/:user', userRoutes)    // user

// page not found
app.all('*', (req, res) => {
    console.log('Page not found', req.method, req.path)
    res.render('pagenotfound')
})

app.listen(port, () => console.log(`Listening on port ${port}`))