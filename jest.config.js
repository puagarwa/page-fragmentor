module.exports = {
  preset: 'jest-playwright-preset',
  testEnvironmentOptions: {
    'jest-playwright': {
      browsers: ['chromium', 'firefox', 'webkit'],
    },
  },
  testTimeout: 30000,
  // modulePathIgnorePatterns: ['ignored'],
  reporters: ['default', 
    ['./jest-playwright-reporter/PlaywrightReporter.js', 
      {
        'accountId': '123',
        'runId': '12345678',
        'postRunUrl': 'http://localhost:5000/api/123/runs',
        'workflowName': 'E2E Tests',
        'workflowId': '12',
        'workflowUrl': 'https://github.com/pratiksharma23/page-fragmentor/actions/workflows/e2e.yml',
        'triggerType': 'Commit',
        'triggerId': 'SomethingRandom',
        'triggerUrl': 'http://www.github.com/pratiksharma23/page-fragmentor/commit/somethindRandom',
        'repo': 'pratiksharma23/page-fragmentor',
        'branch': 'ps.test'
      }
    ]
  ],
};
