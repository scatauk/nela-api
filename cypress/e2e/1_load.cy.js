/* global describe it cy beforeEach */
/// <reference types="cypress" />

describe('Basic load', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('loads the site', () => {
    cy.get('.container > h1').should('contain.text', 'NELA API');
  });
});
