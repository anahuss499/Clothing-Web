// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let promoDiscount = 0; // fraction (e.g., 0.1 for 10%)

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    if (cart.length === 0) {
        alert('Your cart is empty! Redirecting to shop...');
        window.location.href = 'index.html';
        return;
    }

    renderOrderSummary();
    initializeEventListeners();
    initializeAddressAutocomplete();
    
    // Set current year in footer
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});

// Address Autocomplete using OpenStreetMap/Nominatim
function initializeAddressAutocomplete() {
    const addressInput = document.getElementById('address');
    const suggestionsContainer = document.getElementById('addressSuggestions');

    if (!addressInput) return;

    addressInput.addEventListener('input', debounce(function(e) {
        const query = e.target.value.trim();
        
        if (query.length < 3) {
            suggestionsContainer.classList.remove('active');
            return;
        }

        fetchAddressSuggestions(query, suggestionsContainer, addressInput);
    }, 300));

    // Close suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target !== addressInput) {
            suggestionsContainer.classList.remove('active');
        }
    });
}

// Fetch address suggestions from Nominatim (OpenStreetMap)
async function fetchAddressSuggestions(query, container, addressInput) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=8&addressdetails=1`,
            {
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        if (!response.ok) throw new Error('Network response was not ok');
        const results = await response.json();

        if (results.length === 0) {
            container.innerHTML = '<div style="padding: 12px 15px; color: #999;">No addresses found</div>';
            container.classList.add('active');
            return;
        }

        container.innerHTML = results.map((result, index) => `
            <div class="address-suggestion-item" onclick="selectAddress(this, '${result.address.road || result.address.house_number || ''}', '${result.address.city || result.address.town || result.address.village || ''}', '${result.address.state || result.address.region || ''}', '${result.address.postcode || ''}', '${result.address.country || ''}')">
                <div class="suggestion-main">${result.display_name.split(',')[0]}</div>
                <div class="suggestion-secondary">${result.display_name}</div>
            </div>
        `).join('');

        container.classList.add('active');
    } catch (error) {
        console.error('Error fetching address suggestions:', error);
        container.innerHTML = '<div style="padding: 12px 15px; color: #999;">Unable to fetch suggestions</div>';
        container.classList.add('active');
    }
}

// Select address from suggestions
function selectAddress(element, road, city, state, postcode, country) {
    const addressInput = document.getElementById('address');
    const cityInput = document.getElementById('city');
    const stateInput = document.getElementById('state');
    const zipInput = document.getElementById('zipCode');
    const countryInput = document.getElementById('country');
    const suggestionsContainer = document.getElementById('addressSuggestions');

    // Set address field
    const fullAddress = road || element.querySelector('.suggestion-main').textContent;
    addressInput.value = fullAddress;

    // Set city
    if (cityInput) cityInput.value = city;

    // Set state/province
    if (stateInput) stateInput.value = state;

    // Set postal code
    if (zipInput) zipInput.value = postcode;

    // Set country
    if (countryInput && country) {
        const countryCode = getCountryCode(country);
        if (countryCode) {
            countryInput.value = countryCode;
        }
    }

    // Close suggestions
    suggestionsContainer.classList.remove('active');
}

// Convert country name to country code
function getCountryCode(countryName) {
    const countryMap = {
        'United States': 'US',
        'Canada': 'CA',
        'United Kingdom': 'UK',
        'United Arab Emirates': 'AE',
        'Saudi Arabia': 'SA',
        'Malaysia': 'MY',
        'Indonesia': 'ID',
        'Australia': 'AU',
        'Germany': 'DE',
        'France': 'FR',
        'Spain': 'ES',
        'Italy': 'IT',
        'Netherlands': 'NL',
        'Belgium': 'BE',
        'Austria': 'AT',
        'Switzerland': 'CH',
        'Sweden': 'SE',
        'Norway': 'NO',
        'Denmark': 'DK',
        'Poland': 'PL',
        'Greece': 'GR',
        'Turkey': 'TR',
        'South Africa': 'ZA',
        'India': 'IN',
        'Pakistan': 'PK',
        'Bangladesh': 'BD',
        'Egypt': 'EG',
        'Nigeria': 'NG',
        'New Zealand': 'NZ',
        'Singapore': 'SG',
        'Hong Kong': 'HK',
        'Japan': 'JP',
        'South Korea': 'KR',
        'China': 'CN',
        'Mexico': 'MX',
        'Brazil': 'BR'
    };

    return countryMap[countryName] || null;
}

// Debounce function to limit API calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Event listeners
function initializeEventListeners() {
    // Payment method selection
    document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
        radio.addEventListener('change', function() {
            togglePaymentForm(this.value);
        });
    });

    // Delivery method selection impacts shipping cost
    document.querySelectorAll('input[name="deliveryMethod"]').forEach(radio => {
        radio.addEventListener('change', function() {
            calculateTotals();
        });
    });

    // Card number formatting
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }

    // Expiry date formatting
    const expiryDateInput = document.getElementById('expiryDate');
    if (expiryDateInput) {
        expiryDateInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });
    }

    // CVV input - numbers only
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }
}

// Toggle payment form
function togglePaymentForm(method) {
    const cardForm = document.getElementById('cardPaymentForm');
    const paypalForm = document.getElementById('paypalPaymentForm');

    if (method === 'card') {
        cardForm.style.display = 'block';
        paypalForm.style.display = 'none';
    } else if (method === 'paypal') {
        cardForm.style.display = 'none';
        paypalForm.style.display = 'block';
    }
}

// Render order summary
function renderOrderSummary() {
    const summaryItems = document.getElementById('summaryItems');
    
    summaryItems.innerHTML = cart.map(item => `
        <div class="summary-item">
            <div class="summary-item-image">${item.icon}</div>
            <div class="summary-item-details">
                <div class="summary-item-name">${item.name}</div>
                <div class="summary-item-quantity">Qty: ${item.quantity}</div>
            </div>
            <div class="summary-item-price">£${(item.price * item.quantity).toFixed(2)}</div>
        </div>
    `).join('');

    calculateTotals();
}

// Calculate totals
function calculateTotals() {
    const rawSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = rawSubtotal * (promoDiscount || 0);
    const subtotal = rawSubtotal - discountAmount;
    const shipping = getShippingCost();
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    document.getElementById('subtotal').textContent = `£${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = shipping === 0 ? 'FREE' : `£${shipping.toFixed(2)}`;
    document.getElementById('tax').textContent = `£${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `£${total.toFixed(2)}`;
}

// Shipping cost based on delivery selection
function getShippingCost() {
    const delivery = document.querySelector('input[name="deliveryMethod"]:checked')?.value || 'Standard (7-14 days)';
    if (delivery.toLowerCase().includes('express')) {
        return 5;
    }
    return 0; // standard is free
}

// Apply promo code
function applyPromoCode() {
    const promoCode = document.getElementById('promoCode').value.toUpperCase();
    
    // Sample promo codes
    const promoCodes = {
        'BELIEVERS10': 0.10,
        'WELCOME20': 0.20,
        'FAITH15': 0.15
    };

    if (promoCodes[promoCode]) {
        promoDiscount = promoCodes[promoCode];
        const rawSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const discountAmount = rawSubtotal * promoDiscount;
        showNotification(`Promo code applied! You saved £${discountAmount.toFixed(2)}`);
        calculateTotals();
    } else {
        promoDiscount = 0;
        showNotification('Invalid promo code', 'error');
        calculateTotals();
    }
}

// Validate form
function validateForm() {
    const form = document.getElementById('checkoutForm');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = 'red';
            isValid = false;
        } else {
            field.style.borderColor = '';
        }
    });

    // Validate payment method
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    
    if (paymentMethod === 'card') {
        const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
        const expiryDate = document.getElementById('expiryDate').value;
        const cvv = document.getElementById('cvv').value;
        const cardName = document.getElementById('cardName').value;

        if (!cardNumber || cardNumber.length < 13) {
            document.getElementById('cardNumber').style.borderColor = 'red';
            isValid = false;
        }
        if (!expiryDate || expiryDate.length < 5) {
            document.getElementById('expiryDate').style.borderColor = 'red';
            isValid = false;
        }
        if (!cvv || cvv.length < 3) {
            document.getElementById('cvv').style.borderColor = 'red';
            isValid = false;
        }
        if (!cardName) {
            document.getElementById('cardName').style.borderColor = 'red';
            isValid = false;
        }
    }

    return isValid;
}

// Place order
function placeOrder() {
    if (!validateForm()) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

    // Show loading state
    const placeOrderBtn = document.querySelector('.place-order-btn');
    const originalText = placeOrderBtn.textContent;
    placeOrderBtn.textContent = 'Processing...';
    placeOrderBtn.disabled = true;

    // Simulate payment processing
    setTimeout(() => {
        if (paymentMethod === 'paypal') {
            // Simulate PayPal redirect
            showNotification('Redirecting to PayPal...');
            setTimeout(() => {
                processOrder();
            }, 1500);
        } else {
            // Process card payment
            processOrder();
        }
        
        placeOrderBtn.textContent = originalText;
        placeOrderBtn.disabled = false;
    }, 2000);
}

// Process order
async function processOrder() {
    // Generate order number
    const orderNumber = 'BLV' + Date.now().toString().slice(-8);
    
    // Get order details
    const parseMoney = (val) => {
        if (!val) return 0;
        const cleaned = val.replace(/[^0-9.-]+/g, '');
        const num = parseFloat(cleaned);
        return isNaN(num) ? 0 : num;
    };

    const orderDetails = {
        orderNumber: orderNumber,
        date: new Date().toISOString(),
        items: cart,
        shippingInfo: {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            zipCode: document.getElementById('zipCode').value,
            country: document.getElementById('country').value
        },
        deliveryMethod: document.querySelector('input[name="deliveryMethod"]:checked')?.value || 'Standard (7-14 days)',
        paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').value,
        totals: {
            subtotal: parseMoney(document.getElementById('subtotal').textContent),
            shipping: parseMoney(document.getElementById('shipping').textContent),
            tax: parseMoney(document.getElementById('tax').textContent),
            total: parseMoney(document.getElementById('total').textContent)
        }
    };

    // Send order notification to backend (admin + customer email)
    try {
        await sendOrderNotification(orderDetails);
    } catch (error) {
        console.error('Order notification failed:', error);
        showNotification('Order placed, but we could not send confirmation. We will follow up shortly.', 'error');
    }

    // Store order in localStorage
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(orderDetails);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Clear cart
    localStorage.removeItem('cart');
    cart = [];

    // Show success modal
    showSuccessModal(orderNumber);
}

// Show success modal
function showSuccessModal(orderNumber) {
    document.getElementById('orderNumber').textContent = orderNumber;
    document.getElementById('successModal').classList.add('open');
    document.getElementById('overlay').classList.add('active');
}

// Send order notification (admin + customer email)
async function sendOrderNotification(orderDetails) {
    const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderDetails)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to send order notification');
    }
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background-color: ${type === 'error' ? '#f44336' : 'var(--primary-gold)'};
        color: ${type === 'error' ? '#fff' : 'var(--primary-black)'};
        padding: 15px 25px;
        border-radius: 5px;
        font-weight: bold;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
