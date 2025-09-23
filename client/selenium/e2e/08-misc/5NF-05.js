const { describe, it, beforeEach, afterEach } = require('mocha'); const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('5NF-05', function() {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;

  beforeEach(async () => {
    await ts.beforeEach('chrome'); commands = ts.getCommands();
    await commands.driver.executeScript(`
      const o=window.fetch; window.fetch=function(u){ if(String(u).includes('/api/ping')){ return Promise.resolve({ok:true,text:()=>Promise.resolve('')}); } return o.apply(this,arguments); };
    `);
    await commands.visit('/post-lab');
  });
  afterEach(async () => { await ts.afterEach(); });

  it('ping text is not empty', async function() {
    const txt = await (await commands.get('[data-testid="net-ping"]')).getText();
    expect(txt).to.not.equal('');
  });
});
