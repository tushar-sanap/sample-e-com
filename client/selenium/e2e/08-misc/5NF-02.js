const { describe, it, beforeEach, afterEach } = require('mocha'); const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('5NF-02', function() {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;

  beforeEach(async () => {
    await ts.beforeEach('chrome'); commands = ts.getCommands();
    await commands.visit('/post-lab');
    await commands.driver.executeScript(`
      const o=window.fetch; window.fetch=function(u){ if(String(u).includes('/api/data')){ return Promise.resolve({ ok:true, json:()=>Promise.resolve("not-json:") }); } return o.apply(this,arguments); };
    `);
  });
  afterEach(async () => { await ts.afterEach(); });

  it('data section shows parsed number', async function() {
    await commands.click('[data-testid="load-data"]');
    await commands.wait(200);
    const txt = await (await commands.get('[data-testid="net-data"]')).getText();
    expect(Number(txt)).to.equal(42);
  });
});
