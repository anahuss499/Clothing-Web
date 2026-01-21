// PayPal Checkout Integration
let paypalOrderId = null;

// Wait for PayPal SDK to load
if (typeof window.paypal !== 'undefined') {
    initializePayPalButton();
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
        initializePayPalButton();
    } else {
        cardForm.style.display = 'block';
        paypalForm.style.display = 'none';
    }
}

// Initialize PayPal buttons
function initializePayPalButton() {
    if (typeof paypal === 'undefined') {
        console.error('PayPal SDK not loaded');
        return;
    }

    // Clear previous buttons if any
    const container = document.getElementById('paypal-button-container');
    if (!container) return;
    
    container.innerHTML = '';

    paypal.Buttons({
        // Set up transaction
        createOrder: async function(data, actions) {
            try {
                // Get cart items from checkout page
                const cartItems = getCartItems();
                const total = calculateTotal();
                const customerEmail = document.getElementById('email')?.value || 'customer@example.com';
                const deviceType = getDeviceType();
                const trafficSource = getTrafficSource();

                // Create order on backend
                const response = await fetch('/api/paypal/create-order', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        total: total,
                        items: cartItems,
                        customerEmail: customerEmail,
                        deviceType: deviceType,
                        trafficSource: trafficSource
                    })
                });

                const data = await response.json();

                if (data.success) {
                    paypalOrderId = data.orderId;
                    return data.orderId;
                } else {
                    throw new Error(data.error || 'Failed to create order');
                }
            } catch (error) {
                console.error('Order creation error:', error);
                alert('Error creating order: ' + error.message);
                throw error;
            }
        },

        // Finalize transaction
        onApprove: async function(data, actions) {
            try {
                const cartItems = getCartItems();
                const shippingInfo = getShippingInfo();
                const customerEmail = document.getElementById('email')?.value || 'customer@example.com';
                const deviceType = getDeviceType();
                const trafficSource = getTrafficSource();

                // Capture order on backend
                const response = await fetch('/api/paypal/capture-order', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        orderId: data.orderID,
                        cartItems: cartItems,
                        customerEmail: customerEmail,
                        shippingInfo: shippingInfo,
                        deviceType: deviceType,
                        trafficSource: trafficSource
                    })
                });

                const result = await response.json();

                if (result.success) {
                    // Clear cart and show success
                    localStorage.removeItem('cart');
                    
                    // Redirect to success page
                    window.location.href = `checkout.html?success=true&orderId=${result.orderId}`;
                } else {
                    throw new Error(result.error || 'Failed to capture payment');
                }
            } catch (error) {
                console.error('Payment capture error:', error);
                alert('Error processing payment: ' + error.message);
            }
        },

        // Handle errors
        onError: function(err) {
            console.error('PayPal error:', err);
            alert('An error occurred during the transaction:\n' + err.message);
        },

        // Handle cancellation
        onCancel: function(data) {
            console.log('Payment cancelled by user');
            alert('Payment was cancelled. Please try again.');
        }
    }).render('#paypal-button-container');
}

// Helper functions to get checkout data
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
    // Check referrer
    if (document.referrer.includes('google')) return 'Google';
    if (document.referrer.includes('instagram')) return 'Instagram';
    if (document.referrer.includes('facebook')) return 'Facebook';
    if (document.referrer.includes('twitter')) return 'Twitter';
    if (document.referrer.includes('linkedin')) return 'LinkedIn';
    
    // Check UTM parameters
    const params = new URLSearchParams(window.location.search);
    if (params.has('utm_source')) {
        return params.get('utm_source');
    }
    
    // Default
    return document.referrer ? 'Referral' : 'Direct';
}

// Reinitialize when payment method is selected
document.addEventListener('DOMContentLoaded', function() {
    const paypalRadio = document.getElementById('paypal');
    if (paypalRadio) {
        paypalRadio.addEventListener('change', function() {
            setTimeout(initializePayPalButton, 500);
        });
    }
});
