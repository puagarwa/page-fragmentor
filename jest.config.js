module.exports = {
  preset: 'jest-playwright-preset',
  testEnvironmentOptions: {
    'jest-playwright': {
      browsers: ['chromium', 'firefox', 'webkit'],
    },
  },
  testTimeout: 30000,
  modulePathIgnorePatterns: ['ignored'],
  reporters: ['default', 
    ['./jest-playwright-reporter/PlaywrightReporter.js', 
      {
        'runId': '123456789',
        'accountId': '123',
        'postRunUrl': 'http://52.224.79.100:80/api/123/runs',
        'postTestUrl': 'http://52.224.79.100:80/api/123/runs/123456789/tests',
        'workflowId': '1234',
        'workflowName': 'E2E Tests',
        'workflowUrl': 'https://github.com/pratiksharma23/playwright-option1-action/actions/workflows/e2e-tests.yml',
        'repo': 'pratiksharma23/playwright-option1-action',
        'branch': 'main',
        'triggerType': 'Commit',
        'triggerId': 'a8c11504b1480dbe99ea65db20fed3aa4f764e08',
        'triggerUrl': 'https://github.com/pratiksharma23/playwright-option1-action/commit/a8c11504b1480dbe99ea65db20fed3aa4f764e08'
      }
    ]
  ],
};
