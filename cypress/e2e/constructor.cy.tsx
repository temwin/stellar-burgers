import { SELECTORS } from '../support/commands';

const TEXT = {
  KRATOR_BUN: 'Краторная булка N-200i',
  BIO_PATTY: 'Биокотлета из марсианской Магнолии',
  BUN_TOP: 'Краторная булка N-200i (верх)',
  BUN_BOTTOM: 'Краторная булка N-200i (низ)',
  SELECT_BUNS: 'Выберите булки',
  SELECT_FILLINGS: 'Выберите начинку',
  INGREDIENT_DETAILS: 'Детали ингредиента'
};

describe('Конструктор бургеров', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  describe('Загрузка ингредиентов', () => {
    it('проверяем что ингредиенты загрузились', () => {
      cy.contains('Краторная булка').should('exist');
    });
  });

  describe('Добавление ингредиентов в конструктор', () => {
    it('должен добавлять один ингредиент по клику на кнопку', () => {
      cy.addIngredient(TEXT.KRATOR_BUN);

      cy.get(SELECTORS.CONSTRUCTOR).should('contain', TEXT.KRATOR_BUN);
    });

    it('должен добавлять булку в конструктор', () => {
      cy.addIngredient(TEXT.KRATOR_BUN);

      cy.get(SELECTORS.CONSTRUCTOR)
        .should('contain', TEXT.BUN_TOP)
        .and('contain', TEXT.BUN_BOTTOM);
    });

    it('должен добавлять начинку в конструктор', () => {
      cy.addIngredient(TEXT.BIO_PATTY);
      cy.get(SELECTORS.CONSTRUCTOR).should('contain', TEXT.BIO_PATTY);
    });
  });

  describe('Модальные окна', () => {
    describe('Модальное окно ингредиента', () => {
      beforeEach(() => {
        cy.clickIngredient(TEXT.KRATOR_BUN);
        cy.get(SELECTORS.MODAL).should('be.visible');
      });

      it('открытие модального окна ингредиента', () => {
        cy.get(SELECTORS.MODAL)
          .should('contain', TEXT.INGREDIENT_DETAILS)
          .and('contain', TEXT.KRATOR_BUN);
      });

      it('закрытие по клику на крестик', () => {
        cy.closeModal();
        cy.get(SELECTORS.MODAL).should('not.exist');
      });

      it('закрытие по клику на оверлей', () => {
        cy.get(SELECTORS.MODAL_OVERLAY).click({ force: true });
        cy.get(SELECTORS.MODAL).should('not.exist');
      });
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as(
        'getUser'
      );
      cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as(
        'createOrder'
      );

      cy.setCookie('accessToken', 'mock-token-123');
      cy.setCookie('refreshToken', 'mock-refresh-456');

      cy.reload();
      cy.wait('@getUser');
    });

    it('создает заказ, показывает номер и очищается конструтор', () => {
      cy.location('pathname').should('eq', '/');
      cy.addIngredient(TEXT.KRATOR_BUN);
      cy.addIngredient(TEXT.BIO_PATTY);

      cy.get(SELECTORS.CONSTRUCTOR)
        .should('contain', TEXT.KRATOR_BUN)
        .and('contain', TEXT.BIO_PATTY);

      cy.submitOrder();

      cy.wait('@createOrder');

      cy.get(SELECTORS.MODAL, { timeout: 25000 })
        .should('be.visible')
        .and('contain', '98597');

      cy.closeModal();
      cy.get(SELECTORS.MODAL).should('not.exist');

      cy.assertEmptyConstructor();
    });
  });
});
