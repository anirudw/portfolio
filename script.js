/**
 * ==========================================================================
 * ANIRUDH S NAIR - PORTFOLIO INTERACTIVITY (VANILLA JS)
 * Standalone, lightweight ES6+ JavaScript for smooth scrolling,
 * IntersectionObserver reveal animations, and email copy functionality.
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. Smooth Scroll for Internal Section Navigation Links
  const initSmoothScroll = () => {
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth' });

          // Close mobile navigation menu if active
          const navMenu = document.querySelector('.nav');
          const toggleBtn = document.getElementById('mobile-menu-toggle');
          if (navMenu && navMenu.classList.contains('is-open')) {
            navMenu.classList.remove('is-open');
            if (toggleBtn) {
              toggleBtn.setAttribute('aria-expanded', 'false');
              toggleBtn.setAttribute('aria-label', 'Open Navigation Menu');
            }
          }
        }
      });
    });
  };

  // 2. Subtle Fade-In on Scroll via IntersectionObserver
  const initScrollAnimations = () => {
    const animatableElements = document.querySelectorAll('.animate-on-scroll');
    if (!animatableElements.length) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observerInstance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Unobserve target after animation triggers for optimal performance
          observerInstance.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatableElements.forEach((el) => observer.observe(el));
  };

  // 3. Email Click-to-Copy with Text Feedback
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
          const tempInput = document.createElement('textarea');
          tempInput.value = EMAIL_ADDRESS;
          tempInput.style.position = 'fixed';
          tempInput.style.opacity = '0';
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
        }

        copyBtn.classList.add('copied');
        if (copyTextSpan) copyTextSpan.textContent = 'Email copied';
        copyBtn.setAttribute('aria-label', 'Email copied to clipboard');

        setTimeout(() => {
          copyBtn.classList.remove('copied');
          if (copyTextSpan) copyTextSpan.textContent = 'Copy';
          copyBtn.setAttribute('aria-label', 'Copy email address to clipboard');
        }, 2000);

      } catch (err) {
        console.error('Failed to copy email:', err);
      }
    });
  };

  // 4. Light/Dark Theme & Mobile Nav Mechanisms
  const initThemeAndNav = () => {
    const themeBtn = document.getElementById('theme-toggle');
    const STORAGE_KEY = 'portfolio_theme';
    const HTML = document.documentElement;

    if (themeBtn) {
      const applyTheme = (theme) => {
        HTML.setAttribute('data-theme', theme);
        themeBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
      };

      const savedTheme = localStorage.getItem(STORAGE_KEY) || 
        (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
      applyTheme(savedTheme);

      themeBtn.addEventListener('click', () => {
        const nextTheme = HTML.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        localStorage.setItem(STORAGE_KEY, nextTheme);
        applyTheme(nextTheme);
      });
    }

    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.querySelector('.nav');
    if (mobileToggle && navMenu) {
      mobileToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('is-open');
        mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    }
  };

  // Initialize essential handlers
  initSmoothScroll();
  initScrollAnimations();
  initCopyEmail();
  initThemeAndNav();
});
