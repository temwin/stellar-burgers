// ✅ Обработка экшена добавления ингредиента

// ✅ Обработка экшена удаления ингредиента

// ✅ Обработка экшена изменения порядка ингредиентов

import { TConstructorIngredient, TIngredient } from '@utils-types';
import reducer, {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient
} from '../burgerConstructorSlice';

const initialState = reducer(undefined, { type: '@@INIT' });
describe('обработка экшена добавления ингредиента', () => {
  it('должен добавить булку', () => {
    const testBun: TIngredient = {
      _id: 'bun-1',
      name: 'Краторная булка',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'image.png',
      image_large: 'image-large.png',
      image_mobile: 'image-mobile.png'
    };
    const newState = reducer(initialState, addBun(testBun));

    expect(newState.bun).toEqual(testBun);
    expect(newState.ingredients).toHaveLength(0);
  });
});

describe('обработка экшена удаления ингредиента', () => {
  it('должен удалить начинку по индексу', () => {
    const ingredientToRemove: TConstructorIngredient = {
      _id: 'filling-1',
      name: 'Биокотлета',
      type: 'main',
      proteins: 50,
      fat: 20,
      carbohydrates: 30,
      calories: 300,
      price: 750,
      image: 'filling.png',
      image_large: 'filling-large.png',
      image_mobile: 'filling-mobile.png',
      id: 'unique-id-123'
    };

    const stateWithIngredient = {
      ...initialState,
      ingredients: [ingredientToRemove]
    };

    const newState = reducer(stateWithIngredient, removeIngredient(0));

    expect(newState.ingredients).toHaveLength(0);
  });
});

describe('обработка экшена изменения порядка ингредиентов', () => {
  it('должен переместить начинку в списке', () => {
    const ingredients: TConstructorIngredient[] = [
      {
        _id: '1',
        name: 'Сыр',
        type: 'main',
        proteins: 25,
        fat: 30,
        carbohydrates: 10,
        calories: 350,
        price: 200,
        image: 'cheese.png',
        image_large: 'cheese-large.png',
        image_mobile: 'cheese-mobile.png',
        id: 'id-1'
      },
      {
        _id: '2',
        name: 'Котлета',
        type: 'main',
        proteins: 50,
        fat: 20,
        carbohydrates: 30,
        calories: 300,
        price: 300,
        image: 'patty.png',
        image_large: 'patty-large.png',
        image_mobile: 'patty-mobile.png',
        id: 'id-2'
      },
      {
        _id: '3',
        name: 'Салат',
        type: 'main',
        proteins: 5,
        fat: 0,
        carbohydrates: 10,
        calories: 50,
        price: 100,
        image: 'lettuce.png',
        image_large: 'lettuce-large.png',
        image_mobile: 'lettuce-mobile.png',
        id: 'id-3'
      }
    ];

    const stateWithIngredients = {
      ...initialState,
      ingredients
    };

    const newState = reducer(
      stateWithIngredients,
      moveIngredient({ fromIndex: 0, toIndex: 2 })
    );

    expect(newState.ingredients[0]._id).toBe('2');
    expect(newState.ingredients[1]._id).toBe('3');
    expect(newState.ingredients[2]._id).toBe('1');
  });
});
