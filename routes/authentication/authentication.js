const {application} = require("express");
const router = require('express').Router();
const axios = require('axios')
router.get('/', (req, res, next) => {
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}`)
});

router.get('/oauth-callback', ({query: {code}}, res) =>{
  const body ={
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    code
  }
  const options ={headers: {accept: 'application/json'}}

  axios.post('https://github.com/login/oauth/access_token', body)
      .then(response => response.data)
      .then(data => {
         console.log(data)
       })
})

module.exports = router;
