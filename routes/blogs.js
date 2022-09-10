const express = require('express')
const router = express.Router({mergeParams: true})

router.get('/', (req,res) => {
    res.send('Here are your routes')
})

router.get('/:id', (req,res) => {
    
})

module.exports = router