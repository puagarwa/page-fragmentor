const childProcess = require('child_process');
const storage = require('@azure/storage-blob');
const fs = require('fs');
const { getPostRunConfig, getSasTokenConfig, callAPI } = require('./httpClient');
const TestCaseInfo = require('./models/TestCaseInfo');
const TestSuiteInfo = require('./models/TestSuiteInfo');

const testResultsFile = './testResults.json';
const testResultsFileZipped = './testResults.zip';

async function getSasUri(runId, accountId) {
  const sasApiUrl = `https://${process.env.ENDPOINT}/api/${accountId}/sasuri?runId=${runId}`;
  const config = await getSasTokenConfig(
    'get',
    sasApiUrl,
  );
  const response = await callAPI(config);
  return response.data.sasUri;
}

async function createBlobInContainer(containerClient, file) {
  // create blobClient for container
  const blobClient = containerClient.getBlockBlobClient(file);
  // upload file
  await blobClient.uploadFile(file);
}

async function registerTestResults(runId, testSuites, sasUri) {
  try {
    fs.writeFileSync(testResultsFile, JSON.stringify(testSuites));
    childProcess.execSync(`zip testResults ${testResultsFile}`);
    if (fs.existsSync(testResultsFileZipped) && sasUri && runId) {
      const blobService = new storage.BlobServiceClient(`${sasUri}`);
      const containerClient = blobService.getContainerClient(runId);
      await createBlobInContainer(containerClient, testResultsFileZipped);
    }
  } catch (error) {
    console.log(error);
  }
}

async function registerRunResults(runResult, runInfo, postRunUrl) {
  try {
    // POST run results
    const config = await getPostRunConfig(
      'post',
      postRunUrl,
      JSON.stringify(runInfo),
    );
    await callAPI(config);
  } catch (error) {
    console.log('Exception while posting run results.');
  }

  let i = 0; let j = 0; let id = 1;
  const testSuites = [];
  for (i = 0; i < runResult.testResults.length; i += 1) {
    const testCases = [];
    for (j = 0; j < runResult.testResults[i].testResults.length; j += 1) {
      const testCaseInfo = new TestCaseInfo(id, runResult.testResults[i].testResults[j]);
      id += 1;
      testCases.push(testCaseInfo);
    }
    const testSuiteInfo = new TestSuiteInfo(runResult.testResults[i]);
    testSuiteInfo.tests = testCases;
    testSuites.push(testSuiteInfo);
  }
  const sasUri = await getSasUri(runInfo.id, runInfo.accountId);
  await registerTestResults(runInfo.id, testSuites, sasUri);
}

module.exports = registerRunResults;
