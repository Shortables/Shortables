var Nightmare = require('nightmare');

new Nightmare({ show: true })
// go to main page
.goto('http://localhost:3000/') 
// go to login page
.click('#nav-login')
// enter user name
.type('#login-name', 'loginNightmare')
// enter password
.type('#login-pw', 'passw0rd')
// click log in button
.click('#login-btn')
// wait 1s
.wait(1000)
// take a screenshot of the result
.screenshot("login.png")
// end
.end()
.then(function() {
    console.log("Done!");
})
.catch(function(err) {
    console.log(err);
});
