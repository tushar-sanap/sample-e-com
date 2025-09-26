const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('6DF Test Scenarios', function() {
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

  it('6DF-Case-1', async function() {
    await commands.visit('/signup');

    const email = await commands.get('#email'); 
    await email.clear();
    await email.sendKeys('not-an-email'); 

    const val = await email.getAttribute('value');
    expect(val).to.match(/.+@.+\..+/); 
    });


  it('6DF-Case-2', async function() {
    await commands.visit('/signup');

    const lastName = await commands.get('#lastName');
    await lastName.clear();
    await lastName.sendKeys('12345'); 

    const val = await lastName.getAttribute('value');
    expect(val).to.match(/^[A-Za-z]+$/); 
    });

  it('6DF-Case-3', async function() {
    await commands.visit('/cart');

   
    await commands.driver.executeScript(`
        document.querySelector('[data-testid="item-price"]').innerText = "12.345";
    `);

    const val = await commands.get('[data-testid="item-price"]').getText();
    expect(val).to.match(/^[0-9]+\.[0-9]{2}$/); 
    });


  it('6DF-Case-4', async function() {
    await commands.visit('/cart');

    
    await commands.driver.executeScript(`
        const qty = document.querySelector('[data-testid="item-quantity"]');
        if (qty) qty.value = "-5";
    `);

    const val = await commands.get('[data-testid="item-quantity"]').getAttribute('value');
    expect(parseInt(val)).to.be.greaterThan(0); 
});


  it('6DF-Case-5', async function() {
    await commands.visit('/checkout');
    await commands.driver.executeScript(`
      document.body.innerHTML += '<input id="date" value="25-12-2025">';
    `);
    const val = await commands.get('#date').getAttribute('value');
    expect(val).to.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/);
  });
});
