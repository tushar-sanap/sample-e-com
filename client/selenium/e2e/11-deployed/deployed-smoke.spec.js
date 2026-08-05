/**
 * Deployed Production Smoke Suite
 * --------------------------------
 * Verifies the *deployed* application end-to-end, not a local build:
 *   - Backend  (Vercel):  https://server-puce-gamma-22.vercel.app
 *   - Frontend (Render):  https://sample-ecom-client.onrender.com
 *
 * The app URL is pointed at the deployed frontend (see the `test:deployed`
 * npm script / BASE_URL env). Run it through the BrowserStack SDK so the
 * browser sessions show up on the TRA dashboard, same as the other suites:
 *
 *   npm run test:deployed
 *   # expands to:
 *   BASE_URL=https://sample-ecom-client.onrender.com \
 *     npx browserstack-node-sdk mocha selenium/e2e/11-deployed/*.js
 *
 * Override targets without editing this file:
 *   BASE_URL           -> deployed frontend URL (app under test)
 *   DEPLOYED_API_URL   -> deployed backend base URL
 */

const { describe, it, before, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

// Deployed targets. Defaults point at the known production URLs; either can be
// overridden via env so the same spec works for preview / staging deploys.
const APP_URL = process.env.BASE_URL || 'https://sample-ecom-client.onrender.com';
const API_URL = (process.env.DEPLOYED_API_URL || 'https://server-puce-gamma-22.vercel.app')
  .replace(/\/$/, '');

// Render's free tier can cold-start; retry the first few API hits before failing.
async function fetchWithRetry(url, options = {}, retries = 4, delayMs = 3000) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, options);
      // 5xx during a cold start is worth another attempt
      if (res.status >= 500 && attempt < retries) {
        await new Promise(r => setTimeout(r, delayMs));
        continue;
      }
      return res;
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, delayMs));
      }
    }
  }
  throw lastError || new Error(`Failed to fetch ${url}`);
}

describe('🌐 Deployed Production Smoke Suite', function () {
  this.timeout(120000);

  // ---------------------------------------------------------------------------
  // Backend API — deployed on Vercel (no browser needed, pure HTTP)
  // ---------------------------------------------------------------------------
  describe('Backend API (Vercel)', function () {
    it('GET /health responds with status OK', async function () {
      const res = await fetchWithRetry(`${API_URL}/health`);
      expect(res.status).to.equal(200);
      const body = await res.json();
      expect(body).to.have.property('status', 'OK');
      expect(body).to.have.property('timestamp');
    });

    it('GET /api/products returns a non-empty, paginated catalogue', async function () {
      const res = await fetchWithRetry(`${API_URL}/api/products`);
      expect(res.status).to.equal(200);
      const body = await res.json();
      expect(body).to.have.property('success', true);
      // Products come back as { data: { data: [...], pagination: {...} } }
      const products = body.data && body.data.data;
      expect(products, 'products array').to.be.an('array').that.is.not.empty;
      expect(products[0]).to.include.keys(['id', 'name', 'price', 'category']);
      expect(body.data.pagination).to.include.keys(['page', 'limit', 'total']);
    });

    it('GET /api/products/featured returns featured products', async function () {
      const res = await fetchWithRetry(`${API_URL}/api/products/featured`);
      expect(res.status).to.equal(200);
      const body = await res.json();
      expect(body).to.have.property('success', true);
      expect(body.data).to.be.an('array').that.is.not.empty;
    });

    it('GET /api/products/categories returns the category list', async function () {
      const res = await fetchWithRetry(`${API_URL}/api/products/categories`);
      expect(res.status).to.equal(200);
      const body = await res.json();
      expect(body).to.have.property('success', true);
      expect(body.data).to.be.an('array').that.is.not.empty;
    });

    it('GET /api/cart without a token is rejected (401)', async function () {
      const res = await fetchWithRetry(`${API_URL}/api/cart`);
      expect(res.status).to.equal(401);
    });

    it('returns 404 for an unknown route', async function () {
      const res = await fetchWithRetry(`${API_URL}/api/definitely-not-a-route`);
      expect(res.status).to.equal(404);
    });

    it('allows the deployed frontend origin via CORS', async function () {
      const res = await fetchWithRetry(`${API_URL}/health`, {
        headers: { Origin: 'https://sample-ecom-client.onrender.com' }
      });
      expect(res.headers.get('access-control-allow-origin'))
        .to.equal('https://sample-ecom-client.onrender.com');
    });

    it('does not echo a disallowed CORS origin', async function () {
      const res = await fetchWithRetry(`${API_URL}/health`, {
        headers: { Origin: 'https://evil.example.com' }
      });
      expect(res.headers.get('access-control-allow-origin'))
        .to.not.equal('https://evil.example.com');
    });
  });

  // ---------------------------------------------------------------------------
  // Frontend App — deployed on Render (real browser via BrowserStack)
  // The app URL is pointed at APP_URL below, regardless of any local default.
  // ---------------------------------------------------------------------------
  describe('Frontend App (Render)', function () {
    const testSetup = new TestSetup();
    let commands;

    before(function () {
      // Point the app-under-test at the deployed frontend so visit('/') and
      // every relative navigation resolve against the production URL.
      testSetup.getConfig().baseUrl = APP_URL;
    });

    beforeEach(async function () {
      await testSetup.beforeEach('chrome');
      commands = testSetup.getCommands();
    });

    afterEach(async function () {
      await testSetup.afterEach();
    });

    it('loads the home page with hero and featured products', async function () {
      await commands.visit('/');
      await commands.wait(2000);
      const hero = await commands.getAll('[data-testid="hero-section"]');
      expect(hero.length, 'hero section present').to.be.greaterThan(0);
      const featured = await commands.getAll(
        '[data-testid="featured-products-grid"] [data-testid="product-card"]'
      );
      expect(featured.length, 'featured product cards').to.be.greaterThan(0);
    });

    it('lists product cards on the products page', async function () {
      await commands.visit('/products');
      await commands.waitForProductsToLoad();
      const cards = await commands.getAll('[data-testid="product-card"]');
      expect(cards.length, 'product cards rendered').to.be.greaterThan(0);
    });

    it('renders name and price on each product card', async function () {
      await commands.visit('/products');
      await commands.waitForProductsToLoad();
      const names = await commands.getAll('[data-testid="product-name"]');
      const prices = await commands.getAll('[data-testid="product-price"]');
      expect(names.length, 'product names').to.be.greaterThan(0);
      expect(prices.length, 'product prices').to.be.greaterThan(0);
      expect(await names[0].getText()).to.have.length.greaterThan(0);
      expect(await prices[0].getText()).to.match(/\d/);
    });
  });
});
