class TestCaseInfo {
  constructor(testCaseResult) {
    this.duration = testCaseResult.duration;
    this.name = testCaseResult.fullName;
    this.status = testCaseResult.status;
    this.title = testCaseResult.title;
    this.failureMessages = testCaseResult.failureMessages;
  }
}

module.exports = TestCaseInfo;