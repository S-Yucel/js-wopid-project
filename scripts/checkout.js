import {renderOrderSummary} from './checkout/orderSummary.js';
import { renderPaymentSummary} from './checkout/paymentSummary.js';
//import '../data/cart-class.js';

document.querySelector('.place-order-button').addEventListener('click', () => {
  console.log('Order placed');
  // Siparişi tamamlama işlemleri burada yapılabilir

  // Sepeti temizleyin
  localStorage.removeItem('cart');

  // Kullanıcıyı onay sayfasına yönlendirin
  window.location.href = 'order-confirmation.html'; // Onay sayfası URL'si

  // veya ekranda bir onay mesajı gösterin
  alert('Thank you for your order!');
});



renderOrderSummary();
renderPaymentSummary();

