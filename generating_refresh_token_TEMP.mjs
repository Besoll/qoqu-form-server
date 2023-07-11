import fetch from 'node-fetch';

// Sending data with POST in order to generate Refresh Token
fetch('https://accounts.zoho.eu/oauth/v2/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    'client_id': process.env.CLIENT_ID,
    'client_secret': process.env.CLIENT_SECRET,
    'redirect_uri': process.env.REDIRECT_URI,
    'code': process.env.CODE,
    'grant_type': process.env.GRANT_TYPE
  })
}).then(response => response.json()).then(data => console.log(data));


