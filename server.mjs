import fetch from 'node-fetch';
import express from 'express';
import bodyParser from 'body-parser';


let accessToken = process.env.ACCESS_TOKEN;
let refreshToken = process.env.REFRESH_TOKEN;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

const app = express();

app.use(bodyParser.json());

async function getAccessToken() {
  const response = await fetch('https://accounts.zoho.eu/oauth/v2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      'refresh_token': refreshToken,
      'client_id': clientId,
      'client_secret': clientSecret,
      'grant_type': 'refresh_token'
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Failed to refresh access token: ${data.error}`);
  }

  accessToken = data.access_token;
  return accessToken;
}

app.post('/form-submission', async (req, res) => {
  const { name, email, phonenumber, message } = req.body;

  if (!name || !email || !phonenumber || !message) {
    return res.status(400).send({ error: 'All fields are required' });
  }

  if (!validateEmail(email)) {
    return res.status(400).send({ error: 'Invalid email address' });
  }

  const accessToken = await getAccessToken();

  const leadData = {
    data: [{
      Last_Name: name,
      Email: email,
      Phone: phonenumber,
      Description: message
    }]
  };

  const response = await fetch('https://www.zohoapis.eu/crm/v2/Leads', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Zoho-oauthtoken ${accessToken}`
    },
    body: JSON.stringify(leadData)
  });

  const zohoResponse = await response.json();

  if (!response.ok) {
    return res.status(500).send({ error: `Failed to create lead in Zoho CRM: ${zohoResponse.error}` });
  }

  res.send({ success: true });
});

function validateEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
