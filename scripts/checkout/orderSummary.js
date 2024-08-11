import { cart, removeFromCart, updateDeliveryOption, updateCartQuantity } from '../../data/cart.js';
import { getProduct } from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { deliveryOptions, getDeliveryOption } from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';

export function renderOrderSummary() {
    const today = dayjs();
    let cartSummaryHTML = '';

    cart.forEach((cartItem) => {
        const productId = cartItem.productId;
        const matchingProduct = getProduct(productId);

        const deliveryOptionId = cartItem.deliveryOptionId;
        const deliveryOption = getDeliveryOption(deliveryOptionId);

        if (matchingProduct && deliveryOption) {
            const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
            const dateString = deliveryDate.format('dddd, MMMM D');

            cartSummaryHTML += `
            <div class="cart-item-container js-cart-item-container-${matchingProduct.id}" data-product-id="${matchingProduct.id}">
                <div class="delivery-date">
                    Delivery date: ${dateString}
                </div>

                <div class="cart-item-details-grid">
                    <img class="product-image" src="${matchingProduct.image}">
                    <div class="cart-item-details">
                        <div class="product-name">
                            ${matchingProduct.name}
                        </div>
                        <div class="product-price">
                            ${matchingProduct.getPrice()}
                        </div>
                        <div class="product-quantity js-product-quantity-${matchingProduct.id}">
                            <span>
                                Quantity: <input type="number" class="js-new-quantity-input new-quantity-input" value="${cartItem.quantity}" min="1">
                            </span>
                            <span class="update-quantity-link link-primary">Update</span>
                            <span class="delete-quantity-link link-primary js-delete-link-${matchingProduct.id}" data-product-id="${matchingProduct.id}">Delete</span>
                        </div>
                    </div>
                    <div class="delivery-options">
                        <div class="delivery-options-title">Choose a delivery option:</div>
                        ${deliveryOptionsHTML(matchingProduct, cartItem)}
                    </div>
                </div>
            </div>
            `;
        } else {
            console.error('Matching product or delivery option not found for cart item:', cartItem);
        }
    });

    function deliveryOptionsHTML(matchingProduct, cartItem) {
        let html = '';
        deliveryOptions.forEach((deliveryOption) => {
            const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
            const dateString = deliveryDate.format('dddd, MMMM D');
            const priceString = deliveryOption.priceCents === 0 ? 'FREE' : `$${formatCurrency(deliveryOption.priceCents)}`;
            const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

            html += `
            <div class="delivery-option js-delivery-option" data-product-id="${matchingProduct.id}"
                data-delivery-option-id="${deliveryOption.id}">
                <input type="radio" ${isChecked ? 'checked' : ''} class="delivery-option-input" name="delivery-option-${matchingProduct.id}">
                <div>
                    <div class="delivery-option-date">${dateString}</div>
                    <div class="delivery-option-price">${priceString} - Shipping</div>
                </div>
            </div>
            `;
        });
        return html;
    }

    document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

    addEventListeners();

    function addEventListeners() {
        // Delete link event listener
        document.querySelectorAll('.js-delete-link').forEach((link) => {
            link.addEventListener('click', (event) => {
                const productId = event.target.dataset.productId;
                removeFromCart(productId);
                renderOrderSummary();
                renderPaymentSummary();
            });
        });

        // Delivery option change event listener
        document.querySelectorAll('.js-delivery-option input[type="radio"]').forEach((element) => {
            element.addEventListener('change', () => {
                const { productId, deliveryOptionId } = element.closest('.js-delivery-option').dataset;
                updateDeliveryOption(productId, deliveryOptionId);
                renderOrderSummary();
                renderPaymentSummary();
            });
        });

        // Update quantity link event listener
        document.querySelectorAll('.update-quantity-link').forEach((link) => {
            link.addEventListener('click', (event) => {
                const productId = event.target.closest('.cart-item-container').dataset.productId;
                const inputElement = event.target.closest('.cart-item-details').querySelector('.js-new-quantity-input');
                const newQuantity = parseInt(inputElement.value, 10);

                if (!isNaN(newQuantity) && newQuantity > 0) {
                    updateCartQuantity(productId, newQuantity);
                    renderOrderSummary();
                    renderPaymentSummary();
                }
            });
        });

        // Delete quantity link event listener
        document.querySelectorAll('.delete-quantity-link').forEach((link) => {
            link.addEventListener('click', (event) => {
                const productId = event.target.closest('.cart-item-container').dataset.productId;
                removeFromCart(productId);
                renderOrderSummary();
                renderPaymentSummary();
            });
        });
    }
}
