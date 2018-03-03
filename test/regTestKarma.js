var Nightmare = require("nightmare");
var expect = require('chai').expect;

describe('test login', function() {
    var nightmare = Nightmare()
    nightmare
    // go to login page
    .goto('http://localhost:3000/register')
    // enter email address
    .type('#addEmail', 'abc@123.com')
    // enter first name
    .type('#addFirst', 'Registration')
    // enter last name
    .type('#addLast','Nightmare')
    // enter user name
    .type('#addUserNmae', 'regNightmare')
    // enter password
    .type('#addPassword', 'passw0rd')
    // click sign up button
    .click('#signUp')
    // take screenshot save to current dir
    .screenshot('registered.png')
    // end test
    .end()
    .then(function() {
        console.log('Done!');
    })
    // catch errors
    .catch(function(err) {
        console.log(err);
    });
})
