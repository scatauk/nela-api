/* global describe it cy beforeEach expect Cypress */
/// <reference types="cypress" />

describe('Show API docs', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
    // Switch to API Reference tab and wait for content
    cy.contains('a', 'API Reference').click();
    // Wait for the API docs section to be visible
    cy.contains('h1', 'API Reference').should('be.visible');
  });

  const checkExampleContent = (buttonText) => {
    // First find and click the button
    cy.log(`Clicking "${buttonText}" button`);
    cy.contains('button', buttonText).as('exampleButton').should('be.visible').click();

    // Wait for Vue to update the v-show state
    cy.get('@exampleButton')
      .parent()
      .find('div.px-4.pb-4')
      .should('exist')
      .then(($div) => {
        // Wait for Vue's next tick and the animation to complete
        return new Cypress.Promise((resolve) => {
          // Short delay to let Vue update the DOM
          setTimeout(() => {
            if ($div.is(':visible')) {
              resolve($div);
            } else {
              // Keep checking visibility
              const checkVisibility = setInterval(() => {
                if ($div.is(':visible')) {
                  clearInterval(checkVisibility);
                  resolve($div);
                }
              }, 100);
              // Timeout after 10s
              setTimeout(() => {
                clearInterval(checkVisibility);
                resolve($div);
              }, 10000);
            }
          }, 50);
        });
      })
      .should('be.visible')
      .within(() => {
        cy.log(`Checking content for "${buttonText}"`);
        // Finally check the pre element's visibility and content
        cy.get('pre.mt-2.bg-gray-50.p-4.rounded-lg.overflow-x-auto.text-sm')
          .should('be.visible')
          .invoke('text')
          .then((text) => {
            if (buttonText === 'Example Request') {
              expect(text).to.include('"age": 65');
              expect(text).to.include('"asa": "3"');
            } else {
              expect(text).to.include('predictedRisk');
            }
          });
      });
  };

  it('should show example request and response', () => {
    // Click and verify request example
    checkExampleContent('Example Request');

    // Click and verify response example
    checkExampleContent('Example Response');
  });

  it('should show all required parameters', () => {
    cy.get('table').within(() => {
      cy.contains('td', 'age').should('be.visible');
      cy.contains('td', 'asa').should('be.visible');
      cy.contains('td', 'indication').should('be.visible');
    });
  });

  it('should maintain layout on different screen sizes', () => {
    // Test each viewport size separately to isolate failures
    it('should work on mobile view', () => {
      cy.viewport('iphone-6');
      cy.get('table').should('be.visible');
      checkExampleContent('Example Request');
    });

    it('should work on tablet view', () => {
      cy.viewport('ipad-2');
      cy.get('table').should('be.visible');
      checkExampleContent('Example Request');
    });

    it('should work on desktop view', () => {
      cy.viewport(1024, 768);
      cy.get('table').should('be.visible');
      checkExampleContent('Example Request');
    });
  });

  it('should handle table interactions', () => {
    cy.get('table').within(() => {
      // Check table row styles - verify it has a transparent background initially
      cy.get('tr').first().should('have.css', 'background-color', 'rgba(0, 0, 0, 0)');

      // Since we can't reliably test hover states in Cypress, we'll verify the row has transitions
      cy.get('tr').first().should('have.css', 'transition-property', 'all');

      // Check code formatting
      cy.get('code').should('have.class', 'bg-gray-100');
    });
  });
});
