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
        'workflowId': '12',
        'workflowUrl': 'https://github.com/pratiksharma23/page-fragmentor/actions/workflows/e2e.yml',
        'triggerType': 'Commit'
      }
    ]
  ],
};
