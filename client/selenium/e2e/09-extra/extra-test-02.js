const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('9ABF Test Scenarios', function() {
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

  
  it('9ABF-Case-1', async function() {
    await commands.visit('/login');
    await (await commands.get('#email')).sendKeys('john@example.com');
    await (await commands.get('#password')).sendKeys('Ecomm@123');
    const loginbutton = await commands.get('[data-testid="login-button"]');
    await loginbutton.click();
    await commands.wait(2000);

    await commands.visit('/products');
    const firstProduct = await commands.get('[data-testid="product-card"]');
    await (await firstProduct.findElement({ css: 'button' })).click();
    await commands.wait(2000);

   
    await commands.visit('/cart?mode=desync');

    const subtotal = await commands.get('[data-testid="cart-subtotal"]').getText();
    const total = await commands.get('[data-testid="cart-total"]').getText();

    expect(subtotal).to.equal(total); 
  });

  
  it('9ABF-Case-2', async function() {
   
    await commands.visit('/checkout?mode=unstable');
    const bodyText = await commands.get('body').getText();
    expect(bodyText).to.not.include('Error');
  });

 
  it('9ABF-Case-3', async function() {
    await commands.visit('/checkout?cart=empty');

    const txt = await commands.get('body').getText();
    expect(txt).to.include('Items exist'); 
  });


  it('9ABF-Case-4', async function() {
    await commands.visit('/signup');
    await (await commands.get('#firstName')).sendKeys('John');
    await (await commands.get('#lastName')).sendKeys('Doe');
    await (await commands.get('#email')).sendKeys('john.doe@example.com');
    await (await commands.get('#password')).sendKeys('12345');
    await (await commands.get('#signup-button')).click();
    await commands.wait(2000);

  
    const finalPwd = await commands.get('#password').getAttribute('value');
    expect(finalPwd).to.equal('12345');
  });

 
  it('9ABF-Case-5', async function() {

    await commands.visit('/login?role=admin');

    const role = await commands.driver.executeScript(`
      return JSON.parse(localStorage.getItem('user')).role
    `);
    expect(role).to.equal('user'); 
  });
});
