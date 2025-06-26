const express = require('express');
const axios = require('axios');
const app = express();
const path = require('path');

const CLIENT_ID = '1387844630812561489';
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET'; // เปลี่ยนเป็นค่าของคุณ
const REDIRECT_URI = 'http://localhost:3000/auth/discord/callback';

app.use(express.static('public'));
app.use(express.json());

// หน้าแรก
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// รับ code จาก Discord
app.post('/auth/discord', async (req, res) => {
  try {
    const { code } = req.body;
    
    // แลก code เป็น token
    const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', 
      new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const accessToken = tokenResponse.data.access_token;
    
    // รับข้อมูลผู้ใช้
    const userResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    res.json({ user: userResponse.data });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});