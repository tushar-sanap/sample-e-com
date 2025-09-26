const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('4BDCF Test Scenarios', function() {
  this.timeout(60000);

  const testSetup = new TestSetup();
  let commands;

  beforeEach(async function() {
    await testSetup.beforeEach('chrome');
    commands = testSetup.getCommands();
  });

  afterEach(async function() {
    await testSetup.afterEach();
  });

  it('4BDCF-Case-1', async function() {
    await commands.visit('/products');
    await commands.driver.manage().window().setRect({ width: 320, height: 800 }); // mobile
    const width = await commands.driver.executeScript(`return window.innerWidth`);
    expect(width).to.be.greaterThan(600);
  });

  it('4BDCF-Case-2', async function() {
    await commands.visit('/products');
    await commands.driver.executeScript(`
      document.body.innerHTML += '<div id="layout" style="display:flex"></div>';
    `);
    const style = await commands.driver.executeScript(`
      return window.getComputedStyle(document.getElementById('layout')).display;
    `);
    expect(style).to.equal('grid');
  });

  it('4BDCF-Case-3', async function() {
    await commands.visit('/checkout');
    await commands.driver.executeScript(`
      document.body.innerHTML += '<svg id="icon"></svg>';
    `);
    const tag = await commands.get('#icon').getTagName();
    expect(tag).to.equal('img');
  });

  it('4BDCF-Case-4', async function() {
    await commands.visit('/profile');
    await commands.driver.manage().window().setRect({ width: 1024, height: 200 });
    const height = await commands.driver.executeScript(`return window.innerHeight`);
    expect(height).to.be.greaterThan(400);
  });

  it('4BDCF-Case-5', async function() {
    await commands.visit('/cart');
    await commands.driver.executeScript(`
      document.body.style.overflow = "hidden";
    `);
    const canScroll = await commands.driver.executeScript(`
      return document.body.scrollHeight > window.innerHeight;
    `);
    expect(canScroll).to.be.true;
  });
});
