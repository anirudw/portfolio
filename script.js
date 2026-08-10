/**
 * ==========================================================================
 * DEVELOPER PORTFOLIO - INTERACTIVITY & BEHAVIOR (VANILLA JS)
 * Target: Anirudh S Nair - Developer Portfolio
 * Architecture: Standalone, zero-dependency ES6+ JavaScript
 * Features: Theme Toggle, Active Nav Highlight, Mobile Menu, Scroll Anims, Copy Email
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /**
   * ------------------------------------------------------------------------
   * 1. LIGHT / DARK THEME TOGGLE
   * Persists preference in localStorage & syncs data-theme attribute on <html>
   * ------------------------------------------------------------------------
   */
  const initTheme = () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;

    const STORAGE_KEY = 'portfolio_theme';
    const HTML = document.documentElement;

    // Determine initial theme (localStorage > OS preference > dark default)
    const getSavedTheme = () => localStorage.getItem(STORAGE_KEY);
    const getSystemTheme = () => (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

    const applyTheme = (theme) => {
      HTML.setAttribute('data-theme', theme);
      themeToggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
      themeToggleBtn.setAttribute('title', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
      
      // Update SVG Icon inside theme toggle button
      themeToggleBtn.innerHTML = theme === 'light'
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
             <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
           </svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
             <circle cx="12" cy="12" r="5"></circle>
             <line x1="12" y1="1" x2="12" y2="3"></line>
             <line x1="12" y1="21" x2="12" y2="23"></line>
             <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
             <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
             <line x1="1" y1="12" x2="3" y2="12"></line>
             <line x1="21" y1="12" x2="23" y2="12"></line>
             <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
             <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
           </svg>`;
    };

    let currentTheme = getSavedTheme() || getSystemTheme();
    applyTheme(currentTheme);

    themeToggleBtn.addEventListener('click', () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      localStorage.setItem(STORAGE_KEY, currentTheme);
      applyTheme(currentTheme);
    });
  };

  /**
   * ------------------------------------------------------------------------
   * 2. ACTIVE NAVIGATION HIGHLIGHT (INTERSECTION OBSERVER)
   * Dynamically activates corresponding header nav link as section scrolls into view
   * ------------------------------------------------------------------------
   */
  const initActiveNavObserver = () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    if (!sections.length || !navLinks.length) return;

    const navLinkMap = new Map();
    navLinks.forEach((link) => {
      const hash = link.getAttribute('href');
      if (hash && hash.startsWith('#')) {
        navLinkMap.set(hash.substring(1), link);
      }
    });

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => link.classList.remove('active'));
          const activeLink = navLinkMap.get(id);
          if (activeLink) {
            activeLink.classList.add('active');
          }
        }
      });
    }, observerOptions);

    sections.forEach((section) => observer.observe(section));
  };

  /**
   * ------------------------------------------------------------------------
   * 3. MOBILE NAVIGATION TOGGLE
   * Controls accessible hamburger dropdown menu for mobile viewports
   * ------------------------------------------------------------------------
   */
  const initMobileNav = () => {
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const navMenu = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');
    if (!toggleBtn || !navMenu) return;

    const toggleMenu = (isOpen) => {
      const state = isOpen !== undefined ? isOpen : navMenu.classList.contains('is-open');
      const targetState = !state;

      navMenu.classList.toggle('is-open', targetState);
      toggleBtn.setAttribute('aria-expanded', targetState ? 'true' : 'false');
      toggleBtn.setAttribute('aria-label', targetState ? 'Close Navigation Menu' : 'Open Navigation Menu');
    };

    toggleBtn.addEventListener('click', () => toggleMenu());

    // Close menu when clicking any navigation link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('is-open')) {
          toggleMenu(false);
        }
      });
    });

    // Close menu on Escape key press for keyboard accessibility
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
        toggleMenu(false);
        toggleBtn.focus();
      }
    });
  };

  /**
   * ------------------------------------------------------------------------
   * 4. SCROLL-TRIGGERED FADE-IN ANIMATIONS (INTERSECTION OBSERVER)
   * Reveals elements with smooth translateY and opacity transitions as observed
   * ------------------------------------------------------------------------
   */
  const initScrollAnimations = () => {
    const animatableElements = document.querySelectorAll('.animate-on-scroll');
    if (!animatableElements.length) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observerInstance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Stop observing element once animated for optimal performance
          observerInstance.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatableElements.forEach((el) => observer.observe(el));
  };

  /**
   * ------------------------------------------------------------------------
   * 5. COPY-TO-CLIPBOARD FUNCTIONALITY
   * Copies direct email to user clipboard with accessible visual feedback
   * ------------------------------------------------------------------------
   */
  const initCopyEmail = () => {
    const copyBtn = document.getElementById('copy-email-btn');
    if (!copyBtn) return;

    const EMAIL_ADDRESS = 'anirudh05snair@gmail.com';
    const copyTextSpan = copyBtn.querySelector('.copy-text');

    copyBtn.addEventListener('click', async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(EMAIL_ADDRESS);
        } else {
          // Fallback mechanism for older browser contexts
          const tempInput = document.createElement('textarea');
          tempInput.value = EMAIL_ADDRESS;
          tempInput.style.position = 'fixed';
          tempInput.style.opacity = '0';
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
        }

        // Provide temporary positive visual feedback
        copyBtn.classList.add('copied');
        if (copyTextSpan) copyTextSpan.textContent = 'Copied!';
        copyBtn.setAttribute('aria-label', 'Email copied to clipboard');

        setTimeout(() => {
          copyBtn.classList.remove('copied');
          if (copyTextSpan) copyTextSpan.textContent = 'Copy';
          copyBtn.setAttribute('aria-label', 'Copy email to clipboard');
        }, 2000);

      } catch (err) {
        console.error('Failed to copy email to clipboard:', err);
      }
    });
  };

  // Initialize all interactive modules
  initTheme();
  initActiveNavObserver();
  initMobileNav();
  initScrollAnimations();
  initCopyEmail();
});
