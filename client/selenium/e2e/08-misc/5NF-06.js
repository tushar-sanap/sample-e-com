const { describe, it, beforeEach, afterEach } = require('mocha'); const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('5NF-06', function() {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;

  beforeEach(async () => {
    await ts.beforeEach('chrome'); commands = ts.getCommands();
    await commands.driver.executeScript(`
      const o=window.fetch; window.fetch=function(u){ if(String(u).includes('/api/data')){ return Promise.resolve({ok:true,json:()=>Promise.resolve({ a: { b: { c: 12 }}})});} return o.apply(this,arguments); };
    `);
    await commands.visit('/post-lab');
  });
  afterEach(async () => { await ts.afterEach(); });

  it('value equals 7', async function() {
    await commands.click('[data-testid="load-data"]');
    await commands.wait(200);
    const txt = await (await commands.get('[data-testid="net-data"]')).getText();
    expect(txt).to.equal('7');
  });
});
