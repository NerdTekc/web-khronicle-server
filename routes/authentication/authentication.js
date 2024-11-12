const {application} = require("express");
const router = require('express').Router();
const axios = require('axios')
var db = require('../../db.js')
const { v4: uuidv4 } = require('uuid');

router.get('/', (req, res, next) => {
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}`)
});

// Handle OAuth callback
router.get('/oauth-callback', async (req, res) => {
  const { code } = req.query;
  
  if (!code) {
    return res.status(400).json({ error: 'Authorization code not found' });
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code
      },
      { headers: { accept: 'application/json' } }
    );

    const { access_token } = tokenResponse.data;

    if (!access_token) {
      return res.status(400).json({ error: 'Access token not received' });
    }

    // Fetch user information using the access token
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const userData = userResponse.data;

    try {
      const insert = `INSERT OR IGNORE INTO user (id, ghid, name, login, avatar_url, bio, email, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

      const userId = uuidv4();

      db.run(insert, [
        userId, 
        userData.id, 
        userData.name, 
        userData.login, 
        userData.avatar_url, 
        userData.bio, 
        userData.email, 
        userData.created_at
      ], function (err) {
          if (err) {
              console.error('Error inserting user:', err.message);
              return res.status(500).json({ error: 'Failed to create user.' });
          }else if (this.changes === 0) {
            console.log('User already exists with email:', userData.email);
        } else {
            console.log('User inserted successfully with ID:', userId);
        }
      });

      const redirectUrl = `${process.env.FRONTEND_URL}/?t=${access_token}&i=${userId}`
      res.redirect(redirectUrl);
    } catch (e) {}
  } catch (error) {
    console.error('Error during OAuth process:', error.message);
    res.status(500).json({ error: 'Failed to authenticate' });
  }
});

module.exports = router;
