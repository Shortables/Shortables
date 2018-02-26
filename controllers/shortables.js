var express		= require("express");
var db			= require("../models");

var router = express.Router();

router.get('/', (req, res) => {
    res.render('index', { user : req.user });
});

module.exports = router;
