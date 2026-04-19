const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('Q1-15 compare page loads', function () {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;
  beforeEach(async () => { await ts.beforeEach('chrome'); commands = ts.getCommands(); });
  afterEach(async () => { await ts.afterEach(); });
  it('compare page renders', async function () {
    await commands.visit('/compare');
    await commands.wait(600);
    const exists = await commands.driver.executeScript(
      "return !!document.querySelector('[data-testid=\"compare-page\"]')"
    );
    expect(exists).to.equal(true);
  });
});

describe('Q1-16 compare empty state', function () {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;
  beforeEach(async () => { await ts.beforeEach('chrome'); commands = ts.getCommands(); });
  afterEach(async () => { await ts.afterEach(); });
  it('shows empty placeholder initially', async function () {
    await commands.visit('/compare');
    await commands.wait(500);
    const hasEmpty = await commands.driver.executeScript(
      "return !!document.querySelector('[data-testid=\"compare-empty\"]')"
    );
    expect(hasEmpty).to.equal(true);
  });
});

describe('Q1-17 compare add product A', function () {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;
  beforeEach(async () => { await ts.beforeEach('chrome'); commands = ts.getCommands(); });
  afterEach(async () => { await ts.afterEach(); });
  it('adding product A builds the table', async function () {
    await commands.visit('/compare');
    await commands.wait(400);
    const btn = await commands.get('[data-testid="compare-add-a"]');
    await btn.click();
    await commands.wait(300);
    const hasTable = await commands.driver.executeScript(
      "return !!document.querySelector('[data-testid=\"compare-table\"]')"
    );
    expect(hasTable).to.equal(true);
  });
});

describe('Q1-18 compare two products', function () {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;
  beforeEach(async () => { await ts.beforeEach('chrome'); commands = ts.getCommands(); });
  afterEach(async () => { await ts.afterEach(); });
  it('two products produce two column headers', async function () {
    await commands.visit('/compare');
    await commands.wait(400);
    const a = await commands.get('[data-testid="compare-add-a"]');
    await a.click();
    await commands.wait(200);
    const b = await commands.get('[data-testid="compare-add-b"]');
    await b.click();
    await commands.wait(300);
    const n = await commands.driver.executeScript(
      "return document.querySelectorAll('[data-testid=\"compare-col-header\"]').length"
    );
    expect(n).to.equal(2);
  });
});

describe('Q1-19 compare remove product', function () {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;
  beforeEach(async () => { await ts.beforeEach('chrome'); commands = ts.getCommands(); });
  afterEach(async () => { await ts.afterEach(); });
  it('remove button shrinks the table', async function () {
    await commands.visit('/compare');
    await commands.wait(400);
    const a = await commands.get('[data-testid="compare-add-a"]');
    await a.click();
    await commands.wait(200);
    const b = await commands.get('[data-testid="compare-add-b"]');
    await b.click();
    await commands.wait(300);
    const remove = await commands.get('[data-testid="compare-remove-button"]');
    await remove.click();
    await commands.wait(300);
    const n = await commands.driver.executeScript(
      "return document.querySelectorAll('[data-testid=\"compare-col-header\"]').length"
    );
    expect(n).to.equal(1);
  });
});

describe('Q1-20 compare clear all', function () {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;
  beforeEach(async () => { await ts.beforeEach('chrome'); commands = ts.getCommands(); });
  afterEach(async () => { await ts.afterEach(); });
  it('clear resets the table back to empty', async function () {
    await commands.visit('/compare');
    await commands.wait(400);
    const a = await commands.get('[data-testid="compare-add-a"]');
    await a.click();
    await commands.wait(200);
    const c = await commands.get('[data-testid="compare-add-c"]');
    await c.click();
    await commands.wait(300);
    const clear = await commands.get('[data-testid="compare-clear-button"]');
    await clear.click();
    await commands.wait(300);
    const hasEmpty = await commands.driver.executeScript(
      "return !!document.querySelector('[data-testid=\"compare-empty\"]')"
    );
    expect(hasEmpty).to.equal(true);
  });
});
