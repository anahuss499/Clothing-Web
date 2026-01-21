// PayPal Hosted Fields for Card Payments
let cardFields;

// Initialize hosted fields when PayPal SDK loads
if (typeof window.paypal !== 'undefined' && typeof paypal.HostedFields !== 'undefined') {
    initializeCardFields();
}

// Watch for payment method changes
document.addEventListener('DOMContentLoaded', function() {
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            updatePaymentDisplay();
        });
    });
});

function updatePaymentDisplay() {
    const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const cardForm = document.getElementById('cardPaymentForm');
    const paypalForm = document.getElementById('paypalPaymentForm');
    
    if (selectedMethod === 'paypal') {
        cardForm.style.display = 'none';
        paypalForm.style.display = 'block';
    } else {
        cardForm.style.display = 'block';
        paypalForm.style.display = 'none';
        if (!cardFields) {
            initializeCardFields();
        }
    }
}

// Initialize PayPal Hosted Fields
function initializeCardFields() {
    if (typeof paypal === 'undefined' || typeof paypal.HostedFields === 'undefined') {
        console.error('PayPal HostedFields not available');
        return;
    }

    paypal.HostedFields.render({
        fields: {
            number: {
                selector: '#card-field'
            },
            expirationDate: {
                selector: '#expiry-field'
            },
            cvv: {
                selector: '#cvv-field'
            }
        }
    }).then(function(hostedFieldsInstance) {
        cardFields = hostedFieldsInstance;

        // Setup card payment button
        const cardPaymentBtn = document.getElementById('card-payment-btn');
        if (cardPaymentBtn) {
            cardPaymentBtn.addEventListener('click', function() {
                processCardPayment(cardFields);
            });
        }
    }).catch(function(error) {
        console.error('Hosted Fields error:', error);
        alert('Error loading card payment form. Please refresh the page.');
    });
}

// Process card payment
async function processCardPayment(hostedFieldsInstance) {
    try {
        // Validate form
        const email = document.getElementById('email')?.value;
        const firstName = document.getElementById('firstName')?.value;
        const lastName = document.getElementById('lastName')?.value;

        if (!email || !firstName || !lastName) {
            alert('Please fill in all required fields (Email, First Name, Last Name)');
            return;
        }

        // Disable button during processing
        const btn = document.getElementById('card-payment-btn');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

        // Request card nonce from PayPal
        const { nonce } = await hostedFieldsInstance.request({
            contingencies: ['3D_SECURE']
        });

        // Get cart and shipping info
        const cartItems = getCartItems();
        const total = calculateTotal();
        const shippingInfo = getShippingInfo();
        const deviceType = getDeviceType();
        const trafficSource = getTrafficSource();

        // Send to your backend for processing
        const response = await fetch('/api/card/process-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nonce: nonce,
                amount: total,
                email: email,
                firstName: firstName,
                lastName: lastName,
                cartItems: cartItems,
                shippingInfo: shippingInfo,
                deviceType: deviceType,
                trafficSource: trafficSource
            })
        });

        const result = await response.json();

        if (result.success) {
            // Clear cart
            localStorage.removeItem('cart');
            
            // Redirect to success
            window.location.href = `checkout.html?success=true&orderId=${result.orderId}`;
        } else {
            throw new Error(result.error || 'Payment processing failed');
        }

    } catch (error) {
        console.error('Card payment error:', error);
        alert('Payment failed: ' + error.message);
        
        // Re-enable button
        const btn = document.getElementById('card-payment-btn');
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-credit-card"></i> Pay with Card';
    }
}

// Helper functions
function getCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    return cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
    }));
}

function calculateTotal() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const deliveryMethod = document.querySelector('input[name="deliveryMethod"]:checked');
    let deliveryFee = 0;
    
    if (deliveryMethod) {
        const method = deliveryMethod.value;
        if (method === 'express') {
            deliveryFee = 10.00;
        }
    }
    
    return (subtotal + deliveryFee).toFixed(2);
}

function getShippingInfo() {
    return {
        firstName: document.getElementById('firstName')?.value || '',
        lastName: document.getElementById('lastName')?.value || '',
        email: document.getElementById('email')?.value || '',
        phone: document.getElementById('phone')?.value || '',
        address: document.getElementById('address')?.value || '',
        city: document.getElementById('city')?.value || '',
        state: document.getElementById('state')?.value || '',
        zipCode: document.getElementById('zipCode')?.value || '',
        country: document.getElementById('country')?.value || ''
    };
}

function getDeviceType() {
    const ua = navigator.userAgent;
    if (/mobile|android|iphone|ipod/i.test(ua)) return 'mobile';
    if (/tablet|ipad/i.test(ua)) return 'tablet';
    return 'desktop';
}

function getTrafficSource() {
    if (document.referrer.includes('google')) return 'Google';
    if (document.referrer.includes('instagram')) return 'Instagram';
    if (document.referrer.includes('facebook')) return 'Facebook';
    if (document.referrer.includes('twitter')) return 'Twitter';
    if (document.referrer.includes('linkedin')) return 'LinkedIn';
    
    const params = new URLSearchParams(window.location.search);
    if (params.has('utm_source')) {
        return params.get('utm_source');
    }
    
    return document.referrer ? 'Referral' : 'Direct';
}

// Reinitialize when card payment method is selected
document.addEventListener('DOMContentLoaded', function() {
    const cardRadio = document.getElementById('creditCard');
    if (cardRadio) {
        cardRadio.addEventListener('change', function() {
            setTimeout(() => {
                if (!cardFields) {
                    initializeCardFields();
                }
            }, 500);
        });
    }
});
