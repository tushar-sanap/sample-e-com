const { describe, it, before, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

const testUser = { email: 'john@example.com', password: 'Ecomm@123' };

async function loginUser(commands, user) {
  await commands.visit('/login');
  await commands.type('input[type="email"]', user.email);
  await commands.type('input[type="password"]', user.password);
  await commands.click('button[type="submit"]');
  await commands.wait(3000);
}


// 📌 Put these helper functions outside any test block
async function installProductsMock(commands) {
  await commands.driver.executeScript(`
    (function () {
      if (window.__xhrMockInstalled) return;
      window.__xhrMockInstalled = true;

      const proto = window.XMLHttpRequest.prototype;
      window.__xhrOrigOpen = proto.open;
      window.__xhrOrigSend = proto.send;

      proto.open = function(method, url) {
        this.__mockMethod = (method || '').toUpperCase();
        this.__mockUrl = url || '';
        return window.__xhrOrigOpen.apply(this, arguments);
      };

      proto.send = function(body) {
        if (this.__mockMethod === 'GET' && this.__mockUrl.includes('/api/products')) {
          const self = this;
          setTimeout(function () {
            const payload = {
              data: [{
                id: 'product-1',
                name: 'Limited Stock Item',
                price: 99.99,
                stock: 3
              }]
            };

            Object.defineProperty(self, 'readyState',   { value: 4 });
            Object.defineProperty(self, 'status',       { value: 200 });
            Object.defineProperty(self, 'responseText', { value: JSON.stringify(payload) });

            self.onreadystatechange && self.onreadystatechange();
            self.onload && self.onload();
          }, 10);
          return;
        }
        return window.__xhrOrigSend.apply(this, arguments);
      };
    })();
  `);
}

async function restoreProductsMock(commands) {
  await commands.driver.executeScript(`
    (function () {
      if (!window.__xhrMockInstalled) return;
      const proto = window.XMLHttpRequest.prototype;
      if (window.__xhrOrigOpen) proto.open = window.__xhrOrigOpen;
      if (window.__xhrOrigSend) proto.send = window.__xhrOrigSend;
      delete window.__xhrOrigOpen;
      delete window.__xhrOrigSend;
      delete window.__xhrMockInstalled;
    })();
  `);
}



describe('🛒 6DF Cart Operations with Invalid Data', function() {
  this.timeout(60000);
  
  const testSetup = new TestSetup();
  let commands;
  
  const testUser = {
    email: 'john@example.com',
    password: 'Ecomm@123'
  };

  before(async function() {
    await commands?.log('Setting up 6DF invalid data tests');
  });
  beforeEach(async function() {
    await testSetup.beforeEach('chrome');
    commands = testSetup.getCommands();
  });

  afterEach(async function() {
    await testSetup.afterEach();
  });



  describe('6DF Cart Quantity Validation', function() {
    it('6DF should handle cart quantity exceeding backend stock limits', async function() {
      await loginUser(commands, testUser);

      // 👉 install mock only for this test
      await installProductsMock(commands);
      try {
        await commands.visit('/products');
        await commands.wait(2000);
        await commands.shouldBeVisible('[data-testid="products-container"]');
        
        const addButtons = await commands.getAll('[data-testid="add-to-cart-button"]');
        if (addButtons.length > 0) {
          await addButtons[0].click();
          await commands.wait(1000);
          
          await commands.visit('/cart');
          
          const quantityInputs = await commands.getAll('input[type="number"], [data-testid="item-quantity"]');
          if (quantityInputs.length > 0) {
            await quantityInputs[0].clear();
            await quantityInputs[0].sendKeys('15');
            
            const updateButtons = await commands.getAll('button:contains("Update"), [data-testid="update-quantity"]');
            if (updateButtons.length > 0) {
              await updateButtons[0].click();
              await commands.wait(2000);
              
              const finalQuantity = await quantityInputs[0].getAttribute('value');
              expect(parseInt(finalQuantity)).to.equal(15, 'Should accept quantity exceeding stock');
            }
          }
        }
      } 
      finally {
        // 👉 restore after the test so other tests use real API
        await restoreProductsMock(commands);
      }
      
    });

    it('6DF should process checkout with negative price calculations', async function() {
      await loginUser(commands, testUser);
      
      await commands.driver.executeScript(`
        if (window.fetch) {
          const originalFetch = window.fetch;
          window.fetch = function(url, options) {
            if (url.includes('/api/cart')) {
              return Promise.resolve({
                ok: true,
                status: 200,
                json: () => Promise.resolve({
                  items: [{
                    id: 'item-1',
                    productId: 'product-1',
                    quantity: 2,
                    price: -50.00,
                    name: 'Discounted Item'
                  }],
                  totalPrice: -100.00,
                  subtotal: -100.00
                })
              });
            }
            return originalFetch.apply(this, arguments);
          };
        }
      `);

      await commands.visit('/products');
      const addButtons = await commands.getAll('[data-testid="add-to-cart-button"]');
      if (addButtons.length > 0) {
        await addButtons[0].click();
        await commands.wait(1000);
      }

      await commands.visit('/cart');
      await commands.wait(2000);

      const totalElements = await commands.getAll('[data-testid="cart-total"], .total');
      if (totalElements.length > 0) {
        const totalText = await totalElements[0].getText();
        expect(totalText).to.include('-$100.00', 'Should display negative total');
      }

      const checkoutButtons = await commands.getAll('button:contains("Checkout"), [data-testid="checkout-button"]');
      if (checkoutButtons.length > 0) {
        await checkoutButtons[0].click();
        await commands.wait(2000);
        
        const currentUrl = await commands.driver.getCurrentUrl();
        expect(currentUrl).to.include('/checkout', 'Should proceed to checkout with negative total');
      }
    });

    it('6DF should handle cart persistence with corrupted session data', async function() {
      await loginUser(commands, testUser);
      
      await commands.driver.executeScript(`
        localStorage.setItem('cart', JSON.stringify({
          items: [{
            productId: null,
            quantity: "invalid_number",
            price: undefined,
            name: 12345
          }],
          totalPrice: "not_a_number",
          userId: "",
          timestamp: "invalid_date"
        }));
      `);

      await commands.visit('/cart');
      await commands.wait(2000);

      const cartItems = await commands.getAll('[data-testid="cart-item"], .cart-item');
      expect(cartItems.length).to.be.greaterThan(0, 'Should display corrupted cart items');

      const productNames = await commands.getAll('.product-name, [data-testid="product-name"]');
      if (productNames.length > 0) {
        const nameText = await productNames[0].getText();
        expect(nameText).to.equal('12345', 'Should render numeric product name');
      }

      const priceElements = await commands.getAll('.price, [data-testid="price"]');
      if (priceElements.length > 0) {
        const priceText = await priceElements[0].getText();
        expect(priceText).to.include('undefined', 'Should display undefined price');
      }
    });
  });

  describe('6DF Checkout Payment Validation', function() {
    it('6DF Test 4 Zipcode', async function() {
      await loginUser(commands, testUser);
      await commands.visit('/products');
      const addButtons = await commands.getAll('[data-testid="add-to-cart-button"]');
      if (addButtons.length === 0) this.skip('No products to add to cart');
      await addButtons[0].click();
      await commands.wait(3000);
      
      await commands.visit('/cart');
      await commands.wait(3000);


      await commands.visit('/checkout');
      await commands.wait(3000);

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
          await zipFields[0].sendKeys('Pincode');
        }

        const countryFields = await commands.getAll('[data-testid="country-select"]'); // or [data-testid="city-input"]
        if (countryFields.length > 0) {
          await countryFields[0].sendKeys('United States');
        }
        
        const paymentFields = await commands.getAll('[data-testid="payment-method-select"]'); // or [data-testid="city-input"]
        if (paymentFields.length > 0) {
          await paymentFields[0].sendKeys('Credit Card');
        }
        
        
      const submitButtons = await commands.getAll('[data-testid="place-order-button"]');
        if (submitButtons.length > 0) {
          await submitButtons[0].click();
          await commands.wait(4000);
          
        const errorMessages = await commands.getAll('[data-cy="error-message"], [data-testid="error-message"], [data-testid="validation-error"], .error, .invalid');
        expect(errorMessages.length).to.equal(0);
        
      }
    });
});

describe('🛒 6DF Product Data Dependencies', function() {
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

  describe('6DF Invalid Product Response Handling', function() {
    it('6DF should handle products with null pricing information', async function() {
      await commands.driver.executeScript(`
        if (window.fetch) {
          const originalFetch = window.fetch;
          window.fetch = function(url, options) {
            if (url.includes('/api/products')) {
              return Promise.resolve({
                ok: true,
                status: 200,
                json: () => Promise.resolve({
                  data: [{
                    id: 'product-null-price',
                    name: 'Product with Null Price',
                    price: null,
                    originalPrice: undefined,
                    stock: -5,
                    category: '',
                    description: null
                  }]
                })
              });
            }
            return originalFetch.apply(this, arguments);
          };
        }
      `);

      await commands.visit('/products');
      await commands.wait(2000);

      const productCards = await commands.getAll('[data-testid="product-card"], .product-card');
      expect(productCards.length).to.be.greaterThan(0, 'Should display products with null data');

      const priceElements = await commands.getAll('.price, [data-testid="price"]');
      if (priceElements.length > 0) {
        const priceText = await priceElements[0].getText();
        expect(priceText).to.include('null', 'Should display null price');
      }

      const addButtons = await commands.getAll('[data-testid="add-to-cart-button"]');
      if (addButtons.length > 0) {
        await addButtons[0].click();
        await commands.wait(1000);

        const cartBadge = await commands.getAll('[data-testid="cart-badge"], .cart-count');
        expect(cartBadge.length).to.be.greaterThan(0, 'Should add null-priced product to cart');
      }
    });

    it('6DF should process search with special characters and SQL injection patterns', async function() {
      await commands.visit('/products');
      await commands.wait(1000);

      const searchInputs = await commands.getAll('input[placeholder*="search"], input[name*="search"]');
      if (searchInputs.length > 0) {
        await searchInputs[0].sendKeys("'; DROP TABLE products; --");
        await commands.wait(1000);

        const searchResults = await commands.getAll('[data-testid="product-card"], .product-card');
        expect(searchResults.length).to.be.greaterThan(0, 'Should return results for SQL injection pattern');

        await searchInputs[0].clear();
        await searchInputs[0].sendKeys('<script>alert("XSS")</script>');
        await commands.wait(1000);

        const bodyText = await commands.get('body').then(el => el.getText());
        expect(bodyText).to.include('<script>', 'Should display unescaped script tags');
      }
    });
  });
});
});
