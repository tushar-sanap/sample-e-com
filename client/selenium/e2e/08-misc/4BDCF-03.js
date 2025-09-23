const { describe, it, beforeEach, afterEach } = require('mocha'); const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('4BDCF-03', function() {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;
  beforeEach(async () => { await ts.beforeEach(process.env.BROWSER || 'chrome'); commands = ts.getCommands(); await commands.visit('/post-lab'); });
  afterEach(async () => { await ts.afterEach(); });

  it('canvas data url size is constant', async function() {
    const len = await commands.driver.executeScript(`
      const c=document.querySelector('[data-testid="canv"]'); const x=c.getContext('2d'); x.fillStyle='#000'; x.fillRect(0,0,140,40); return c.toDataURL().length;
    `);
    expect(len).to.equal(370);
  });
});
