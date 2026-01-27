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

            showWelcomeToast(user);
        }
    }
}

// Lightweight welcome toast for returning users
function showWelcomeToast(user) {
    if (document.getElementById('welcomeToast')) {
        return;
    }

    const toast = document.createElement('div');
    toast.id = 'welcomeToast';
    toast.textContent = `Welcome back, ${user.name}!`;
    toast.style.cssText = [
        'position: fixed',
        'top: 20px',
        'right: 20px',
        'padding: 12px 18px',
        'background: #0f172a',
        'color: #f8fafc',
        'border-radius: 10px',
        'box-shadow: 0 8px 24px rgba(0,0,0,0.18)',
        'z-index: 9999',
        'font-weight: 600',
        'letter-spacing: 0.2px'
    ].join(';');

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Get current user ID (email is used as unique identifier)
function getCurrentUserId() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.email) {
            return user.email;
        }
    }
    return null;
}

// Sample product data with enhanced details
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
        description: 'Premium quality thobe with modern cut and traditional elegance. Perfect for daily wear and special occasions. Made from 100% cotton blend fabric that ensures comfort throughout the day.',
        icon: '🕌',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: [
            { name: 'Black', hex: '#1a1a1a' },
            { name: 'White', hex: '#ffffff' },
            { name: 'Navy', hex: '#001f3f' },
            { name: 'Brown', hex: '#8b4513' }
        ],
        images: ['🕌', '🕌', '🕌', '🕌'],
        reviews_data: [
            { author: 'Omar S.', rating: 5, date: '2 weeks ago', text: 'Perfect blend of modesty and style. The quality is exceptional and it fits perfectly!', helpfulCount: 32, notHelpfulCount: 3 },
            { author: 'Ahmed K.', rating: 4, date: '1 month ago', text: 'Great thobe, very comfortable. Only issue is the delivery took longer than expected.', helpfulCount: 32, notHelpfulCount: 5 },
            { author: 'Hassan M.', rating: 5, date: '1 month ago', text: 'Excellent craftsmanship. Will definitely buy again!', helpfulCount: 32, notHelpfulCount: 2 }
        ]
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
        description: 'Traditional Emirati-style thobe in pristine white. Elegant and comfortable for formal occasions. Features traditional embroidery details on the chest.',
        icon: '🕌',
        sizes: ['M', 'L', 'XL', 'XXL'],
        colors: [
            { name: 'White', hex: '#ffffff' },
            { name: 'Cream', hex: '#fffdd0' },
            { name: 'Gold Trim', hex: '#ffd700' }
        ],
        images: ['🕌', '🕌', '🕌', '🕌'],
        reviews_data: [
            { author: 'Fatima B.', rating: 5, date: '3 weeks ago', text: 'My husband looks so handsome in this! Perfect for Eid celebrations.', helpfulCount: 32, notHelpfulCount: 4 },
            { author: 'Mohammed F.', rating: 4, date: '1 month ago', text: 'Good quality, fits well. White color is brighter than expected.', helpfulCount: 32, notHelpfulCount: 4 }
        ]
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
        description: 'Classic Saudi-style thobe in sophisticated black. Perfect for any occasion. Premium fabric with traditional styling.',
        icon: '🕌',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: [
            { name: 'Black', hex: '#1a1a1a' },
            { name: 'Dark Gray', hex: '#36454f' }
        ],
        images: ['🕌', '🕌', '🕌', '🕌'],
        reviews_data: [
            { author: 'Sultan A.', rating: 5, date: '2 weeks ago', text: 'Versatile and elegant. Great for both casual and formal settings.', helpfulCount: 32, notHelpfulCount: 4 },
            { author: 'Yusuf M.', rating: 4, date: '2 weeks ago', text: 'Nice quality but fabric is a bit thick in summer.', helpfulCount: 32, notHelpfulCount: 4 }
        ]
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
        description: 'Bold streetwear hoodie with Islamic calligraphy design. Comfortable and stylish. Features a modern cut with contemporary graphics.',
        icon: '👕',
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        colors: [
            { name: 'Black', hex: '#1a1a1a' },
            { name: 'Gray', hex: '#808080' },
            { name: 'Navy', hex: '#001f3f' }
        ],
        images: ['👕', '👕', '👕', '👕'],
        reviews_data: [
            { author: 'Karim D.', rating: 5, date: '1 week ago', text: 'Love the design! Very comfortable hoodie, perfect for street style.', helpfulCount: 32, notHelpfulCount: 4 },
            { author: 'Ali R.', rating: 5, date: '2 weeks ago', text: 'Great quality and the graphics are amazing.', helpfulCount: 32, notHelpfulCount: 4 }
        ]
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
        description: 'Modern streetwear jacket with subtle Islamic design elements. Perfect for layering.',
        icon: '🧥',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: [
            { name: 'Black', hex: '#1a1a1a' },
            { name: 'Charcoal', hex: '#36454f' },
            { name: 'Olive', hex: '#808000' }
        ],
        images: ['🧥', '🧥', '🧥', '🧥'],
        reviews_data: [
            { author: 'Jamal S.', rating: 5, date: '2 weeks ago', text: 'Stylish and well-made. Exactly what I was looking for!', helpfulCount: 32, notHelpfulCount: 4 },
            { author: 'Rashid M.', rating: 5, date: '1 month ago', text: 'Amazing quality. The design is subtle but meaningful.', helpfulCount: 32, notHelpfulCount: 4 }
        ]
    },
    {
        id: 6,
        name: 'Modest Abaya',
        category: 'women',
        type: 'islamic',
        subtype: 'abaya',
        abayaStyle: 'modern',
        price: 89.99,
        rating: 4.7,
        reviews: 35,
        description: 'Elegant abaya with contemporary design. Made from premium fabric for all-day comfort. Features modern silhouette with traditional elements.',
        icon: '👗',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
            { name: 'Black', hex: '#1a1a1a' },
            { name: 'Navy', hex: '#001f3f' },
            { name: 'Dark Brown', hex: '#654321' }
        ],
        images: ['👗', '👗', '👗', '👗'],
        reviews_data: [
            { author: 'Aisha N.', rating: 5, date: '3 weeks ago', text: 'Beautiful abaya! Fits perfectly and the material is so soft.', helpfulCount: 32, notHelpfulCount: 4 },
            { author: 'Leila H.', rating: 4, date: '1 month ago', text: 'Very elegant. Only wish it came in more colors.', helpfulCount: 32, notHelpfulCount: 4 }
        ]
    },
    {
        id: 7,
        name: 'Classic Black Abaya',
        category: 'women',
        type: 'islamic',
        subtype: 'abaya',
        abayaStyle: 'classic',
        price: 79.99,
        rating: 4.8,
        reviews: 51,
        description: 'Timeless black abaya with elegant draping. Perfect for daily wear.',
        icon: '👗',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: [
            { name: 'Black', hex: '#1a1a1a' },
            { name: 'Deep Black', hex: '#0a0a0a' }
        ],
        images: ['👗', '👗', '👗', '👗'],
        reviews_data: [
            { author: 'Noor K.', rating: 5, date: '1 week ago', text: 'Perfect abaya! Great quality and very comfortable.', helpfulCount: 32, notHelpfulCount: 4 },
            { author: 'Rania M.', rating: 4, date: '2 weeks ago', text: 'Good value for money. Very happy with my purchase.', helpfulCount: 32, notHelpfulCount: 4 }
        ]
    },
    {
        id: 8,
        name: 'Designer Embroidered Abaya',
        category: 'women',
        type: 'islamic',
        subtype: 'abaya',
        abayaStyle: 'embroidered',
        price: 129.99,
        rating: 4.9,
        reviews: 29,
        description: 'Luxurious abaya with intricate embroidery. Makes a statement. Premium quality with detailed handwork.',
        icon: '👗',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
            { name: 'Black with Gold', hex: '#1a1a1a' },
            { name: 'Black with Pearl', hex: '#1a1a1a' }
        ],
        images: ['👗', '👗', '👗', '👗'],
        reviews_data: [
            { author: 'Yasmin S.', rating: 5, date: '2 weeks ago', text: 'Absolutely stunning! The embroidery is exquisite.', helpfulCount: 32, notHelpfulCount: 4 },
            { author: 'Dina W.', rating: 5, date: '1 month ago', text: 'Worth every penny. I get compliments every time I wear it.', helpfulCount: 32, notHelpfulCount: 4 }
        ]
    },
    {
        id: 32,
        name: 'Dubai Luxury Abaya',
        category: 'women',
        type: 'islamic',
        subtype: 'abaya',
        abayaStyle: 'dubai',
        price: 149.99,
        rating: 4.9,
        reviews: 34,
        description: 'Exquisite Dubai-style abaya with crystal embellishments and premium fabrics. Elegant and luxurious.',
        icon: '👗',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
            { name: 'Black with Crystals', hex: '#1a1a1a' },
            { name: 'Midnight Blue with Crystals', hex: '#001a4d' }
        ],
        images: ['👗', '👗', '👗', '👗'],
        reviews_data: [
            { author: 'Zahra E.', rating: 5, date: '1 week ago', text: 'Absolutely gorgeous! The crystals are stunning and high quality.', helpfulCount: 32, notHelpfulCount: 4 },
            { author: 'Amira F.', rating: 5, date: '2 weeks ago', text: 'Perfect for special occasions. This abaya is a showstopper!', helpfulCount: 32, notHelpfulCount: 4 }
        ]
    },
    {
        id: 33,
        name: 'Simple Black Abaya',
        category: 'women',
        type: 'islamic',
        subtype: 'abaya',
        abayaStyle: 'simple',
        price: 59.99,
        rating: 4.5,
        reviews: 42,
        description: 'Understated and elegant abaya in plain black. Perfect for everyday wear and minimalist style.',
        icon: '👗',
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        colors: [
            { name: 'Pure Black', hex: '#000000' }
        ],
        images: ['👗', '👗', '👗', '👗'],
        reviews_data: [
            { author: 'Hana G.', rating: 5, date: '1 week ago', text: 'Simple and perfect! Great quality for the price.', helpfulCount: 32, notHelpfulCount: 4 },
            { author: 'Sarah J.', rating: 4, date: '2 weeks ago', text: 'Very comfortable and versatile. Love it!', helpfulCount: 32, notHelpfulCount: 4 }
        ]
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
        icon: '🧕',
        sizes: ['One Size'],
        colors: [
            { name: 'Multicolor Set', hex: '#d4a574' }
        ],
        images: ['🧕', '🧕', '🧕', '🧕'],
        reviews_data: [
            { author: 'Maha T.', rating: 5, date: '1 week ago', text: 'Great set of hijabs! Excellent quality and perfect colors.', helpfulCount: 32, notHelpfulCount: 4 },
            { author: 'Zainab L.', rating: 4, date: '2 weeks ago', text: 'Good quality but wish there were more color options.', helpfulCount: 32, notHelpfulCount: 4 }
        ]
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
        icon: '🧕',
        sizes: ['One Size'],
        colors: [
            { name: 'Chiffon Mix', hex: '#d4a574' }
        ],
        images: ['🧕', '🧕', '🧕', '🧕'],
        reviews_data: [
            { author: 'Hana R.', rating: 5, date: '2 weeks ago', text: 'Perfect chiffon hijabs! Very easy to style.', helpfulCount: 32, notHelpfulCount: 4 },
            { author: 'Sarai M.', rating: 4, date: '1 month ago', text: 'Good quality, but one hijab got damaged during shipping.', helpfulCount: 32, notHelpfulCount: 4 }
        ]
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
        icon: '🧕',
        sizes: ['One Size'],
        colors: [
            { name: 'Jersey Mix', hex: '#d4a574' }
        ],
        images: ['🧕', '🧕', '🧕', '🧕'],
        reviews_data: [
            { author: 'Rana K.', rating: 5, date: '1 week ago', text: 'These hijabs stay in place all day! Best purchase ever.', helpfulCount: 32, notHelpfulCount: 4 },
            { author: 'Lina S.', rating: 5, date: '2 weeks ago', text: 'Very comfortable and stylish. Highly recommend!', helpfulCount: 32, notHelpfulCount: 4 }
        ]
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
        icon: '👕',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: [
            { name: 'Black', hex: '#1a1a1a' },
            { name: 'Burgundy', hex: '#800020' },
            { name: 'Charcoal', hex: '#36454f' }
        ],
        images: ['👕', '👕', '👕', '👕'],
        reviews_data: [
            { author: 'Sara J.', rating: 5, date: '2 weeks ago', text: 'Love this hoodie! Perfect for layering and very comfortable.', helpfulCount: 32, notHelpfulCount: 4 },
            { author: 'Noura B.', rating: 4, date: '1 month ago', text: 'Good quality but sizing runs small.', helpfulCount: 32, notHelpfulCount: 4 }
        ]
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
        icon: '👖',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
            { name: 'Black', hex: '#1a1a1a' },
            { name: 'Navy', hex: '#001f3f' }
        ],
        images: ['👖', '👖', '👖', '👖'],
        reviews_data: [
            { author: 'Amira G.', rating: 5, date: '2 weeks ago', text: 'Perfect set! Everything matches and looks amazing together.', helpfulCount: 32, notHelpfulCount: 4 },
            { author: 'Tasneem A.', rating: 5, date: '1 month ago', text: 'Great value as a set. Love the coordinated look!', helpfulCount: 32, notHelpfulCount: 4 }
        ]
    },
    {
        id: 14,
        name: 'Kids Kurta Set',
        category: 'kids',
        type: 'islamic',
        subtype: 'other',
        gender: 'unisex',
        price: 39.99,
        rating: 4.9,
        reviews: 31,
        description: 'Comfortable kurta set for kids. Perfect for Eid and special occasions.',
        icon: '👶',
        sizes: ['2T', '3T', '4T', '5T', '6T'],
        colors: [
            { name: 'Navy', hex: '#001f3f' },
            { name: 'Maroon', hex: '#800000' },
            { name: 'Green', hex: '#006400' }
        ],
        images: ['👶', '👶', '👶', '👶'],
        reviews_data: [
            { author: 'Mama Zara', rating: 5, date: '2 weeks ago', text: 'My kids look so adorable in these kurtas! Perfect for Eid.', helpfulCount: 32, notHelpfulCount: 4 },
            { author: 'Mama Amira', rating: 5, date: '1 month ago', text: 'Great quality and my kids love them!', helpfulCount: 32, notHelpfulCount: 4 }
        ]
    },
    {
        id: 15,
        name: 'Boys Mini Thobe',
        category: 'kids',
        type: 'islamic',
        subtype: 'thobe',
        gender: 'boys',
        price: 45.99,
        rating: 4.8,
        reviews: 44,
        description: 'Adorable mini thobe for young boys. Comfortable and stylish.',
        icon: '🕌',
        sizes: ['1T', '2T', '3T', '4T', '5T'],
        colors: [
            { name: 'White', hex: '#ffffff' },
            { name: 'Cream', hex: '#fffdd0' },
            { name: 'Navy', hex: '#001f3f' }
        ],
        images: ['🕌', '🕌', '🕌', '🕌'],
        reviews_data: [
            { author: 'Mama Noor', rating: 5, date: '1 week ago', text: 'My son looks so cute! Perfect thobe for celebrations.', helpfulCount: 32, notHelpfulCount: 4 },
            { author: 'Mama Yasmin', rating: 4, date: '2 weeks ago', text: 'Good quality but sizing is tight.', helpfulCount: 32, notHelpfulCount: 4 }
        ]
    },
    {
        id: 16,
        name: 'Kids White Thobe',
        category: 'kids',
        type: 'islamic',
        subtype: 'thobe',
        gender: 'unisex',
        price: 42.99,
        rating: 4.7,
        reviews: 38,
        description: 'Classic white thobe for children. Perfect for special occasions.',
        icon: '🕌',
        sizes: ['1T', '2T', '3T', '4T', '5T', '6T'],
        colors: [
            { name: 'White', hex: '#ffffff' },
            { name: 'Cream', hex: '#fffdd0' }
        ],
        images: ['🕌', '🕌', '🕌', '🕌'],
        reviews_data: [
            { author: 'Mama Layla', rating: 5, date: '2 weeks ago', text: 'Perfect thobe! My children love wearing it.', helpfulCount: 32, notHelpfulCount: 4 },
            { author: 'Mama Hana', rating: 4, date: '1 month ago', text: 'Good quality but white can stain easily.', helpfulCount: 32, notHelpfulCount: 4 }
        ]
    },
    {
        id: 17,
        name: 'Kids Streetwear Tee',
        category: 'kids',
        type: 'streetwear',
        subtype: 'tshirt',
        gender: 'unisex',
        price: 19.99,
        rating: 4.5,
        reviews: 24,
        description: 'Cool streetwear t-shirt for kids with faith-inspired graphics.',
        icon: '👕',
        sizes: ['2T', '3T', '4T', '5T', '6T'],
        colors: [
            { name: 'Black', hex: '#1a1a1a' },
            { name: 'Navy', hex: '#001f3f' }
        ],
        images: ['👕', '👕', '👕', '👕'],
        reviews_data: [
            { author: 'Mama Sara', rating: 5, date: '2 weeks ago', text: 'My kids love these tees! Great design and quality.', helpfulCount: 32, notHelpfulCount: 4 },
            { author: 'Mama Dina', rating: 4, date: '1 month ago', text: 'Good price but material is thin.', helpfulCount: 32, notHelpfulCount: 4 }
        ]
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
        icon: '🕋',
        sizes: ['One Size'],
        colors: [
            { name: 'Green', hex: '#006400' },
            { name: 'Navy', hex: '#001f3f' },
            { name: 'Black', hex: '#1a1a1a' }
        ],
        images: ['🕋', '🕋', '🕋', '🕋'],
        reviews_data: [
            { author: 'Abdullah M.', rating: 5, date: '1 week ago', text: 'Perfect prayer mat! Very portable and well-made.', helpfulCount: 32, notHelpfulCount: 4 },
            { author: 'Khalid A.', rating: 5, date: '2 weeks ago', text: 'Excellent quality. I take it everywhere!', helpfulCount: 32, notHelpfulCount: 4 }
        ]
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
        icon: '👗',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
            { name: 'Black', hex: '#1a1a1a' },
            { name: 'Navy', hex: '#001f3f' },
            { name: 'Charcoal', hex: '#36454f' }
        ],
        images: ['👗', '👗', '👗', '👗'],
        reviews_data: [
            { author: 'Nadia T.', rating: 5, date: '2 weeks ago', text: 'Stunning jilbab! The design is elegant and modern.', helpfulCount: 32, notHelpfulCount: 4 },
            { author: 'Salma R.', rating: 5, date: '1 month ago', text: 'Worth the investment. High-quality material and beautiful design.', helpfulCount: 32, notHelpfulCount: 4 }
        ]
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
        icon: '👔',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: [
            { name: 'Black', hex: '#1a1a1a' },
            { name: 'Navy', hex: '#001f3f' },
            { name: 'Gray', hex: '#808080' }
        ],
        images: ['👔', '👔', '👔', '👔'],
        reviews_data: [
            { author: 'Tarek F.', rating: 5, date: '2 weeks ago', text: 'Great tracksuit! Perfect for gym and casual wear.', helpfulCount: 32, notHelpfulCount: 4 },
            { author: 'Waleed S.', rating: 4, date: '1 month ago', text: 'Good quality but expensive.', helpfulCount: 32, notHelpfulCount: 4 }
        ]
    },
    {
        id: 21,
        name: 'Girls Dress Set',
        category: 'kids',
        type: 'islamic',
        subtype: 'dress',
        gender: 'girls',
        price: 44.99,
        rating: 4.7,
        reviews: 29,
        description: 'Beautiful modest dress set for girls. Comfortable and stylish.',
        icon: '👗',
        sizes: ['2T', '3T', '4T', '5T', '6T'],
        colors: [
            { name: 'Pink', hex: '#ff69b4' },
            { name: 'Purple', hex: '#800080' },
            { name: 'Green', hex: '#006400' }
        ],
        images: ['👗', '👗', '👗', '👗'],
        reviews_data: [
            { author: 'Mama Mariam', rating: 5, date: '2 weeks ago', text: 'Adorable dress! My daughter loves it.', helpfulCount: 32, notHelpfulCount: 4 },
            { author: 'Mama Rana', rating: 4, date: '1 month ago', text: 'Pretty dress but runs a bit small.', helpfulCount: 32, notHelpfulCount: 4 }
        ]
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
        icon: '🧕',
        sizes: ['One Size'],
        colors: [
            { name: 'Black', hex: '#1a1a1a' },
            { name: 'Navy', hex: '#001f3f' },
            { name: 'Charcoal', hex: '#36454f' }
        ],
        images: ['🧕', '🧕', '🧕', '🧕'],
        reviews_data: [
            { author: 'Mona E.', rating: 5, date: '1 week ago', text: 'Perfect for sports! Stays in place and breathes well.', helpfulCount: 32, notHelpfulCount: 4 },
            { author: 'Alia H.', rating: 5, date: '2 weeks ago', text: 'Best sports hijab I\'ve tried. Highly recommend!' }
        ]
    },
    {
        id: 23,
        name: 'Jubba Jacket',
        category: 'men',
        type: 'islamic',
        subtype: 'thobe',
        menType: 'thobe',
        price: 89.99,
        rating: 4.7,
        reviews: 33,
        description: 'Modern jubba-style jacket. Perfect blend of traditional and contemporary.',
        icon: '🧥',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: [
            { name: 'Black', hex: '#1a1a1a' },
            { name: 'Navy', hex: '#001f3f' },
            { name: 'Dark Brown', hex: '#654321' }
        ],
        images: ['🧥', '🧥', '🧥', '🧥'],
        reviews_data: [
            { author: 'Faisal P.', rating: 5, date: '2 weeks ago', text: 'Excellent jacket! Looks very elegant and modern.', helpfulCount: 32, notHelpfulCount: 4 },
            { author: 'Bilal Q.', rating: 4, date: '1 month ago', text: 'Good quality but could use better stitching.', helpfulCount: 32, notHelpfulCount: 4 }
        ]
    },
    // Moroccan Jubbahs
    {
        id: 24,
        name: 'Moroccan Thobe Djellaba',
        category: 'men',
        type: 'islamic',
        subtype: 'jubbah',
        menType: 'moroccan',
        price: 95.99,
        rating: 4.8,
        reviews: 31,
        description: 'Traditional Moroccan djellaba with modern touches. Soft fabric with traditional embroidery on chest.',
        icon: '👔',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: [
            { name: 'Navy Blue', hex: '#001f3f' },
            { name: 'Forest Green', hex: '#228b22' },
            { name: 'Maroon', hex: '#800000' }
        ],
        images: ['👔', '👔', '👔', '👔'],
        reviews_data: [
            { author: 'Hassan M.', rating: 5, date: '2 weeks ago', text: 'Authentic Moroccan style! Very comfortable and looks great.', helpfulCount: 32, notHelpfulCount: 4 },
            { author: 'Karim Z.', rating: 5, date: '1 month ago', text: 'Perfect for special occasions. Quality is outstanding!', helpfulCount: 32, notHelpfulCount: 4 }
        ]
    },
    {
        id: 25,
        name: 'Moroccan Embroidered Djellaba',
        category: 'men',
        type: 'islamic',
        subtype: 'jubbah',
        menType: 'moroccan',
        price: 115.99,
        rating: 4.9,
        reviews: 24,
        description: 'Premium Moroccan djellaba with intricate gold embroidery. Perfect for Eid and celebrations.',
        icon: '👔',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
            { name: 'Black with Gold', hex: '#1a1a1a' },
            { name: 'Burgundy with Gold', hex: '#800020' }
        ],
        images: ['👔', '👔', '👔', '👔'],
        reviews_data: [
            { author: 'Omar N.', rating: 5, date: '2 weeks ago', text: 'Stunning embroidery work! Received many compliments.', helpfulCount: 32, notHelpfulCount: 4 },
            { author: 'Youssef R.', rating: 5, date: '1 month ago', text: 'Worth every penny. Premium quality!', helpfulCount: 32, notHelpfulCount: 4 }
        ]
    },
    // Arab Jubbahs
    {
        id: 26,
        name: 'Traditional Arab Jubbah',
        category: 'men',
        type: 'islamic',
        subtype: 'jubbah',
        menType: 'arab',
        price: 85.99,
        rating: 4.7,
        reviews: 28,
        description: 'Classic Arab jubbah with traditional cut. Perfect for formal occasions.',
        icon: '👔',
        sizes: ['M', 'L', 'XL', 'XXL'],
        colors: [
            { name: 'Black', hex: '#1a1a1a' },
            { name: 'Dark Brown', hex: '#654321' },
            { name: 'Navy', hex: '#001f3f' }
        ],
        images: ['👔', '👔', '👔', '👔'],
        reviews_data: [
            { author: 'Rashid A.', rating: 5, date: '1 week ago', text: 'Authentic Arab styling. Very satisfied!', helpfulCount: 32, notHelpfulCount: 4 },
            { author: 'Samir K.', rating: 4, date: '2 weeks ago', text: 'Good quality, fits perfectly.', helpfulCount: 32, notHelpfulCount: 4 }
        ]
    },
    {
        id: 27,
        name: 'Saudi Style Jubbah',
        category: 'men',
        type: 'islamic',
        subtype: 'jubbah',
        menType: 'arab',
        price: 99.99,
        rating: 4.8,
        reviews: 35,
        description: 'Modern Saudi-inspired jubbah with premium fabric. Elegant and comfortable.',
        icon: '👔',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: [
            { name: 'Deep Black', hex: '#0a0a0a' },
            { name: 'Charcoal', hex: '#36454f' }
        ],
        images: ['👔', '👔', '👔', '👔'],
        reviews_data: [
            { author: 'Tariq H.', rating: 5, date: '2 weeks ago', text: 'Excellent quality and perfect fit!', helpfulCount: 32, notHelpfulCount: 4 },
            { author: 'Ali M.', rating: 5, date: '1 month ago', text: 'Best jubbah I\'ve owned. Highly recommend!' }
        ]
    },
    // Turkish Jubbahs
    {
        id: 28,
        name: 'Turkish Casual Jubbah',
        category: 'men',
        type: 'islamic',
        subtype: 'jubbah',
        menType: 'turkish',
        price: 79.99,
        rating: 4.6,
        reviews: 26,
        description: 'Contemporary Turkish jubbah with relaxed fit. Great for everyday wear.',
        icon: '👔',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: [
            { name: 'Olive Green', hex: '#556b2f' },
            { name: 'Stone Gray', hex: '#708090' },
            { name: 'Navy', hex: '#001f3f' }
        ],
        images: ['👔', '👔', '👔', '👔'],
        reviews_data: [
            { author: 'Emre T.', rating: 5, date: '1 week ago', text: 'Very comfortable and stylish!', helpfulCount: 32, notHelpfulCount: 4 },
            { author: 'Mustafa D.', rating: 4, date: '2 weeks ago', text: 'Good quality, arrived on time.', helpfulCount: 32, notHelpfulCount: 4 }
        ]
    },
    {
        id: 29,
        name: 'Ottoman Inspired Jubbah',
        category: 'men',
        type: 'islamic',
        subtype: 'jubbah',
        menType: 'turkish',
        price: 109.99,
        rating: 4.8,
        reviews: 32,
        description: 'Premium Turkish jubbah with rich traditional patterns. Perfect for special events.',
        icon: '👔',
        sizes: ['M', 'L', 'XL', 'XXL'],
        colors: [
            { name: 'Royal Blue', hex: '#4169e1' },
            { name: 'Deep Red', hex: '#8b0000' }
        ],
        images: ['👔', '👔', '👔', '👔'],
        reviews_data: [
            { author: 'Cengiz Y.', rating: 5, date: '1 week ago', text: 'Beautiful patterns and excellent craftsmanship!', helpfulCount: 32, notHelpfulCount: 4 },
            { author: 'Mehmet K.', rating: 5, date: '2 weeks ago', text: 'Worth the investment. Love the quality!', helpfulCount: 32, notHelpfulCount: 4 }
        ]
    },
    // Pakistani Jubbahs
    {
        id: 30,
        name: 'Pakistani Traditional Sherwani',
        category: 'men',
        type: 'islamic',
        subtype: 'jubbah',
        menType: 'pakistani',
        price: 125.99,
        rating: 4.9,
        reviews: 29,
        description: 'Elegant Pakistani sherwani with fine embroidery. Perfect for weddings and celebrations.',
        icon: '👔',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
            { name: 'Gold Embroidered Black', hex: '#1a1a1a' },
            { name: 'Silver Embroidered Navy', hex: '#001f3f' }
        ],
        images: ['👔', '👔', '👔', '👔'],
        reviews_data: [
            { author: 'Amir P.', rating: 5, date: '1 week ago', text: 'Absolutely stunning! Perfect for my wedding!', helpfulCount: 32, notHelpfulCount: 4 },
            { author: 'Zain S.', rating: 5, date: '2 weeks ago', text: 'Premium quality and beautiful embroidery work!', helpfulCount: 32, notHelpfulCount: 4 }
        ]
    },
    {
        id: 31,
        name: 'Pakistani Casual Kurta Jubbah',
        category: 'men',
        type: 'islamic',
        subtype: 'jubbah',
        menType: 'pakistani',
        price: 74.99,
        rating: 4.7,
        reviews: 27,
        description: 'Comfortable Pakistani kurta with modern design. Versatile for casual and semi-formal wear.',
        icon: '👔',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: [
            { name: 'Cream', hex: '#fffdd0' },
            { name: 'Sage Green', hex: '#9dc183' },
            { name: 'Dusty Blue', hex: '#6c8ebf' }
        ],
        images: ['👔', '👔', '👔', '👔'],
        reviews_data: [
            { author: 'Rashid U.', rating: 5, date: '1 week ago', text: 'Very comfortable for daily wear!', helpfulCount: 32, notHelpfulCount: 4 },
            { author: 'Hassan V.', rating: 4, date: '2 weeks ago', text: 'Good value and comfortable fit.', helpfulCount: 32, notHelpfulCount: 4 }
        ]
    }
];

// State management
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let savedItems = JSON.parse(localStorage.getItem('savedItems')) || [];
let currentFilter = 'all';
let menTypeFilter = null;  // Filter for men's jubbahs (moroccan, arab, turkish, pakistani)
let abayaStyleFilter = null;  // Filter for women's abayas (classic, dubai, modern, embroidered, simple)

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    checkUserLogin(); // Check if user is logged in

    // Only render products grid on pages that include it
    if (document.getElementById('productsGrid')) {
        renderProducts();
    }

    // Only render streetwear section when relevant grid exists
    if (document.getElementById('menStreetGrid') || document.getElementById('womenStreetGrid') || document.querySelector('.streetwear-section')) {
        renderStreetWearSection();
    }

    updateCartCount();
    updateSavedCount();
    initializeEventListeners();
    
    // Set current year in footer if element exists
    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// Event listeners
function initializeEventListeners() {
    // Cart button
    // Cart button
    const cartBtnEl = document.getElementById('cartBtn');
    const closeCartBtnEl = document.getElementById('closeCartBtn');
    if (cartBtnEl) cartBtnEl.addEventListener('click', toggleCart);
    if (closeCartBtnEl) closeCartBtnEl.addEventListener('click', toggleCart);

    // Saved button
    const savedBtnEl = document.getElementById('savedBtn');
    const closeSavedBtnEl = document.getElementById('closeSavedBtn');
    if (savedBtnEl) savedBtnEl.addEventListener('click', toggleSaved);
    if (closeSavedBtnEl) closeSavedBtnEl.addEventListener('click', toggleSaved);

    // Modal close
    const closeModalBtnEl = document.getElementById('closeModalBtn');
    const overlayEl = document.getElementById('overlay');
    if (closeModalBtnEl) closeModalBtnEl.addEventListener('click', closeModal);
    if (overlayEl) overlayEl.addEventListener('click', closeAllSidebars);

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            showAllProducts = false; // Reset to show initial products
            renderProducts();
        });
    });
    
    // View More button
    const viewMoreBtn = document.getElementById('viewMoreBtn');
    if (viewMoreBtn) {
        viewMoreBtn.addEventListener('click', toggleViewMore);
    }

    // Initialize Dropdown Menu Handlers
    const navDropdowns = document.querySelectorAll('.nav-dropdown');
    let mobileDropdownOpen = null;
    const isTouchDevice = () => {
        return (('ontouchstart' in window) ||
                (navigator.maxTouchPoints > 0) ||
                (navigator.msMaxTouchPoints > 0));
    };
    
    function positionDropdown(dropdown) {
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');
        const mainLink = dropdown.querySelector('a:first-child');
        
        if (mainLink && dropdownMenu) {
            const rect = mainLink.getBoundingClientRect();
            dropdownMenu.style.top = (rect.bottom + 5) + 'px';
            dropdownMenu.style.left = rect.left + 'px';
        }
    }
    
    navDropdowns.forEach(dropdown => {
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');
        const mainLink = dropdown.querySelector('a:first-child');
        
        if (mainLink && dropdownMenu) {
            // Position dropdown on initial load and on window resize
            positionDropdown(dropdown);
            
            // Show dropdown on hover (desktop)
            dropdown.addEventListener('mouseenter', function() {
                if (!isTouchDevice()) {
                    positionDropdown(dropdown);
                    dropdownMenu.style.opacity = '1';
                    dropdownMenu.style.visibility = 'visible';
                    dropdownMenu.style.transform = 'translateY(0)';
                }
            });
            
            // Hide dropdown on mouse leave (desktop)
            dropdown.addEventListener('mouseleave', function() {
                if (!isTouchDevice()) {
                    dropdownMenu.style.opacity = '0';
                    dropdownMenu.style.visibility = 'hidden';
                    dropdownMenu.style.transform = 'translateY(-10px)';
                }
            });
            
            // Handle click on main link to toggle dropdown (mobile/touch)
            mainLink.addEventListener('click', function(e) {
                const isVisible = dropdownMenu.style.visibility === 'visible';
                
                // On mobile/touch, toggle dropdown instead of navigating
                if (window.innerWidth <= 768 || isTouchDevice()) {
                    e.preventDefault();
                    e.stopPropagation();
                    positionDropdown(dropdown);
                    
                    // Close any other open dropdown
                    if (mobileDropdownOpen && mobileDropdownOpen !== dropdown) {
                        const otherMenu = mobileDropdownOpen.querySelector('.dropdown-menu');
                        otherMenu.style.opacity = '0';
                        otherMenu.style.visibility = 'hidden';
                        otherMenu.style.transform = 'translateY(-10px)';
                    }
                    
                    // Toggle current dropdown
                    if (!isVisible) {
                        dropdownMenu.style.opacity = '1';
                        dropdownMenu.style.visibility = 'visible';
                        dropdownMenu.style.transform = 'translateY(0)';
                        mobileDropdownOpen = dropdown;
                    } else {
                        dropdownMenu.style.opacity = '0';
                        dropdownMenu.style.visibility = 'hidden';
                        dropdownMenu.style.transform = 'translateY(-10px)';
                        mobileDropdownOpen = null;
                    }
                }
            });
            
            // Handle touch events for better mobile experience
            if (isTouchDevice()) {
                dropdown.addEventListener('touchend', function(e) {
                    const isVisible = dropdownMenu.style.visibility === 'visible';
                    if (!isVisible) {
                        e.preventDefault();
                        positionDropdown(dropdown);
                        
                        // Close any other open dropdown
                        if (mobileDropdownOpen && mobileDropdownOpen !== dropdown) {
                            const otherMenu = mobileDropdownOpen.querySelector('.dropdown-menu');
                            otherMenu.style.opacity = '0';
                            otherMenu.style.visibility = 'hidden';
                            otherMenu.style.transform = 'translateY(-10px)';
                        }
                        
                        dropdownMenu.style.opacity = '1';
                        dropdownMenu.style.visibility = 'visible';
                        dropdownMenu.style.transform = 'translateY(0)';
                        mobileDropdownOpen = dropdown;
                    }
                }, { passive: false });
            }
        }
    });
    
    // Close dropdown when clicking on a menu item
    navDropdowns.forEach(dropdown => {
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');
        if (dropdownMenu) {
            const menuItems = dropdownMenu.querySelectorAll('a');
            menuItems.forEach(item => {
                item.addEventListener('click', function() {
                    // Close the dropdown after selecting an item
                    setTimeout(() => {
                        dropdownMenu.style.opacity = '0';
                        dropdownMenu.style.visibility = 'hidden';
                        dropdownMenu.style.transform = 'translateY(-10px)';
                        mobileDropdownOpen = null;
                    }, 100);
                });
            });
        }
    });
    
    // Reposition dropdowns on window resize
    window.addEventListener('resize', function() {
        navDropdowns.forEach(dropdown => {
            positionDropdown(dropdown);
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-dropdown')) {
            navDropdowns.forEach(dropdown => {
                const dropdownMenu = dropdown.querySelector('.dropdown-menu');
                if (dropdownMenu) {
                    dropdownMenu.style.opacity = '0';
                    dropdownMenu.style.visibility = 'hidden';
                    dropdownMenu.style.transform = 'translateY(-10px)';
                }
            });
            mobileDropdownOpen = null;
        }
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
// View More functionality
let showAllProducts = false;
const PRODUCTS_PER_ROW = 4;
const INITIAL_ROWS = 3;
const INITIAL_PRODUCTS_COUNT = PRODUCTS_PER_ROW * INITIAL_ROWS;

function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    const viewMoreContainer = document.getElementById('viewMoreContainer');
    const viewMoreBtn = document.getElementById('viewMoreBtn');
    
    const filteredProducts = currentFilter === 'all' 
        ? products 
        : products.filter(p => p.category === currentFilter);

    const productsToShow = showAllProducts ? filteredProducts : filteredProducts.slice(0, INITIAL_PRODUCTS_COUNT);
    
    productsGrid.innerHTML = productsToShow.map(product => `
        <div class="product-card" data-id="${product.id}" onclick="if(event.target.closest('button') === null) showProductDetail(${product.id});" style="cursor: pointer;">
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
    
    // Show/hide view more button based on product count
    if (filteredProducts.length > INITIAL_PRODUCTS_COUNT) {
        viewMoreContainer.style.display = 'flex';
        if (showAllProducts) {
            viewMoreBtn.innerHTML = '<span>View Less</span><i class="fas fa-chevron-up"></i>';
        } else {
            viewMoreBtn.innerHTML = '<span>View More Products</span><i class="fas fa-chevron-down"></i>';
        }
    } else {
        viewMoreContainer.style.display = 'none';
    }
}

// Toggle view more
function toggleViewMore() {
    showAllProducts = !showAllProducts;
    renderProducts();
    
    // Scroll to products section when collapsing
    if (!showAllProducts) {
        document.getElementById('products').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Render streetwear section
let currentStreetWearFilter = 'all'; // Track current filter

function renderStreetWearSection(filter = 'all') {
    currentStreetWearFilter = filter;
    
    // Helper function to render products
    const renderProducts = (productList) => {
        if (productList.length === 0) {
            return '<p class="empty-message">No products available</p>';
        }
        return productList.map(product => `
            <div class="product-card" data-id="${product.id}" onclick="if(event.target.closest('button') === null) showProductDetail(${product.id});" style="cursor: pointer;">
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
    };
    
    // Filter products based on selection
    let menProducts, womenProducts;
    
    if (filter === 'all') {
        menProducts = products.filter(p => p.category === 'men' && p.type === 'streetwear');
        womenProducts = products.filter(p => p.category === 'women' && p.type === 'streetwear');
    } else {
        menProducts = products.filter(p => p.category === 'men' && p.type === 'streetwear' && p.subtype === filter);
        womenProducts = products.filter(p => p.category === 'women' && p.type === 'streetwear' && p.subtype === filter);
    }
    
    // Render men's streetwear
    const menStreetGrid = document.getElementById('menStreetGrid');
    if (menStreetGrid) {
        menStreetGrid.innerHTML = renderProducts(menProducts);
    }
    
    // Render women's streetwear
    const womenStreetGrid = document.getElementById('womenStreetGrid');
    if (womenStreetGrid) {
        womenStreetGrid.innerHTML = renderProducts(womenProducts);
    }
}

// Filter streetwear by type
function filterStreetWear(filter) {
    // Update active button
    document.querySelectorAll('.streetwear-filters .filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        }
    });
    
    // Re-render with filter
    renderStreetWearSection(filter);
}

// Show product detail
// Navigate to product detail page
function showProductDetail(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
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

// Buy Now - Add to cart and redirect to checkout
function buyNow(productId) {
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
    
    // Redirect to checkout page
    window.location.href = 'checkout.html';
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

// Initialize sidebar dropdown handlers
function initSidebarDropdowns() {
    const sidebarDropdowns = document.querySelectorAll('.sidebar-dropdown');
    
    sidebarDropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.sidebar-dropdown-toggle');
        
        if (toggle) {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Close other open dropdowns
                sidebarDropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('open');
                    }
                });
                
                // Toggle current dropdown
                dropdown.classList.toggle('open');
            });
        }
    });
    
    // Close dropdown and sidebar when clicking on a menu item
    const menuItems = document.querySelectorAll('.sidebar-dropdown-menu a');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            setTimeout(() => {
                sidebarDropdowns.forEach(dropdown => {
                    dropdown.classList.remove('open');
                });
                // Close the entire sidebar
                toggleSidebar(false);
            }, 300);
        });
    });
}

// Initialize sidebar dropdowns when page loads
document.addEventListener('DOMContentLoaded', function() {
    initSidebarDropdowns();
});

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
            <div class="item-image">${item.icon}</div>
            <div class="item-details">
                <div class="item-name">${item.name}</div>
                <div class="item-price">£${item.price.toFixed(2)}</div>
                <div class="item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="quantity-display">${item.quantity}</span>
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
async function toggleSaveItem(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const saved = isSaved(productId);
    if (saved) {
        await UserAccount.removeSavedItem(productId);
        showNotification('Removed from saved items');
    } else {
        await UserAccount.addSavedItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images ? product.images[0] : '',
            size: product.sizes ? product.sizes[0] : 'M'
        });
        showNotification('Saved for later!');
    }
    updateSavedCount();
    renderSavedItems();
    renderProducts(); // Re-render to update save button states
}

// Check if saved
function isSaved(productId) {
    const items = UserAccount.getSavedItems();
    return items.some(item => item.id === productId || item.productId === productId);
}

// Render saved items
function renderSavedItems() {
    const savedItemsContainer = document.getElementById('savedItems');
    const items = UserAccount.getSavedItems();
    if (!items || items.length === 0) {
        savedItemsContainer.innerHTML = '<div class="empty-message">No saved items</div>';
        return;
    }
    savedItemsContainer.innerHTML = items.map(item => {
        const id = item.id || item.productId;
        return `
        <div class="saved-item">
            <div class="item-image">${item.icon || ''}</div>
            <div class="item-details">
                <div class="item-name">${item.name || item.productName}</div>
                <div class="item-price">£${(item.price || item.productPrice).toFixed(2)}</div>
                <button class="btn-secondary" onclick="addToCart(${id}); showNotification('Added to cart!');">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
            <button class="remove-btn" onclick="toggleSaveItem(${id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        `;
    }).join('');
}

// Update cart count
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

// Update saved count
function updateSavedCount() {
    const items = UserAccount.getSavedItems();
    document.getElementById('savedCount').textContent = items.length;
}

// Toggle cart
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const savedSidebar = document.getElementById('savedSidebar');
    const overlay = document.getElementById('overlay');
    
    const isCartOpen = cartSidebar.classList.contains('open');
    
    if (isCartOpen) {
        // Close cart
        cartSidebar.classList.remove('open');
        overlay.classList.remove('active');
    } else {
        // Open cart, close other sidebars
        savedSidebar.classList.remove('open');
        cartSidebar.classList.add('open');
        overlay.classList.add('active');
        renderCart();
    }
}

// Toggle saved
function toggleSaved() {
    const savedSidebar = document.getElementById('savedSidebar');
    const cartSidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');
    
    const isSavedOpen = savedSidebar.classList.contains('open');
    
    if (isSavedOpen) {
        // Close saved
        savedSidebar.classList.remove('open');
        overlay.classList.remove('active');
    } else {
        // Open saved, close other sidebars
        cartSidebar.classList.remove('open');
        savedSidebar.classList.add('open');
        overlay.classList.add('active');
        renderSavedItems();
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
                <p>£${product.price.toFixed(2)}</p>
            </div>
        </div>
    `).join('');
}

// Show category with dedicated section
function showCategory(category) {
    // Hide main sections
    document.getElementById('products').classList.add('hidden');
    document.getElementById('about').classList.add('hidden');
    document.getElementById('streetwearSection').classList.add('hidden');
    document.getElementById('categorySection').classList.remove('hidden');
    
    // Set category information
    const categoryInfo = {
        'men': {
            title: "Men's Collection",
            subtitle: "Modern Islamic wear for men",
            icon: 'fa-male',
            subsections: [
                { name: 'Thobes', icon: 'fa-mosque', subtype: 'thobe' }
            ]
        },
        'women': {
            title: "Women's Collection",
            subtitle: "Modest and elegant designs",
            icon: 'fa-female',
            subsections: [
                { name: 'Abayas', icon: 'fa-female', subtype: 'abaya' },
                { name: 'Hijabs', icon: 'fa-head-side-mask', subtype: 'hijab' }
            ]
        },
        'kids': {
            title: "Kids Collection",
            subtitle: "Stylish wear for children",
            icon: 'fa-child',
            subsections: [
                { name: 'Boys', icon: 'fa-male', gender: 'boys' },
                { name: 'Girls', icon: 'fa-female', gender: 'girls' }
            ]
        }
    };
    
    const info = categoryInfo[category];
    
    // Update logo section (use brand logo image)
    const categorySectionTitle = document.getElementById('categorySectionTitle');
    if (categorySectionTitle) {
        categorySectionTitle.textContent = info.title;
    }
    document.getElementById('categoryLogoTitle').textContent = info.title;
    document.getElementById('categoryLogoSubtitle').textContent = '';
    document.getElementById('categoryIcon').innerHTML = `<img class="category-logo-image" src="images/real-removebg-preview (1).png" alt="The Believers Logo">`;
    
    // Render subsections dynamically
    const subsectionsContainer = document.getElementById('categorySubsections');
    subsectionsContainer.innerHTML = '';
    
    info.subsections.forEach(subsection => {
        let filteredProducts;
        
        if (subsection.gender) {
            // Filter by gender (for kids)
            filteredProducts = products.filter(p => 
                p.category === category && (p.gender === subsection.gender || p.gender === 'unisex')
            );
        } else if (subsection.subtype) {
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
                            <div class="product-card" data-id="${product.id}" onclick="if(event.target.closest('button') === null) showProductDetail(${product.id});" style="cursor: pointer;">
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

// Filter men's products by type (thobe, moroccan, arab, turkish, pakistani)
function filterByMenType(type) {
    menTypeFilter = type === 'thobe' ? null : type;  // thobe is default, no filter needed
    abayaStyleFilter = null;  // Reset abaya filter
    
    // Trigger category display with filter applied
    if (menTypeFilter === 'streetwear') {
        // Show streetwear section with only men's streetwear
        showStreetWearSection('men');
    } else if (menTypeFilter) {
        showCategoryWithFilter('men', menTypeFilter);
    } else {
        showCategory('men');
    }
}

// Filter women's products by abaya style
function filterByAbayaStyle(style) {
    abayaStyleFilter = style;
    menTypeFilter = null;  // Reset men filter
    
    // Trigger category display with filter applied
    if (style === 'streetwear') {
        // Show streetwear section with only women's streetwear
        showStreetWearSection('women');
    } else {
        showCategoryWithFilter('women', style);
    }
}

// Filter kids products by gender
function filterByKidsGender(gender) {
    menTypeFilter = null;  // Reset men filter
    abayaStyleFilter = null;  // Reset women filter
    
    // Show category with gender filter applied
    if (gender === 'boys') {
        showCategoryWithFilter('kids', 'boys');
    } else if (gender === 'girls') {
        showCategoryWithFilter('kids', 'girls');
    } else {
        showCategory('kids');
    }
}

// Show streetwear section
function showStreetWearSection(gender = null) {
    // Hide other sections
    document.getElementById('products').classList.add('hidden');
    document.getElementById('about').classList.add('hidden');
    document.getElementById('categorySection').classList.add('hidden');
    document.getElementById('streetwearSection').classList.remove('hidden');
    
    // Get the grids
    const menGrid = document.getElementById('menStreetGrid');
    const womenGrid = document.getElementById('womenStreetGrid');
    const menSection = document.querySelector('#streetwearSection .subsection:nth-child(2)');
    const womenSection = document.querySelector('#streetwearSection .subsection:nth-child(3)');
    
    // Show/hide based on gender
    if (gender === 'men') {
        menSection.style.display = 'block';
        womenSection.style.display = 'none';
    } else if (gender === 'women') {
        menSection.style.display = 'none';
        womenSection.style.display = 'block';
    } else {
        // Show both if no gender specified
        menSection.style.display = 'block';
        womenSection.style.display = 'block';
    }
    
    // Render streetwear products
    renderStreetWearSection();
    
    // Scroll to streetwear section
    document.getElementById('streetwearSection').scrollIntoView({ behavior: 'smooth' });
}

// Show category with applied filter
function showCategoryWithFilter(category, filterValue) {
    // Hide main sections
    document.getElementById('products').classList.add('hidden');
    document.getElementById('about').classList.add('hidden');
    document.getElementById('streetwearSection').classList.add('hidden');
    document.getElementById('categorySection').classList.remove('hidden');
    
    // Set category information
    const categoryInfo = {
        'men': {
            title: "Men's Collection",
            subtitle: "Modern Islamic wear for men",
            icon: 'fa-male',
            subsections: []
        },
        'women': {
            title: "Women's Collection",
            subtitle: "Modest and elegant designs",
            icon: 'fa-female',
            subsections: []
        },
        'kids': {
            title: "Kids Collection",
            subtitle: "Stylish wear for children",
            icon: 'fa-child',
            subsections: []
        }
    };
    
    const info = categoryInfo[category];
    if (!info) return;
    
    // Update logo section
    const categorySectionTitle = document.getElementById('categorySectionTitle');
    if (categorySectionTitle) {
        categorySectionTitle.textContent = info.title;
    }
    document.getElementById('categoryLogoTitle').textContent = info.title;
    document.getElementById('categoryLogoSubtitle').textContent = '';
    document.getElementById('categoryIcon').innerHTML = `<img class="category-logo-image" src="images/real-removebg-preview (1).png" alt="The Believers Logo">`;
    
    // Render filtered subsections
    const subsectionsContainer = document.getElementById('categorySubsections');
    subsectionsContainer.innerHTML = '';
    
    let filteredProducts = [];
    let subsectionName = '';
    let subsectionIcon = '';
    
    if (category === 'men' && menTypeFilter) {
        // Filter by menType
        if (menTypeFilter === 'moroccan') {
            filteredProducts = products.filter(p => p.category === 'men' && p.menType === 'moroccan' && p.type !== 'streetwear');
            subsectionName = 'Moroccan Jubbah';
            subsectionIcon = 'fa-male';
        } else if (menTypeFilter === 'arab') {
            filteredProducts = products.filter(p => p.category === 'men' && p.menType === 'arab' && p.type !== 'streetwear');
            subsectionName = 'Arab Jubbah';
            subsectionIcon = 'fa-male';
        } else if (menTypeFilter === 'turkish') {
            filteredProducts = products.filter(p => p.category === 'men' && p.menType === 'turkish' && p.type !== 'streetwear');
            subsectionName = 'Turkish Jubbah';
            subsectionIcon = 'fa-male';
        } else if (menTypeFilter === 'pakistani') {
            filteredProducts = products.filter(p => p.category === 'men' && p.menType === 'pakistani' && p.type !== 'streetwear');
            subsectionName = 'Pakistani Jubbah';
            subsectionIcon = 'fa-male';
        } else if (menTypeFilter === 'streetwear') {
            filteredProducts = products.filter(p => p.category === 'men' && p.type === 'streetwear');
            subsectionName = 'Men\'s Streetwear';
            subsectionIcon = 'fa-male';
        }
    } else if (category === 'women' && abayaStyleFilter) {
        // Filter by abayaStyle or streetwear
        if (abayaStyleFilter === 'streetwear') {
            filteredProducts = products.filter(p => p.category === 'women' && p.type === 'streetwear');
            subsectionName = 'Women\'s Streetwear';
            subsectionIcon = 'fa-female';
        } else {
            filteredProducts = products.filter(p => 
                p.category === 'women' && 
                p.subtype === 'abaya' && 
                p.abayaStyle === abayaStyleFilter &&
                p.type !== 'streetwear'
            );
            
            if (abayaStyleFilter === 'classic') subsectionName = 'Classic Abaya';
            else if (abayaStyleFilter === 'dubai') subsectionName = 'Dubai Style Abaya';
            else if (abayaStyleFilter === 'modern') subsectionName = 'Modern Abaya';
            else if (abayaStyleFilter === 'embroidered') subsectionName = 'Embroidered Abaya';
            else if (abayaStyleFilter === 'simple') subsectionName = 'Simple Abaya';
            subsectionIcon = 'fa-female';
        }
    } else if (category === 'kids') {
        // Filter kids by gender
        if (filterValue === 'boys') {
            filteredProducts = products.filter(p => p.category === 'kids' && (p.gender === 'boys' || p.gender === 'unisex'));
            subsectionName = 'Boys Collection';
            subsectionIcon = 'fa-male';
        } else if (filterValue === 'girls') {
            filteredProducts = products.filter(p => p.category === 'kids' && (p.gender === 'girls' || p.gender === 'unisex'));
            subsectionName = 'Girls Collection';
            subsectionIcon = 'fa-female';
        }
    }
    
    // Display filtered products
    if (filteredProducts && filteredProducts.length > 0) {
        const subsectionHTML = `
            <div class="subsection">
                <div class="subsection-header">
                    <h3 class="subsection-title">
                        <i class="fas ${subsectionIcon}"></i> ${subsectionName}
                    </h3>
                </div>
                <div class="products-grid">
                    ${filteredProducts.map(product => `
                        <div class="product-card" data-id="${product.id}" onclick="if(event.target.closest('button') === null) showProductDetail(${product.id});" style="cursor: pointer;">
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
                    `).join('')}
                </div>
            </div>
        `;
        subsectionsContainer.innerHTML = subsectionHTML;
    } else {
        subsectionsContainer.innerHTML = '<p style="text-align: center; padding: 40px;">No products found in this category.</p>';
    }
    
    // Scroll to category section
    document.getElementById('categoryLogoSection').scrollIntoView({ behavior: 'smooth' });
}

// Back to home from category section
function backToHome() {
    // Reset all filters
    menTypeFilter = null;
    abayaStyleFilter = null;
    
    // Show products section and about
    document.getElementById('products').classList.remove('hidden');
    document.getElementById('about').classList.remove('hidden');
    document.getElementById('categorySection').classList.add('hidden');
    document.getElementById('streetwearSection').classList.remove('hidden');
    
    // Reset streetwear subsections display
    const menSection = document.querySelector('#streetwearSection .subsection:nth-child(2)');
    const womenSection = document.querySelector('#streetwearSection .subsection:nth-child(3)');
    if (menSection) menSection.style.display = 'block';
    if (womenSection) womenSection.style.display = 'block';
    
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
    const cartSidebar = document.getElementById('cartSidebar');
    const savedSidebar = document.getElementById('savedSidebar');
    const productModal = document.getElementById('productModal');
    const searchModal = document.getElementById('searchModal');
    const overlay = document.getElementById('overlay');
    const sidebar = document.getElementById('sidebar');
    
    if (cartSidebar) cartSidebar.classList.remove('open');
    if (savedSidebar) savedSidebar.classList.remove('open');
    if (productModal) productModal.classList.remove('open');
    if (searchModal) searchModal.classList.remove('open');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
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
