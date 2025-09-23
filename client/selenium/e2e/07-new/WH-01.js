const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');


describe('WH-01', function () {
  this.timeout(15000); 

  const testSetup = new TestSetup();
  let commands;

  beforeEach(async function () {
    const browser = process.env.BROWSER || 'chrome';
    await testSetup.beforeEach(browser);
    commands = testSetup.getCommands();

   
    await commands.visit('/products');

    await new Promise(() => {}); 
  });

  afterEach(async function () {

    await testSetup.afterEach();
  });

  it('WH-01 Test', async function () {
    expect(true).to.equal(true); 
  });
});
