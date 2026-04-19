const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('Q1-08 currency page loads', function () {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;
  beforeEach(async () => { await ts.beforeEach('chrome'); commands = ts.getCommands(); });
  afterEach(async () => { await ts.afterEach(); });
  it('currency page renders', async function () {
    await commands.visit('/currency');
    await commands.wait(600);
    const exists = await commands.driver.executeScript(
      "return !!document.querySelector('[data-testid=\"currency-page\"]')"
    );
    expect(exists).to.equal(true);
  });
});

describe('Q1-09 currency amount input', function () {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;
  beforeEach(async () => { await ts.beforeEach('chrome'); commands = ts.getCommands(); });
  afterEach(async () => { await ts.afterEach(); });
  it('amount input is present and editable', async function () {
    await commands.visit('/currency');
    await commands.wait(400);
    const input = await commands.get('[data-testid="currency-amount-input"]');
    await input.clear();
    await input.sendKeys('250');
    const val = await input.getAttribute('value');
    expect(val).to.equal('250');
  });
});

describe('Q1-10 currency selects populated', function () {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;
  beforeEach(async () => { await ts.beforeEach('chrome'); commands = ts.getCommands(); });
  afterEach(async () => { await ts.afterEach(); });
  it('from/to dropdowns have multiple currencies', async function () {
    await commands.visit('/currency');
    await commands.wait(400);
    const counts = await commands.driver.executeScript(`
      const f = document.querySelector('[data-testid="currency-from-select"]');
      const t = document.querySelector('[data-testid="currency-to-select"]');
      return [f ? f.querySelectorAll('option').length : 0, t ? t.querySelectorAll('option').length : 0];
    `);
    expect(counts[0]).to.be.greaterThan(2);
    expect(counts[1]).to.be.greaterThan(2);
  });
});

describe('Q1-11 currency convert produces result', function () {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;
  beforeEach(async () => { await ts.beforeEach('chrome'); commands = ts.getCommands(); });
  afterEach(async () => { await ts.afterEach(); });
  it('clicking convert fills the result', async function () {
    await commands.visit('/currency');
    await commands.wait(400);
    const btn = await commands.get('[data-testid="currency-convert-button"]');
    await btn.click();
    await commands.wait(300);
    const text = await commands.driver.executeScript(
      "return (document.querySelector('[data-testid=\"currency-result\"]')||{}).textContent || ''"
    );
    expect(String(text).length).to.be.greaterThan(0);
  });
});

describe('Q1-12 currency result format', function () {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;
  beforeEach(async () => { await ts.beforeEach('chrome'); commands = ts.getCommands(); });
  afterEach(async () => { await ts.afterEach(); });
  it('result contains equals sign', async function () {
    await commands.visit('/currency');
    await commands.wait(400);
    const btn = await commands.get('[data-testid="currency-convert-button"]');
    await btn.click();
    await commands.wait(300);
    const text = await commands.driver.executeScript(
      "return (document.querySelector('[data-testid=\"currency-result\"]')||{}).textContent || ''"
    );
    expect(String(text).includes('=')).to.equal(true);
  });
});

describe('Q1-13 currency swap button', function () {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;
  beforeEach(async () => { await ts.beforeEach('chrome'); commands = ts.getCommands(); });
  afterEach(async () => { await ts.afterEach(); });
  it('swap exchanges from and to currencies', async function () {
    await commands.visit('/currency');
    await commands.wait(400);
    const before = await commands.driver.executeScript(`
      const f = document.querySelector('[data-testid="currency-from-select"]');
      const t = document.querySelector('[data-testid="currency-to-select"]');
      return [f ? f.value : '', t ? t.value : ''];
    `);
    const swap = await commands.get('[data-testid="currency-swap-button"]');
    await swap.click();
    await commands.wait(300);
    const after = await commands.driver.executeScript(`
      const f = document.querySelector('[data-testid="currency-from-select"]');
      const t = document.querySelector('[data-testid="currency-to-select"]');
      return [f ? f.value : '', t ? t.value : ''];
    `);
    expect(after[0]).to.equal(before[1]);
    expect(after[1]).to.equal(before[0]);
  });
});

describe('Q1-14 currency zero amount', function () {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;
  beforeEach(async () => { await ts.beforeEach('chrome'); commands = ts.getCommands(); });
  afterEach(async () => { await ts.afterEach(); });
  it('zero input produces zero result', async function () {
    await commands.visit('/currency');
    await commands.wait(400);
    const input = await commands.get('[data-testid="currency-amount-input"]');
    await input.clear();
    await input.sendKeys('0');
    const btn = await commands.get('[data-testid="currency-convert-button"]');
    await btn.click();
    await commands.wait(300);
    const text = await commands.driver.executeScript(
      "return (document.querySelector('[data-testid=\"currency-result\"]')||{}).textContent || ''"
    );
    expect(String(text).includes('0.00')).to.equal(true);
  });
});
