const { describe, it, before, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('9ABF Stock Management and Checkout Issues', function() {
  this.timeout(60000);
  
  const testSetup = new TestSetup();
  let commands;

  const loginUser = async () => {
    try {
      await commands.visit('/login');
      await commands.type('input[type="email"]', 'john@example.com');
      await commands.type('input[type="password"]', 'Ecomm@123');
      await commands.click('button[type="submit"]');
      await commands.wait(3000);
    } catch (error) {
      await commands.log('Login helper failed: ' + error.message);
    }
  };

  beforeEach(async function() {
    await testSetup.beforeEach('chrome');
    commands = testSetup.getCommands();
    // Set user agent to trigger 9ABF bugs
    await commands.driver.executeScript("Object.defineProperty(navigator, 'userAgent', {get: function(){return 'Mozilla/5.0 9ABF Test Agent';}});");
  });

  afterEach(async function() {
    await testSetup.afterEach();
  });

  it('9ABF Test 2 Stock Test', async function() {
    await loginUser();
    
    await commands.visit('/products');
    await commands.shouldBeVisible('[data-testid="products-container"], .products-container');
    
    const productCards = await commands.getAll('[data-testid="product-card"], .product-card');
    if (productCards.length > 0) {
      const firstProductText = await productCards[0].getText();
      const stockMatch = firstProductText.match(/stock[:\s]*(\d+)/i);
      let initialStock = null;
      
      if (stockMatch) {
        initialStock = parseInt(stockMatch[1]);
      }
      
      const addButtons = await commands.getAll('[data-testid="add-to-cart-button"], button:contains("Add to Cart")');
      if (addButtons.length > 0) {
        await addButtons[0].click();
        await commands.wait(1500);
        
        await commands.visit('/checkout');
        await commands.wait(2000);
        
        // Fill out checkout form
        const streetFields = await commands.getAll('[data-testid="street-input"]'); // or [data-testid="city-input"]
        if (streetFields.length > 0) {
          await streetFields[0].sendKeys('Street 123');
        }
       
       
        const cityFields = await commands.getAll('[data-testid="city-input"]'); 
        if (cityFields.length > 0) {
          await cityFields[0].sendKeys('Lucknow');
        }

        const stateFields = await commands.getAll('[data-testid="state-input"]'); // or [data-testid="city-input"]
        if (stateFields.length > 0) {
          await stateFields[0].sendKeys('UP');
        }
        
        const zipFields = await commands.getAll('[data-testid="zipcode-input"]'); // or [data-testid="city-input"]
        if (zipFields.length > 0) {
          await zipFields[0].sendKeys('842002');
        }

        const countryFields = await commands.getAll('[data-testid="country-select"]'); // or [data-testid="city-input"]
        if (countryFields.length > 0) {
          await countryFields.sendKeys('United States');
        }
        
        const paymentFields = await commands.getAll('[data-testid="payment-method-select"]'); // or [data-testid="city-input"]
        if (paymentFields.length > 0) {
          await paymentFields.sendKeys('Credit Card');
        }
        
        
        const submitButtons = await commands.getAll('[data-testid="place-order-button"]');
        if (submitButtons.length > 0) {
          await submitButtons[0].click();
          await commands.wait(4000);
          
          await commands.visit('/products');
          await commands.wait(2000);
          
          const updatedProductCards = await commands.getAll('[data-testid="product-card"], .product-card');
          if (updatedProductCards.length > 0) {
            const updatedProductText = await updatedProductCards[0].getText();
            const updatedStockMatch = updatedProductText.match(/stock[:\s]*(\d+)/i);
            
            if (initialStock !== null && updatedStockMatch) {
              const updatedStock = parseInt(updatedStockMatch[1]);
              
              expect(updatedStock).to.equal(initialStock - 1, 
                `Expected stock to decrease from ${initialStock} to ${initialStock - 1} but got ${updatedStock} - inventory update bug detected`);
            }
          }
        }
      }
    } else {
      this.skip('No products available for stock test');
    }
  });

  it('9ABF Test 3 Order ID', async function() {
    await loginUser();
    
    await commands.visit('/products');
    const addButtons = await commands.getAll('[data-testid="add-to-cart-button"], button:contains("Add to Cart")');
    if (addButtons.length > 0) {
      await addButtons[0].click();
      await commands.wait(1500);
      
      await commands.visit('/checkout');
      await commands.wait(2000);
      
       // Fill out checkout form
        const streetFields = await commands.getAll('[data-testid="street-input"]'); // or [data-testid="city-input"]
        if (streetFields.length > 0) {
          await streetFields[0].sendKeys('Street 123');
        }
       
       
        const cityFields = await commands.getAll('[data-testid="city-input"]'); 
        if (cityFields.length > 0) {
          await cityFields[0].sendKeys('Lucknow');
        }

        const stateFields = await commands.getAll('[data-testid="state-input"]'); // or [data-testid="city-input"]
        if (stateFields.length > 0) {
          await stateFields[0].sendKeys('UP');
        }
        
        const zipFields = await commands.getAll('[data-testid="zipcode-input"]'); // or [data-testid="city-input"]
        if (zipFields.length > 0) {
          await zipFields[0].sendKeys('842002');
        }

        const countryFields = await commands.getAll('[data-testid="country-select"]'); // or [data-testid="city-input"]
        if (countryFields.length > 0) {
          await countryFields.sendKeys('United States');
        }
        
        const paymentFields = await commands.getAll('[data-testid="payment-method-select"]'); // or [data-testid="city-input"]
        if (paymentFields.length > 0) {
          await paymentFields.sendKeys('Credit Card');
        }
        
        
     
      
      const submitButtons = await commands.getAll('[data-testid="place-order-button"]');
      if (submitButtons.length > 0) {
        await submitButtons[0].click();
        await commands.wait(4000);
        
        const currentUrl = await commands.driver.getCurrentUrl();
        if (currentUrl.includes('/success') || currentUrl.includes('/confirmation') || currentUrl.includes('/orders')) {
          const pageText = await commands.get('body').then(el => el.getText());
          
          const hasTransactionId = pageText.includes('Transaction ID') || 
                                 pageText.includes('Transaction:') ||
                                 pageText.includes('Reference:') ||
                                 pageText.match(/TXN[:\s]*[A-Z0-9]+/i) ||
                                 pageText.match(/REF[:\s]*[A-Z0-9]+/i);
          
          expect(hasTransactionId).to.be.true, 
            'Order confirmation should display transaction ID but none found - payment processing incomplete';
        }
      }
    } else {
      this.skip('No products available for checkout test');
    }
  });

  it('9ABF Test 4', async function() {
    await loginUser();

    await commands.visit('/cart');
    await commands.wait(2000);
    const quantityInputs1 = await commands.getAll('input[type="number"], [data-testid="item-quantity"]');
    const quantityInputs1Value = await quantityInputs1[0].getText();
    await commands.visit('/products');
    const addButtons = await commands.getAll('[data-testid="add-to-cart-button"], button:contains("Add to Cart")');
    if (addButtons.length >= 2) {
      await addButtons[0].click();
      await commands.wait(500);
      await addButtons[1].click();
      await commands.wait(1000);
      
      await commands.visit('/cart');
      await commands.wait(2000);
      
      const quantityInputs2 = await commands.getAll('input[type="number"], [data-testid="item-quantity"]');
      if (quantityInputs2.length > 0) {
        
        const quantityInputs2Value = await quantityInputs2[0].getText();
        expect(parseInt(quantityInputs2Value)).to.equal(parseInt(quantityInputs1Value) + 2);
      }
    } else {
      this.skip('Insufficient products for concurrent stock test');
    }
  });
});