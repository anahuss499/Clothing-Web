# The Believers - Modern Islamic Clothing & Streetwear

A modern e-commerce website for Islamic clothing and streetwear that blends modest fashion with bold, contemporary designs.

## Features

### Design
- **Sleek Theme**: Black, gold, and white color scheme inspired by Nike and Adidas
- **Responsive**: Fully responsive design for mobile, tablet, and desktop
- **Modern UI**: Clean and professional interface with smooth animations

### Shopping Experience
- **Product Categories**: Separate sections for Men, Women, and Kids
- **Product Filtering**: Filter products by category
- **Search Functionality**: Search products by name, category, or description
- **Product Details**: View detailed product information with customer reviews
- **Size Selection**: Choose from S, M, L, XL sizes

### Cart & Wishlist
- **Shopping Cart**: Add products to cart with quantity management
- **Save for Later**: Save favorite items to wishlist
- **Persistent Storage**: Cart and wishlist data saved in browser localStorage

### Checkout
- **Shipping Information**: Complete shipping address form
- **Payment Options**: 
  - Credit/Debit Card payment
  - PayPal integration
- **Promo Codes**: Apply discount codes (Try: BELIEVERS10, WELCOME20, FAITH15)
- **Order Confirmation**: Order number and email confirmation

### Additional Features
- **Customer Reviews**: View product ratings and reviews
- **Social Integration**: Social media links (Facebook, Instagram, Twitter, YouTube)
- **Newsletter**: Email subscription for updates and offers
- **📧 Email Newsletter Service**: Professional email delivery with SendGrid (See [EMAIL_SETUP.md](EMAIL_SETUP.md))

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **JavaScript**: Vanilla JS for interactivity
- **Font Awesome**: Icon library
- **LocalStorage**: Client-side data persistence
- **Node.js + Express**: Backend server for email service
- **SendGrid**: Professional email delivery service

## File Structure

```
Clothing-Web/
├── index.html              # Main homepage
├── checkout.html           # Checkout page
├── admin-newsletter.html   # Newsletter admin panel
├── styles.css              # Main stylesheet
├── checkout.css            # Checkout-specific styles
├── script.js               # Main JavaScript functionality
├── checkout.js             # Checkout JavaScript
├── newsletter.js           # Newsletter subscription logic
├── server.js               # Backend API server
├── package.json            # Node.js dependencies
├── .env.example            # Environment variables template
├── EMAIL_SETUP.md          # Email service setup guide
└── README.md               # Project documentation
```

## Getting Started

### Frontend Only (No Email Service)

1. Clone the repository:
   ```bash
   git clone https://github.com/anahuss499/Clothing-Web.git
   ```

2. Open `index.html` in your web browser

3. Browse products, add items to cart, and proceed to checkout

### Full Setup (With Email Newsletter Service)

1. Clone the repository:
   ```bash
   git clone https://github.com/anahuss499/Clothing-Web.git
   cd Clothing-Web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up email service (see [EMAIL_SETUP.md](EMAIL_SETUP.md) for detailed instructions):
   ```bash
   cp .env.example .env
   # Edit .env with your SendGrid credentials
   ```

4. Start the backend server:
   ```bash
   npm start
   # or use the quick start script:
   ./start-newsletter.sh
   ```

5. Open `index.html` in your browser to test the newsletter subscription

6. Access admin panel at `admin-newsletter.html` to send newsletters

## Features in Detail

### Product Catalog
- 12+ sample products across all categories
- Product cards with hover effects
- Quick view and save buttons
- Star ratings and review counts

### Shopping Cart
- Side panel cart interface
- Quantity adjustment (+/-)
- Remove items
- Real-time total calculation
- Proceed to checkout button

### Checkout Process
1. View order summary
2. Enter shipping information
3. Select payment method (Card or PayPal)
4. Apply promo codes (optional)
5. Place order and receive confirmation

### Promo Codes
- `BELIEVERS10` - 10% off
- `WELCOME20` - 20% off
- `FAITH15` - 15% off

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Future Enhancements

- Backend integration for real payment processing
- User accounts and order history
- Product reviews submission
- Advanced filtering (price, size, color)
- Live chat support
- Multi-language support
- Database integration for newsletter subscribers (MongoDB ready)

## Newsletter Service

The Believers now includes a professional email newsletter service that sends emails directly to subscribers' inboxes **without being flagged as spam**. 

### Features:
- ✅ **SendGrid Integration** - Industry-leading email delivery
- ✅ **Anti-Spam Protection** - Proper authentication (SPF, DKIM, DMARC)
- ✅ **Rate Limiting** - Prevents abuse
- ✅ **Professional HTML Emails** - Beautiful, responsive design
- ✅ **Admin Panel** - Easy newsletter broadcasting
- ✅ **Welcome Emails** - Automatic subscriber confirmation

### Quick Setup:
1. Get a free SendGrid account at [sendgrid.com](https://sendgrid.com/)
2. Copy `.env.example` to `.env` and add your credentials
3. Run `npm install && npm start`
4. Test the newsletter form on your website

**Full documentation:** See [EMAIL_SETUP.md](EMAIL_SETUP.md) for complete setup instructions.

## About The Believers

The Believers is a modern Islamic clothing and streetwear brand that celebrates faith and street culture. We blend modest fashion with bold, contemporary designs to create unique pieces for men, women, and children.

## License

This project is open source and available for educational purposes.

## Contact

For questions or support, please visit our website or contact us through social media.