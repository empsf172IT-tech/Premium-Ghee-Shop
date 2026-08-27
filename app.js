/**
 * GHRITA — Web Application Script
 * Handcrafted visual behaviors and dynamic client-side interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // Theme Management
  initTheme();

  // Navigation Logic
  initNavigation();

  // Scroll Animations (AOS style)
  initScrollAnimations();

  // E-commerce Cart
  initCart();

  // Forms Simulation
  initForms();
});

/* ==========================================================================
   Theme Management
   ========================================================================== */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('theme') || 'light';

  // Apply initially
  document.documentElement.setAttribute('data-theme', storedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}

/* ==========================================================================
   Navigation Logic (Sticky, Hamburger & Active links)
   ========================================================================== */
function initNavigation() {
  const header = document.querySelector('header');
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const sections = document.querySelectorAll('section');

  // Sticky header class toggle
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Hamburger drawer toggle
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.toggle('active');
      hamburger.classList.toggle('active');
      
      // Animate hamburger bars to X
      const spans = hamburger.querySelectorAll('span');
      if (mobileNav.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(2px, 2px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(4px, -5px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });
  }

  // Close mobile nav on click
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('active');
      hamburger.classList.remove('active');
      const spans = hamburger.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    });
  });

  // Track active section and update navigation highlight
  const observerOptions = {
    root: null,
    rootMargin: '-50% 0px -50% 0px', // Trigger when section occupies center of viewport
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        // Desktop nav active class
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${id}` || (id === 'home' && href === '#')) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });

        // Mobile nav active class
        mobileLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${id}` || (id === 'home' && href === '#')) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    if (section.getAttribute('id')) {
      observer.observe(section);
    }
  });

  // Scroll to Top Button functionality
  const backToTop = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > window.innerHeight) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

/* ==========================================================================
   Scroll Reveal Animations
   ========================================================================== */
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-zoom');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve to keep animated elements loaded
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(reveal => {
    revealObserver.observe(reveal);
  });
}


/* ==========================================================================
   E-commerce Cart Logic
   ========================================================================== */
function initCart() {
  const cartTrigger = document.getElementById('cart-trigger');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartDrawer = document.getElementById('cart-drawer');
  const closeCartBtn = document.getElementById('close-cart');
  const cartCount = document.querySelector('.cart-count');
  const cartItemsContainer = document.querySelector('.cart-items-container');
  const cartTotalPrice = document.querySelector('.cart-total-price');
  const addCartBtns = document.querySelectorAll('.btn-add-cart, .btn-primary[data-product]');
  const checkoutBtn = document.getElementById('checkout-btn');

  // Hardcoded product database for simulations
  const productsDB = {
    classic: { name: 'Classic Golden Ghee', price: 28.00, img: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80' },
    grassfed: { name: 'Grass-Fed A2 Ghee', price: 38.00, img: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&w=600&q=80' },
    cultured: { name: 'Cultured Heritage Ghee', price: 45.00, img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80' }
  };

  let cart = JSON.parse(localStorage.getItem('ghee_cart')) || [];

  // Toggle Cart Drawer
  function toggleCart() {
    cartOverlay.classList.toggle('active');
    cartDrawer.classList.toggle('active');
  }

  if (cartTrigger) cartTrigger.addEventListener('click', toggleCart);
  if (cartOverlay) cartOverlay.addEventListener('click', toggleCart);
  if (closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);

  // Add Item to Cart
  function addToCart(productId) {
    const product = productsDB[productId];
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
      existingItem.qty += 1;
    } else {
      cart.push({
        id: productId,
        name: product.name,
        price: product.price,
        img: product.img,
        qty: 1
      });
    }

    saveCart();
    renderCart();
    
    // Open drawer automatically when adding an item
    if (!cartDrawer.classList.contains('active')) {
      toggleCart();
    }
  }

  // Save Cart State
  function saveCart() {
    localStorage.setItem('ghee_cart', JSON.stringify(cart));
  }

  // Update Quantity
  window.updateCartQty = function(id, delta) {
    const item = cart.find(item => item.id === id);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter(item => item.id !== id);
    }
    
    saveCart();
    renderCart();
  };

  // Remove Item
  window.removeFromCart = function(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    renderCart();
  };

  // Render Cart UI
  function renderCart() {
    // Update Badge Count
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    if (cartCount) {
      cartCount.textContent = totalItems;
      cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }

    if (!cartItemsContainer) return;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="cart-empty-message">
          <p>Your cart is empty.</p>
          <p style="font-size: 0.85rem; margin-top: 0.5rem; color: var(--text-muted)">Discover our signature collection and start culinary journey.</p>
        </div>
      `;
      if (cartTotalPrice) cartTotalPrice.textContent = '$0.00';
      return;
    }

    // Render items
    let cartHTML = '';
    let subtotal = 0;

    cart.forEach(item => {
      const itemTotal = item.price * item.qty;
      subtotal += itemTotal;

      cartHTML += `
        <div class="cart-item">
          <img src="${item.img}" alt="${item.name}" class="cart-item-img">
          <div class="cart-item-details">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            <div class="cart-item-qty">
              <button class="qty-btn" onclick="updateCartQty('${item.id}', -1)">-</button>
              <span class="qty-val">${item.qty}</span>
              <button class="qty-btn" onclick="updateCartQty('${item.id}', 1)">+</button>
            </div>
          </div>
          <div class="btn-remove-item" onclick="removeFromCart('${item.id}')">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
        </div>
      `;
    });

    cartItemsContainer.innerHTML = cartHTML;
    if (cartTotalPrice) cartTotalPrice.textContent = `$${subtotal.toFixed(2)}`;
  }

  // Add click listeners to product buttons
  addCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const productId = btn.getAttribute('data-product');
      if (productId) {
        addToCart(productId);
      }
    });
  });

  // Initial cart render
  renderCart();

  // Mock Checkout Interaction
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      alert('Thank you for choosing GHRITA! This is a demo checkout simulation.');
      cart = [];
      saveCart();
      renderCart();
      toggleCart();
    });
  }
}

/* ==========================================================================
   Newsletter & Contact Forms Simulations
   ========================================================================== */
function initForms() {
  const newsletterForm = document.getElementById('newsletter-form');
  const subscribeMsg = document.getElementById('subscribe-msg');
  const contactForm = document.getElementById('contact-form');

  if (newsletterForm && subscribeMsg) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      if (emailInput && emailInput.value) {
        emailInput.value = '';
        subscribeMsg.style.display = 'block';
        subscribeMsg.textContent = 'Welcome to the Golden Circle. Details will arrive in your inbox.';
        setTimeout(() => {
          subscribeMsg.style.display = 'none';
        }, 5000);
      }
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const inputs = contactForm.querySelectorAll('input, textarea');
      alert('Thank you for reaching out to us. Our guest relations team will respond within 24 hours.');
      inputs.forEach(input => {
        if (input.type !== 'submit') input.value = '';
      });
    });
  }
}
