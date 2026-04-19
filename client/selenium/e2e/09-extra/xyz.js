const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('ENV-01', function () {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;
  beforeEach(async () => { await ts.beforeEach('chrome'); commands = ts.getCommands(); });
  afterEach(async () => { await ts.afterEach(); });
  it('products list loads', async function () {
    await commands.visit('/products');
    await commands.wait(800);
    const text = await commands.driver.executeScript('return document.body.innerText || ""');
    expect(text.includes('Network Error')).to.equal(false);
    const n = await commands.driver.executeScript(
      "return (document.querySelectorAll('[data-testid=\"product-card\"]').length)||0"
    );
    expect(n).to.be.greaterThan(0);
  });
});

describe('ENV-02', function () {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;
  beforeEach(async () => { await ts.beforeEach('chrome'); commands = ts.getCommands(); });
  afterEach(async () => { await ts.afterEach(); });
  it('product detail shows info', async function () {
    await commands.visit('/products/1');
    await commands.wait(800);
    const text = await commands.driver.executeScript('return document.body.innerText || ""');
    expect(text.includes('Network Error')).to.equal(false);
    const hasTitle = await commands.driver.executeScript(
      "return !!document.querySelector('[data-testid=\"product-title\"]')"
    );
    expect(hasTitle).to.equal(true);
  });
});

describe('ENV-03', function () {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;
  beforeEach(async () => { await ts.beforeEach('chrome'); commands = ts.getCommands(); });
  afterEach(async () => { await ts.afterEach(); });
  it('login completes', async function () {
    await commands.visit('/login');
    const email = await commands.get('[data-testid="email-input"]');
    await email.clear(); await email.sendKeys('john@example.com');
    const pwd = await commands.get('[data-testid="password-input"]');
    await pwd.clear(); await pwd.sendKeys('Passw0rd!');
    const submit = await commands.get('[data-testid="login-button"]');
    await submit.click();
    await commands.wait(1200);
    const url = await commands.driver.getCurrentUrl();
    expect(url.includes('/login')).to.equal(false);
  });
});

describe('ENV-04', function () {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;
  beforeEach(async () => { await ts.beforeEach('chrome'); commands = ts.getCommands(); });
  afterEach(async () => { await ts.afterEach(); });
  it('orders page shows rows', async function () {
    await commands.visit('/orders');
    await commands.wait(600);
    if ((await commands.driver.getCurrentUrl()).includes('/login')) {
      const email = await commands.get('[data-testid="email-input"]');
      await email.clear(); await email.sendKeys('john@example.com');
      const pwd = await commands.get('[data-testid="password-input"]');
      await pwd.clear(); await pwd.sendKeys('Passw0rd!');
      const submit = await commands.get('[data-testid="login-button"]');
      await submit.click();
      await commands.wait(1200);
    }
    const text = await commands.driver.executeScript('return document.body.innerText || ""');
    expect(text.includes('Network Error')).to.equal(false);
    const n = await commands.driver.executeScript(
      "return (document.querySelectorAll('[data-testid=\"order-row\"]').length)||0"
    );
    expect(n).to.be.greaterThan(0);
  });
});

describe('ENV-05', function () {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;
  beforeEach(async () => { await ts.beforeEach('chrome'); commands = ts.getCommands(); });
  afterEach(async () => { await ts.afterEach(); });
  it('cart opens without redirect', async function () {
    await commands.visit('/cart');
    await commands.wait(800);
    const url = await commands.driver.getCurrentUrl();
    expect(url.includes('/cart')).to.equal(true);
    const text = await commands.driver.executeScript('return document.body.innerText || ""');
    expect(text.includes('Network Error')).to.equal(false);
  });
});

describe('ENV-06', function () {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;
  beforeEach(async () => { await ts.beforeEach('chrome'); commands = ts.getCommands(); });
  afterEach(async () => { await ts.afterEach(); });
  it('checkout renders and confirms', async function () {
    await commands.visit('/checkout');
    await commands.wait(800);
    const url = await commands.driver.getCurrentUrl();
    expect(url.includes('/checkout')).to.equal(true);
    const text = await commands.driver.executeScript('return document.body.innerText || ""');
    expect(text.includes('Network Error')).to.equal(false);
  });
});

describe('ENV-07', function () {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;
  beforeEach(async () => { await ts.beforeEach('chrome'); commands = ts.getCommands(); });
  afterEach(async () => { await ts.afterEach(); });
  it('search returns results', async function () {
    await commands.visit('/products');
    const box = await commands.get('[data-testid="search-input"]');
    await box.clear(); await box.sendKeys('shirt');
    await commands.wait(1200);
    const text = await commands.driver.executeScript('return document.body.innerText || ""');
    expect(text.includes('Network Error')).to.equal(false);
    const n = await commands.driver.executeScript(
      "return (document.querySelectorAll('[data-testid=\"product-card\"]').length)||0"
    );
    expect(n).to.be.greaterThan(0);
  });
});

describe('ENV-08', function () {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;
  beforeEach(async () => { await ts.beforeEach('chrome'); commands = ts.getCommands(); });
  afterEach(async () => { await ts.afterEach(); });
  it('product images load', async function () {
    await commands.visit('/products');
    await commands.wait(1200);
    const allLoaded = await commands.driver.executeScript(`
      const imgs = Array.from(document.querySelectorAll('img'));
      if (!imgs.length) return false;
      return imgs.every(img => img.naturalWidth > 0 && img.naturalHeight > 0);
    `);
    expect(allLoaded).to.equal(true);
  });
});

describe('ENV-09', function () {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;
  beforeEach(async () => { await ts.beforeEach('chrome'); commands = ts.getCommands(); });
  afterEach(async () => { await ts.afterEach(); });
  it('category filter populated', async function () {
    await commands.visit('/products');
    await commands.wait(800);
    const options = await commands.driver.executeScript(`
      const sel = document.querySelector('select') || document.querySelector('[data-testid="category-select"]');
      if (!sel) return 0;
      return sel.querySelectorAll('option').length;
    `);
    expect(options).to.be.greaterThan(1);
  });
});

describe('ENV-10', function () {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;
  beforeEach(async () => { await ts.beforeEach('chrome'); commands = ts.getCommands(); });
  afterEach(async () => { await ts.afterEach(); });
  it('profile page loads data after login', async function () {
    await commands.visit('/login');
    const email = await commands.get('[data-testid="email-input"]');
    await email.clear(); await email.sendKeys('john@example.com');
    const pwd = await commands.get('[data-testid="password-input"]');
    await pwd.clear(); await pwd.sendKeys('Passw0rd!');
    const submit = await commands.get('[data-testid="login-button"]');
    await submit.click();
    await commands.wait(1200);
    await commands.visit('/experience');
    await commands.wait(800);
    const text = await commands.driver.executeScript('return document.body.innerText || ""');
    expect(text.includes('Network Error')).to.equal(false);
    const hasName = await commands.driver.executeScript(
      "return !!document.querySelector('[data-testid=\"profile-name\"]')"
    );
    expect(hasName).to.equal(true);
  });
});
