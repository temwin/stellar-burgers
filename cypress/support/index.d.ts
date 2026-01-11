declare namespace Cypress {
    interface Chainable<Subject = any> {
        addIngredient(ingredientName: string): Chainable<void>;
        clickIngredient(ingredientName: string): Chainable<void>;
        closeModal(): Chainable<void>;
        assertEmptyConstructor(): Chainable<void>;
        submitOrder(): Chainable<void>;
    }
}
