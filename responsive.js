/**
 * ITM University Gwalior - NCC Digital Management Ecosystem
 * Shared Mobile Navigation & Native Drawer Controller (responsive.js)
 * 
 * Reused across Admin, Officer, and Student Cadet Dashboards.
 * Handles:
 *  - Native off-canvas drawer open/close
 *  - Backdrop management
 *  - Body scroll lock & restore
 *  - Keyboard accessibility (Escape key handler)
 *  - ARIA attributes (aria-expanded, aria-controls)
 *  - Close on menu-item click
 *  - Automatic cleanup on screen resize >= 1024px
 */

(function (window) {
  'use strict';

  let activeBackdrop = null;

  // Initialize Backdrop in DOM
  function ensureBackdrop() {
    let backdrop = document.getElementById('sidebar-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'sidebar-backdrop';
      backdrop.className = 'sidebar-backdrop';
      backdrop.setAttribute('aria-hidden', 'true');
      document.body.appendChild(backdrop);

      backdrop.addEventListener('click', () => {
        closeAllDrawers();
      });
    }
    activeBackdrop = backdrop;
    return backdrop;
  }

  // Find active drawer on the current page
  function getPageDrawer() {
    return document.getElementById('admin-sidebar') ||
      document.getElementById('officer-sidebar') ||
      document.getElementById('mobile-drawer-panel') ||
      document.getElementById('mobile-drawer');
  }

  function getHamburgerButton() {
    return document.querySelector('[data-drawer-toggle]') ||
      document.getElementById('header-hamburger-btn');
  }

  // Open Drawer
  function openDrawer(drawerElem) {
    const drawer = typeof drawerElem === 'string' ? document.getElementById(drawerElem) : (drawerElem || getPageDrawer());
    if (!drawer) return;

    ensureBackdrop();
    drawer.classList.add('open');
    drawer.classList.remove('hidden');
    document.body.classList.add('drawer-open');

    const hamburger = getHamburgerButton();
    if (hamburger) {
      hamburger.setAttribute('aria-expanded', 'true');
    }
  }

  // Close Drawer
  function closeDrawer(drawerElem) {
    const drawer = typeof drawerElem === 'string' ? document.getElementById(drawerElem) : (drawerElem || getPageDrawer());
    if (!drawer) return;

    drawer.classList.remove('open');
    document.body.classList.remove('drawer-open');

    // If cadet modal-style drawer
    if (drawer.id === 'mobile-drawer' && drawer.classList.contains('fixed') && drawer.classList.contains('inset-0')) {
      drawer.classList.add('hidden');
    }

    const hamburger = getHamburgerButton();
    if (hamburger) {
      hamburger.setAttribute('aria-expanded', 'false');
    }
  }

  // Toggle Drawer
  function toggleDrawer(drawerElem) {
    const drawer = typeof drawerElem === 'string' ? document.getElementById(drawerElem) : (drawerElem || getPageDrawer());
    if (!drawer) return;

    if (drawer.classList.contains('open') || (!drawer.classList.contains('hidden') && drawer.id === 'mobile-drawer')) {
      closeDrawer(drawer);
    } else {
      openDrawer(drawer);
    }
  }

  // Close all open drawers
  function closeAllDrawers() {
    const drawers = document.querySelectorAll('#admin-sidebar, #officer-sidebar, #mobile-drawer-panel, #mobile-drawer');
    drawers.forEach(d => closeDrawer(d));
  }

  // Listen for Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      closeAllDrawers();
    }
  });

  // Automatically close drawer if user resizes window to desktop (>= 1024px)
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
      document.body.classList.remove('drawer-open');
      const drawers = document.querySelectorAll('#admin-sidebar, #officer-sidebar, #mobile-drawer-panel');
      drawers.forEach(d => d.classList.remove('open'));
    }
  });

  // Attach auto-close on navigation item clicks
  document.addEventListener('DOMContentLoaded', () => {
    ensureBackdrop();

    const drawer = getPageDrawer();
    if (drawer) {
      // Any link or button inside drawer navigation closes drawer on small screens
      drawer.addEventListener('click', (e) => {
        const target = e.target.closest('button, a');
        if (target && !target.classList.contains('drawer-close-btn') && window.innerWidth < 1024) {
          // Allow click handler to run, then close drawer
          setTimeout(() => {
            closeDrawer(drawer);
          }, 150);
        }
      });
    }

    // Refresh icons if lucide is available
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  });

  // Public Interface & Legacy Compatibility Aliases
  window.NCC_RESPONSIVE = {
    openDrawer,
    closeDrawer,
    toggleDrawer,
    closeAllDrawers
  };

  // Backwards compatible aliases for existing dashboard buttons
  window.toggleMobileAdminSidebar = function () {
    toggleDrawer('admin-sidebar');
  };

  window.toggleMobileSidebar = function () {
    toggleDrawer('officer-sidebar');
  };

  window.toggleMobileDrawer = function (show) {
    if (show) {
      openDrawer('mobile-drawer');
    } else {
      closeDrawer('mobile-drawer');
    }
  };

})(typeof window !== 'undefined' ? window : this);
