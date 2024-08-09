import { addToCart, cart, loadFromStorage } from '../../data/cart.js';

describe('test suite: addToCart', () => {

  beforeEach(() => {
    cart.length = 0; // Sepeti her testten önce sıfırlayın
  });

  it('adds an existing product to the cart', () => {
    // Sepete bir ürün ekleyin
    cart.push({ productId: 'existing-product-id', quantity: 1 });

    // Var olan bir ürünü sepete ekleme testi
    addToCart('existing-product-id');

    // Beklenti: Ürün zaten varsa, miktarın artması gerekir.
    expect(cart.length).toEqual(1); // Ürün sayısı aynı kalmalı.
    expect(cart[0].productId).toBe('existing-product-id');
    expect(cart[0].quantity).toBe(2); // Miktar artırılmalı
  });

  it('adds a new product to the cart', () => {
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([]);
    });
    loadFromStorage();

    addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');

    expect(cart.length).toEqual(1);  // Sepette bir ürün olmalı
    expect(cart[0].productId).toBe('e43638ce-6aa0-4b85-b27f-e1d07eb678c6'); // Doğru ürün sepete eklendi mi?
    expect(cart[0].quantity).toBe(1); // Yeni ürünün miktarı 1 olmalı
    expect(localStorage.setItem).toHaveBeenCalledTimes(1); // LocalStorage'a bir kere kaydedilmeli
    
  });

});
