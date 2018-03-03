var express		= require("express");
var db			= require("../models");

var router = express.Router();

router.get('/', (req, res) => {
    posts = ['first post', 'second post', 'third post']
    res.render('index', { user : req.user, posts : posts });
});

router.get('/login', (req, res) => {
    res.render('login', { user : req.user });
});

router.get('/register', (req, res) => {
    res.render('register', { user : req.user });
});

router.get('/upload', (req, res) => {
    res.render('upload', { user : req.user });
});

module.exports = router;
