var Nightmare = require('nightmare');

new Nightmare({ show: true })
// go to main page
.goto('http://localhost:3000/') 
// go to login page
.click('#nav-register')
// enter email address
.type('#add-email', 'abc@123.com')
// enter first name
.type('#add-first', 'Registration')
// enter last name
.type('#add-last','Nightmare')
// enter user name
.type('#add-username', 'regNightmare')
// enter password
.type('#add-password', 'passw0rd')
// click sign up button
.click('#sign-up')
// wait 5 seconds
.wait(5000)
// take screenshot save to current dir
.screenshot("registered.png")
// end test
.end()
.then(function() {
    console.log('Done!');
})
// catch errors
.catch(function(err) {
    console.log(err);
});