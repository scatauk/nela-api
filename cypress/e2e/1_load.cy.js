/* global describe it cy beforeEach */
/// <reference types="cypress" />

describe('Basic load and navigation', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
    // Wait for the form to be loaded
    cy.get('form').should('exist');
  });

  it('loads the page with the correct header', () => {
    cy.get('.max-w-7xl h1').should('contain.text', 'Demo');
  });

  it('should have all form elements present', () => {
    cy.get('form').should('exist');
    cy.get('input[type="number"]').should('have.length.at.least', 1);
    cy.get('select').should('have.length.at.least', 1);
    cy.get('button[type="submit"]').should('exist');
  });

  it('should handle responsive navigation', () => {
    // Mobile view
    cy.viewport('iphone-6');
    cy.get('[data-testid="mobile-menu"]').should('exist');
    cy.get('[data-testid="desktop-menu"]').should('not.be.visible');

    // Desktop view
    cy.viewport(1024, 768);
    cy.get('[data-testid="desktop-menu"]').should('be.visible');
    cy.get('[data-testid="mobile-menu"]').should('not.be.visible');
  });

  it('should validate form inputs', () => {
    const ageInput = cy.get('input[name="ageinyears"]').first();

    // Test number input validation
    ageInput.type('{backspace}{backspace}68');
    ageInput.should('have.value', '68');
    // Test invalid input
    ageInput.type('abc');
    ageInput.should('have.value', '68');

    // // Test required field validation
    // cy.get('button[type="submit"]').click();
    // cy.get('form').should('contain.text', 'required');
  });

  it('should handle surgery indication modal', () => {
    // Wait for form to be fully loaded and interactive
    cy.get('form').should('be.visible');

    // Find the indication for surgery field and its Set button
    cy.contains('label', 'indication for surgery')
      .parent()
      .within(() => {
        // Click the Set button
        cy.contains('button', 'Set').should('be.visible').click();
      });

    // Wait for modal to be fully visible and verify its content
    cy.get('[role="dialog"]')
      .should('be.visible')
      .within(() => {
        cy.get('#modal-title').should('be.visible').should('contain.text', 'Set Indications for Surgery');

        // Find and scroll to the Bleeding section
        cy.contains('h6.text-sm.font-medium.text-gray-900.mb-2', 'Bleeding')
          .scrollIntoView()
          .should('be.visible')
          .parent()
          .within(() => {
            // Find the checkbox by its label text
            cy.contains('.relative', 'Haemorrhage').should('be.visible').find('input[type="checkbox"]').check();
          });

        // Click Save changes button - force click due to fixed positioning
        cy.contains('button', 'Save changes').click({ force: true });
      });

    // Modal should be closed
    cy.get('[role="dialog"]').should('not.exist');

    // Now field should be updated to 'bleeding'
    cy.contains('label', 'indication for surgery').parent().find('input').should('have.value', 'bleeding');

    // Test Cancel button behavior
    cy.contains('label', 'indication for surgery')
      .parent()
      .within(() => {
        cy.contains('button', 'Set').should('be.visible').click();
      });

    cy.get('[role="dialog"]')
      .should('be.visible')
      .within(() => {
        // Find and scroll to the Sepsis section
        cy.contains('h6.text-sm.font-medium.text-gray-900.mb-2', 'Sepsis')
          .scrollIntoView()
          .should('be.visible')
          .parent()
          .within(() => {
            // Find the checkbox by its label text
            cy.contains('.relative', 'Peritonitis').should('be.visible').find('input[type="checkbox"]').check();
          });

        // Click Cancel - force click due to fixed positioning
        cy.contains('button', 'Cancel').click({ force: true });
      });

    // Modal should be closed
    cy.get('[role="dialog"]').should('not.exist');

    // Field should still have previous value
    cy.contains('label', 'indication for surgery').parent().find('input').should('have.value', 'bleeding');
  });
});
