var Nightmare = require('nightmare');

new Nightmare({ show: true })
// go to main page
.goto('http://localhost:3000/') 
// go to login page
.click('#nav-register')
// enter email address
.type('#addEmail', 'abc@123.com')
// enter first name
.type('#addFirst', 'Login')
// enter last name
.type('#addLast','Nightmare')
// enter user name
.type('#addUserName', 'loginNightmare')
// enter password
.type('#addPassword', 'passw0rd')
// click sign up button
.click('#signUp')
// wait 5 seconds
.wait(5000)
// take screenshot save to current dir - 
.screenshot("userExists.png")
// end test
.end()
.then(function() {
    console.log('Done!');
})
// catch errors
.catch(function(err) {
    console.log(err);
});