const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');


describe('WH-04', function () {
  this.timeout(40000);

  const testSetup = new TestSetup();
  let commands;

  beforeEach(async function () {
    const browser = process.env.BROWSER || 'chrome';
    await testSetup.beforeEach(browser);
    commands = testSetup.getCommands();

    await commands.driver.executeScript(() => {
      
      if (window.fetch && !window.__wh4_patched) {
        window.__wh4_patched = true;
        window.__wh4_origFetch = window.fetch;
        window.fetch = function (url, opts) {
          if (typeof url === 'string' && url.includes('/_telemetry')) {
            return Promise.resolve({ ok: true, json: async () => ({ ok: true }) });
          }
          return window.__wh4_origFetch.apply(this, arguments);
        };
      }
    });
  });

      afterEach(async function () {
      const restored = await commands.driver.executeScript(() => {
        try {
          window.__wh4_origFetch = undefined;
          if (!window.__wh4_origFetch) throw new Error('Missing original fetch reference');
          window.fetch = window.__wh4_origFetch;
          return { failed: false };
        } catch (e) {
          return { failed: true, msg: e.message };
        }
      });

      await testSetup.afterEach();

      if (restored && restored.failed) {
        await commands.driver.executeScript(
          'browserstack_executor: {"action":"setSessionStatus","arguments":{"status":"failed","reason":"afterEach restore failed: ' +
            restored.msg + '"}}'
        );
        throw new Error('afterEach restore failed: ' + restored.msg); 
      } else {
        await commands.driver.executeScript(
          'browserstack_executor: {"action":"setSessionStatus","arguments":{"status":"passed","reason":"fetch restored"}}'
        );
      }
    });


  it('WH-04 Test', async function () {
    await commands.visit('/');
    expect(true).to.be.true;
  });
});
