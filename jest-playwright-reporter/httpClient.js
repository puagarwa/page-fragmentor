const axios = require('axios');
const https = require('https');
const fs = require('fs');

async function request(apiUrl, payload, certLocation, keyLocation) {
  const config = {
    url: apiUrl,
    method: 'post',
    data: payload,
    headers: {
      'Content-Type': 'application/json',
      'Accept': '*/*',
    },
    httpsAgent: new https.Agent({ 
      cert: fs.readFileSync(certLocation),
      key: fs.readFileSync(keyLocation),
      keepAlive: true }),
    timeout: 600000,
  };
  try {
    const response = await axios(config);
    return response;
  } catch (error) {
    console.error(error);
    return error;
  }
}

module.exports = request;
