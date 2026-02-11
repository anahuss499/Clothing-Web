// Admin Dashboard JavaScript
const API_BASE = window.location.origin;
let authToken = null;
let currentPeriod = 'today';
let trafficChartInstance = null;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    setupEventListeners();
});

// Check if already authenticated
function checkAuthentication() {
    authToken = sessionStorage.getItem('adminToken');
    
    if (authToken) {
        showDashboard();
        loadAnalytics();
    } else {
        showLoginOverlay();
    }
}

// Setup event listeners
function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Period selector buttons
    document.querySelectorAll('.period-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentPeriod = this.getAttribute('data-period');
            loadAnalytics();
        });
    });
    
    // Refresh button
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            this.classList.add('spinning');
            loadAnalytics().finally(() => {
                setTimeout(() => {
                    this.classList.remove('spinning');
                }, 500);
            });
        });
    }
    
    // Load live visitors on interval
    setInterval(loadLiveVisitors, 3000); // Update every 3 seconds
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    
    const password = document.getElementById('adminPassword').value;
    const errorDiv = document.getElementById('loginError');
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    errorDiv.textContent = '';
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';
    
    try {
        const response = await fetch(`${API_BASE}/api/admin/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password })
        });
        
        const data = await response.json();
        
        if (data.success && data.token) {
            authToken = data.token;
            sessionStorage.setItem('adminToken', authToken);
            
            // Show success animation
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Success!';
            submitBtn.classList.add('success');
            
            setTimeout(() => {
                showDashboard();
                loadAnalytics();
            }, 800);
            
        } else {
            throw new Error(data.message || 'Invalid password');
        }
        
    } catch (error) {
        errorDiv.textContent = error.message || 'Authentication failed. Please try again.';
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
        
        // Shake animation
        document.querySelector('.login-container').classList.add('shake');
        setTimeout(() => {
            document.querySelector('.login-container').classList.remove('shake');
        }, 500);
    }
}

// Handle manual logout (with confirmation)
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        performLogout();
    }
}

// Perform logout without confirmation (for automatic logouts)
function performLogout() {
    sessionStorage.removeItem('adminToken');
    authToken = null;
    
    // Fade out dashboard
    document.getElementById('dashboard').classList.add('fade-out');
    
    setTimeout(() => {
        document.getElementById('dashboard').classList.add('hidden');
        document.getElementById('dashboard').classList.remove('fade-out');
        showLoginOverlay();
        
        // Reset form
        document.getElementById('loginForm').reset();
    }, 300);
}

// Show/hide overlays
function showLoginOverlay() {
    document.getElementById('loginOverlay').classList.remove('hidden');
    // Delay focus to ensure element is visible
    setTimeout(() => {
        const passwordInput = document.getElementById('adminPassword');
        if (passwordInput) {
            passwordInput.focus();
        }
    }, 100);
}

function showDashboard() {
    document.getElementById('loginOverlay').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
}

function showLoading() {
    document.getElementById('loadingOverlay').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.add('hidden');
}

// Load analytics data
async function loadAnalytics() {
    showLoading();
    
    try {
        // Fetch analytics
        const analyticsResponse = await fetch(`${API_BASE}/api/admin/analytics?period=${currentPeriod}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (!analyticsResponse.ok) {
            if (analyticsResponse.status === 401) {
                performLogout();
                throw new Error('Session expired. Please login again.');
            }
            throw new Error('Failed to fetch analytics');
        }
        
        const analyticsData = await analyticsResponse.json();
        
        // Fetch recent orders
        const ordersResponse = await fetch(`${API_BASE}/api/admin/orders/recent?limit=10`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        const ordersData = await ordersResponse.json();
        
        // Update UI
        if (analyticsData.success && analyticsData.data) {
            updateStatsCards(analyticsData.data);
            updateTrafficChart(analyticsData.data.trafficSources);
            updateLocationsChart(analyticsData.data.topLocations);
            updateTopProducts(analyticsData.data.topProducts);
        }
        
        if (ordersData.success && ordersData.orders) {
            updateRecentOrders(ordersData.orders);
        }
        
    } catch (error) {
        console.error('Error loading analytics:', error);
        alert(error.message || 'Failed to load analytics data');
    } finally {
        hideLoading();
    }
}

// Update stats cards
function updateStatsCards(data) {
    document.getElementById('totalRevenue').textContent = `£${data.totalRevenue.toFixed(2)}`;
    document.getElementById('totalOrders').textContent = data.totalOrders;
    document.getElementById('avgOrder').textContent = `£${data.avgOrderValue.toFixed(2)}`;
    
    // Calculate total products sold
    const totalProducts = data.topProducts.reduce((sum, p) => sum + p.quantity, 0);
    document.getElementById('productsSold').textContent = totalProducts;
}

// Update traffic sources chart
function updateTrafficChart(trafficSources) {
    const ctx = document.getElementById('trafficChart').getContext('2d');
    
    // Destroy existing chart
    if (trafficChartInstance) {
        trafficChartInstance.destroy();
    }
    
    const labels = trafficSources.map(t => t.source);
    const data = trafficSources.map(t => t.count);
    const colors = [
        '#667eea', '#764ba2', '#f093fb', '#4facfe',
        '#43e97b', '#fa709a', '#fee140', '#30cfd0'
    ];
    
    trafficChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors.slice(0, labels.length),
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const source = trafficSources[context.dataIndex];
                            return `${context.label}: ${context.parsed} orders (£${source.revenue.toFixed(2)})`;
                        }
                    }
                }
            }
        }
    });
}

// Update locations chart
function updateLocationsChart(locations) {
    const container = document.getElementById('locationsChart');
    
    if (locations.length === 0) {
        container.innerHTML = '<p class="no-data">No location data available</p>';
        return;
    }
    
    const maxRevenue = Math.max(...locations.map(l => l.revenue));
    
    container.innerHTML = locations.map((loc, index) => `
        <div class="location-item">
            <div class="location-rank">${index + 1}</div>
            <div class="location-info">
                <div class="location-name">
                    <i class="fas fa-map-marker-alt"></i>
                    ${loc.location}
                </div>
                <div class="location-bar">
                    <div class="location-bar-fill" style="width: ${(loc.revenue / maxRevenue) * 100}%"></div>
                </div>
                <div class="location-stats">
                    <span>${loc.count} orders</span>
                    <span>£${loc.revenue.toFixed(2)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Update top products table
function updateTopProducts(products) {
    const container = document.getElementById('topProductsTable');
    
    if (products.length === 0) {
        container.innerHTML = '<p class="no-data">No product data available</p>';
        return;
    }
    
    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Product</th>
                    <th>Quantity Sold</th>
                    <th>Revenue</th>
                </tr>
            </thead>
            <tbody>
                ${products.map((product, index) => `
                    <tr>
                        <td><span class="rank-badge">${index + 1}</span></td>
                        <td>
                            <div class="product-info">
                                ${product.image ? `<img src="${product.image}" alt="${product.name}">` : ''}
                                <span>${product.name}</span>
                            </div>
                        </td>
                        <td><strong>${product.quantity}</strong> units</td>
                        <td><strong>£${product.revenue.toFixed(2)}</strong></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Update recent orders table
function updateRecentOrders(orders) {
    const container = document.getElementById('recentOrdersTable');
    
    if (orders.length === 0) {
        container.innerHTML = '<p class="no-data">No orders yet</p>';
        return;
    }
    
    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Products</th>
                    <th>Total</th>
                    <th>Location</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                ${orders.map(order => `
                    <tr>
                        <td><code>${order.orderId}</code></td>
                        <td>
                            <div class="customer-info">
                                <strong>${order.customerName || order.shippingAddress?.fullName || 'N/A'}</strong>
                                <small>${order.customerEmail}</small>
                            </div>
                        </td>
                        <td>${order.products.length} item(s)</td>
                        <td><strong>£${order.total.toFixed(2)}</strong></td>
                        <td>
                            <i class="fas fa-map-marker-alt"></i>
                            ${order.shippingAddress?.city || 'N/A'}, ${order.shippingAddress?.country || 'N/A'}
                        </td>
                        <td>${formatDate(order.createdAt)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// ===== VISITOR TRACKING FUNCTIONS =====

// Load live visitors
async function loadLiveVisitors() {
    try {
        const response = await fetch(`${API_BASE}/api/admin/visitors/live`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                performLogout();
                return;
            }
            throw new Error('Failed to fetch live visitors');
        }
        
        const data = await response.json();
        
        if (data.success) {
            updateLiveVisitors(data);
            loadVisitorStats();
        }
        
    } catch (error) {
        console.error('Error loading live visitors:', error);
    }
}

// Update live visitors display
function updateLiveVisitors(data) {
    const { liveVisitors, activeCount, totalCurrentSessions } = data;
    
    // Update live count
    document.getElementById('liveVisitorCount').textContent = activeCount;
    
    // Update visitor list
    const container = document.getElementById('liveVisitorsList');
    
    if (liveVisitors.length === 0) {
        container.innerHTML = '<p class="no-data">No active visitors right now</p>';
        return;
    }
    
    container.innerHTML = liveVisitors.map((visitor, index) => `
        <div class="visitor-item ${visitor.isActive ? 'active' : 'idle'}">
            <div class="visitor-icon">
                <i class="fas ${visitor.deviceType === 'mobile' ? 'fa-mobile-alt' : visitor.deviceType === 'tablet' ? 'fa-tablet-alt' : 'fa-desktop'}"></i>
            </div>
            <div class="visitor-info">
                <div class="visitor-page">
                    <strong>${visitor.page || 'home'}</strong>
                </div>
                <div class="visitor-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${visitor.city}, ${visitor.country}
                </div>
                <div class="visitor-time">
                    ${visitor.timeAgo < 30 ? 'Just now' : visitor.timeAgo + 's ago'}
                </div>
            </div>
            <div class="visitor-status">
                ${visitor.isActive ? '<span class="status-active">Active</span>' : '<span class="status-idle">Idle</span>'}
            </div>
        </div>
    `).join('');
}

// Load visitor statistics
async function loadVisitorStats() {
    try {
        const response = await fetch(`${API_BASE}/api/admin/visitors/stats?period=${currentPeriod}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to fetch visitor stats');
        
        const data = await response.json();
        
        if (data.success && data.stats) {
            updateVisitorStats(data.stats);
        }
        
    } catch (error) {
        console.error('Error loading visitor stats:', error);
    }
}

// Update visitor statistics display
function updateVisitorStats(stats) {
    // Update stat cards
    document.getElementById('totalVisitors').textContent = stats.uniqueVisitors;
    document.getElementById('totalPageViews').textContent = stats.totalVisits;
    
    // Calculate device percentages
    const devices = stats.deviceBreakdown;
    const totalDevices = Object.values(devices).reduce((a, b) => a + b, 0);
    const mobileCount = (devices.mobile || 0) + (devices.tablet || 0);
    const mobilePercentage = totalDevices > 0 ? Math.round((mobileCount / totalDevices) * 100) : 0;
    document.getElementById('mobileVisitors').textContent = mobilePercentage + '%';
    
    // Update top country
    if (stats.topCountries.length > 0) {
        document.getElementById('topCountry').textContent = stats.topCountries[0].country;
    }
    
    // Update device chart
    updateDeviceChart(devices);
    
    // Update countries chart
    updateCountriesChart(stats.topCountries);
}

// Update device breakdown chart
let deviceChartInstance = null;

function updateDeviceChart(devices) {
    const ctx = document.getElementById('deviceChart');
    if (!ctx) return;
    
    ctx = ctx.getContext('2d');
    
    if (deviceChartInstance) {
        deviceChartInstance.destroy();
    }
    
    const labels = Object.keys(devices).map(d => d.charAt(0).toUpperCase() + d.slice(1));
    const data = Object.values(devices);
    
    deviceChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: ['#667eea', '#764ba2', '#f093fb'],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Update countries chart
function updateCountriesChart(countries) {
    const container = document.getElementById('countriesChart');
    if (!container) return;
    
    if (countries.length === 0) {
        container.innerHTML = '<p class="no-data">No visitor data</p>';
        return;
    }
    
    const maxCount = Math.max(...countries.map(c => c.count));
    
    container.innerHTML = countries.map((country, index) => `
        <div class="country-item">
            <div class="country-rank">${index + 1}</div>
            <div class="country-info">
                <div class="country-name">
                    <i class="fas fa-flag"></i>
                    ${country.country}
                </div>
                <div class="country-bar">
                    <div class="country-bar-fill" style="width: ${(country.count / maxCount) * 100}%"></div>
                </div>
                <div class="country-stats">
                    <span>${country.count} visitor${country.count > 1 ? 's' : ''}</span>
                </div>
            </div>
        </div>
    `).join('');
}
