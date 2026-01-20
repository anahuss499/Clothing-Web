// Product Detail Page Logic

// Get product ID from URL
function getProductIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('id'));
}

let currentProductId = null;
let currentReviewRating = 0;

// Initialize product detail page
document.addEventListener('DOMContentLoaded', function() {
    checkUserLogin();
    const productId = getProductIdFromURL();
    currentProductId = productId;
    
    if (productId) {
        displayProductDetail(productId);
        displayReviews(productId);
        displayRecommendedProducts(productId);
    } else {
        // Redirect to home if no product ID
        window.location.href = 'index.html';
    }
    
    updateCartCount();
    updateSavedCount();
    initializeEventListeners();
    initializeReviewForm();
    
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
});

// Display full product detail
function displayProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const container = document.getElementById('productDetailContainer');
    const infoSection = document.getElementById('productInfoSection');

    // Get product images (color variations)
    const images = product.images || [product.icon, product.icon, product.icon, product.icon];
    const sizes = product.sizes || ['S', 'M', 'L', 'XL'];
    const colors = product.colors || [
        { name: 'Black', hex: '#1a1a1a' },
        { name: 'White', hex: '#ffffff' },
        { name: 'Navy', hex: '#001f3f' },
        { name: 'Gold', hex: '#d4a574' }
    ];

    // Product detail HTML
    container.innerHTML = `
        <div class="product-detail-images">
            <div class="main-image" id="mainImage">
                ${images[0]}
            </div>
            <div class="thumbnail-gallery">
                ${images.map((img, idx) => `
                    <div class="thumbnail ${idx === 0 ? 'active' : ''}" onclick="switchImage(this, '${img}')">
                        ${img}
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="product-detail-info">
            <div class="product-header">
                <span class="product-category-badge">${product.category}</span>
                <h1>${product.name}</h1>
                <div class="product-rating-detail">
                    <div class="stars">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}</div>
                    <span class="review-count">${product.reviews} reviews</span>
                </div>
            </div>

            <div class="product-price-detail">
                £${product.price.toFixed(2)}
            </div>

            <p class="product-description-detail">
                ${product.description}
            </p>

            <div class="size-section">
                <h3>Select Size</h3>
                <div class="size-options">
                    ${sizes.map(size => `
                        <button class="size-btn ${size === 'M' ? 'active' : ''}" onclick="selectSize(this)">
                            ${size}
                        </button>
                    `).join('')}
                </div>
            </div>

            <div class="color-section">
                <h3>Choose Color</h3>
                <div class="color-options">
                    ${colors.map((color, idx) => `
                        <button class="color-btn ${idx === 0 ? 'active' : ''}" 
                                style="background-color: ${color.hex}" 
                                onclick="selectColor(this)"
                                title="${color.name}">
                        </button>
                    `).join('')}
                </div>
            </div>

            <div class="product-actions-section">
                <div class="qty-selector">
                    <button class="qty-btn" onclick="decreaseQuantity()">−</button>
                    <div class="qty-display" id="qtyDisplay">1</div>
                    <button class="qty-btn" onclick="increaseQuantity()">+</button>
                </div>
                <button class="add-to-cart-btn-detail" onclick="addToCartFromDetail(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
                <button class="buy-now-btn-detail" onclick="buyNowFromDetail(${product.id})">
                    <i class="fas fa-bolt"></i> Buy Now
                </button>
                <button class="save-btn-detail ${isSaved(product.id) ? 'saved' : ''}" 
                        onclick="toggleSaveFromDetail(${product.id}, this)">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
        </div>
    `;

    // Product info section (shipping, returns, etc)
    infoSection.innerHTML = `
        <div class="info-item">
            <div class="info-icon"><i class="fas fa-truck"></i></div>
            <div class="info-title">Free Standard Shipping</div>
            <div class="info-text">Express delivery available for £5</div>
        </div>
        <div class="info-item">
            <div class="info-icon"><i class="fas fa-undo"></i></div>
            <div class="info-title">Easy Returns</div>
            <div class="info-text">30-day return policy</div>
        </div>
        <div class="info-item">
            <div class="info-icon"><i class="fas fa-headset"></i></div>
            <div class="info-title">Support</div>
            <div class="info-text">24/7 customer service</div>
        </div>
    `;
}

// Switch main image
function switchImage(thumbnail, imageContent) {
    const mainImage = document.getElementById('mainImage');
    mainImage.textContent = imageContent;
    
    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
    thumbnail.classList.add('active');
}

// Select size
function selectSize(btn) {
    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

// Select color
function selectColor(btn) {
    document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

// Quantity management
let detailQuantity = 1;

function increaseQuantity() {
    detailQuantity++;
    document.getElementById('qtyDisplay').textContent = detailQuantity;
}

function decreaseQuantity() {
    if (detailQuantity > 1) {
        detailQuantity--;
        document.getElementById('qtyDisplay').textContent = detailQuantity;
    }
}

// Add to cart from detail page
function addToCartFromDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    for (let i = 0; i < detailQuantity; i++) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
    showNotification(`Added ${detailQuantity} item(s) to cart!`);
    
    // Reset quantity
    detailQuantity = 1;
    document.getElementById('qtyDisplay').textContent = '1';
}

// Buy Now from detail page - Add to cart and redirect to checkout
function buyNowFromDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    for (let i = 0; i < detailQuantity; i++) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Redirect to checkout page
    window.location.href = 'checkout.html';
}

// Toggle save from detail page
function toggleSaveFromDetail(productId, btn) {
    toggleSaveItem(productId);
    btn.classList.toggle('saved');
}

// Display reviews
function displayReviews(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const reviews = product.reviews_data || [
        { author: 'Omar S.', rating: 5, date: '2 weeks ago', text: 'Perfect blend of modesty and style. The quality is exceptional!' },
        { author: 'Aisha R.', rating: 4, date: '1 month ago', text: 'Very comfortable and elegant. The fit is perfect for my body type.' },
        { author: 'Mohammed H.', rating: 5, date: '1 month ago', text: 'Highly recommend! The material is high quality and looks great.' },
        { author: 'Fatima K.', rating: 5, date: '2 months ago', text: 'Excellent service and fast delivery. Very happy with my purchase!' }
    ];

    // Calculate rating distribution
    const ratingDistribution = {
        5: reviews.filter(r => r.rating === 5).length,
        4: reviews.filter(r => r.rating === 4).length,
        3: reviews.filter(r => r.rating === 3).length,
        2: reviews.filter(r => r.rating === 2).length,
        1: reviews.filter(r => r.rating === 1).length
    };

    const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

    // Display reviews summary
    const reviewsSummary = document.getElementById('reviewsSummary');
    reviewsSummary.innerHTML = `
        <div class="rating-summary">
            <div class="big-rating">${avgRating}</div>
            <div class="rating-info">
                <h3>Average Rating</h3>
                <div>${'★'.repeat(Math.round(avgRating))}${'☆'.repeat(5 - Math.round(avgRating))}</div>
                <p>Based on ${reviews.length} reviews</p>
            </div>
        </div>
        <div class="rating-info">
            <h3>Rating Breakdown</h3>
            <div class="rating-bars">
                ${[5, 4, 3, 2, 1].map(rating => {
                    const count = ratingDistribution[rating];
                    const percentage = (count / reviews.length) * 100;
                    return `
                        <div class="rating-bar">
                            <span>${rating} ${rating === 1 ? 'star' : 'stars'}</span>
                            <div class="bar-fill">
                                <div class="bar-progress" style="width: ${percentage}%"></div>
                            </div>
                            <span class="bar-count">${count}</span>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;

    // Display individual reviews
    const reviewsList = document.getElementById('reviewsList');
    reviewsList.innerHTML = reviews.map((review, index) => {
        const isUserReview = review.userId && review.userId === getCurrentUserId();
        return `
        <div class="review-item" id="review-${index}">
            <div class="review-header-item">
                <div class="reviewer-info">
                    <div class="reviewer-name">${review.author}</div>
                    <div class="review-date">${review.date}</div>
                </div>
                <div class="review-rating-stars">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
            </div>
            ${review.text ? `<p class="review-content">${review.text}</p>` : ''}
            <div class="review-helpful">
                <button class="helpful-btn" onclick="markHelpful(${index}, 'helpful', this)" title="Mark as helpful">
                    <i class="far fa-thumbs-up"></i> Helpful <span class="helpful-count">${review.helpfulCount || 0}</span>
                </button>
                ${isUserReview ? `
                    <div class="review-actions">
                        <button class="review-action-btn" onclick="editReview(${index})">Edit</button>
                        <button class="review-action-btn delete" onclick="deleteReview(${index})">Delete</button>
                    </div>
                ` : ''}
            </div>
        </div>
    `;}
    ).join('');
}

// Display recommended products
function displayRecommendedProducts(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Get similar products based on category and type
    const recommendedProducts = products.filter(p => 
        p.id !== productId && 
        (p.category === product.category || p.type === product.type)
    ).slice(0, 4);

    const grid = document.getElementById('recommendedGrid');
    grid.innerHTML = recommendedProducts.map(product => `
        <div class="product-card">
            <div class="product-image">
                ${product.icon}
                <div class="product-actions">
                    <button class="action-btn save-btn ${isSaved(product.id) ? 'saved' : ''}" 
                            onclick="toggleSaveItem(${product.id}); event.stopPropagation();">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="action-btn quick-view-btn" 
                            onclick="goToProduct(${product.id}); event.stopPropagation();">
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
                <div class="product-price">£${product.price.toFixed(2)}</div>
                <div class="product-buttons">
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id}); event.stopPropagation();">
                        Add to Cart
                    </button>
                    <button class="buy-now-btn" onclick="buyNow(${product.id}); event.stopPropagation();">
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Navigate to another product
function goToProduct(productId) {
    detailQuantity = 1;
    window.location.href = `product-detail.html?id=${productId}`;
}

// Scroll to review form
function scrollToReviewForm() {
    const reviewForm = document.getElementById('writeReviewSection');
    const isLoggedIn = getCurrentUserId();
    
    if (!isLoggedIn) {
        showNotification('Please log in to write a review');
        window.location.href = 'login.html';
        return;
    }
    
    reviewForm.style.display = 'block';
    reviewForm.scrollIntoView({ behavior: 'smooth' });
}

// Initialize review form
function initializeReviewForm() {
    const form = document.getElementById('reviewForm');
    if (form) {
        form.addEventListener('submit', submitReview);
    }
}

// Set review rating
function setReviewRating(rating) {
    currentReviewRating = rating;
    document.getElementById('reviewRating').value = rating;
    
    // Update star display
    document.querySelectorAll('#starRatingInput .star').forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
    
    // Update label
    const labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
    document.getElementById('ratingLabel').textContent = labels[rating];
}

// Submit review
async function submitReview(e) {
    e.preventDefault();
    
    const name = document.getElementById('reviewerName').value.trim();
    const rating = parseInt(document.getElementById('reviewRating').value);
    const comment = document.getElementById('reviewComment').value.trim();
    
    // Validation
    if (!name) {
        showNotification('Please enter your name');
        return;
    }
    
    if (rating === 0) {
        showNotification('Please select a rating');
        return;
    }
    
    if (!comment) {
        showNotification('Please enter a comment');
        return;
    }
    
    const userId = getCurrentUserId();
    const product = products.find(p => p.id === currentProductId);
    
    if (!product) return;
    
    // Create new review
    const newReview = {
        id: Date.now(),
        author: name,
        userId: userId,
        rating: rating,
        text: comment,
        date: 'Just now',
        helpfulCount: 0
    };
    
    // Initialize reviews_data if not exists
    if (!product.reviews_data) {
        product.reviews_data = [];
    }
    
    product.reviews_data.unshift(newReview);
    
    // Save to localStorage
    localStorage.setItem('products', JSON.stringify(products));
    
    // Reset form
    document.getElementById('reviewForm').reset();
    document.getElementById('reviewRating').value = 0;
    currentReviewRating = 0;
    document.querySelectorAll('#starRatingInput .star').forEach(star => {
        star.classList.remove('active');
    });
    document.getElementById('ratingLabel').textContent = 'Select rating';
    
    // Hide form
    document.getElementById('writeReviewSection').style.display = 'none';
    
    // Refresh reviews display
    displayReviews(currentProductId);
    
    showNotification('Review submitted successfully!');
}

// Cancel review form
function cancelReviewForm() {
    document.getElementById('writeReviewSection').style.display = 'none';
    document.getElementById('reviewForm').reset();
    document.getElementById('reviewRating').value = 0;
    currentReviewRating = 0;
    document.querySelectorAll('#starRatingInput .star').forEach(star => {
        star.classList.remove('active');
    });
    document.getElementById('ratingLabel').textContent = 'Select rating';
}

// Edit review
function editReview(reviewIndex) {
    const product = products.find(p => p.id === currentProductId);
    if (!product || !product.reviews_data || !product.reviews_data[reviewIndex]) return;
    
    const review = product.reviews_data[reviewIndex];
    
    // Populate form with review data
    document.getElementById('reviewerName').value = review.author;
    document.getElementById('reviewComment').value = review.text || '';
    setReviewRating(review.rating);
    
    // Store current review index for updating
    document.getElementById('reviewForm').reviewIndex = reviewIndex;
    document.getElementById('reviewForm').isEditing = true;
    
    // Update submit button text
    const submitBtn = document.querySelector('.submit-review-btn');
    submitBtn.textContent = 'Update Review';
    
    // Show form
    document.getElementById('writeReviewSection').style.display = 'block';
    document.getElementById('writeReviewSection').scrollIntoView({ behavior: 'smooth' });
}

// Modified submitReview to handle editing
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('reviewForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('reviewerName').value.trim();
            const rating = parseInt(document.getElementById('reviewRating').value);
            const comment = document.getElementById('reviewComment').value.trim();
            
            // Validation
            if (!name) {
                showNotification('Please enter your name');
                return;
            }
            
            if (rating === 0) {
                showNotification('Please select a rating');
                return;
            }
            
            if (!comment) {
                showNotification('Please enter a comment');
                return;
            }
            
            const userId = getCurrentUserId();
            const product = products.find(p => p.id === currentProductId);
            
            if (!product) return;
            
            // Initialize reviews_data if not exists
            if (!product.reviews_data) {
                product.reviews_data = [];
            }
            
            if (form.isEditing && form.reviewIndex !== undefined) {
                // Update existing review
                const review = product.reviews_data[form.reviewIndex];
                review.author = name;
                review.rating = rating;
                review.text = comment;
                review.date = 'Just edited';
                
                document.querySelector('.submit-review-btn').textContent = 'Submit Review';
                form.isEditing = false;
                form.reviewIndex = undefined;
                
                showNotification('Review updated successfully!');
            } else {
                // Create new review
                const newReview = {
                    id: Date.now(),
                    author: name,
                    userId: userId,
                    rating: rating,
                    text: comment,
                    date: 'Just now',
                    helpfulCount: 0
                };
                
                product.reviews_data.unshift(newReview);
                showNotification('Review submitted successfully!');
            }
            
            // Save to localStorage
            localStorage.setItem('products', JSON.stringify(products));
            
            // Reset form
            document.getElementById('reviewForm').reset();
            document.getElementById('reviewRating').value = 0;
            currentReviewRating = 0;
            document.querySelectorAll('#starRatingInput .star').forEach(star => {
                star.classList.remove('active');
            });
            document.getElementById('ratingLabel').textContent = 'Select rating';
            
            // Hide form
            document.getElementById('writeReviewSection').style.display = 'none';
            
            // Refresh reviews display
            displayReviews(currentProductId);
        });
    }
});

// Delete review
function deleteReview(reviewIndex) {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    const product = products.find(p => p.id === currentProductId);
    if (!product || !product.reviews_data) return;
    
    product.reviews_data.splice(reviewIndex, 1);
    
    // Save to localStorage
    localStorage.setItem('products', JSON.stringify(products));
    
    // Refresh reviews display
    displayReviews(currentProductId);
    
    showNotification('Review deleted successfully!');
}

// Mark review as helpful
function markHelpful(reviewIndex, type, button) {
    const product = products.find(p => p.id === currentProductId);
    if (!product || !product.reviews_data || !product.reviews_data[reviewIndex]) return;
    
    const review = product.reviews_data[reviewIndex];
    
    if (type === 'helpful') {
        review.helpfulCount = (review.helpfulCount || 0) + 1;
        button.classList.add('marked-helpful');
        button.disabled = true;
    }
    
    // Save to localStorage
    localStorage.setItem('products', JSON.stringify(products));
}
