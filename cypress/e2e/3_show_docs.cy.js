/* global describe it cy beforeEach */
/// <reference types="cypress" />

describe('Show API docs', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('click `API Reference` menu item: the documentation should display', () => {
    cy.get('#navbarSupportedContent > ul > li:nth-child(2) > a').click();
    cy.get('h1').should('contain.text', 'API Reference');
  });
});
