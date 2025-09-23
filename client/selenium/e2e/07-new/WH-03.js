// WH-03 (fixed to fail for real)
const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('WH-03', function () {
  this.timeout(40000);
  const testSetup = new TestSetup();
  let commands;

  beforeEach(async function () {
    await testSetup.beforeEach(process.env.BROWSER || 'chrome');
    commands = testSetup.getCommands();
  });

  it('WH-03 Test', async function () {
    await commands.visit('/products');

    await commands.driver.executeScript(() => {
      window.__consoleErrorCount = 0;

      const install = () => {
        if (console.error && !console.error.__wh03Patched) {
          const orig = console.error;
          const wrapped = function (...args) {
            try { window.__consoleErrorCount++; } catch (_) {}
            return orig.apply(this, args);
          };
          wrapped.__wh03Patched = true;
          console.error = wrapped;
        }
      };

      install();
      clearInterval(window.__wh03Interval);
      window.__wh03Interval = setInterval(install, 250);

      window.addEventListener('error', () => { window.__consoleErrorCount++; });
      window.addEventListener('unhandledrejection', () => { window.__consoleErrorCount++; });
    });


    await commands.driver.executeScript('console.error(" error audit");');
    expect(true).to.be.true;
  });

  afterEach(async function () {
    const errors = await commands.driver.executeScript(() => window.__consoleErrorCount || 0);

    await testSetup.afterEach();


    if (errors > 0) {
      await commands.driver.executeScript(
        'browserstack_executor: {"action":"setSessionStatus","arguments":{"status":"failed","reason":"Console errors: ' + errors + '"}}'
      );
    }

    expect(errors, 'No console errors in test').to.equal(0); 
  });
});
