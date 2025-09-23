const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('WH-Visual-01', function () {
  this.timeout(45000);
  const testSetup = new TestSetup();
  let commands;

  beforeEach(async function () {
    await testSetup.beforeEach('chrome');
    commands = testSetup.getCommands();
  });

  afterEach(async function () { await testSetup.afterEach(); });

  it('Visual Test 1', async function () {
    await commands.visit('/experience');
    await commands.shouldBeVisible('[data-testid="category-zone"]');

    const selects = await commands.getAll('[data-testid="category-select"]');
    expect(selects.length).to.be.greaterThan(1);

    await selects[0].sendKeys('Electronics');
    await commands.wait(600);

    const pill = await commands.get('[data-testid="category-visible-pill"]');
    const text = await pill.getText();
    expect(text).to.include('Electronics');
  });
});
