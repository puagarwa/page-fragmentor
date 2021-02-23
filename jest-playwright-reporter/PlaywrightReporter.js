const callAPI = require('./helpers');
const TestSuiteInfo = require('./models/TestSuiteInfo');
const TestCaseInfo = require('./models/TestCaseInfo');
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
    this.postRunUrl = options.postRunUrl;
    this.postTestUrl = options.postTestUrl;
    this.runId = options.runId;
    this.workflowId = options.workflowId;
    this.workflowName = options.workflowName;
    this.workflowUrl = options.workflowUrl;
    this.repo = options.repo;
    this.accountId = options.accountId;
    this.branch = options.branch;
    this.triggerType = options.triggerType;
    this.triggerId = options.triggerId;
    this.triggerUrl = options.triggerUrl;
    this.testIdCounter = 1;
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
