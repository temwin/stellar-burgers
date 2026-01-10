import { rootReducer } from "../../rootReducer";

describe('rootReducer', () => {
    it('Проверяют правильную инициализацию rootReducer', () => {
        // Получили начальное состояние
        const initialState = rootReducer(undefined, { type: '@@INIT' });
        // Проверяем, что все 4 слайса есть
        expect(initialState).toHaveProperty('ingredients');
        expect(initialState).toHaveProperty('burgerConstructor');
        expect(initialState).toHaveProperty('order');
        expect(initialState).toHaveProperty('auth');
    })
})
