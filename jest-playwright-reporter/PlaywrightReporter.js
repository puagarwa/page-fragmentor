const callAPI = require('./helpers');
const TestSuiteInfo = require('./models/TestSuiteInfo');
const RunInfo = require('./models/RunInfo');

class PlaywrightReporter {
  /**
   * constructor for the reporter
   *
   * @param {Object} globalConfig - Jest configuration object
   * @param {Object} options - Options object defined in jest config
   */
  constructor(globalConfig, options = {}) {
    this._globalConfig = globalConfig;
    this.options = options;
    this.accountId = options.accountId ? options.accountId : process.env.ACCOUNT_ID;
    this.runId = options.runId ? options.runId : process.env.GITHUB_RUN_ID;
    this.postRunUrl = options.postRunUrl ? options.postRunUrl
      : `http://${process.env.ENDPOINT}/api/${this.accountId}/runs`;
    this.postTestUrl = options.postTestUrl ? options.postTestUrl
      : `http://${process.env.ENDPOINT}/api/${this.accountId}/runs/${this.runId}/tests`;
    this.workflowId = options.workflowId;
    this.workflowName = options.workflowName ? options.workflowName : process.env.GITHUB_WORKFLOW;
    this.workflowUrl = options.workflowUrl;
    this.repo = options.repo ? options.repo : process.env.GITHUB_REPOSITORY;
    this.branch = options.branch ? options.branch : process.env.BRANCH_NAME;
    this.triggerType = options.triggerType;
    this.triggerId = options.triggerId ? options.triggerId : process.env.GITHUB_SHA;
    this.triggerUrl = `https://www.github.com/${this.repo}/commit/${this.triggerId}`;
    this.testIdCounter = Number(process.env.ID);
  }

  onRunStart() {
  }

  /**
   * @param {string} test - The Test last run
   * @param {JestTestRunResult} runResult - Results from the test run
   */
  onRunComplete(test, runResult) {
    const runResultInfo = new RunInfo(runResult);
    runResultInfo.id = this.runId;
    runResultInfo.accountId = this.accountId;
    runResultInfo.workflowId = this.workflowId;
    runResultInfo.workflowName = this.workflowName;
    runResultInfo.workflowUrl = this.workflowUrl;
    runResultInfo.repo = this.repo;
    runResultInfo.branch = this.branch;
    runResultInfo.triggerType = this.triggerType;
    runResultInfo.triggerId = this.triggerId;
    runResultInfo.triggerUrl = this.triggerUrl;
    runResultInfo.endTime = Date.now();

    callAPI(this.postRunUrl, runResultInfo);
  }

  /**
   * @param {JestTestSuiteRunConfig} testRunConfig - Context information about the test run
   * @param {JestTestSuiteResult} testSuiteResult - Results for the test suite just executed
   * @param {JestTestRunResult} runResult - Results for the test run at the point in time of the test suite being executed
   */
  onTestResult(testRunConfig, testSuiteResult, runResult) {
    const testSuiteInfo = new TestSuiteInfo(testSuiteResult);
    testSuiteInfo.runId = this.runId;
    testSuiteInfo.accountId = this.accountId;
    testSuiteInfo.id = this.testIdCounter.toString();
    this.testIdCounter += 1;
    // let i;
    // for (i = 0; i < testSuiteResult.testResults.length; i += 1) {
    //   const testCaseInfo = new TestCaseInfo(testSuiteResult.testResults[i]);
    //   testSuiteInfo.testCaseInfos.push(testCaseInfo);
    // }
    callAPI(this.postTestUrl, testSuiteInfo);
  }
}

module.exports = PlaywrightReporter;
