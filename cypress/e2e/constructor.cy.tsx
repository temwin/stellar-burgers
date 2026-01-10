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
      cy.get('[data-cy="ingredient"]')
        .contains('Краторная булка N-200i')
        .closest('[data-cy="ingredient"]')
        .as('ingredientCard');

      cy.get('@ingredientCard').within(() => {
        cy.contains('button', 'Добавить').click();
      });

      cy.get('[data-cy="constructor"]').should(
        'contain',
        'Краторная булка N-200i'
      );
    });

    it('должен добавлять булку в конструктор', () => {
      cy.get('[data-cy="ingredient"]')
        .contains('Краторная булка N-200i')
        .closest('[data-cy="ingredient"]')
        .within(() => {
          cy.contains('button', 'Добавить').click();
        });

      cy.get('[data-cy="constructor"]')
        .should('contain', 'Краторная булка N-200i (верх)')
        .and('contain', 'Краторная булка N-200i (низ)');
    });

    it('должен добавлять начинку в конструктор', () => {
      cy.get('[data-cy="ingredient"]')
        .contains('Биокотлета из марсианской Магнолии')
        .closest('[data-cy="ingredient"]')
        .within(() => {
          cy.contains('button', 'Добавить').click();
        });

      cy.get('[data-cy="constructor"]').should(
        'contain',
        'Биокотлета из марсианской Магнолии'
      );
    });
  });

  describe('Модальные окна', () => {
    describe('Модальное окно ингредиента', () => {
      beforeEach(() => {
        cy.get('[data-cy="ingredient"]')
          .contains('Краторная булка N-200i')
          .click();
        cy.get('[data-cy="modal"]').should('be.visible');
      });

      it('открытие модального окна ингредиента', () => {
        cy.get('[data-cy="modal"]')
          .should('contain', 'Детали ингредиента')
          .and('contain', 'Краторная булка N-200i');
      });

      it('закрытие по клику на крестик', () => {
        cy.get('[data-cy="modal-close"]').click();
        cy.get('[data-cy="modal"]').should('not.exist');
      });

      it('закрытие по клику на оверлей', () => {
        cy.get('[data-cy="modal-overlay"]').click({ force: true });
        cy.get('[data-cy="modal"]').should('not.exist');
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
      cy.get('[data-cy="ingredient"]')
        .contains('Краторная булка N-200i')
        .closest('[data-cy="ingredient"]')
        .within(() => {
          cy.contains('button', 'Добавить').click({ force: true });
        });

      cy.get('[data-cy="ingredient"]')
        .contains('Биокотлета из марсианской Магнолии')
        .closest('[data-cy="ingredient"]')
        .within(() => {
          cy.contains('button', 'Добавить').click({ force: true });
        });

      cy.get('[data-cy="constructor"]')
        .should('contain', 'Краторная булка N-200i')
        .and('contain', 'Биокотлета из марсианской Магнолии');

      cy.get('[data-cy="order-submit-button"]')
        .should('not.be.disabled')
        .click();

      cy.wait('@createOrder');

      cy.get('[data-cy="modal"]', { timeout: 25000 })
        .should('be.visible')
        .and('contain', '98597');

      cy.get('[data-cy="modal-close"] svg').click();
      cy.get('[data-cy="modal"]').should('not.exist');

      cy.get('[data-cy="constructor"]')
        .should('contain', 'Выберите булки')
        .and('contain', 'Выберите начинку');
    });
  });
});
