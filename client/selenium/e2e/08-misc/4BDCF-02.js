const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('4BDCF-02', function () {
  this.timeout(45000);
  const ts = new TestSetup();
  let commands;

  beforeEach(async () => {
    await ts.beforeEach(process.env.BROWSER || 'chrome');
    commands = ts.getCommands();
    await commands.visit('/post-lab');
  });

  afterEach(async () => { await ts.afterEach(); });

  it('date control placeholder present', async function () {
    const els = await commands.getAll('[data-testid="native-date"]');
    expect(els.length).to.equal(1);

    const typeAttr = await els[0].getAttribute('type');
    expect((typeAttr || '').toLowerCase()).to.equal('date');

    const ph = await commands.driver.executeScript(`
      var i=document.querySelector('[data-testid="native-date"]');
      return i && (i.placeholder || i.getAttribute('placeholder') || '');
    `);

    expect(ph).to.not.equal('');
  });
});
