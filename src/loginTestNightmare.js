var Nightmare = require('nightmare');

new Nightmare({ show: true })
.goto('http://localhost:3000/login')
.type('#loginName', 'JackC')
.type('#loginPw', 'passw0rd')
.click('#loginBtn')
.wait(1000)
.screenshot("login.png")
.end()
.then(function() {
    console.log("Done!");
})
.catch(function(err) {
    console.log(err);
});
