var Nightmare = require('nightmare');

new Nightmare({ show: true })
// go to main page
.goto('http://localhost:3000/') 
// go to login page
.click('#nav-register')
// enter email address
.type('#add-email', 'abc@123.com')
// enter first name
.type('#add-first', 'Ernest')
// enter last name
.type('#add-last','Hemmingway')
// enter user name
.type('#add-username', 'ErnestH')
// enter password
.type('#add-password', 'passw0rd')
// click sign up button
.click('#sign-up')
// wait 2 seconds
.wait(2000)
.click('#nav-logout')
.wait(2000)
.click('#nav-register')
// enter email address
.type('#add-email', 'abc@123.com')
// enter first name
.type('#add-first', 'Mark')
// enter last name
.type('#add-last','Twain')
// enter user name
.type('#add-username', 'MTwain')
// enter password
.type('#add-password', 'passw0rd')
// click sign up button
.click('#sign-up')
// wait 2 seconds
.wait(2000)
.click('#nav-logout')
.wait(2000)
.click('#nav-register')
// enter email address
.type('#add-email', 'abc@123.com')
// enter first name
.type('#add-first', 'Stephen')
// enter last name
.type('#add-last','King')
// enter user name
.type('#add-username', 'StephKing')
// enter password
.type('#add-password', 'passw0rd')
// click sign up button
.click('#sign-up')
// wait 2 seconds
.wait(2000)
.click('#nav-logout')
.wait(2000)
.click('#nav-register')
// enter email address
.type('#add-email', 'abc@123.com')
// enter first name
.type('#add-first', 'JK')
// enter last name
.type('#add-last','Rowling')
// enter user name
.type('#add-username', 'JKRow')
// enter password
.type('#add-password', 'passw0rd')
// click sign up button
.click('#sign-up')
// wait 2 seconds
.wait(2000)
.click('#nav-logout')
.wait(2000)
.click('#nav-register')
// enter email address
.type('#add-email', 'abc@123.com')
// enter first name
.type('#add-first', 'John')
// enter last name
.type('#add-last','Steinbeck')
// enter user name
.type('#add-username', 'JohnnyFive')
// enter password
.type('#add-password', 'passw0rd')
// click sign up button
.click('#sign-up')
// wait 2 seconds
.wait(2000)
.click('#nav-logout')
.wait(2000)
.click('#nav-register')
// enter email address
.type('#add-email', 'abc@123.com')
// enter first name
.type('#add-first', 'William')
// enter last name
.type('#add-last','Shakespear')
// enter user name
.type('#add-username', 'BillyShakes')
// enter password
.type('#add-password', 'passw0rd')
// click sign up button
.click('#sign-up')
// wait 2 seconds
.wait(2000)
.click('#nav-logout')
.wait(2000)
.click('#nav-register')
// enter email address
.type('#add-email', 'abc@123.com')
// enter first name
.type('#add-first', 'CS')
// enter last name
.type('#add-last','Lewis')
// enter user name
.type('#add-username', 'TheLion')
// enter password
.type('#add-password', 'passw0rd')
// click sign up button
.click('#sign-up')
// wait 2 seconds
.wait(2000)
.click('#nav-logout')
.wait(2000)
.click('#nav-register')
// enter email address
.type('#add-email', 'abc@123.com')
// enter first name
.type('#add-first', 'Theodore Seuss')
// enter last name
.type('#add-last','Geisel')
// enter user name
.type('#add-username', 'TheDoc')
// enter password
.type('#add-password', 'passw0rd')
// click sign up button
.click('#sign-up')
// wait 2 seconds
.wait(2000)
.click('#nav-logout')
.wait(2000)
.click('#nav-register')
// enter email address
.type('#add-email', 'abc@123.com')
// enter first name
.type('#add-first', 'Charles')
// enter last name
.type('#add-last','Dickens')
// enter user name
.type('#add-username', 'ChuckyD')
// enter password
.type('#add-password', 'passw0rd')
// click sign up button
.click('#sign-up')
// wait 2 seconds
.wait(2000)
.click('#nav-logout')
.wait(2000)
// end test
.end()
.then(function() {
    console.log('Done!');
})
// catch errors
.catch(function(err) {
    console.log(err);
});