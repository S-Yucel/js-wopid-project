import { addToCart, cart } from '../../data/cart.js';

describe('test suite: addToCart', () => {

  it('adds an existing product to the cart', () => {
    // Örneğin, sepetin başlangıçta dolu olduğunu varsayalım.
    cart.push({ id: 'existing-product-id' });

    // Var olan bir ürünü sepete ekleme testi
    addToCart('existing-product-id');

    // Beklenti: Ürün zaten varsa, miktarın artması gerekir veya ürün tekrar eklenmemelidir.
    expect(cart.length).toEqual(1); // Ürün zaten varsa, aynı üründen tekrar eklenmemelidir.
    expect(cart[0].id).toBe('existing-product-id');
  });

  it('adds a new product to the cart', () => {
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([]);
    });

    console.log(localStorage.getItem('cart'));

    addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');

    expect(cart.length).toEqual(1);  // `cart.length` doğru yazıldı
    expect(cart[0].id).toBe('e43638ce-6aa0-4b85-b27f-e1d07eb678c6'); // Yeni eklenen ürünün doğru ID'ye sahip olduğunu kontrol edin
  });

});
