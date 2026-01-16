// User Authentication Management
function checkUserLogin() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const loginBtn = document.getElementById('loginBtn');
    
    if (isLoggedIn === 'true') {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && loginBtn) {
            // Change icon to indicate logged-in state
            loginBtn.innerHTML = '<i class="fas fa-user-circle"></i>';
            loginBtn.title = `Logged in as ${user.name}`;
            loginBtn.style.color = 'var(--primary-gold)';
        }
    }
}

// Sample product data
const products = [
    {
        id: 1,
        name: 'Classic Thobe',
        category: 'men',
        type: 'islamic',
        subtype: 'thobe',
        price: 79.99,
        rating: 4.5,
        reviews: 28,
        description: 'Premium quality thobe with modern cut and traditional elegance. Perfect for daily wear and special occasions.',
        icon: '🕌'
    },
    {
        id: 2,
        name: 'White Emirati Thobe',
        category: 'men',
        type: 'islamic',
        subtype: 'thobe',
        price: 89.99,
        rating: 4.7,
        reviews: 35,
        description: 'Traditional Emirati-style thobe in pristine white. Elegant and comfortable.',
        icon: '🕌'
    },
    {
        id: 3,
        name: 'Black Saudi Thobe',
        category: 'men',
        type: 'islamic',
        subtype: 'thobe',
        price: 85.99,
        rating: 4.6,
        reviews: 42,
        description: 'Classic Saudi-style thobe in sophisticated black. Perfect for any occasion.',
        icon: '🕌'
    },
    {
        id: 4,
        name: 'Street Hoodie',
        category: 'men',
        type: 'streetwear',
        subtype: 'hoodie',
        price: 59.99,
        rating: 4.8,
        reviews: 42,
        description: 'Bold streetwear hoodie with Islamic calligraphy design. Comfortable and stylish.',
        icon: '👕'
    },
    {
        id: 5,
        name: 'Urban Faith Jacket',
        category: 'men',
        type: 'streetwear',
        subtype: 'jacket',
        price: 79.99,
        rating: 4.9,
        reviews: 38,
        description: 'Modern streetwear jacket with subtle Islamic design elements.',
        icon: '🧥'
    },
    {
        id: 6,
        name: 'Modest Abaya',
        category: 'women',
        type: 'islamic',
        subtype: 'abaya',
        price: 89.99,
        rating: 4.7,
        reviews: 35,
        description: 'Elegant abaya with contemporary design. Made from premium fabric for all-day comfort.',
        icon: '👗'
    },
    {
        id: 7,
        name: 'Classic Black Abaya',
        category: 'women',
        type: 'islamic',
        subtype: 'abaya',
        price: 79.99,
        rating: 4.8,
        reviews: 51,
        description: 'Timeless black abaya with elegant draping. Perfect for daily wear.',
        icon: '👗'
    },
    {
        id: 8,
        name: 'Designer Embroidered Abaya',
        category: 'women',
        type: 'islamic',
        subtype: 'abaya',
        price: 129.99,
        rating: 4.9,
        reviews: 29,
        description: 'Luxurious abaya with intricate embroidery. Makes a statement.',
        icon: '👗'
    },
    {
        id: 9,
        name: 'Hijab Collection Set',
        category: 'women',
        type: 'islamic',
        subtype: 'hijab',
        price: 24.99,
        rating: 4.6,
        reviews: 56,
        description: 'Premium quality hijabs in various colors. Soft, breathable, and easy to style.',
        icon: '🧕'
    },
    {
        id: 10,
        name: 'Chiffon Hijab Pack',
        category: 'women',
        type: 'islamic',
        subtype: 'hijab',
        price: 34.99,
        rating: 4.7,
        reviews: 48,
        description: 'Set of 5 chiffon hijabs in versatile colors. Lightweight and elegant.',
        icon: '🧕'
    },
    {
        id: 11,
        name: 'Jersey Hijab Collection',
        category: 'women',
        type: 'islamic',
        subtype: 'hijab',
        price: 29.99,
        rating: 4.8,
        reviews: 62,
        description: 'Comfortable jersey hijabs that stay in place. Perfect for everyday wear.',
        icon: '🧕'
    },
    {
        id: 12,
        name: 'Women\'s Streetwear Hoodie',
        category: 'women',
        type: 'streetwear',
        subtype: 'hoodie',
        price: 54.99,
        rating: 4.7,
        reviews: 33,
        description: 'Modest streetwear hoodie with faith-inspired graphics. Stylish and comfortable.',
        icon: '👕'
    },
    {
        id: 13,
        name: 'Urban Modest Set',
        category: 'women',
        type: 'streetwear',
        subtype: 'set',
        price: 69.99,
        rating: 4.8,
        reviews: 27,
        description: 'Coordinated streetwear set combining modesty with urban style.',
        icon: '👖'
    },
    {
        id: 14,
        name: 'Kids Kurta Set',
        category: 'kids',
        type: 'islamic',
        subtype: 'other',
        price: 39.99,
        rating: 4.9,
        reviews: 31,
        description: 'Comfortable kurta set for kids. Perfect for Eid and special occasions.',
        icon: '👶'
    },
    {
        id: 15,
        name: 'Boys Mini Thobe',
        category: 'kids',
        type: 'islamic',
        subtype: 'thobe',
        price: 45.99,
        rating: 4.8,
        reviews: 44,
        description: 'Adorable mini thobe for young boys. Comfortable and stylish.',
        icon: '🕌'
    },
    {
        id: 16,
        name: 'Kids White Thobe',
        category: 'kids',
        type: 'islamic',
        subtype: 'thobe',
        price: 42.99,
        rating: 4.7,
        reviews: 38,
        description: 'Classic white thobe for children. Perfect for special occasions.',
        icon: '🕌'
    },
    {
        id: 17,
        name: 'Kids Streetwear Tee',
        category: 'kids',
        type: 'streetwear',
        subtype: 'tshirt',
        price: 19.99,
        rating: 4.5,
        reviews: 24,
        description: 'Cool streetwear t-shirt for kids with faith-inspired graphics.',
        icon: '👕'
    },
    {
        id: 18,
        name: 'Prayer Mat Set',
        category: 'men',
        type: 'islamic',
        subtype: 'accessories',
        price: 34.99,
        rating: 4.8,
        reviews: 67,
        description: 'Portable prayer mat with carrying case. Comfortable and durable.',
        icon: '🕋'
    },
    {
        id: 19,
        name: 'Designer Jilbab',
        category: 'women',
        type: 'islamic',
        subtype: 'abaya',
        price: 99.99,
        rating: 4.9,
        reviews: 43,
        description: 'Modern designer jilbab with elegant draping. Perfect for modest fashion.',
        icon: '👗'
    },
    {
        id: 20,
        name: 'Athletic Tracksuit',
        category: 'men',
        type: 'streetwear',
        subtype: 'tracksuit',
        price: 69.99,
        rating: 4.6,
        reviews: 38,
        description: 'Modest athletic wear for men. Comfortable and performance-ready.',
        icon: '👔'
    },
    {
        id: 21,
        name: 'Girls Dress Set',
        category: 'kids',
        type: 'islamic',
        subtype: 'dress',
        price: 44.99,
        rating: 4.7,
        reviews: 29,
        description: 'Beautiful modest dress set for girls. Comfortable and stylish.',
        icon: '👗'
    },
    {
        id: 22,
        name: 'Sports Hijab',
        category: 'women',
        type: 'islamic',
        subtype: 'hijab',
        price: 29.99,
        rating: 4.8,
        reviews: 52,
        description: 'Performance sports hijab. Breathable, moisture-wicking, and secure.',
        icon: '🧕'
    },
    {
        id: 23,
        name: 'Jubba Jacket',
        category: 'men',
        type: 'islamic',
        subtype: 'thobe',
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
    checkUserLogin(); // Check if user is logged in
    renderProducts();
    renderStreetWearSection();
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

    // Sidebar toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', () => toggleSidebar());
    const closeSidebarBtn = document.getElementById('closeSidebarBtn');
    if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', () => toggleSidebar(false));

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

// Render streetwear section
function renderStreetWearSection() {
    // Get streetwear products separated by gender
    const menStreetWear = products.filter(p => p.category === 'men' && p.type === 'streetwear');
    const womenStreetWear = products.filter(p => p.category === 'women' && p.type === 'streetwear');
    
    // Render men's streetwear
    const menStreetGrid = document.getElementById('menStreetGrid');
    if (menStreetWear.length > 0) {
        menStreetGrid.innerHTML = menStreetWear.map(product => `
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
    } else {
        menStreetGrid.innerHTML = '<p class="empty-message">No men\'s streetwear available</p>';
    }
    
    // Render women's streetwear
    const womenStreetGrid = document.getElementById('womenStreetGrid');
    if (womenStreetWear.length > 0) {
        womenStreetGrid.innerHTML = womenStreetWear.map(product => `
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
    } else {
        womenStreetGrid.innerHTML = '<p class="empty-message">No women\'s streetwear available</p>';
    }
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
        { author: 'Omar S.', rating: 5, text: 'Perfect blend of modesty and style. Love it!' },
        { author: 'Aisha R.', rating: 4, text: 'Comfortable and elegant. Highly recommend.' }
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

    // Close sidebar if open
    const sidebarEl = document.getElementById('sidebar');
    if (sidebarEl) sidebarEl.classList.remove('open');
    document.body.classList.remove('sidebar-open');

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
    showNotification('Added to cart!');
}

// Toggle sidebar
function toggleSidebar(force) {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const body = document.body;

    let open;
    if (typeof force === 'boolean') {
        open = force;
    } else {
        open = !sidebar.classList.contains('open');
    }

    sidebar.classList.toggle('open', open);
    overlay.classList.toggle('active', open);
    body.classList.toggle('sidebar-open', open);
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

// Show category with dedicated section
function showCategory(category) {
    // Hide main sections
    document.getElementById('products').classList.add('hidden');
    document.getElementById('about').classList.add('hidden');
    document.getElementById('categorySection').classList.remove('hidden');
    
    // Set category information
    const categoryInfo = {
        'men': {
            title: "Men's Collection",
            subtitle: "Modern Islamic wear for men",
            icon: 'fa-male',
            subsections: [
                { name: 'Thobes', icon: 'fa-mosque', subtype: 'thobe' },
                { name: 'Streetwear', icon: 'fa-hat-cowboy', type: 'streetwear' }
            ]
        },
        'women': {
            title: "Women's Collection",
            subtitle: "Modest and elegant designs",
            icon: 'fa-female',
            subsections: [
                { name: 'Abayas', icon: 'fa-female', subtype: 'abaya' },
                { name: 'Hijabs', icon: 'fa-head-side-mask', subtype: 'hijab' },
                { name: 'Streetwear', icon: 'fa-hat-cowboy', type: 'streetwear' }
            ]
        },
        'kids': {
            title: "Kids Collection",
            subtitle: "Stylish wear for children",
            icon: 'fa-child',
            subsections: [
                { name: 'Thobes', icon: 'fa-mosque', subtype: 'thobe' },
                { name: 'Islamic Wear', icon: 'fa-star-and-crescent', type: 'islamic', excludeSubtype: 'thobe' }
            ]
        }
    };
    
    const info = categoryInfo[category];
    
    // Update logo section (use brand logo image)
    document.getElementById('categorySectionTitle').textContent = info.title;
    document.getElementById('categoryLogoTitle').textContent = info.title;
    document.getElementById('categoryLogoSubtitle').textContent = info.subtitle;
    document.getElementById('categoryIcon').innerHTML = `<img class="category-logo-image" src="images/real-removebg-preview (1).png" alt="The Believers Logo">`;
    
    // Render subsections dynamically
    const subsectionsContainer = document.getElementById('categorySubsections');
    subsectionsContainer.innerHTML = '';
    
    info.subsections.forEach(subsection => {
        let filteredProducts;
        
        if (subsection.subtype) {
            // Filter by subtype
            filteredProducts = products.filter(p => 
                p.category === category && p.subtype === subsection.subtype
            );
        } else if (subsection.type) {
            // Filter by type
            if (subsection.excludeSubtype) {
                filteredProducts = products.filter(p => 
                    p.category === category && 
                    p.type === subsection.type && 
                    p.subtype !== subsection.excludeSubtype
                );
            } else {
                filteredProducts = products.filter(p => 
                    p.category === category && p.type === subsection.type
                );
            }
        }
        
        if (filteredProducts && filteredProducts.length > 0) {
            const subsectionHTML = `
                <div class="subsection">
                    <div class="subsection-header">
                        <h3 class="subsection-title">
                            <i class="fas ${subsection.icon}"></i> ${subsection.name}
                        </h3>
                    </div>
                    <div class="products-grid">
                        ${filteredProducts.map(product => `
                            <div class="product-card" onclick="showProductDetail(${product.id})">
                                <div class="product-image">${product.icon}</div>
                                <div class="product-info">
                                    <h3>${product.name}</h3>
                                    <div class="rating">
                                        <span class="stars">${'⭐'.repeat(Math.round(product.rating))}</span>
                                        <span class="rating-value">${product.rating}</span>
                                    </div>
                                    <p class="reviews">${product.reviews} reviews</p>
                                    <p class="price">$${product.price.toFixed(2)}</p>
                                    <button class="btn-secondary" onclick="event.stopPropagation(); addToCart(${product.id})">Add to Cart</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            subsectionsContainer.innerHTML += subsectionHTML;
        }
    });
    
    // Scroll to category section
    document.getElementById('categorySection').scrollIntoView({ behavior: 'smooth' });
}

// Back to home from category section
function backToHome() {
    // Show products section and about
    document.getElementById('products').classList.remove('hidden');
    document.getElementById('about').classList.remove('hidden');
    document.getElementById('categorySection').classList.add('hidden');
    
    // Reset filter to all
    currentFilter = 'all';
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === 'all');
    });
    renderProducts();
    
    // Scroll to products
    document.querySelector('.categories').scrollIntoView({ behavior: 'smooth' });
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
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.remove('open');
    document.body.classList.remove('sidebar-open');
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
