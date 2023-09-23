const express = require('express')
const path = require('path')
const session = require("express-session")
const mongoose = require('mongoose')
const { v4: uuidv4 } = require("uuid")
const app = express()
const nocache = require("nocache");

require('dotenv').config()

const PORT = process.env.PORT || 4000
app.use(nocache())
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
})

app.use(express.static('global'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//Set template engine
app.set('view engine', "ejs")
app.set('views', path.join(__dirname, 'views'));

app.use(session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: false
}))

//route
app.use("/", require("./router/routes"))


//port setting

app.listen(PORT, () => {
    console.log(`Start running http://localhost:${PORT}`)
})



