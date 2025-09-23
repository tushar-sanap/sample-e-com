const { describe, it, beforeEach, afterEach } = require('mocha'); const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('5NF-01', function() {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;

  beforeEach(async () => {
    await ts.beforeEach('chrome'); commands = ts.getCommands();
    await commands.driver.executeScript(`
      const o=window.fetch; window.fetch=function(u,opts){ if(String(u).includes('/api/ping')){ return new Promise(()=>{});} return o.apply(this,arguments); };
    `);
    await commands.visit('/post-lab');
  });
  afterEach(async () => { await ts.afterEach(); });

  it('ping result is shown', async function() {
    const t = await (await commands.get('[data-testid="net-ping"]')).getText();
    expect(t.length > 0).to.equal(true);
  });
});
