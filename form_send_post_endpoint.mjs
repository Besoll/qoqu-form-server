import fetch from 'node-fetch';

fetch('https://qoqu.nl/form-submission', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    'name': 'hjgajhdgjahgdjsahg',
    'email': 'test@example.com',
    'phonenumber': '123456789',
    'message': 'test22332'
  })
}).then(response => response.json()).then(data => console.log(data));
