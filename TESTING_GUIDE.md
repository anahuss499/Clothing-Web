# Dropdown Filter Testing Guide

## Quick Start Testing

### Test 1: Men's Moroccan Jubbah Filter
**Steps:**
1. Open the website
2. Hover over "Men" in the navbar
3. Click "Moroccan Jubbah" from dropdown
4. **Expected Result:** 
   - Page scrolls to category section
   - Shows only 2 Moroccan jubbah products (IDs: 24-25)
   - Header displays "Moroccan Jubbah"
   - Products have different prices and ratings
   - All products have descriptions, colors, and sizes

**Products to see:**
- Moroccan Thobe Djellaba ($95.99) ⭐4.8
- Moroccan Embroidered Djellaba ($115.99) ⭐4.9

### Test 2: Men's Arab Jubbah Filter
**Steps:**
1. From home, hover over "Men"
2. Click "Arab Jubbah"
3. **Expected Result:** Shows 2 Arab jubbah products (IDs: 26-27)

**Products to see:**
- Traditional Arab Jubbah ($85.99) ⭐4.7
- Saudi Style Jubbah ($99.99) ⭐4.8

### Test 3: Men's Turkish Jubbah Filter
**Steps:**
1. From home, hover over "Men"
2. Click "Turkish Jubbah"
3. **Expected Result:** Shows 2 Turkish jubbah products (IDs: 28-29)

**Products to see:**
- Turkish Casual Jubbah ($79.99) ⭐4.6
- Ottoman Inspired Jubbah ($109.99) ⭐4.8

### Test 4: Men's Pakistani Jubbah Filter
**Steps:**
1. From home, hover over "Men"
2. Click "Pakistani Jubbah"
3. **Expected Result:** Shows 2 Pakistani products (IDs: 30-31)

**Products to see:**
- Pakistani Traditional Sherwani ($125.99) ⭐4.9
- Pakistani Casual Kurta Jubbah ($74.99) ⭐4.7

### Test 5: Men's Thobes Filter (Default)
**Steps:**
1. From home, hover over "Men"
2. Click "Thobes"
3. **Expected Result:** Shows existing thobe products (all male islamic items with subtype 'thobe')

### Test 6: Women's Classic Abaya Filter
**Steps:**
1. From home, hover over "Women"
2. Click "Classic Abaya"
3. **Expected Result:** Shows 1 classic abaya (ID: 7)

**Products to see:**
- Classic Black Abaya ($79.99) ⭐4.8

### Test 7: Women's Dubai Style Filter
**Steps:**
1. From home, hover over "Women"
2. Click "Dubai Style"
3. **Expected Result:** Shows 1 Dubai luxury abaya (ID: 32)

**Products to see:**
- Dubai Luxury Abaya ($149.99) ⭐4.9

### Test 8: Women's Modern Abaya Filter
**Steps:**
1. From home, hover over "Women"
2. Click "Modern Abaya"
3. **Expected Result:** Shows 1 modern abaya (ID: 6)

**Products to see:**
- Modest Abaya ($89.99) ⭐4.7

### Test 9: Women's Embroidered Abaya Filter
**Steps:**
1. From home, hover over "Women"
2. Click "Embroidered Abaya"
3. **Expected Result:** Shows 1 embroidered abaya (ID: 8)

**Products to see:**
- Designer Embroidered Abaya ($129.99) ⭐4.9

### Test 10: Women's Simple Abaya Filter
**Steps:**
1. From home, hover over "Women"
2. Click "Simple Abaya"
3. **Expected Result:** Shows 1 simple abaya (ID: 33)

**Products to see:**
- Simple Black Abaya ($59.99) ⭐4.5

## Interaction Testing

### Test 11: Add Filtered Product to Cart
**Steps:**
1. Filter to "Moroccan Jubbah"
2. Click "Add to Cart" on a product
3. Check cart icon badge (should increment)
4. Click cart icon to verify product is there
5. **Expected Result:** Product successfully added with correct price and details

### Test 12: Save Filtered Product to Wishlist
**Steps:**
1. Filter to any category (e.g., "Dubai Style")
2. Click heart icon on a product
3. Check heart icon badge (should increment)
4. Click heart icon to verify product is saved
5. **Expected Result:** Product successfully saved

### Test 13: Quick View on Filtered Product
**Steps:**
1. Filter to any category
2. Click eye icon on product
3. **Expected Result:** Product detail modal opens with full info

### Test 14: Buy Now on Filtered Product
**Steps:**
1. Filter to any category
2. Click "Buy Now"
3. **Expected Result:** Redirects to checkout with product in cart

## Navigation Testing

### Test 15: Back Button Works
**Steps:**
1. Filter to any category (e.g., "Moroccan Jubbah")
2. Click "Back" button
3. **Expected Result:** 
   - Returns to home page
   - Filters are reset
   - Products section visible again

### Test 16: Filter Reset on New Selection
**Steps:**
1. Filter to "Moroccan Jubbah" (shows moroccan products)
2. Hover over Men again
3. Click "Arab Jubbah"
4. **Expected Result:** Smoothly transitions to Arab products, only shows Arab items

### Test 17: Filter Reset on Home Navigation
**Steps:**
1. Filter to "Moroccan Jubbah"
2. Click "Home" link in navbar
3. **Expected Result:** 
   - Returns to home section
   - All filters cleared
   - Normal featured products shown

## Visual Testing

### Test 18: Dropdown Animation
**Steps:**
1. Hover over "Men" or "Women" in navbar
2. Observe dropdown appearance
3. **Expected Result:** 
   - Dropdown slides in smoothly (0.4s)
   - Has gold border on top
   - Shadow effect visible
   - Backdrop blur effect

### Test 19: Product Grid Responsiveness
**Steps:**
1. Filter to any category
2. Resize browser window (make it narrow)
3. **Expected Result:** 
   - Products stack properly on small screens
   - 1-2 columns on mobile, 3+ on desktop
   - All elements remain accessible

### Test 20: Smooth Scroll
**Steps:**
1. Click on a filter option
2. **Expected Result:** 
   - Page smoothly scrolls to category section
   - Animation is fluid (not jerky)

## Console Testing

### Test 21: Check for JavaScript Errors
**Steps:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Navigate through filters
4. **Expected Result:** No errors, no warnings related to filters

### Test 22: Check State Variables
**Steps:**
1. Open browser DevTools Console
2. Type: `console.log(menTypeFilter, abayaStyleFilter)`
3. Click on a filter
4. **Expected Result:** State variables update correctly

## Performance Testing

### Test 23: Fast Filter Switching
**Steps:**
1. Click "Moroccan Jubbah" 
2. Immediately click back
3. Click "Arab Jubbah"
4. Immediately click back
5. Repeat with women's filters
6. **Expected Result:** No lag, smooth transitions, no stuck UI

### Test 24: Multiple Products Added to Cart
**Steps:**
1. Filter to "Moroccan Jubbah"
2. Add first product to cart
3. Go back, filter to "Arab Jubbah"
4. Add product to cart
5. Go back, filter to "Turkish Jubbah"
6. Add product to cart
7. Check cart
8. **Expected Result:** All products from different categories in cart

## Edge Cases

### Test 25: Check Product Details
**Steps:**
1. Filter to any category
2. Click on a product card (not buttons)
3. **Expected Result:** Product detail modal opens with all info, ratings, colors, sizes

### Test 26: Check Ratings Display
**Steps:**
1. Filter to different categories
2. Check each product's star rating
3. **Expected Result:** 
   - Stars display correctly
   - Review counts show
   - All products have 4-5 stars

### Test 27: Check Color Options
**Steps:**
1. Filter to "Moroccan Jubbah"
2. Click product to view details
3. Check color options
4. **Expected Result:** Multiple colors available for selection

## Mobile Testing

### Test 28: Mobile Dropdown
**Steps:**
1. Open on mobile device
2. Click menu icon (hamburger)
3. Navigate to Men dropdown
4. Click filter option
5. **Expected Result:** Dropdown works on touch, shows filtered products

### Test 29: Mobile Cart Operations
**Steps:**
1. On mobile, filter to any category
2. Add product to cart
3. Check cart functionality
4. **Expected Result:** Cart drawer opens, product shows correctly

## Summary Checklist
- [ ] All 5 men's filters work (thobes, moroccan, arab, turkish, pakistani)
- [ ] All 5 women's filters work (classic, dubai, modern, embroidered, simple)
- [ ] Products display correctly for each filter
- [ ] Add to cart works on filtered products
- [ ] Save to wishlist works
- [ ] Quick view modal works
- [ ] Back button resets filters
- [ ] Smooth animations throughout
- [ ] No JavaScript errors in console
- [ ] Mobile responsive
- [ ] Desktop responsive
- [ ] Transitions between filters are smooth
- [ ] Product details correct for each item
- [ ] Ratings and reviews display
- [ ] Colors and sizes available

## Troubleshooting

**Issue:** Dropdown not appearing
**Solution:** Clear browser cache (Ctrl+Shift+Delete), hard refresh (Ctrl+Shift+R)

**Issue:** Wrong products showing
**Solution:** Check menTypeFilter and abayaStyleFilter in browser console

**Issue:** Filters not resetting
**Solution:** Verify backToHome() function is called, check resetFilters() execution

**Issue:** Products not adding to cart
**Solution:** Check addToCart() function, verify product ID exists in products array
