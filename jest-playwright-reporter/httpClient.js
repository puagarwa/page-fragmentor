const axios = require('axios');
const https = require('https');

async function getPostRunConfig(method, url, payload) {
  const config = {
    url,
    method,
    data: payload,
    headers: {
      'Content-Type': 'application/json',
      'Accept': '*/*',
    },
    httpsAgent: new https.Agent({ 
      keepAlive: true }),
    timeout: 600000,
  };
  return config;
}

async function getSasTokenConfig(method, url, runId) {
  const config = {
    url,
    method,
    params: {
      runId: runId,
    },
    headers: {
      'Content-Type': 'application/json',
      'Accept': '*/*',
    },
    httpsAgent: new https.Agent({ 
      keepAlive: true }),
    timeout: 600000,
  };
  return config;
}

async function callAPI(config) {
  try {
    const response = await axios(config);
    return response;
  } catch (error) {
    // console.error(error);
    return error;
  }
}

module.exports = {
  getPostRunConfig,
  getSasTokenConfig,
  callAPI,
}
