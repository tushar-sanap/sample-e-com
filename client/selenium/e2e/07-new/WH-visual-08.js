const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('WH-Visual-08', function () {
  this.timeout(45000);
  const testSetup = new TestSetup();
  let commands;

  beforeEach(async () => {
    await testSetup.beforeEach('chrome');
    commands = testSetup.getCommands();
  });

  afterEach(async () => { await testSetup.afterEach(); });

  it('Visual Test 8', async function () {
    await commands.visit('/experience');
    const cta = await commands.get('[data-testid="slide1-cta"]');
    await commands.driver.executeScript('arguments[0].dispatchEvent(new MouseEvent("mouseenter",{bubbles:true}))', cta);
    await cta.click();
    await commands.wait(300);
    const out = await commands.get('[data-testid="carousel-result"]').then(e => e.getText());
    expect(out).to.include('Slide 1');
  });
});
