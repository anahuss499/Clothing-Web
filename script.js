// Sample product data
const products = [
    {
        id: 1,
        name: 'Classic Thobe',
        category: 'men',
        price: 79.99,
        rating: 4.5,
        reviews: 28,
        description: 'Premium quality thobe with modern cut and traditional elegance. Perfect for daily wear and special occasions.',
        icon: '🕌'
    },
    {
        id: 2,
        name: 'Street Hoodie',
        category: 'men',
        price: 59.99,
        rating: 4.8,
        reviews: 42,
        description: 'Bold streetwear hoodie with Islamic calligraphy design. Comfortable and stylish.',
        icon: '👕'
    },
    {
        id: 3,
        name: 'Modest Abaya',
        category: 'women',
        price: 89.99,
        rating: 4.7,
        reviews: 35,
        description: 'Elegant abaya with contemporary design. Made from premium fabric for all-day comfort.',
        icon: '👗'
    },
    {
        id: 4,
        name: 'Hijab Collection',
        category: 'women',
        price: 24.99,
        rating: 4.6,
        reviews: 56,
        description: 'Premium quality hijabs in various colors. Soft, breathable, and easy to style.',
        icon: '🧕'
    },
    {
        id: 5,
        name: 'Kids Kurta Set',
        category: 'kids',
        price: 39.99,
        rating: 4.9,
        reviews: 31,
        description: 'Comfortable kurta set for kids. Perfect for Eid and special occasions.',
        icon: '👶'
    },
    {
        id: 6,
        name: 'Kids Streetwear Tee',
        category: 'kids',
        price: 19.99,
        rating: 4.5,
        reviews: 24,
        description: 'Cool streetwear t-shirt for kids with faith-inspired graphics.',
        icon: '👕'
    },
    {
        id: 7,
        name: 'Prayer Mat Set',
        category: 'men',
        price: 34.99,
        rating: 4.8,
        reviews: 67,
        description: 'Portable prayer mat with carrying case. Comfortable and durable.',
        icon: '🕋'
    },
    {
        id: 8,
        name: 'Designer Jilbab',
        category: 'women',
        price: 99.99,
        rating: 4.9,
        reviews: 43,
        description: 'Modern designer jilbab with elegant draping. Perfect for modest fashion.',
        icon: '👗'
    },
    {
        id: 9,
        name: 'Athletic Tracksuit',
        category: 'men',
        price: 69.99,
        rating: 4.6,
        reviews: 38,
        description: 'Modest athletic wear for men. Comfortable and performance-ready.',
        icon: '👔'
    },
    {
        id: 10,
        name: 'Girls Dress Set',
        category: 'kids',
        price: 44.99,
        rating: 4.7,
        reviews: 29,
        description: 'Beautiful modest dress set for girls. Comfortable and stylish.',
        icon: '👗'
    },
    {
        id: 11,
        name: 'Sports Hijab',
        category: 'women',
        price: 29.99,
        rating: 4.8,
        reviews: 52,
        description: 'Performance sports hijab. Breathable, moisture-wicking, and secure.',
        icon: '🧕'
    },
    {
        id: 12,
        name: 'Jubba Jacket',
        category: 'men',
        price: 89.99,
        rating: 4.7,
        reviews: 33,
        description: 'Modern jubba-style jacket. Perfect blend of traditional and contemporary.',
        icon: '🧥'
    }
];

// State management
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let savedItems = JSON.parse(localStorage.getItem('savedItems')) || [];
let currentFilter = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    updateCartCount();
    updateSavedCount();
    initializeEventListeners();
    
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
});

// Event listeners
function initializeEventListeners() {
    // Cart button
    document.getElementById('cartBtn').addEventListener('click', toggleCart);
    document.getElementById('closeCartBtn').addEventListener('click', toggleCart);

    // Saved button
    document.getElementById('savedBtn').addEventListener('click', toggleSaved);
    document.getElementById('closeSavedBtn').addEventListener('click', toggleSaved);

    // Search button
    document.getElementById('searchBtn').addEventListener('click', toggleSearch);
    document.getElementById('closeSearchBtn').addEventListener('click', toggleSearch);

    // Search input
    document.getElementById('searchInput').addEventListener('input', handleSearch);

    // Modal close
    document.getElementById('closeModalBtn').addEventListener('click', closeModal);
    document.getElementById('overlay').addEventListener('click', closeAllSidebars);

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            renderProducts();
        });
    });

    // Mobile menu
    document.getElementById('mobileMenuBtn').addEventListener('click', toggleMobileMenu);

    // Newsletter form
    document.querySelector('.newsletter-form').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for subscribing to The Believers newsletter!');
        this.reset();
    });

    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Render products
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    const filteredProducts = currentFilter === 'all' 
        ? products 
        : products.filter(p => p.category === currentFilter);

    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                ${product.icon}
                <div class="product-actions">
                    <button class="action-btn save-btn ${isSaved(product.id) ? 'saved' : ''}" 
                            onclick="toggleSaveItem(${product.id}); event.stopPropagation();">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="action-btn quick-view-btn" 
                            onclick="showProductDetail(${product.id}); event.stopPropagation();">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-rating">
                    ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
                    (${product.reviews})
                </div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id}); event.stopPropagation();">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Show product detail
function showProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div class="product-detail">
            <div class="product-detail-image">${product.icon}</div>
            <div class="product-detail-info">
                <div class="product-category">${product.category.toUpperCase()}</div>
                <h2>${product.name}</h2>
                <div class="product-rating">
                    ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
                    (${product.reviews} reviews)
                </div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <p class="product-description">${product.description}</p>
                
                <div class="size-selector">
                    <h4>Select Size:</h4>
                    <div class="size-options">
                        <button class="size-btn" onclick="selectSize(this)">S</button>
                        <button class="size-btn active" onclick="selectSize(this)">M</button>
                        <button class="size-btn" onclick="selectSize(this)">L</button>
                        <button class="size-btn" onclick="selectSize(this)">XL</button>
                    </div>
                </div>
                
                <div class="product-actions-detail">
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id}); closeModal();">
                        Add to Cart
                    </button>
                    <button class="action-btn ${isSaved(product.id) ? 'saved' : ''}" 
                            onclick="toggleSaveItem(${product.id}); this.classList.toggle('saved');">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
        
        <div class="reviews-section">
            <h3>Customer Reviews</h3>
            ${generateReviews(product)}
        </div>
    `;

    document.getElementById('productModal').classList.add('open');
    document.getElementById('overlay').classList.add('active');
}

// Generate reviews
function generateReviews(product) {
    const reviewsData = [
        { author: 'Ahmed K.', rating: 5, text: 'Excellent quality and great fit! Highly recommend.' },
        { author: 'Fatima M.', rating: 4, text: 'Beautiful design and comfortable to wear all day.' },
        { author: 'Omar S.', rating: 5, text: 'Perfect blend of modesty and style. Love it!' }
    ];

    return reviewsData.map(review => `
        <div class="review">
            <div class="review-header">
                <span class="review-author">${review.author}</span>
                <span class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</span>
            </div>
            <p class="review-text">${review.text}</p>
        </div>
    `).join('');
}

// Select size
function selectSize(btn) {
    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
    
    // Show notification
    showNotification('Added to cart!');
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

// Update quantity
function updateQuantity(productId, delta) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    }
}

// Render cart
function renderCart() {
    const cartItems = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-message">Your cart is empty</div>';
        document.getElementById('cartTotal').textContent = '$0.00';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">${item.icon}</div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cartTotal').textContent = `$${total.toFixed(2)}`;
}

// Toggle save item
function toggleSaveItem(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const index = savedItems.findIndex(item => item.id === productId);
    if (index > -1) {
        savedItems.splice(index, 1);
        showNotification('Removed from saved items');
    } else {
        savedItems.push(product);
        showNotification('Saved for later!');
    }

    localStorage.setItem('savedItems', JSON.stringify(savedItems));
    updateSavedCount();
    renderSavedItems();
    renderProducts(); // Re-render to update save button states
}

// Check if saved
function isSaved(productId) {
    return savedItems.some(item => item.id === productId);
}

// Render saved items
function renderSavedItems() {
    const savedItemsContainer = document.getElementById('savedItems');
    
    if (savedItems.length === 0) {
        savedItemsContainer.innerHTML = '<div class="empty-message">No saved items</div>';
        return;
    }

    savedItemsContainer.innerHTML = savedItems.map(item => `
        <div class="saved-item">
            <div class="saved-item-image">${item.icon}</div>
            <div class="saved-item-details">
                <div class="saved-item-name">${item.name}</div>
                <div class="saved-item-price">$${item.price.toFixed(2)}</div>
                <button class="btn-secondary" onclick="addToCart(${item.id}); showNotification('Added to cart!');">
                    Add to Cart
                </button>
            </div>
            <button class="remove-btn" onclick="toggleSaveItem(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

// Update cart count
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

// Update saved count
function updateSavedCount() {
    document.getElementById('savedCount').textContent = savedItems.length;
}

// Toggle cart
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');
    
    cartSidebar.classList.toggle('open');
    overlay.classList.toggle('active');
    
    if (cartSidebar.classList.contains('open')) {
        renderCart();
        document.getElementById('savedSidebar').classList.remove('open');
    }
}

// Toggle saved
function toggleSaved() {
    const savedSidebar = document.getElementById('savedSidebar');
    const overlay = document.getElementById('overlay');
    
    savedSidebar.classList.toggle('open');
    overlay.classList.toggle('active');
    
    if (savedSidebar.classList.contains('open')) {
        renderSavedItems();
        document.getElementById('cartSidebar').classList.remove('open');
    }
}

// Toggle search
function toggleSearch() {
    const searchModal = document.getElementById('searchModal');
    const overlay = document.getElementById('overlay');
    
    searchModal.classList.toggle('open');
    overlay.classList.toggle('active');
    
    if (searchModal.classList.contains('open')) {
        document.getElementById('searchInput').focus();
    }
}

// Handle search
function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    const searchResults = document.getElementById('searchResults');
    
    if (query.length < 2) {
        searchResults.innerHTML = '';
        return;
    }

    const results = products.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.category.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );

    if (results.length === 0) {
        searchResults.innerHTML = '<div class="empty-message">No products found</div>';
        return;
    }

    searchResults.innerHTML = results.map(product => `
        <div class="search-result-item" onclick="showProductDetail(${product.id}); toggleSearch();">
            <div class="search-result-image">${product.icon}</div>
            <div class="search-result-info">
                <h4>${product.name}</h4>
                <p>$${product.price.toFixed(2)}</p>
            </div>
        </div>
    `).join('');
}

// Show category
function showCategory(category) {
    currentFilter = category;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === category);
    });
    renderProducts();
    document.querySelector('#products').scrollIntoView({ behavior: 'smooth' });
}

// Close modal
function closeModal() {
    document.getElementById('productModal').classList.remove('open');
    document.getElementById('overlay').classList.remove('active');
}

// Close all sidebars
function closeAllSidebars() {
    document.getElementById('cartSidebar').classList.remove('open');
    document.getElementById('savedSidebar').classList.remove('open');
    document.getElementById('productModal').classList.remove('open');
    document.getElementById('searchModal').classList.remove('open');
    document.getElementById('overlay').classList.remove('active');
}

// Toggle mobile menu
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background-color: var(--primary-gold);
        color: var(--primary-black);
        padding: 15px 25px;
        border-radius: 5px;
        font-weight: bold;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Remove after 3 seconds
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

// Go to checkout
function goToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    window.location.href = 'checkout.html';
}
