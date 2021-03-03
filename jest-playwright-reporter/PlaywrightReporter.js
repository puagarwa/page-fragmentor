const registerRunResults = require('./helpers');
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
      : `https://${process.env.ENDPOINT}/api/${this.accountId}/runs`;
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
   * @param {TestRunResult} runResult - Results from the test run
   */
  onRunComplete(test, runResult) {
    const runInfo = new RunInfo(runResult);
    runInfo.id = this.runId;
    runInfo.accountId = this.accountId;
    runInfo.workflowId = this.workflowId;
    runInfo.workflowName = this.workflowName;
    runInfo.workflowUrl = this.workflowUrl;
    runInfo.repo = this.repo;
    runInfo.branch = this.branch;
    runInfo.triggerType = this.triggerType;
    runInfo.triggerId = this.triggerId;
    runInfo.triggerUrl = this.triggerUrl;
    runInfo.endTime = Date.now();

    registerRunResults(runResult, runInfo, this.postRunUrl);
  }

  onTestResult() {
  }
}

module.exports = PlaywrightReporter;
