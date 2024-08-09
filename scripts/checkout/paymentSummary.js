import { cart } from '../../data/cart.js';
import { getDeliveryOption } from '../../data/deliveryOptions.js';
import { getProduct } from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';

export function renderPaymentSummary() {
  let productPriceCents = 0;
  let shippingPriceCents = 0;
  const TAX_RATE = 0.1;

  // Sepetteki toplam ürün sayısını hesaplama
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  cart.forEach((cartItem) => {
    const product = getProduct(cartItem.productId);
    if (!product) {
      console.error(`Product with ID ${cartItem.productId} not found`);
      return;
    }
    productPriceCents += product.priceCents * cartItem.quantity;

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    if (!deliveryOption) {
      console.error(`Delivery option with ID ${cartItem.deliveryOptionId} not found`);
      return;
    }
    shippingPriceCents += deliveryOption.priceCents;
  });

  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const taxCents = totalBeforeTaxCents * TAX_RATE;
  const totalCents = totalBeforeTaxCents + taxCents;

  const paymentSummaryHTML = `
  <div class="payment-summary">
    <div class="payment-summary-title">
        Order Summary
    </div>

    <div class="payment-summary-row">
        <div>Items (${totalItems}):</div>
        <div class="payment-summary-money">
        $${formatCurrency(productPriceCents)}
        </div>
    </div>

    <div class="payment-summary-row">
        <div>Shipping &amp; handling:</div>
        <div class="payment-summary-money">
        $${formatCurrency(shippingPriceCents)}
        </div>
    </div>

    <div class="payment-summary-row subtotal-row">
        <div>Total before tax:</div>
        <div class="payment-summary-money">
        $${formatCurrency(totalBeforeTaxCents)}
        </div>
    </div>

    <div class="payment-summary-row">
        <div>Estimated tax (${TAX_RATE * 100}%):</div>
        <div class="payment-summary-money">
        $${formatCurrency(taxCents)}
        </div>
    </div>

    <div class="payment-summary-row total-row">
        <div>Order total:</div>
        <div class="payment-summary-money">
        $${formatCurrency(totalCents)}
        </div>
    </div>

    <button class="place-order-button button-primary">
        Place your order
    </button>
  </div>
  `;

  document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;

  // Siparişi tamamlama butonuna tıklama olayını dinleme
  document.querySelector('.place-order-button').addEventListener('click', () => {
    console.log('Order placed');
    // Siparişi tamamlama işlemleri burada yapılabilir
  });
}
