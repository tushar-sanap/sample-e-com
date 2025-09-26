const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('7ASF Test Scenarios', function() {
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

  it('7ASF-Case-1', async function() {
    await commands.visit('/login');
    await (await commands.get('#email')).sendKeys('john@example.com');
    await (await commands.get('#password')).sendKeys('Ecomm@123');
    const loginbutton = await commands.get('[data-testid="login-button"]');
    await loginbutton.click();
    await commands.wait(2000);
    const signOut = await commands.get('[data-testid="logout-button"]');
    await signOut.click();
    await commands.visit('/dashboard');
    const welcome = await await commands.get('[data-testid="user-greeting"]');
    const text = await welcome.getText();
    expect(text).to.include('Hi');
  });

  it('7ASF-Case-2', async function() {
    await commands.visit('/login');
    await (await commands.get('#email')).sendKeys('john@example.com');
    await (await commands.get('#password')).sendKeys('Ecomm@123');
    const loginbutton = await commands.get('[data-testid="login-button"]');
    await loginbutton.click();
    await commands.wait(2000);
    const adminNav = await commands.get('[data-testid="nav-admin"]');
    await adminNav.click();
    const access = await commands.get('#access-state');
    const txt = await access.getText();
    expect(txt).to.equal('Admin');
  });

  it('7ASF-Case-3', async function() {
    await commands.visit('/login');
    const addAccount = await commands.get('[data-testid="add-account"]');
    await addAccount.click();
    const back = await commands.get('[data-testid="back-to-login"]');
    await back.click();
    const switcher = await commands.get('[data-testid="account-switcher"]');
    await switcher.click();
    const done = await commands.get('[data-testid="switcher-close"]');
    await done.click();
    const active = await commands.get('#active-user');
    const who = await active.getText();
    expect(who).to.equal('userA');
  });

  it('7ASF-Case-4', async function() {
    await commands.visit('/profile');
    const settings = await commands.get('[data-testid="profile-settings"]');
    await settings.click();
    const revoke = await commands.get('[data-testid="revoke-sessions"]');
    await revoke.click();
    const status = await commands.get('#profile-status');
    const txt = await status.getText();
    expect(txt).to.equal('Active');
  });

  it('7ASF-Case-5', async function() {
    await commands.visit('/profile');
    const edit = await commands.get('[data-testid="edit-profile"]');
    await edit.click();
    const nameInput = await commands.get('#name');
    await nameInput.clear();
    await nameInput.sendKeys('12345');
    const emailInput = await commands.get('#email');
    await emailInput.clear();
    await emailInput.sendKeys('invalid-email');
    const save = await commands.get('[data-testid="save-profile"]');
    await save.click();
    const emailView = await commands.get('#email');
    const email = await emailView.getText();
    expect(email).to.match(/.+@.+\..+/);
  });
});
