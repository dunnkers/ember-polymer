/* eslint-env node */
module.exports = {
  test_page: 'tests/index.html?hidepassed',
  disable_watching: true,
  launch_in_ci: [
    'Chrome'
  ],
  launch_in_dev: [
    'Chrome'
  ],
  browser_args: {
    Chrome: {
<<<<<<< HEAD
      mode: 'ci',
      args: [
        // --no-sandbox is needed when running Chrome inside a container
        process.env.TRAVIS ? '--no-sandbox' : null,

        '--disable-gpu',
||||||| parent of 3b112e4... message
      mode: 'ci',
      args: [
        '--disable-gpu',
=======
      ci: [
        // --no-sandbox is needed when running Chrome inside a container
        process.env.CI ? '--no-sandbox' : null,
>>>>>>> 3b112e4... message
        '--headless',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-software-rasterizer',
        '--mute-audio',
        '--remote-debugging-port=0',
        '--window-size=1440,900'
<<<<<<< HEAD
      ]
    },
||||||| parent of 3b112e4... message
      ]
    }
=======
      ].filter(Boolean)
    }
>>>>>>> 3b112e4... message
  }
};
