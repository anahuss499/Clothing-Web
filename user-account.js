// User Account Management
// This file handles user authentication state and saved items synchronization

const UserAccount = {
    // Check if user is logged in
    isLoggedIn() {
        return !!localStorage.getItem('authToken');
    },

    // Get current user data
    getUser() {
        const userData = localStorage.getItem('user');
        return userData ? JSON.parse(userData) : null;
    },

    // Get auth token
    getToken() {
        return localStorage.getItem('authToken');
    },

    // Logout user
    logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    },

    // Fetch user profile from server
    async fetchProfile() {
        try {
            const token = this.getToken();
            if (!token) return null;

            const response = await fetch('/api/auth/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    // Token expired, logout
                    this.logout();
                }
                throw new Error('Failed to fetch profile');
            }

            const data = await response.json();
            if (data.success) {
                localStorage.setItem('user', JSON.stringify(data.user));
                return data.user;
            }
            return null;
        } catch (error) {
            console.error('Profile fetch error:', error);
            return null;
        }
    },

    // Add item to saved items
    async addSavedItem(item) {
        try {
            const token = this.getToken();
            if (!token) {
                // Not logged in, save to localStorage
                const savedItems = JSON.parse(localStorage.getItem('savedItems') || '[]');
                if (!savedItems.find(i => i.id === item.id)) {
                    savedItems.push(item);
                    localStorage.setItem('savedItems', JSON.stringify(savedItems));
                }
                return { success: true };
            }

            // Logged in, save to server
            const response = await fetch('/api/user/saved-items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    productId: item.id,
                    productName: item.name,
                    productPrice: item.price,
                    productImage: item.image,
                    productSize: item.size || 'M'
                })
            });

            const data = await response.json();
            if (data.success) {
                // Update local user data
                const user = this.getUser();
                user.savedItems = data.savedItems;
                localStorage.setItem('user', JSON.stringify(user));
            }
            return data;
        } catch (error) {
            console.error('Add saved item error:', error);
            return { success: false, message: 'Error saving item' };
        }
    },

    // Remove item from saved items
    async removeSavedItem(productId) {
        try {
            const token = this.getToken();
            if (!token) {
                // Not logged in, remove from localStorage
                let savedItems = JSON.parse(localStorage.getItem('savedItems') || '[]');
                savedItems = savedItems.filter(i => i.id !== productId);
                localStorage.setItem('savedItems', JSON.stringify(savedItems));
                return { success: true };
            }

            // Logged in, remove from server
            const response = await fetch(`/api/user/saved-items/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (data.success) {
                // Update local user data
                const user = this.getUser();
                user.savedItems = data.savedItems;
                localStorage.setItem('user', JSON.stringify(user));
            }
            return data;
        } catch (error) {
            console.error('Remove saved item error:', error);
            return { success: false, message: 'Error removing item' };
        }
    },

    // Get saved items
    getSavedItems() {
        if (this.isLoggedIn()) {
            const user = this.getUser();
            return user ? user.savedItems : [];
        } else {
            // Return from localStorage
            return JSON.parse(localStorage.getItem('savedItems') || '[]');
        }
    },

    // Update UI based on login state
    updateUI() {
        const isLoggedIn = this.isLoggedIn();
        const user = this.getUser();

        // Update account links in header
        const accountLinks = document.querySelectorAll('.account-link');
        accountLinks.forEach(link => {
            if (isLoggedIn && user) {
                link.innerHTML = `<i class="fas fa-user"></i> ${user.firstName}`;
                link.href = '#';
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showAccountMenu(e);
                });
            } else {
                link.innerHTML = `<i class="fas fa-user"></i> Login`;
                link.href = 'auth.html';
            }
        });
    },

    // Show account dropdown menu
    showAccountMenu(e) {
        e.preventDefault();
        const user = this.getUser();
        
        // Create dropdown menu
        let menu = document.getElementById('account-dropdown');
        if (!menu) {
            menu = document.createElement('div');
            menu.id = 'account-dropdown';
            menu.style.cssText = `
                position: absolute;
                top: 100%;
                right: 0;
                background: white;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                min-width: 200px;
                z-index: 1000;
                margin-top: 10px;
            `;
            
            menu.innerHTML = `
                <div style="padding: 15px; border-bottom: 1px solid #e0e0e0;">
                    <div style="font-weight: 600;">${user.firstName} ${user.lastName}</div>
                    <div style="font-size: 12px; color: #666;">${user.email}</div>
                </div>
                <a href="#" class="menu-item" onclick="window.location.href='account.html'" style="display: block; padding: 12px 15px; color: #333; text-decoration: none; transition: background 0.2s;">
                    <i class="fas fa-user-circle"></i> My Account
                </a>
                <a href="#" class="menu-item" onclick="UserAccount.logout()" style="display: block; padding: 12px 15px; color: #d9534f; text-decoration: none; transition: background 0.2s;">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </a>
            `;
            
            document.body.appendChild(menu);
            
            // Close on outside click
            setTimeout(() => {
                document.addEventListener('click', function closeMenu(e) {
                    if (!menu.contains(e.target) && !e.target.closest('.account-link')) {
                        menu.remove();
                        document.removeEventListener('click', closeMenu);
                    }
                });
            }, 100);
        }
        
        // Position menu
        const rect = e.target.getBoundingClientRect();
        menu.style.left = `${rect.right - 200}px`;
        menu.style.top = `${rect.bottom}px`;
    }
};

// Initialize on page load
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        UserAccount.updateUI();
    });
}
