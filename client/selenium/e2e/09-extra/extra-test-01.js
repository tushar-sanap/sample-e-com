const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('Test Scenarios', function() {
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

  it('E-Case-A', async function() {
    await commands.visit('/test-env?config=legacy'); 
    const el = await commands.get('#vm-status');
    const status = await el.getText();
    expect(status).to.equal('Running');  
  });

  it('E-Case-B', async function() {
    await commands.visit('/test-env');
    await commands.driver.executeScript(`
      return fetch("http://local.info/endpoint");
    `);
    const text = await commands.get('#output-b').getText();
    expect(text).to.equal('OK');
  });

  it('E-Case-C', async function() {
    await commands.visit('/test-env?feature=beta'); 
    const output = await commands.get('#output-c');
    const text = await output.getText();
    expect(text).to.include('Loaded');  
  });

  it('E-Case-D', async function() {
    await commands.visit('/test-env');
    await commands.driver.executeScript(`
      Object.defineProperty(navigator, 'userAgent', { value: 'CustomAgent/99.0', configurable: true });
    `);
    const el = await commands.get('#output-d');
    const text = await el.getText();
    expect(text).to.equal('Supported');
  });

   it('E-Case-E', async function() {
    await commands.visit('/test-env?mode=stress'); 
    const el = await commands.get('#calc-status');
    const txt = await el.getText();
    expect(txt).to.equal('Done');  
  });

 it('E-Case-F', async function() {
    await commands.visit('/test-env?layout=blank'); 
    const el = await commands.get('#output-f');
    expect(await el.getText()).to.equal('Active'); 
  });

  it('E-Case-G', async function() {
    await commands.visit('/test-env');  
    const el = await commands.get('#server-time'); 
    const serverTime = await el.getText();
    expect(parseInt(serverTime) % 2).to.equal(0);  
  });

  it('E-Case-H', async function() {
    await commands.visit('/test-env');
    await commands.driver.executeScript(`
      sessionStorage.setItem('token', Date.now().toString());
    `);
    const el = await commands.get('#output-h');
    const txt = await el.getText();
    expect(txt).to.equal('Valid');
  });

    it('E-Case-I', async function() {
    await commands.visit('/test-env?session=legacy'); 
    const val = await commands.get('#session-value').getText();
    expect(val).to.equal('12345');  
  });

  it('E-Case-J', async function() {
    await commands.visit('/test-env');
    await commands.driver.executeScript(`
      return { id: Math.random() > 0.5 ? null : undefined, name: (Math.random() * 10000) };
    `);
    const el = await commands.get('#output-j');
    const txt = await el.getText();
    expect(txt).to.include('Valid JSON');
  });
});
