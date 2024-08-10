import { renderOrderSummary } from '../../scripts/checkout/orderSummary.js';
import { loadFromStorage, cart } from '../../data/cart.js';

describe('test suite: renderOrderSummary', () => {
  const productId1 = 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6';
  const productId2 = '15b6fc6f-327a-4ec4-896f-486349e85a3d';

  beforeEach(() => {
    // Test ortamını hazırlıyoruz
    document.querySelector('.js-test-container').innerHTML = `
      <div class="js-order-summary"></div>
      <div class="js-payment-summary"></div>
    `;
    cart.length = 0; // Her testten önce sepeti temizleyin

    // Yerel depolama sahte veri sağlama
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([{
        productId: productId1,
        quantity: 2,
        deliveryOptionId: '1'
      }, {
        productId: productId2,
        quantity: 1,
        deliveryOptionId: '2'
      }]);
    });

    spyOn(localStorage, 'setItem');
    loadFromStorage(); // Sepeti yerel depolamadan yüklüyoruz
  });

  it('display the cart', () => {
    renderOrderSummary(); // Sepet özetini görüntülüyoruz

    // Sepetteki ürün sayısını kontrol ediyoruz
    expect(document.querySelectorAll('.js-cart-item-container').length).toEqual(2);

    // İlk ürünün miktarını kontrol ediyoruz
    const productQuantity1 = document.querySelector(`.js-product-quantity-${productId1}`);
    expect(productQuantity1.innerText).toContain('Quantity: 2');

    const productQuantity2 = document.querySelector(`.js-product-quantity-${productId2}`);
    expect(productQuantity2.innerText).toContain('Quantity: 1');
  });

  it('removes a product', () => {
    renderOrderSummary();

    // Ürünü sepetten kaldırmaya çalışıyoruz
    const deleteLink = document.querySelector(`.js-delete-link[data-product-id="${productId1}"]`);
    
    expect(deleteLink).not.toBeNull(); // Elementin mevcut olup olmadığını kontrol edin
    
    deleteLink.click();

    // Ürünün sepetten kaldırıldığını kontrol ediyoruz
    expect(document.querySelectorAll('.js-cart-item-container').length).toEqual(1);
    expect(document.querySelector(`.js-cart-item-container-${productId1}`)).toBeNull();

    // Diğer ürünün hala sepette olduğunu kontrol ediyoruz
    expect(document.querySelector(`.js-cart-item-container-${productId2}`)).not.toBeNull();

    // cart dizisinin güncellendiğini kontrol ediyoruz
    expect(cart.length).toEqual(1);
    expect(cart[0].productId).toEqual(productId2);
  });

  afterEach(() => {
    // Her testten sonra DOM'u temizliyoruz
    document.querySelector('.js-test-container').innerHTML = ''; 
  });
});
