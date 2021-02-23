const request = require('./httpClient');

async function callAPI(url, payload) {
  // console.log(JSON.stringify(payload));
  const response = await request(
    url,
    JSON.stringify(payload),
    'jest-playwright-reporter/certificate.crt',
    'jest-playwright-reporter/privateKey.key',
  );
  // eslint-disable-next-line no-console
  console.log(response);
}

module.exports = callAPI;
