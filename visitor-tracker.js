// Visitor Tracking Script - Add to all pages
(function() {
    'use strict';

    // Generate or retrieve session ID
    function getSessionId() {
        let sessionId = sessionStorage.getItem('visitorSessionId');
        if (!sessionId) {
            sessionId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('visitorSessionId', sessionId);
        }
        return sessionId;
    }

    // Detect device type
    function getDeviceType() {
        const ua = navigator.userAgent;
        if (/mobile|android|iphone|ipad|phone/i.test(ua)) {
            return 'mobile';
        } else if (/tablet|ipad/i.test(ua)) {
            return 'tablet';
        }
        return 'desktop';
    }

    // Get current page name
    function getPageName() {
        const pathname = window.location.pathname;
        const filename = pathname.split('/').pop() || 'home';
        return filename.replace('.html', '') || 'home';
    }

    // Track visitor
    function trackVisitor() {
        const sessionId = getSessionId();
        const deviceType = getDeviceType();
        const page = getPageName();

        // Send to backend
        fetch('/api/track/visitor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sessionId,
                page,
                deviceType
            })
        }).catch(err => console.error('Tracking error:', err));
    }

    // Track on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', trackVisitor);
    } else {
        trackVisitor();
    }

    // Re-track every 5 minutes to keep session active
    setInterval(trackVisitor, 5 * 60 * 1000);
})();
