const childProcess = require('child_process');
const storage = require('@azure/storage-blob');
const fs = require('fs');
const { getPostRunConfig, getSasTokenConfig, callAPI } = require('./httpClient');
const TestCaseInfo = require('./models/TestCaseInfo');
const TestSuiteInfo = require('./models/TestSuiteInfo');

// const artifactsDir = process.env.ARTIFACTS_DIR;
const testResultsFile = './testResults.json';
const testResultsFileZipped = './testResults.zip';

async function getSasUri(runId, accountId) {
  const sasApiUrl = `http://${process.env.ENDPOINT}/api/${accountId}/sasuri`;
  const config = await getSasTokenConfig(
    'get',
    sasApiUrl,
    runId,
  );
  const response = await callAPI(config);
  if (response.status !== '200') {
    // eslint-disable-next-line no-console
    console.log(response);
  }
  return response.data;
}

async function createBlobInContainer(containerClient, file) {
  // create blobClient for container
  const blobClient = containerClient.getBlockBlobClient(file);
  // upload file
  await blobClient.uploadFile(file);
}

async function registerTestResults(runId, testSuites, sasUri) {
  fs.writeFileSync(testResultsFile, JSON.stringify(testSuites));
  childProcess.execSync(`zip testResults ${testResultsFile}`);
  if (fs.existsSync(testResultsFileZipped) && sasUri && runId) {
    const blobService = new storage.BlobServiceClient(`${sasUri}`);
    const containerClient = blobService.getContainerClient(runId);
    // await containerClient.createIfNotExists({
    //   access: 'container',
    // });
    // upload file
    await createBlobInContainer(containerClient, testResultsFileZipped);
  }
  // await uploadArtifacts(containerClient);
}

// async function uploadArtifacts(containerClient) {
// }

async function registerRunResults(runResult, runInfo, postRunUrl) {
  try {
    // eslint-disable-next-line no-unused-vars
    // POST run results
    const config = await getPostRunConfig(
      'post',
      postRunUrl,
      JSON.stringify(runInfo),
    );
    const response = await callAPI(config);
    if (response.status !== '201') {
      // eslint-disable-next-line no-console
      console.log(response);
    }
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
  const sasUri = getSasUri(runInfo.id, runInfo.accountId);
  registerTestResults(runInfo.id, testSuites, sasUri);
}

module.exports = registerRunResults;
