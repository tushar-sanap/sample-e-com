const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('WH-19', function () {
  this.timeout(30000);
  const testSetup = new TestSetup();
  let commands;

  beforeEach(async () => {
    await testSetup.beforeEach(process.env.BROWSER || 'chrome');
    commands = testSetup.getCommands();
    await commands.visit('/');
    await commands.driver.executeScript(() => {
      Object.defineProperty(Node.prototype, 'textContent', { set() {}, get() { return ''; } });
    });
  });

  afterEach(async () => { await testSetup.afterEach(); });

  it('WH-19 Test', async () => {
    await commands.driver.executeScript(`
      const d = document.createElement('div');
      d.id = 'z';
      document.body.appendChild(d);
    `);
    await commands.driver.executeScript('document.getElementById("z").textContent = "hello"');
    const t = await commands.driver.executeScript('return document.getElementById("z").textContent');
    expect(t).to.equal('hello');
  });
});
