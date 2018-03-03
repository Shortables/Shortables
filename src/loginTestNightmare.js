var Nightmare = require('nightmare');

new Nightmare({ show: true })
// go to main page
.goto('http://localhost:3000/') 
// go to login page
.click('#nav-login')
// enter user name
.type('#loginName', 'JackC')
// enter password
.type('#loginPw', 'passw0rd')
// click log in button
.click('#loginBtn')
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
