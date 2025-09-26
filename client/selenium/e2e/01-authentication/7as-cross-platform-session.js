const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('7ASF Cross-Platform Session Validation', function() {
  this.timeout(60000);
  
  const testSetup = new TestSetup();
  let commands;
  
  const testUsers = {
    validUser: {
      email: 'john@example.com',
      password: 'Ecomm@123',
      firstName: 'John',
      lastName: 'Doe'
    }
  };

  beforeEach(async function() {
    await testSetup.beforeEach('chrome');
    commands = testSetup.getCommands();
  });

  afterEach(async function() {
    await testSetup.afterEach();
  });

  describe('7ASF Token Refresh Edge Cases', function() {
    it('7ASF should handle login with concurrent token refresh attempts', async function() {
      await commands.visit('/login');
      
      await commands.driver.executeScript(`
        localStorage.setItem('refreshToken', 'refresh_' + Date.now());
        localStorage.setItem('tokenExpiry', Date.now() + 1000);
      `);
      
      await commands.type('#email', testUsers.validUser.email);
      await commands.type('#password', testUsers.validUser.password);
      
      await commands.driver.executeScript(`
        const originalFetch = window.fetch;
        let refreshCount = 0;
        window.fetch = function(url, options) {
          if (url.includes('/auth/refresh')) {
            refreshCount++;
            if (refreshCount === 1) {
              return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                  success: true,
                  data: { token: 'new-refresh-token-' + Date.now() }
                })
              });
            }
          }
          return originalFetch.apply(this, arguments);
        };
      `);
      
      await commands.click('button[type="submit"]');
      await commands.wait(3000);
      
      const currentUrl = await commands.driver.getCurrentUrl();
      expect(currentUrl).to.not.include('/login');
    });

    it('7ASF Test 1 Session check', async function() {
      await commands.loginAsTestUser(testUsers.validUser.email, testUsers.validUser.password);
      
      await commands.driver.executeScript(`
        localStorage.setItem('user', JSON.stringify({
          id: null,
          email: undefined,
          firstName: "Mark",
          lastName: null,
          preferences: "invalid_json",
          lastLogin: "not_a_date"
        }));
        localStorage.setItem('userPreferences', 'corrupted_data');
      `);
      const rawUser = await commands.driver.executeScript('return localStorage.getItem("user");');
      const rawPrefs = await commands.driver.executeScript('return localStorage.getItem("userPreferences");');
      console.log('[MOCK CHECK] localStorage.user (raw):', rawUser);
      console.log('[MOCK CHECK] localStorage.userPreferences (raw):', rawPrefs);


      await commands.visit('/profile');
      await commands.wait(2000);
      
      
      const el = await commands.get('[data-testid="user-greeting"]');
      const text = ((await el.getText()) || '').replace(/\s+/g, ' ').trim();
      console.log('[GREETING]', text);
      expect(/\bJohn\b/i.test(text)).to.equal(true);

     
      
   
    });
  });

  describe('7ASF Permission Boundary Testing', function() {
    it('7ASF Test 2 Checkout flow', async function() {
      await commands.visit('/login');
      
      await commands.type('#email', 'invalid@example.com');
      await commands.type('#password', 'wrongpassword');
      await commands.click('button[type="submit"]');
      await commands.wait(2000);
      
      await commands.driver.executeScript(`
        localStorage.setItem('user', JSON.stringify({
          id: null,
          email: undefined,
          firstName: "Mark",
          lastName: null,
          preferences: "invalid_json",
          lastLogin: "not_a_date"
        }));
        localStorage.setItem('userPreferences', 'corrupted_data');
      `);
      
      
      await commands.visit('/products');
      const addButtons = await commands.getAll('[data-testid="add-to-cart-button"]');
      if (addButtons.length > 0) {
        await addButtons[0].click();
        await commands.wait(3000);
      }

    
      const totalElements = await commands.getAll('[data-testid="cart-badge"]');
      expect(totalElements.length).to.equal(0);

  
    });

    it('7ASF Test 3 : authentication flow', async function() {
      
      await commands.visit('/login');
      await commands.type('#email', testUsers.validUser.email);
      await commands.type('#password', testUsers.validUser.password);      
      await commands.click('button[type="submit"]');
      await commands.wait(3000);

      await commands.driver.executeScript(`
        localStorage.setItem('authToken', 'partial-token-123');
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', null);
      `);
      
      await commands.wait(3000);
      await commands.visit('/products');
      await commands.addProductToCart();
      
      
      await commands.visit('/cart');
      await commands.wait(2000);
      
      const cartItems = await commands.getAll('.cart-item, [data-testid="cart-item"], .product-in-cart');
      expect(cartItems.length).to.equal(0);
    
     
    });
  });
});