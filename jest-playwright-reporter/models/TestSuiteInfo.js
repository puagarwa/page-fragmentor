const TestCaseInfo = require("./TestCaseInfo");

class TestSuiteInfo {
  constructor(testResult) {
    this.path = testResult.testFilePath;
    this.numFailedTests = testResult.numFailingTests;
    this.numPassedTests = testResult.numPassingTests;
    this.message = testResult.failureMessage;
    this.startTime = testResult.perfStats.start;
    this.endTime = testResult.perfStats.end;
    let i;
    this.tests = [];
    for (i = 0; i < testResult.testResults.length; i += 1) {
      if (testResult.testResults[i].status === 'pending') {
        continue;
      }
      const testCaseInfo = new TestCaseInfo(testResult.testResults[i]);
      this.tests.push(testCaseInfo);
    }
  }
}

module.exports = TestSuiteInfo;