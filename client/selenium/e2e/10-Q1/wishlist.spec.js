const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('Q1-01 wishlist page loads', function () {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;
  beforeEach(async () => { await ts.beforeEach('chrome'); commands = ts.getCommands(); });
  afterEach(async () => { await ts.afterEach(); });
  it('wishlist page renders', async function () {
    await commands.visit('/wishlist');
    await commands.wait(600);
    const exists = await commands.driver.executeScript(
      "return !!document.querySelector('[data-testid=\"wishlist-page\"]')"
    );
    expect(exists).to.equal(true);
  });
});

describe('Q1-02 wishlist empty state', function () {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;
  beforeEach(async () => { await ts.beforeEach('chrome'); commands = ts.getCommands(); });
  afterEach(async () => { await ts.afterEach(); });
  it('shows empty placeholder initially', async function () {
    await commands.visit('/wishlist');
    await commands.wait(600);
    const hasEmpty = await commands.driver.executeScript(
      "return !!document.querySelector('[data-testid=\"wishlist-empty\"]')"
    );
    expect(hasEmpty).to.equal(true);
  });
});

describe('Q1-03 wishlist add sample', function () {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;
  beforeEach(async () => { await ts.beforeEach('chrome'); commands = ts.getCommands(); });
  afterEach(async () => { await ts.afterEach(); });
  it('add sample creates a row', async function () {
    await commands.visit('/wishlist');
    await commands.wait(400);
    const btn = await commands.get('[data-testid="wishlist-add-sample"]');
    await btn.click();
    await commands.wait(400);
    const n = await commands.driver.executeScript(
      "return document.querySelectorAll('[data-testid=\"wishlist-item\"]').length"
    );
    expect(n).to.equal(1);
  });
});

describe('Q1-04 wishlist item has name', function () {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;
  beforeEach(async () => { await ts.beforeEach('chrome'); commands = ts.getCommands(); });
  afterEach(async () => { await ts.afterEach(); });
  it('added item shows its name', async function () {
    await commands.visit('/wishlist');
    await commands.wait(400);
    const btn = await commands.get('[data-testid="wishlist-add-sample"]');
    await btn.click();
    await commands.wait(400);
    const name = await commands.driver.executeScript(
      "const el = document.querySelector('[data-testid=\"wishlist-item-name\"]'); return el ? el.textContent : ''"
    );
    expect(String(name).length).to.be.greaterThan(0);
  });
});

describe('Q1-05 wishlist counter updates', function () {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;
  beforeEach(async () => { await ts.beforeEach('chrome'); commands = ts.getCommands(); });
  afterEach(async () => { await ts.afterEach(); });
  it('counter text increases after add', async function () {
    await commands.visit('/wishlist');
    await commands.wait(400);
    const btn = await commands.get('[data-testid="wishlist-add-sample"]');
    await btn.click();
    await commands.wait(300);
    await btn.click();
    await commands.wait(300);
    const text = await commands.driver.executeScript(
      "return (document.querySelector('[data-testid=\"wishlist-count\"]')||{}).textContent || ''"
    );
    expect(String(text).includes('2')).to.equal(true);
  });
});

describe('Q1-06 wishlist remove item', function () {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;
  beforeEach(async () => { await ts.beforeEach('chrome'); commands = ts.getCommands(); });
  afterEach(async () => { await ts.afterEach(); });
  it('remove button deletes the row', async function () {
    await commands.visit('/wishlist');
    await commands.wait(400);
    const addBtn = await commands.get('[data-testid="wishlist-add-sample"]');
    await addBtn.click();
    await commands.wait(300);
    const removeBtn = await commands.get('[data-testid="wishlist-remove-button"]');
    await removeBtn.click();
    await commands.wait(300);
    const n = await commands.driver.executeScript(
      "return document.querySelectorAll('[data-testid=\"wishlist-item\"]').length"
    );
    expect(n).to.equal(0);
  });
});

describe('Q1-07 wishlist clear all', function () {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;
  beforeEach(async () => { await ts.beforeEach('chrome'); commands = ts.getCommands(); });
  afterEach(async () => { await ts.afterEach(); });
  it('clear all empties the list', async function () {
    await commands.visit('/wishlist');
    await commands.wait(400);
    const addBtn = await commands.get('[data-testid="wishlist-add-sample"]');
    await addBtn.click();
    await commands.wait(200);
    await addBtn.click();
    await commands.wait(300);
    const clearBtn = await commands.get('[data-testid="wishlist-clear-all"]');
    await clearBtn.click();
    await commands.wait(300);
    const hasEmpty = await commands.driver.executeScript(
      "return !!document.querySelector('[data-testid=\"wishlist-empty\"]')"
    );
    expect(hasEmpty).to.equal(true);
  });
});
