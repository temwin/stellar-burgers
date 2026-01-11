/// <reference types="cypress" />

const SELECTORS = {
  INGREDIENT: '[data-cy="ingredient"]',
  CONSTRUCTOR: '[data-cy="constructor"]',
  MODAL: '[data-cy="modal"]',
  MODAL_CLOSE: '[data-cy="modal-close"]',
  MODAL_OVERLAY: '[data-cy="modal-overlay"]',
  ORDER_SUBMIT_BUTTON: '[data-cy="order-submit-button"]'
};

Cypress.Commands.add('addIngredient', (ingredientName: string) => {
  cy.get(SELECTORS.INGREDIENT)
    .contains(ingredientName)
    .closest(SELECTORS.INGREDIENT)
    .within(() => {
      cy.contains('button', 'Добавить').click();
    });
});

Cypress.Commands.add('clickIngredient', (ingredientName: string) => {
  cy.get(SELECTORS.INGREDIENT).contains(ingredientName).click();
});

Cypress.Commands.add('closeModal', () => {
    cy.get(SELECTORS.MODAL).within(() => {
        cy.get(SELECTORS.MODAL_CLOSE).click();
    });
});

Cypress.Commands.add('assertEmptyConstructor', () => {
    cy.get(SELECTORS.CONSTRUCTOR)
        .should('contain', 'Выберите булки')
        .and('contain', 'Выберите начинку');
});

Cypress.Commands.add('submitOrder', () => {
    cy.get(SELECTORS.ORDER_SUBMIT_BUTTON)
        .should('not.be.disabled')
        .click();
});

export { SELECTORS };
