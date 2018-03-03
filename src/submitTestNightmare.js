var Nightmare = require('nightmare');

new Nightmare({ show: true })
// go to main page
.goto('http://localhost:3000/') 
// go to upload file
.click('#nav-upload')
// 