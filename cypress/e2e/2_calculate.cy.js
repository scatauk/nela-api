/* global describe it cy beforeEach */
/// <reference types="cypress" />

describe('Calculate using an API call', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('Clicking the calculate button with placeholder data generates a result', () => {
    cy.get('button').click();
    cy.get('h2').should('contain.text', 'Result');
    cy.get('pre').should('contain.text', '%');
  });
});
