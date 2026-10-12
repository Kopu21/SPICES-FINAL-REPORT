// SuryaVeda Spices & Condiments - Master Application Controller

// --- STATE MANAGEMENT ---
let currentCategory = 'all';
let currentSearch = '';
let currentHeatFilter = 'all';
let currentSort = 'featured';

let cart = JSON.parse(localStorage.getItem('suryaveda_cart') || '[]');
let activeCoupon = localStorage.getItem('suryaveda_active_coupon') || null;
let isDarkMode = localStorage.getItem('suryaveda_theme') === 'dark';
let isRtlMode = localStorage.getItem('suryaveda_dir') === 'rtl';

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  applyThemePreference();
  applyRtlPreference();
  initNavigation();
  initContactValidation();
  renderCategoryPills();
  renderHomeCategories();
  renderBestSellers();
  renderSignatureHomeProducts();
  renderTerroirCards();
  renderHomeRecipesTeaser();
  renderTestimonials();
  renderHome2Reserves();
  setDishPairing('biryani');
  renderProductsCatalog();
  renderRecipesCatalog();
  renderContactLocations();
  renderCartOffers();
  initBulkCalculator();
  initGiftingStudio();
  verifyBatchLot('SV-2025-LK08');
  updateCartUI();
  
  // Handle direct URL hash routing
  const hash = window.location.hash.replace('#', '') || 'home';
  navigateTo(hash);
});

// --- THEME TOGGLE (LIGHT / DARK VELVET CLOVE) ---
function toggleTheme() {
  isDarkMode = !isDarkMode;
  localStorage.setItem('suryaveda_theme', isDarkMode ? 'dark' : 'light');
  applyThemePreference();
}

function applyThemePreference() {
  const icons = document.querySelectorAll('#theme-icon, .theme-icon-btn');
  const labels = document.querySelectorAll('#theme-label, .theme-label-btn');
  const themeBtns = document.querySelectorAll('#theme-toggle-btn, .theme-toggle-btn');

  if (isDarkMode) {
    document.body.classList.add('dark-mode');
    document.documentElement.classList.add('dark');
    icons.forEach(icon => {
      icon.classList.remove('fa-moon', 'text-saffron-700');
      icon.classList.add('fa-sun', 'text-amber-400');
    });
    labels.forEach(l => { l.innerText = 'Light'; });
    themeBtns.forEach(b => { b.setAttribute('title', 'Switch to Light Mode'); });
  } else {
    document.body.classList.remove('dark-mode');
    document.documentElement.classList.remove('dark');
    icons.forEach(icon => {
      icon.classList.remove('fa-sun', 'text-amber-400');
      icon.classList.add('fa-moon', 'text-saffron-700');
    });
    labels.forEach(l => { l.innerText = 'Dark'; });
    themeBtns.forEach(b => { b.setAttribute('title', 'Switch to Dark Mode'); });
  }
}

// --- RTL / LTR TOGGLE ---
function toggleRtlMode() {
  isRtlMode = !isRtlMode;
  localStorage.setItem('suryaveda_dir', isRtlMode ? 'rtl' : 'ltr');
  applyRtlPreference();
}

function applyRtlPreference() {
  const labels = document.querySelectorAll('#rtl-label, .rtl-label-btn');
  const rtlBtns = document.querySelectorAll('#rtl-toggle-btn, .rtl-toggle-btn');
  const rtlIcons = document.querySelectorAll('#rtl-icon, .rtl-icon-btn');

  if (isRtlMode) {
    document.documentElement.setAttribute('dir', 'rtl');
    document.body.setAttribute('dir', 'rtl');
    labels.forEach(label => { label.innerText = 'LTR'; });
    rtlBtns.forEach(b => {
      b.classList.add('rtl-active');
      b.setAttribute('title', 'Switch to Left-to-Right (LTR) Layout');
    });
  } else {
    document.documentElement.setAttribute('dir', 'ltr');
    document.body.setAttribute('dir', 'ltr');
    labels.forEach(label => { label.innerText = 'RTL'; });
    rtlBtns.forEach(b => {
      b.classList.remove('rtl-active');
      b.setAttribute('title', 'Switch to Right-to-Left (RTL) Layout');
    });
  }
}

// --- NAVIGATION CONTROLLER ---
function filterBySearchOrNav(searchTerm, category = 'all') {
  currentCategory = category;
  currentSearch = searchTerm || '';
  navigateTo('products');
  const searchInput = document.getElementById('catalog-search');
  if (searchInput) searchInput.value = searchTerm || '';
  renderCategoryPills();
  filterProducts();
}

function scrollToElementWithOffset(el) {
  if (!el) return;
  const headerEl = document.getElementById('main-site-header');
  const headerHeight = headerEl ? headerEl.offsetHeight : 80;
  const rect = el.getBoundingClientRect();
  const targetTop = rect.top + window.pageYOffset - headerHeight - 16;
  window.scrollTo({
    top: Math.max(0, targetTop),
    behavior: 'smooth'
  });
}

function navigateTo(viewId) {
  if (!viewId) viewId = 'home';
  const cleanId = viewId.toString().toLowerCase().trim().replace(/^#/, '');

  // 1. Modals & Portals
  if (cleanId === 'login' || cleanId === 'register' || cleanId === 'auth' || cleanId === 'account') {
    openAuthModal(cleanId === 'register' ? 'register' : 'login');
    toggleMobileNav(true);
    return;
  }
  if (cleanId === 'admin') {
    openAdminModal();
    toggleMobileNav(true);
    return;
  }

  // 2. Product Categories shortcut
  const categoryAliases = ['whole', 'powders', 'masalas', 'pickles', 'specials', 'whole-spices', 'ground-spices'];
  if (categoryAliases.includes(cleanId)) {
    const mappedCat = cleanId.replace('-spices', '');
    setCategoryAndNavigate(mappedCat === 'ground' ? 'powders' : mappedCat);
    toggleMobileNav(true);
    return;
  }

  // 3. Section / Subtopic Aliases
  let targetView = cleanId;
  let targetAnchor = null;

  if (cleanId === 'about' || cleanId === 'story' || cleanId === 'heritage') {
    targetView = 'home';
    targetAnchor = document.getElementById('brand-story-section');
  } else if (cleanId === 'services' || cleanId === 'supplies') {
    targetView = 'home';
    targetAnchor = document.getElementById('supplies-section');
  } else if (cleanId === 'pricing' || cleanId === 'quote' || cleanId === 'bulk-quote') {
    targetView = 'bulk-orders';
    targetAnchor = document.getElementById('pricing-section') || document.getElementById('bulk-spice-select');
  } else if (cleanId === 'blog' || cleanId === 'articles' || cleanId === 'knowledge') {
    targetView = 'home-2';
    targetAnchor = document.getElementById('h2-spice-knowledge');
  }

  const validViews = ['home', 'home-2', 'products', 'product-detail', 'recipes', 'bulk-orders', 'contact', 'error', 'gifting', 'purity'];

  // 4. In-page element check if not a standard view
  if (!validViews.includes(targetView)) {
    const el = document.getElementById(cleanId);
    if (el) {
      const parentView = el.closest('.spa-view');
      if (parentView) {
        targetView = parentView.id.replace('view-', '');
        targetAnchor = el;
      } else {
        scrollToElementWithOffset(el);
        toggleMobileNav(true);
        return;
      }
    } else {
      targetView = 'home';
    }
  }

  // 5. Hide all views and show target view
  document.querySelectorAll('.spa-view').forEach(el => {
    el.classList.add('hidden');
  });

  const targetViewEl = document.getElementById(`view-${targetView}`);
  if (targetViewEl) {
    targetViewEl.classList.remove('hidden');
  }

  // 6. Update Nav links active state
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });

  const activeLink = document.getElementById(`nav-${targetView}`);
  if (activeLink) {
    activeLink.classList.add('active');
  } else if (targetView === 'home' || targetView === 'home-2') {
    const homeNav = document.getElementById('nav-home');
    if (homeNav) homeNav.classList.add('active');
  } else if (targetView === 'products' || targetView === 'product-detail') {
    const prodNav = document.getElementById('nav-products');
    if (prodNav) prodNav.classList.add('active');
  }

  // 7. Update URL hash without page reload
  if (targetView !== 'product-detail') {
    window.history.replaceState(null, null, `#${cleanId}`);
  }

  // 8. Scroll to target anchor or top with offset
  if (targetAnchor) {
    setTimeout(() => {
      scrollToElementWithOffset(targetAnchor);
    }, 60);
  } else {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  // 9. Close mobile drawer and dropdown on navigation
  toggleMobileNav(true);
  closeHomeDropdown();
}

// --- NAVBAR HOME DROPDOWN CONTROLLER ---
function toggleHomeDropdown(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  const menu = document.getElementById('home-dropdown-menu');
  const chevron = document.getElementById('home-chevron-icon');
  const btn = document.getElementById('nav-home');
  if (!menu) return;

  const isOpen = !menu.classList.contains('hidden');
  if (isOpen) {
    menu.classList.add('hidden');
    if (chevron) chevron.classList.remove('rotate-180');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  } else {
    menu.classList.remove('hidden');
    if (chevron) chevron.classList.add('rotate-180');
    if (btn) btn.setAttribute('aria-expanded', 'true');
  }
}

function closeHomeDropdown() {
  const menu = document.getElementById('home-dropdown-menu');
  const chevron = document.getElementById('home-chevron-icon');
  const btn = document.getElementById('nav-home');
  if (menu) menu.classList.add('hidden');
  if (chevron) chevron.classList.remove('rotate-180');
  if (btn) btn.setAttribute('aria-expanded', 'false');
}

function selectHomeView(viewId, event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  closeHomeDropdown();
  navigateTo(viewId);
}

function initNavigation() {
  const handleHash = () => {
    const hash = window.location.hash.replace('#', '');
    if (!hash) return;
    if (hash.startsWith('product?id=')) {
      const pid = hash.split('id=')[1];
      openProductDetail(pid);
    } else if (hash.startsWith('product-') || hash.startsWith('product/')) {
      const pid = hash.replace(/^product[-/]/, '');
      openProductDetail(pid);
    } else {
      navigateTo(hash);
    }
  };

  window.addEventListener('hashchange', handleHash);
  if (window.location.hash) {
    handleHash();
  }

  // Dismiss dropdown on clicks outside
  document.addEventListener('click', (e) => {
    const wrapper = document.getElementById('home-dropdown-wrapper');
    if (wrapper && !wrapper.contains(e.target)) {
      closeHomeDropdown();
    }
  });

  // Setup backdrop clicks and escape key for auth and admin modals
  const authModal = document.getElementById('auth-modal');
  if (authModal) {
    authModal.addEventListener('click', (e) => {
      if (e.target === authModal) closeAuthModal();
    });
  }

  const adminModal = document.getElementById('admin-modal');
  if (adminModal) {
    adminModal.addEventListener('click', (e) => {
      if (e.target === adminModal) closeAdminModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAuthModal();
      closeAdminModal();
      closeQuickView();
      closeRecipeModal();
      toggleCartDrawer(false);
    }
  });
}

// Authentication Modal Handlers
function openAuthModal(tab = 'login') {
  const modal = document.getElementById('auth-modal');
  if (!modal) return;
  modal.classList.remove('hidden');
  switchAuthTab(tab);
  document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

function switchAuthTab(tab) {
  const loginForm = document.getElementById('auth-login-form');
  const registerForm = document.getElementById('auth-register-form');
  const btnLogin = document.getElementById('auth-tab-btn-login');
  const btnRegister = document.getElementById('auth-tab-btn-register');
  if (!loginForm || !registerForm) return;

  if (tab === 'register') {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    if (btnRegister) {
      btnRegister.className = 'py-2 px-3 rounded-lg bg-white dark:bg-clove-900 shadow-sm text-saffron-800 dark:text-saffron-300 transition';
    }
    if (btnLogin) {
      btnLogin.className = 'py-2 px-3 rounded-lg text-clove-700 dark:text-parchment-400 hover:text-clove-900 transition';
    }
  } else {
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
    if (btnLogin) {
      btnLogin.className = 'py-2 px-3 rounded-lg bg-white dark:bg-clove-900 shadow-sm text-saffron-800 dark:text-saffron-300 transition';
    }
    if (btnRegister) {
      btnRegister.className = 'py-2 px-3 rounded-lg text-clove-700 dark:text-parchment-400 hover:text-clove-900 transition';
    }
  }
}

function handleAuthSubmit(event, type) {
  event.preventDefault();
  if (type === 'register') {
    showToast('Patron registration received! Welcome to SuryaVeda Heritage Cellar.');
  } else {
    showToast('Authenticated successfully as SuryaVeda Patron.');
  }
  closeAuthModal();
}

// Admin Console Modal Handlers
function openAdminModal() {
  const modal = document.getElementById('admin-modal');
  if (!modal) return;
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  populateAdminInventory();
}

function closeAdminModal() {
  const modal = document.getElementById('admin-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

function populateAdminInventory() {
  const tbody = document.getElementById('admin-inventory-table-body');
  if (!tbody) return;
  const catalog = (typeof SPICE_DATA !== 'undefined' && SPICE_DATA.products) ? SPICE_DATA.products : (typeof products !== 'undefined' ? products : []);
  if (!catalog || !catalog.length) return;
  tbody.innerHTML = catalog.map((p, idx) => `
    <tr class="hover:bg-parchment-100 dark:hover:bg-[#1A1108]/60 transition border-b border-parchment-200 dark:border-saffron-900/20">
      <td class="p-3 font-mono font-bold text-saffron-800 dark:text-saffron-300">${p.id.toUpperCase()}</td>
      <td class="p-3 font-medium text-clove-900 dark:text-parchment-100">${p.name}</td>
      <td class="p-3 capitalize">${p.category}</td>
      <td class="p-3 text-clove-700 dark:text-parchment-300">${p.origin || 'Kerala Terroir'}</td>
      <td class="p-3 font-bold text-cardamom-700 dark:text-cardamom-400">${120 + (idx * 15)} units</td>
      <td class="p-3"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cardamom-100 dark:bg-cardamom-950 text-cardamom-800 dark:text-cardamom-300">Grade A1+ Verified</span></td>
    </tr>
  `).join('');
}

function toggleMobileNav(forceClose = false) {
  const nav = document.getElementById('mobile-nav');
  const btn = document.getElementById('mobile-hamburger-btn');
  const icon = btn ? btn.querySelector('i') : null;
  if (!nav) return;

  if (forceClose || !nav.classList.contains('hidden')) {
    nav.classList.add('hidden');
    if (btn) {
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Open navigation menu');
    }
    if (icon) {
      icon.classList.remove('fa-xmark');
      icon.classList.add('fa-bars');
    }
  } else {
    nav.classList.remove('hidden');
    if (btn) {
      btn.setAttribute('aria-expanded', 'true');
      btn.setAttribute('aria-label', 'Close navigation menu');
    }
    if (icon) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-xmark');
    }
  }
}

function setCategoryAndNavigate(catId) {
  currentCategory = catId;
  navigateTo('products');
  renderCategoryPills();
  filterProducts();
}

// --- CATEGORY PILLS BAR ---
function renderCategoryPills() {
  const container = document.getElementById('category-pills');
  if (!container) return;

  container.innerHTML = SPICE_DATA.categories.map(cat => {
    const isActive = currentCategory === cat.id;
    return `
      <button onclick="selectCategory('${cat.id}')" class="shrink-0 px-4 py-2.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-2 border ${
        isActive 
          ? 'bg-saffron-800 text-saffron-100 border-saffron-900 shadow-md scale-105' 
          : 'bg-white text-clove-900 border-parchment-300 hover:bg-saffron-50 hover:border-saffron-400'
      }">
        <i class="${cat.icon}"></i>
        <span>${cat.name}</span>
        <span class="px-1.5 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-saffron-900 text-saffron-200' : 'bg-parchment-200 text-clove-800'}">${cat.count}</span>
      </button>
    `;
  }).join('');
}

function selectCategory(catId) {
  currentCategory = catId;
  renderCategoryPills();
  filterProducts();
}

// --- PRODUCT CATALOG & RENDERING ---
function renderProductsCatalog() {
  filterProducts();
}

function filterProducts() {
  const grid = document.getElementById('products-grid');
  const noMsg = document.getElementById('no-products-msg');
  if (!grid) return;

  const searchVal = (document.getElementById('catalog-search')?.value || '').toLowerCase().trim();
  const heatVal = document.getElementById('filter-heat')?.value || 'all';
  const sortVal = document.getElementById('sort-by')?.value || 'featured';

  let list = SPICE_DATA.products.filter(p => {
    // Category check
    const matchCategory = (currentCategory === 'all' || p.category === currentCategory);

    // Search check
    const matchSearch = !searchVal || 
      p.name.toLowerCase().includes(searchVal) ||
      p.description.toLowerCase().includes(searchVal) ||
      p.origin.toLowerCase().includes(searchVal) ||
      p.aromaNotes.some(n => n.toLowerCase().includes(searchVal)) ||
      p.tags.some(t => t.toLowerCase().includes(searchVal));

    // Heat check
    let matchHeat = true;
    if (heatVal === 'mild') matchHeat = p.heatLevel.includes('Mild') || p.heatLevel.includes('Delicate');
    else if (heatVal === 'medium') matchHeat = p.heatLevel.includes('Medium') || p.heatLevel.includes('Warm');
    else if (heatVal === 'hot') matchHeat = p.heatLevel.includes('Hot') || p.heatLevel.includes('Fiery');

    return matchCategory && matchSearch && matchHeat;
  });

  // Sorting
  if (sortVal === 'rating') {
    list.sort((a, b) => b.rating - a.rating);
  } else if (sortVal === 'price-asc') {
    list.sort((a, b) => a.price - b.price);
  } else if (sortVal === 'price-desc') {
    list.sort((a, b) => b.price - a.price);
  } else {
    // Featured (Signature first)
    list.sort((a, b) => (b.isSignature ? 1 : 0) - (a.isSignature ? 1 : 0));
  }

  if (list.length === 0) {
    grid.innerHTML = '';
    if (noMsg) noMsg.classList.remove('hidden');
    return;
  }

  if (noMsg) noMsg.classList.add('hidden');
  grid.innerHTML = list.map(product => renderSpiceCardHTML(product)).join('');
}

function renderSpiceCardHTML(p) {
  const aromaPills = p.aromaNotes ? p.aromaNotes.slice(0, 3).map(n => `<span class="aroma-pill px-2 py-0.5 rounded-md text-[10px] font-semibold">${n}</span>`).join('') : '';
  const tagBadge = p.tags && p.tags[0] ? `<span class="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-clove-900/90 backdrop-blur-md text-saffron-300 border border-saffron-500/40 shadow-sm">${p.tags[0]}</span>` : '';

  return `
    <div class="spice-card h-full bg-white dark:bg-[#1E140C] rounded-2xl border border-parchment-300 dark:border-saffron-900/40 overflow-hidden shadow-sm hover:shadow-xl hover:border-saffron-500 transition-all duration-300 flex flex-col justify-between group">
      
      <!-- Image Container -->
      <div class="relative h-52 sm:h-56 overflow-hidden bg-parchment-200 dark:bg-parchment-900 cursor-pointer shrink-0" onclick="openProductDetail('${p.id}')">
        <img src="${p.image}" alt="${p.name}" class="spice-card-img w-full h-full object-cover">
        ${tagBadge}
        <button onclick="toggleWishlist('${p.id}', event)" class="wishlist-btn absolute top-3 right-3 w-8 h-8 rounded-full bg-parchment-50/90 dark:bg-clove-900/80 hover:bg-white dark:hover:bg-clove-800 text-clove-800 dark:text-parchment-200 hover:text-red-500 text-xs shadow flex items-center justify-center transition-colors">
          <i class="fa-regular fa-heart"></i>
        </button>
        <button onclick="event.stopPropagation(); openQuickView('${p.id}')" class="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-parchment-50/95 dark:bg-clove-900/90 hover:bg-white dark:hover:bg-clove-800 text-clove-900 dark:text-parchment-50 text-xs font-bold shadow backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-1.5 border border-parchment-300 dark:border-saffron-800/40">
          <i class="fa-regular fa-eye text-saffron-700 dark:text-saffron-400"></i>
          <span>Quick View</span>
        </button>
      </div>

      <!-- Content Details -->
      <div class="p-4 sm:p-5 flex flex-col flex-grow justify-between">
        
        <div class="flex-grow space-y-2.5">
          <div class="flex items-center justify-between text-[11px] text-clove-800/70 dark:text-parchment-400">
            <span class="flex items-center gap-1 font-semibold text-saffron-800 dark:text-saffron-400">
              <i class="fa-solid fa-location-dot text-terracotta-600"></i> ${p.origin}
            </span>
            <span class="flex items-center gap-1 text-saffron-700 dark:text-saffron-400 font-bold">
              <i class="fa-solid fa-star text-amber-500 text-[10px]"></i> ${p.rating.toFixed(1)} (${p.reviewsCount})
            </span>
          </div>

          <h3 class="font-heading font-bold text-sm sm:text-base text-clove-900 dark:text-parchment-50 leading-snug line-clamp-2 min-h-[2.5rem] hover:text-saffron-800 dark:hover:text-saffron-400 cursor-pointer transition-colors" onclick="openProductDetail('${p.id}')">
            ${p.name}
          </h3>

          <p class="text-[11px] sm:text-xs text-clove-800/70 dark:text-parchment-300 line-clamp-2 min-h-[2rem] font-light leading-relaxed">
            ${p.description}
          </p>

          <!-- Aroma Notes -->
          <div class="pt-1">
            <div class="text-[9px] uppercase font-bold text-clove-800/50 dark:text-parchment-400 mb-1 tracking-wider">Aroma Palette:</div>
            <div class="flex flex-wrap gap-1 min-h-[1.75rem] items-center">
              ${aromaPills}
            </div>
          </div>
        </div>

        <!-- Weight and Price + Add Action Section (Strictly Bottom Aligned across all cards) -->
        <div class="mt-4 pt-3 border-t border-parchment-200 dark:border-saffron-900/40 flex items-center justify-between gap-3">
          <div class="min-w-0 flex flex-col justify-center">
            <span class="text-[10px] text-clove-800/60 dark:text-parchment-400 font-medium block truncate">${p.weight}</span>
            <div class="flex items-baseline gap-1.5 mt-0.5">
              <span class="font-display font-bold text-base sm:text-lg text-saffron-800 dark:text-saffron-400 leading-none">₹${p.price}</span>
              ${p.originalPrice ? `<span class="text-[11px] text-clove-800/40 dark:text-parchment-500 line-through leading-none">₹${p.originalPrice}</span>` : ''}
            </div>
          </div>

          <button onclick="quickAddToCart('${p.id}'); showToast('Added ${p.name.replace(/'/g, "\\'")} to basket!', 'success');" class="px-4 py-2 rounded-xl gold-gradient-bg hover:brightness-110 text-white font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer" aria-label="Add ${p.name} to basket">
            <i class="fa-solid fa-plus text-xs"></i>
            <span>Add</span>
          </button>
        </div>

      </div>

    </div>
  `;
}

function toggleWishlist(productId, event) {
  if (event) event.stopPropagation();
  const btn = event?.currentTarget;
  const icon = btn?.querySelector('i');
  if (icon) {
    if (icon.classList.contains('fa-regular')) {
      icon.classList.remove('fa-regular');
      icon.classList.add('fa-solid', 'text-red-500');
      showToast("Saved to your Spice Wishlist!", "success");
    } else {
      icon.classList.remove('fa-solid', 'text-red-500');
      icon.classList.add('fa-regular');
      showToast("Removed from Wishlist.", "info");
    }
  }
}

function handleNewsletterSubscribe() {
  const input = document.getElementById('newsletter-email-input');
  const val = input ? input.value.trim() : '';
  if (!val || !val.includes('@')) {
    showToast("Please enter a valid email address.", "error");
    return;
  }
  showToast("Welcome to the Connoisseur Circle! 10% coupon HERITAGE10 is active.", "success");
  if (input) input.value = '';
}

function resetFilters() {
  currentCategory = 'all';
  const searchInp = document.getElementById('catalog-search');
  if (searchInp) searchInp.value = '';
  const heatInp = document.getElementById('filter-heat');
  if (heatInp) heatInp.value = 'all';
  const sortInp = document.getElementById('sort-by');
  if (sortInp) sortInp.value = 'featured';

  renderCategoryPills();
  filterProducts();
}

function handleHeaderSearch(e) {
  const val = e.target.value;
  if (e.key === 'Enter' || val.length >= 2) {
    navigateTo('products');
    const catalogSearch = document.getElementById('catalog-search');
    if (catalogSearch) {
      catalogSearch.value = val;
      filterProducts();
    }
  }
}

// --- HOME RENDERING FUNCTIONS ---
function renderHomeCategories() {
  const container = document.getElementById('home-categories-grid');
  if (!container) return;

  const cats = SPICE_DATA.categories.filter(c => c.id !== 'all');
  container.innerHTML = cats.map(cat => `
    <div onclick="setCategoryAndNavigate('${cat.id}')" class="group cursor-pointer rounded-2xl overflow-hidden bg-white dark:bg-[#1E140C] border border-parchment-300 dark:border-saffron-900/40 shadow-sm hover:shadow-xl hover:border-saffron-500 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
      <div class="relative h-36 sm:h-44 overflow-hidden bg-parchment-200 dark:bg-parchment-900">
        <img src="${cat.image}" alt="${cat.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
        <div class="absolute inset-0 bg-gradient-to-t from-clove-900/80 via-transparent to-transparent"></div>
        <span class="absolute bottom-2.5 left-3 text-[10px] font-black uppercase tracking-wider bg-saffron-700/90 backdrop-blur-md text-white px-2 py-0.5 rounded shadow">
          ${cat.count} Products
        </span>
      </div>
      <div class="p-3.5 sm:p-4 flex flex-col justify-between flex-grow space-y-1.5">
        <div class="flex items-center gap-1.5">
          <i class="${cat.icon} text-saffron-600 dark:text-saffron-400 text-xs"></i>
          <h3 class="font-heading font-bold text-xs sm:text-sm text-clove-900 dark:text-parchment-50 group-hover:text-saffron-700 dark:group-hover:text-saffron-400 transition-colors">${cat.name}</h3>
        </div>
        <p class="text-[11px] text-clove-800/70 dark:text-parchment-300 font-light line-clamp-2">${cat.desc}</p>
        <div class="pt-2 text-[11px] font-bold text-saffron-700 dark:text-saffron-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
          <span>${cat.ctaText || 'Shop ' + cat.name}</span>
          <i class="fa-solid fa-arrow-right text-[9px]"></i>
        </div>
      </div>
    </div>
  `).join('');
}

function renderBestSellers() {
  const container = document.getElementById('home-bestsellers-grid');
  if (!container) return;

  const bestSellers = SPICE_DATA.products.slice(0, 8);
  container.innerHTML = bestSellers.map(p => renderSpiceCardHTML(p)).join('');
}

function renderSignatureHomeProducts() {
  const container = document.getElementById('home-signature-grid');
  if (!container) return;

  const signatures = SPICE_DATA.products.filter(p => p.isSignature).slice(0, 4);
  container.innerHTML = signatures.map(p => renderSpiceCardHTML(p)).join('');
}

function renderTerroirCards() {
  const container = document.getElementById('terroir-cards-container');
  if (!container) return;

  container.innerHTML = SPICE_DATA.terroirMap.map(t => `
    <div class="p-5 rounded-2xl bg-clove-800/60 border border-saffron-600/30 hover:border-saffron-400 hover:bg-clove-800 transition-all duration-300 space-y-3 h-full flex flex-col justify-between items-stretch">
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-black uppercase tracking-wider text-saffron-400 bg-saffron-900/60 px-2 py-0.5 rounded border border-saffron-500/30">Terroir</span>
          <i class="fa-solid fa-compass text-saffron-400 text-sm"></i>
        </div>
        <h4 class="font-heading font-bold text-base text-parchment-50 leading-snug min-h-[3rem] flex items-center">${t.region}</h4>
        <p class="text-xs font-semibold text-saffron-300 min-h-[1.75rem] flex items-center">${t.spice}</p>
      </div>
      <p class="text-xs text-parchment-300/80 font-light leading-relaxed mt-auto pt-2 border-t border-saffron-900/40 min-h-[3.75rem] flex items-center">${t.note}</p>
    </div>
  `).join('');
}

function renderHomeRecipesTeaser() {
  const container = document.getElementById('home-recipe-teaser');
  if (!container) return;

  const featuredRecipes = SPICE_DATA.recipes.slice(0, 2);
  container.innerHTML = featuredRecipes.map(r => `
    <div class="bg-white dark:bg-[#150D06] rounded-2xl border border-parchment-300 dark:border-parchment-700 overflow-hidden shadow-sm flex flex-col md:flex-row group h-full items-stretch">
      <div class="md:w-5/12 min-h-[220px] md:min-h-full h-56 md:h-auto relative overflow-hidden bg-parchment-200 dark:bg-parchment-800 shrink-0">
        <img src="${r.image}" alt="${r.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
        <span class="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-clove-900/80 text-saffron-200 backdrop-blur-sm border border-saffron-500/30">${r.category}</span>
      </div>
      <div class="p-6 md:w-7/12 flex flex-col justify-between space-y-4 flex-grow">
        <div class="space-y-2">
          <div class="flex flex-wrap items-center gap-3 text-xs text-clove-800/60 dark:text-parchment-400">
            <span><i class="fa-regular fa-clock text-saffron-700 dark:text-saffron-400 mr-1"></i>${r.prepTime}</span>
            <span><i class="fa-solid fa-fire-burner text-terracotta-600 dark:text-terracotta-400 mr-1"></i>${r.difficulty}</span>
            <span><i class="fa-solid fa-utensils text-saffron-700 dark:text-saffron-400 mr-1"></i>${r.servings} Servings</span>
          </div>
          <h3 class="font-heading font-bold text-lg text-clove-900 dark:text-parchment-50 leading-snug">${r.title}</h3>
          <p class="text-xs text-clove-800/70 dark:text-parchment-300 line-clamp-3 font-light leading-relaxed">${r.overview}</p>
        </div>
        <button onclick="openRecipeModal('${r.id}')" class="w-full px-4 py-2.5 bg-parchment-100 dark:bg-parchment-800/60 hover:bg-saffron-100 dark:hover:bg-saffron-900/40 text-clove-900 dark:text-parchment-100 hover:text-saffron-800 font-bold text-xs rounded-xl border border-parchment-300 dark:border-parchment-700 transition flex items-center justify-between mt-auto">
          <span>View Master Method & Spices</span>
          <i class="fa-solid fa-arrow-right text-xs text-saffron-600"></i>
        </button>
      </div>
    </div>
  `).join('');
}

function renderTestimonials() {
  const container = document.getElementById('testimonials-grid');
  if (!container) return;

  container.innerHTML = SPICE_DATA.testimonials.map(t => `
    <div class="p-6 rounded-2xl bg-white dark:bg-[#1E140C] border border-parchment-300 dark:border-saffron-900/40 shadow-sm flex flex-col justify-between space-y-4">
      <div class="space-y-3">
        <div class="flex text-amber-500 dark:text-amber-400 text-xs">
          ${'<i class="fa-solid fa-star"></i>'.repeat(t.rating)}
        </div>
        <p class="text-xs text-clove-800 dark:text-parchment-200 leading-relaxed italic">"${t.comment}"</p>
      </div>
      <div class="flex items-center gap-3 pt-3 border-t border-parchment-200 dark:border-saffron-900/30">
        <img src="${t.avatar}" alt="${t.name}" class="w-10 h-10 rounded-full object-cover border border-saffron-300 dark:border-saffron-700">
        <div>
          <h4 class="font-bold text-xs text-clove-900 dark:text-parchment-50">${t.name}</h4>
          <p class="text-[10px] text-clove-800/60 dark:text-parchment-400">${t.role}</p>
        </div>
      </div>
    </div>
  `).join('');
}

// --- HOME 2: ESTATE CELLAR RENDERING (EMBEDDED & STANDALONE) ---
function renderHome2Reserves() {
  const embeddedContainer = document.getElementById('embedded-home2-reserves-grid');
  const standaloneContainer = document.getElementById('estate-reserves-grid');

  if (!SPICE_DATA.estateReserves) return;

  const html = SPICE_DATA.estateReserves.map(r => {
    const targetProductId = r.id === 'res-01' ? 'sp-01' : (r.id === 'res-02' ? 'sp-02' : 'sp-03');
    const altText = r.id === 'res-02' ? 'Premium Kashmiri saffron threads from Pampore' : r.name;
    return `
    <div class="bg-white dark:bg-[#1E140C] text-clove-900 dark:text-parchment-50 rounded-2xl border-2 border-amber-600/30 dark:border-amber-500/40 overflow-hidden shadow-lg flex flex-col justify-between group hover:border-amber-500 transition-all duration-300 h-full">
      <div class="relative h-60 bg-parchment-200 dark:bg-parchment-900 overflow-hidden shrink-0 cursor-pointer" onclick="openProductDetail('${targetProductId}')">
        <img src="${r.image}" alt="${altText}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy">
        <span class="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-cardamom-900 text-amber-300 border border-amber-400 shadow">
          ${r.badge}
        </span>
      </div>

      <div class="p-6 space-y-4 flex-grow flex flex-col justify-between">
        <div class="space-y-2">
          <div class="text-[11px] text-cardamom-800 dark:text-cardamom-400 font-bold flex items-center gap-1">
            <i class="fa-solid fa-location-dot"></i> ${r.origin}
          </div>
          <h3 class="font-heading font-bold text-lg text-clove-900 dark:text-parchment-50 leading-snug min-h-[3.25rem] line-clamp-2 hover:text-saffron-800 dark:hover:text-saffron-400 cursor-pointer transition-colors" onclick="openProductDetail('${targetProductId}')">${r.name}</h3>
          <p class="text-xs text-clove-800/70 dark:text-parchment-300 font-light leading-relaxed min-h-[3.5rem] line-clamp-3">${r.curatorNote}</p>
        </div>

        <div class="mt-auto space-y-4 pt-2">
          <div class="p-3.5 rounded-xl bg-parchment-100 dark:bg-parchment-900/60 border border-parchment-200 dark:border-saffron-900/40 text-xs space-y-1.5 min-h-[4.5rem] flex flex-col justify-center">
            <p class="truncate"><strong class="text-clove-900 dark:text-parchment-100">Harvest & Aging:</strong> <span class="text-clove-800 dark:text-parchment-300">${r.harvest}</span></p>
            <p class="truncate"><strong class="text-clove-900 dark:text-parchment-100">Presentation:</strong> <span class="text-clove-800 dark:text-parchment-300">${r.weight}</span></p>
          </div>

          <div class="border-t border-parchment-200 dark:border-saffron-900/40 pt-3 flex items-center justify-between">
            <div>
              <span class="text-[10px] uppercase font-bold text-clove-800/60 dark:text-parchment-400 block">Cellar Price:</span>
              <span class="font-display font-bold text-xl text-saffron-800 dark:text-saffron-400">₹${r.price.toLocaleString('en-IN')}</span>
            </div>

            <button onclick="quickAddToCart('${targetProductId}'); showToast('Added Rare Reserve allocation to basket!', 'success');" class="px-5 py-2.5 rounded-xl gold-gradient-bg text-white font-bold text-xs shadow hover:scale-105 transition flex items-center gap-2 shrink-0">
              <i class="fa-solid fa-crown text-amber-200"></i>
              <span>Reserve Batch</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  }).join('');

  if (embeddedContainer) embeddedContainer.innerHTML = html;
  if (standaloneContainer) standaloneContainer.innerHTML = html;
}

function setDishPairing(dishType) {
  const container = document.getElementById('dish-pairing-result');
  if (!container) return;

  const pairings = {
    biryani: {
      title: "Royal Awadhi & Dum Biryani Compounding",
      blend: "Hyderabadi Dum Biryani Potli Masala + Kashmiri Mongra Saffron",
      notes: "Infuses delicate floral sweetness from rose petals and high-crocin saffron that perfumes the steam.",
      productIds: ["ms-02", "ws-03"],
      sommelierTip: "Bloom saffron in warm milk with 1 crushed cardamom pod before drizzling over parboiled rice."
    },
    curry: {
      title: "Velvety Shahi Mughlai & Southern Gravies",
      blend: "21-Spice Royal Shahi Garam Masala + Lakadong 8.2% Turmeric",
      notes: "Stone flower (dagad phool) and mace give unmatched earthy depth that binds cashew pastes.",
      productIds: ["ms-01", "pw-01"],
      sommelierTip: "Add Shahi Garam Masala strictly in the final 2 minutes of simmering to preserve volatile top-notes."
    },
    grill: {
      title: "Charred Tandoori & Chettinad Pepper Fry",
      blend: "Chettinad Black Pepper Roast + Banarasi Stuffed Chilli Pickle Oil",
      notes: "Pungent mustard oil marinade tenderizes while coarsely cracked Tellicherry peppercorn forms an unctuous crust.",
      productIds: ["ms-03", "pk-02"],
      sommelierTip: "Rub skewered paneer/cuts in strained pickle oil 30 minutes before charring over glowing coals."
    },
    chai: {
      title: "Vedic Winter Rejuvenation Brew",
      blend: "Vedic Chai Masala with Wild Rose Petals + Ceylon Cinnamon Quills",
      notes: "Soothing natural sweetness, warmth from mountain ginger and true cinnamon (low coumarin).",
      productIds: ["ms-04", "ws-04"],
      sommelierTip: "Simmer crushed spices in water for 3 minutes before adding milk to extract full polyphenols."
    }
  };

  const p = pairings[dishType] || pairings.biryani;

  container.innerHTML = `
    <div class="space-y-2">
      <div class="flex items-center gap-2 text-saffron-800 dark:text-saffron-400 font-bold text-xs">
        <i class="fa-solid fa-wand-magic-sparkles"></i>
        <span>Sommelier Match: ${p.title}</span>
      </div>
      <h4 class="font-heading font-bold text-sm text-clove-900 dark:text-parchment-50">${p.blend}</h4>
      <p class="text-xs text-clove-800/80 dark:text-parchment-300 font-light leading-relaxed">${p.notes}</p>
      
      <div class="p-3 rounded-lg bg-saffron-50 dark:bg-saffron-950/40 border border-saffron-200 dark:border-saffron-800 text-xs text-saffron-900 dark:text-saffron-200 font-medium">
        <i class="fa-solid fa-lightbulb text-saffron-700 dark:text-saffron-400 mr-1"></i> <strong>Pro Tip:</strong> ${p.sommelierTip}
      </div>

      <div class="pt-2 flex justify-end gap-2">
        <button onclick="quickAddToCart('${p.productIds[0]}'); quickAddToCart('${p.productIds[1]}');" class="px-4 py-2 rounded-lg bg-clove-900 hover:bg-saffron-700 dark:bg-saffron-700 dark:hover:bg-saffron-600 text-white font-bold text-xs transition flex items-center gap-1.5">
          <i class="fa-solid fa-plus text-xs"></i>
          <span>Add Pairing Set to Basket</span>
        </button>
      </div>
    </div>
  `;
}

// --- RECIPES CATALOG & STEP-BY-STEP VISUAL MODAL ---
function renderRecipesCatalog() {
  const container = document.getElementById('recipes-catalog-grid');
  if (!container) return;

  container.innerHTML = SPICE_DATA.recipes.map(r => `
    <div class="bg-white dark:bg-[#150D06] rounded-2xl border border-parchment-300 dark:border-parchment-700 overflow-hidden shadow-sm flex flex-col justify-between group h-full">
      
      <div class="relative h-72 overflow-hidden bg-parchment-200 dark:bg-parchment-800 shrink-0">
        <img src="${r.image}" alt="${r.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
        <div class="absolute inset-0 bg-gradient-to-t from-clove-900/90 via-transparent to-transparent"></div>
        <span class="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-clove-900/85 text-saffron-300 backdrop-blur-sm border border-saffron-500/30">${r.category}</span>
        
        <div class="absolute bottom-4 left-4 right-4 text-white">
          <div class="flex flex-wrap items-center gap-4 text-xs text-saffron-200 mb-1">
            <span><i class="fa-regular fa-clock mr-1 text-saffron-400"></i>${r.prepTime} Prep • ${r.cookTime} Cook</span>
            <span><i class="fa-solid fa-utensils mr-1 text-saffron-400"></i>${r.servings} Servings</span>
          </div>
          <h3 class="font-heading font-bold text-xl text-white">${r.title}</h3>
        </div>
      </div>

      <div class="p-6 flex flex-col justify-between flex-grow space-y-4">
        
        <div class="p-3.5 rounded-xl bg-parchment-100 dark:bg-parchment-800/50 border border-parchment-300 dark:border-parchment-700 text-xs text-clove-800 dark:text-parchment-200 space-y-1">
          <div class="flex items-center gap-1.5 font-bold text-saffron-900 dark:text-saffron-300">
            <i class="fa-solid fa-camera text-saffron-700 dark:text-saffron-400"></i>
            <span>Visual Culinary Snapshot:</span>
          </div>
          <p class="text-[11px] text-clove-800/80 dark:text-parchment-300 leading-relaxed font-light">${r.imageExplanation}</p>
        </div>

        <p class="text-xs text-clove-800/70 dark:text-parchment-300 font-light leading-relaxed flex-grow">${r.overview}</p>

        <div>
          <span class="text-[10px] font-bold uppercase tracking-wider text-clove-800/50 dark:text-parchment-400 block mb-1.5">Required SuryaVeda Spices:</span>
          <div class="flex flex-wrap gap-1.5">
            ${r.keySpices.map(id => {
              const spice = SPICE_DATA.products.find(p => p.id === id);
              return spice ? `<span class="px-2 py-1 rounded bg-saffron-50 dark:bg-saffron-950/60 border border-saffron-200 dark:border-saffron-800 text-saffron-900 dark:text-saffron-300 text-[11px] font-semibold">${spice.name.split('(')[0]}</span>` : '';
            }).join('')}
          </div>
        </div>

        <div class="pt-3 border-t border-parchment-200 dark:border-parchment-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-auto">
          <span class="text-xs text-terracotta-700 dark:text-terracotta-400 font-semibold italic"><i class="fa-solid fa-lightbulb text-xs mr-1"></i>${r.pairingTip}</span>
          <button onclick="openRecipeModal('${r.id}')" class="px-4 py-2 bg-clove-900 hover:bg-saffron-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-2 shrink-0 self-end sm:self-auto shadow-sm">
            <span>View Step Images & Method</span>
            <i class="fa-solid fa-arrow-right text-[10px]"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function openRecipeModal(recipeId) {
  const recipe = SPICE_DATA.recipes.find(r => r.id === recipeId);
  if (!recipe) return;

  const modal = document.getElementById('recipe-modal');
  const container = document.getElementById('recipe-modal-content');

  const ingredientsListHTML = recipe.ingredients.map(ing => `
    <li class="flex items-start gap-2 text-xs text-clove-900 dark:text-parchment-100">
      <i class="fa-solid fa-check text-cardamom-700 dark:text-cardamom-400 text-xs mt-0.5"></i>
      <span>${ing}</span>
    </li>
  `).join('');

  const stepsListHTML = recipe.steps.map(step => `
    <div class="p-4 bg-white dark:bg-[#1E140C] rounded-xl border border-parchment-300 dark:border-saffron-900/40 space-y-3">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-saffron-700 text-white font-display font-bold text-xs flex items-center justify-center shrink-0">
          ${step.stepNumber}
        </div>
        <h5 class="font-heading font-bold text-sm text-clove-900 dark:text-parchment-50">${step.title}</h5>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        <div class="sm:col-span-8">
          <p class="text-xs text-clove-800 dark:text-parchment-200 leading-relaxed font-light">${step.instruction}</p>
          <div class="mt-2 text-[11px] text-cardamom-900 dark:text-cardamom-300 font-medium bg-cardamom-50 dark:bg-cardamom-950/60 px-2.5 py-1 rounded border border-cardamom-200 dark:border-cardamom-800">
            <i class="fa-regular fa-image mr-1"></i> ${step.stepCaption}
          </div>
        </div>
        <div class="sm:col-span-4 h-28 rounded-lg overflow-hidden border border-parchment-300 dark:border-saffron-900/40">
          <img src="${step.stepImage}" alt="${step.title}" class="w-full h-full object-cover">
        </div>
      </div>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="space-y-6">
      
      <div class="flex flex-col md:flex-row gap-6 items-start">
        <div class="w-full md:w-80 h-60 rounded-xl overflow-hidden border border-parchment-300 dark:border-saffron-900/40 shrink-0">
          <img src="${recipe.image}" alt="${recipe.title}" class="w-full h-full object-cover">
        </div>
        <div class="space-y-2 flex-grow">
          <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-saffron-100 dark:bg-saffron-950/60 text-saffron-800 dark:text-saffron-300 border border-saffron-300 dark:border-saffron-700">${recipe.category}</span>
          <h2 class="font-heading font-bold text-2xl text-clove-900 dark:text-parchment-50">${recipe.title}</h2>
          
          <div class="p-3 bg-parchment-100 dark:bg-parchment-900/60 rounded-lg border border-parchment-200 dark:border-saffron-900/40 text-xs text-clove-800 dark:text-parchment-200 space-y-0.5">
            <span class="font-bold text-saffron-900 dark:text-saffron-400">Image Description:</span>
            <p class="text-[11px] text-clove-800/80 dark:text-parchment-300 font-light">${recipe.imageExplanation}</p>
          </div>

          <div class="flex flex-wrap gap-4 text-xs text-clove-800/70 dark:text-parchment-400 pt-1">
            <span><i class="fa-regular fa-clock text-saffron-700 dark:text-saffron-400 mr-1"></i>Prep: ${recipe.prepTime}</span>
            <span><i class="fa-solid fa-fire text-terracotta-600 dark:text-terracotta-400 mr-1"></i>Cook: ${recipe.cookTime}</span>
            <span><i class="fa-solid fa-award text-cardamom-700 dark:text-cardamom-400 mr-1"></i>${recipe.difficulty}</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-6 bg-parchment-100 dark:bg-parchment-900/50 p-6 rounded-xl border border-parchment-300 dark:border-saffron-900/40">
        <div class="md:col-span-6 space-y-3">
          <h4 class="font-heading font-bold text-sm text-clove-900 dark:text-parchment-50 uppercase tracking-wider">Culinary Ingredients</h4>
          <ul class="space-y-2">
            ${ingredientsListHTML}
          </ul>
        </div>

        <div class="md:col-span-6 space-y-3 border-t md:border-t-0 md:border-l border-parchment-300 dark:border-saffron-900/40 md:pl-6">
          <h4 class="font-heading font-bold text-sm text-clove-900 dark:text-parchment-50 uppercase tracking-wider">Required SuryaVeda Spices</h4>
          <p class="text-xs text-clove-800/70 dark:text-parchment-400">Add to basket to receive single-estate harvest batches:</p>
          <div class="space-y-2">
            ${recipe.keySpices.map(id => {
              const sp = SPICE_DATA.products.find(p => p.id === id);
              if (!sp) return '';
              return `
                <div class="flex items-center justify-between p-2.5 bg-white dark:bg-[#1E140C] rounded-lg border border-parchment-300 dark:border-saffron-900/40">
                  <div class="flex items-center gap-2.5">
                    <img src="${sp.image}" class="w-9 h-9 rounded object-cover">
                    <div>
                      <h5 class="font-bold text-xs text-clove-900 dark:text-parchment-50">${sp.name.split('(')[0]}</h5>
                      <span class="text-[10px] text-saffron-800 dark:text-saffron-400 font-bold">₹${sp.price} (${sp.weight})</span>
                    </div>
                  </div>
                  <button onclick="quickAddToCart('${sp.id}')" class="px-2.5 py-1 bg-saffron-600 hover:bg-saffron-500 text-white text-[11px] font-bold rounded">
                    + Add
                  </button>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <h4 class="font-heading font-bold text-lg text-clove-900 dark:text-parchment-50">Step-by-Step Cooking Technique & Visual Notes</h4>
        <div class="space-y-3">
          ${stepsListHTML}
        </div>
      </div>

      <div class="p-4 rounded-xl bg-saffron-50 dark:bg-saffron-950/40 border border-saffron-200 dark:border-saffron-800 text-xs text-saffron-900 dark:text-saffron-200 font-semibold flex items-center gap-3">
        <i class="fa-solid fa-crown text-saffron-700 dark:text-saffron-400 text-lg"></i>
        <span>Master Chef Note: ${recipe.pairingTip}</span>
      </div>

    </div>
  `;

  modal.classList.remove('hidden');
}

function closeRecipeModal() {
  document.getElementById('recipe-modal')?.classList.add('hidden');
}

// --- QUICK VIEW MODAL & PRODUCT CTAS ---
function openQuickView(productId) {
  const p = SPICE_DATA.products.find(item => item.id === productId);
  if (!p) return;

  const modal = document.getElementById('quick-view-modal');
  const container = document.getElementById('quick-view-content');

  const aromaPills = p.aromaNotes.map(n => `<span class="aroma-pill px-2.5 py-1 rounded-md text-[11px] font-semibold">${n}</span>`).join('');

  container.innerHTML = `
    <div class="relative h-72 md:h-full bg-parchment-200 dark:bg-parchment-900 overflow-hidden">
      <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover">
      <div class="absolute top-4 left-4 flex flex-col gap-2">
        <span class="px-3 py-1 rounded-full text-xs font-bold bg-clove-900/90 text-saffron-300 backdrop-blur-sm border border-saffron-500/30 shadow">${p.categoryName}</span>
        ${p.isSignature ? '<span class="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/90 text-clove-950 backdrop-blur-sm shadow flex items-center gap-1"><i class="fa-solid fa-crown text-[10px]"></i> Signature Reserve</span>' : ''}
      </div>
      <div class="absolute bottom-4 left-4 right-4 bg-clove-950/80 backdrop-blur-md rounded-xl p-2.5 border border-saffron-500/30 text-white text-[11px] flex items-center justify-between">
        <span class="flex items-center gap-1.5 text-cardamom-300 font-semibold"><i class="fa-solid fa-shield-halved"></i> 100% NABL Lab Verified</span>
        <span class="text-saffron-300 font-bold">Grade A+ Terroir</span>
      </div>
    </div>

    <div class="p-6 sm:p-8 flex flex-col justify-between space-y-4 max-h-[85vh] overflow-y-auto">
      <div class="space-y-3">
        <div class="flex items-center justify-between text-xs">
          <span class="flex items-center gap-1.5 text-saffron-800 dark:text-saffron-400 font-semibold">
            <i class="fa-solid fa-location-dot text-terracotta-600 dark:text-terracotta-400"></i> ${p.origin} • <i class="fa-solid fa-calendar text-cardamom-700 dark:text-cardamom-400"></i> ${p.harvest}
          </span>
          <span class="text-amber-500 dark:text-amber-400 font-bold flex items-center gap-1">
            <i class="fa-solid fa-star text-xs"></i> ${p.rating.toFixed(1)} <span class="text-clove-800/60 dark:text-parchment-400 font-normal">(${p.reviewsCount} reviews)</span>
          </span>
        </div>

        <h2 class="font-heading font-bold text-xl sm:text-2xl text-clove-900 dark:text-parchment-50 leading-tight">${p.name}</h2>

        <p class="text-xs sm:text-sm text-clove-800/80 dark:text-parchment-300 font-light leading-relaxed">${p.description}</p>

        <div>
          <span class="text-[10px] uppercase font-bold text-clove-800/60 dark:text-parchment-400 block mb-1.5 tracking-wider">Aroma Profile & Terroir Notes:</span>
          <div class="flex flex-wrap gap-1.5">
            ${aromaPills}
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3 pt-1">
          <div class="bg-parchment-100 dark:bg-parchment-900/60 p-2.5 rounded-xl border border-parchment-300 dark:border-saffron-900/40 text-xs">
            <span class="font-bold text-clove-900 dark:text-parchment-100 block text-[11px]">Heat Index:</span>
            <span class="font-semibold text-terracotta-600 dark:text-terracotta-400">${p.heatLevel}</span>
          </div>
          <div class="bg-parchment-100 dark:bg-parchment-900/60 p-2.5 rounded-xl border border-parchment-300 dark:border-saffron-900/40 text-xs">
            <span class="font-bold text-clove-900 dark:text-parchment-100 block text-[11px]">Grind / State:</span>
            <span class="font-semibold text-saffron-800 dark:text-saffron-400">${p.category === 'whole-spices' ? 'Whole Botanical' : (p.category === 'pickles-chutneys' ? 'Clay Pot Matured' : 'Cold Stone Pounded')}</span>
          </div>
        </div>
      </div>

      <div class="border-t border-parchment-300 dark:border-saffron-900/40 pt-4 space-y-3">
        <div class="flex items-baseline justify-between">
          <div>
            <span class="text-xs text-clove-800/60 dark:text-parchment-400 block font-medium">Net Weight: ${p.weight}</span>
            <div class="flex items-baseline gap-2">
              <span class="font-display font-bold text-2xl text-saffron-800 dark:text-saffron-400">₹${p.price}</span>
              ${p.originalPrice ? `<span class="text-sm text-clove-800/40 dark:text-parchment-500 line-through">₹${p.originalPrice}</span>` : ''}
            </div>
          </div>
          <span class="text-xs font-semibold text-cardamom-700 dark:text-cardamom-400 bg-cardamom-50 dark:bg-cardamom-950/60 px-2.5 py-1 rounded-md border border-cardamom-200 dark:border-cardamom-800">
            <i class="fa-solid fa-truck-fast mr-1"></i> Ships within 24h
          </span>
        </div>

        <!-- Action-Oriented Buttons -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <button onclick="quickAddToCart('${p.id}'); closeQuickView();" class="w-full py-3 px-4 rounded-xl bg-clove-900 hover:bg-clove-800 dark:bg-saffron-700 dark:hover:bg-saffron-600 text-white font-bold text-xs shadow hover:scale-[1.02] transition flex items-center justify-center gap-2">
            <i class="fa-solid fa-basket-shopping"></i>
            <span>Add to Basket</span>
          </button>
          <button onclick="orderNowProduct('${p.id}')" class="w-full py-3 px-4 rounded-xl gold-gradient-bg text-white font-bold text-xs shadow hover:scale-[1.02] transition flex items-center justify-center gap-2">
            <i class="fa-solid fa-bolt"></i>
            <span>Order Now</span>
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <button onclick="enquireAboutProduct('${p.id}')" class="w-full py-2.5 px-3 rounded-xl border border-saffron-600/40 bg-saffron-50/50 dark:bg-saffron-950/40 hover:bg-saffron-100 dark:hover:bg-saffron-900/60 text-saffron-900 dark:text-saffron-300 font-bold text-[11px] transition flex items-center justify-center gap-1.5">
            <i class="fa-regular fa-comment-dots text-saffron-700 dark:text-saffron-400"></i>
            <span>Enquire About This Spice</span>
          </button>
          <button onclick="bulkEnquireProduct('${p.id}')" class="w-full py-2.5 px-3 rounded-xl border border-parchment-300 dark:border-saffron-900/50 bg-parchment-100 dark:bg-parchment-900/60 hover:bg-parchment-200 dark:hover:bg-parchment-800 text-clove-800 dark:text-parchment-300 font-bold text-[11px] transition flex items-center justify-center gap-1.5">
            <i class="fa-solid fa-boxes-stacked text-terracotta-600 dark:text-terracotta-400"></i>
            <span>Request Bulk / Wholesale</span>
          </button>
        </div>

        <button onclick="closeQuickView(); openProductDetail('${p.id}');" class="w-full py-2.5 px-3 rounded-xl border-2 border-saffron-600/60 hover:border-saffron-600 bg-white dark:bg-[#1E140C] hover:bg-saffron-50 dark:hover:bg-saffron-950/60 text-saffron-800 dark:text-saffron-300 font-bold text-xs transition flex items-center justify-center gap-2 shadow-sm">
          <i class="fa-solid fa-up-right-from-square text-xs text-saffron-600 dark:text-saffron-400"></i>
          <span>View Full Product Page & Botanical Specs</span>
        </button>
      </div>

    </div>
  `;

  modal.classList.remove('hidden');
}

function closeQuickView() {
  document.getElementById('quick-view-modal')?.classList.add('hidden');
}

function orderNowProduct(productId) {
  quickAddToCart(productId);
  closeQuickView();
  toggleCartDrawer(true);
}

function enquireAboutProduct(productId) {
  closeQuickView();
  const p = SPICE_DATA.products.find(item => item.id === productId);
  navigateTo('contact');
  const purposeSelect = document.getElementById('contact-purpose');
  const msgInput = document.getElementById('contact-message');
  if (purposeSelect) {
    purposeSelect.value = 'enquiry';
  }
  if (msgInput && p) {
    msgInput.value = `Hello SuryaVeda Team, I would like to enquire about ${p.name} (${p.weight}, ₹${p.price}). Please share harvest batch availability and culinary pairing guidance.`;
    msgInput.focus();
  }
}

function bulkEnquireProduct(productId) {
  closeQuickView();
  navigateTo('bulk-orders');
  const bulkSelect = document.getElementById('bulk-spice-select');
  if (bulkSelect && productId) {
    bulkSelect.value = productId;
    calculateBulkQuote();
  }
}

// --- BOUTIQUE LOCATIONS RENDERER ---
function renderContactLocations() {
  const container = document.getElementById('contact-locations-list');
  if (!container || !SPICE_DATA.storeInfo.locations) return;

  container.innerHTML = SPICE_DATA.storeInfo.locations.map(loc => `
    <div class="p-5 rounded-2xl bg-white dark:bg-[#1E140C] border border-parchment-300 dark:border-saffron-900/40 space-y-3 h-full flex flex-col justify-between">
      <div class="space-y-1.5">
        <div class="flex items-center justify-between">
          <h4 class="font-bold text-sm text-clove-900 dark:text-parchment-50 flex items-center gap-1.5">
            <i class="fa-solid fa-store text-saffron-700 dark:text-saffron-400"></i> ${loc.city}
          </h4>
          <span class="text-[10px] bg-cardamom-100 dark:bg-cardamom-950/60 text-cardamom-800 dark:text-cardamom-300 font-bold px-2 py-0.5 rounded border border-cardamom-300 dark:border-cardamom-800">${loc.state}</span>
        </div>
        <p class="text-xs text-clove-800/80 dark:text-parchment-300 font-light leading-relaxed">${loc.address}</p>
      </div>
      <div class="text-[11px] text-clove-800/70 dark:text-parchment-400 space-y-1 pt-2 border-t border-parchment-200 dark:border-saffron-900/30 mt-auto">
        <p><i class="fa-solid fa-phone mr-1 text-saffron-700 dark:text-saffron-400"></i> ${loc.phone}</p>
        <p><i class="fa-regular fa-clock mr-1 text-saffron-700 dark:text-saffron-400"></i> ${loc.timing}</p>
      </div>
      <div class="flex flex-wrap gap-1.5 pt-1">
        ${loc.features.map(f => `<span class="text-[10px] bg-parchment-100 dark:bg-parchment-900/60 px-2 py-0.5 rounded border border-parchment-200 dark:border-saffron-900/40 text-clove-800 dark:text-parchment-300">${f}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

// --- REAL-TIME CONTACT FORM VALIDATION ---
function initContactValidation() {
  const nameInput = document.getElementById('contact-name');
  const phoneInput = document.getElementById('contact-phone');
  const nameError = document.getElementById('contact-name-error');
  const phoneError = document.getElementById('contact-phone-error');

  if (nameInput && nameError) {
    const handleNameCheck = () => {
      const val = nameInput.value;
      if (/[0-9]/.test(val)) {
        nameError.classList.remove('hidden');
        nameInput.classList.add('border-red-500', 'bg-red-50/20');
        nameInput.classList.remove('border-parchment-300');
      } else {
        nameError.classList.add('hidden');
        nameInput.classList.remove('border-red-500', 'bg-red-50/20');
        nameInput.classList.add('border-parchment-300');
      }
    };

    ['input', 'keyup', 'change', 'blur'].forEach(evt => {
      nameInput.addEventListener(evt, handleNameCheck);
    });
  }

  if (phoneInput && phoneError) {
    const handlePhoneCheck = () => {
      const val = phoneInput.value;
      if (/[a-zA-Z]/.test(val)) {
        phoneError.classList.remove('hidden');
        phoneInput.classList.add('border-red-500', 'bg-red-50/20');
        phoneInput.classList.remove('border-parchment-300');
      } else {
        phoneError.classList.add('hidden');
        phoneInput.classList.remove('border-red-500', 'bg-red-50/20');
        phoneInput.classList.add('border-parchment-300');
      }
    };

    ['input', 'keyup', 'change', 'blur'].forEach(evt => {
      phoneInput.addEventListener(evt, handlePhoneCheck);
    });
  }
}

// --- CART OFFERS RENDERER ---
function renderCartOffers() {
  const container = document.getElementById('cart-offers-container');
  if (!container || !SPICE_DATA.storeInfo.offers) return;

  container.innerHTML = SPICE_DATA.storeInfo.offers.map(off => `
    <div onclick="applyCouponCode('${off.code}')" class="offer-coupon-card p-2.5 rounded-xl cursor-pointer flex flex-col justify-between">
      <div class="flex items-center justify-between">
        <span class="text-[11px] font-black tracking-wider text-saffron-900 bg-saffron-200/80 px-2 py-0.5 rounded">${off.code}</span>
        <span class="text-[10px] font-bold text-cardamom-800">Apply</span>
      </div>
      <p class="text-[10px] font-semibold text-clove-900 mt-1 line-clamp-1">${off.title}</p>
    </div>
  `).join('');
}

// --- BULK ORDERS CALCULATOR ---
function initBulkCalculator() {
  const select = document.getElementById('bulk-spice-select');
  if (!select) return;

  select.innerHTML = SPICE_DATA.products.map(p => `
    <option value="${p.id}">${p.name} (Retail: ₹${p.price} / ${p.weight})</option>
  `).join('');

  calculateBulkQuote();
}

function calculateBulkQuote() {
  const select = document.getElementById('bulk-spice-select');
  const slider = document.getElementById('bulk-kg-slider');
  const kgDisplay = document.getElementById('bulk-kg-display');
  
  if (!select || !slider) return;

  const kg = parseInt(slider.value, 10);
  kgDisplay.innerText = `${kg} KG`;

  const selectedProduct = SPICE_DATA.products.find(p => p.id === select.value) || SPICE_DATA.products[0];

  const baseRatePerKg = (selectedProduct.price * 4);
  const retailTotal = baseRatePerKg * kg;

  let discountPct = 15;
  if (kg >= 201) discountPct = 45;
  else if (kg >= 51) discountPct = 35;
  else if (kg >= 21) discountPct = 25;
  else discountPct = 15;

  const discountVal = (retailTotal * discountPct) / 100;
  const estimatedWholesale = retailTotal - discountVal;

  document.getElementById('bulk-retail-total').innerText = `₹${retailTotal.toLocaleString('en-IN')}`;
  document.getElementById('bulk-discount-pct').innerText = `${discountPct}%`;
  document.getElementById('bulk-discount-val').innerText = `- ₹${discountVal.toLocaleString('en-IN')}`;
  document.getElementById('bulk-final-quote').innerText = `₹${Math.round(estimatedWholesale).toLocaleString('en-IN')}`;
}

function handleBulkInquirySubmit(e) {
  e.preventDefault();
  showToast("Wholesale sample request dispatched! A SuryaVeda spice sommelier will contact you within 4 hours.", "success");
  e.target.reset();
}

// --- CONTACT & CHECKOUT HANDLERS ---
function handleContactSubmit(e) {
  e.preventDefault();
  
  const nameInput = document.getElementById('contact-name');
  const phoneInput = document.getElementById('contact-phone');
  const nameError = document.getElementById('contact-name-error');
  const phoneError = document.getElementById('contact-phone-error');

  const nameVal = nameInput ? nameInput.value.trim() : '';
  const phoneVal = phoneInput ? phoneInput.value.trim() : '';

  let hasError = false;

  // Validate Name: Only alphabets and spaces
  if (!nameVal) {
    if (nameError) nameError.classList.remove('hidden');
    if (nameInput) nameInput.classList.add('border-red-500', 'bg-red-50/20');
    showToast("Please enter your full name.", "error");
    nameInput?.focus();
    hasError = true;
  } else if (/[0-9]/.test(nameVal)) {
    if (nameError) nameError.classList.remove('hidden');
    if (nameInput) nameInput.classList.add('border-red-500', 'bg-red-50/20');
    showToast("Full Name: Numbers are not applicable. Only alphabets and spaces are allowed.", "error");
    nameInput?.focus();
    hasError = true;
  } else {
    if (nameError) nameError.classList.add('hidden');
    if (nameInput) nameInput.classList.remove('border-red-500', 'bg-red-50/20');
  }

  // Validate Phone: Only numbers (and optional + or spaces)
  if (phoneVal && /[a-zA-Z]/.test(phoneVal)) {
    if (phoneError) phoneError.classList.remove('hidden');
    if (phoneInput) phoneInput.classList.add('border-red-500', 'bg-red-50/20');
    showToast("Mobile Number: Alphabets are not applicable. Only numbers are allowed.", "error");
    phoneInput?.focus();
    hasError = true;
  } else {
    if (phoneError) phoneError.classList.add('hidden');
    if (phoneInput) phoneInput.classList.remove('border-red-500', 'bg-red-50/20');
  }

  if (hasError) return;

  showToast("Your inquiry & checkout confirmation have been received by our Mattancherry concierge!", "success");
  e.target.reset();
  if (nameError) nameError.classList.add('hidden');
  if (phoneError) phoneError.classList.add('hidden');
}

function handleNewsletterSubmit(e) {
  e.preventDefault();
  showToast("Welcome to The Spice Chronicler Guild! Check your inbox for the autumn catalog.", "success");
  e.target.reset();
}

// --- STATEFUL CART CONTROLLER ---
function quickAddToCart(productId) {
  const product = SPICE_DATA.products.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      weight: product.weight,
      qty: 1
    });
  }

  saveCart();
  updateCartUI();
  showToast(`Added "${product.name.split('(')[0]}" to basket!`, "success");
}

function updateCartQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== productId);
  }

  saveCart();
  updateCartUI();
}

function removeCartItem(productId) {
  cart = cart.filter(i => i.id !== productId);
  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem('suryaveda_cart', JSON.stringify(cart));
}

function toggleCartDrawer(open) {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-drawer-backdrop');

  if (!drawer || !backdrop) return;

  if (open) {
    drawer.classList.remove('translate-x-full');
    backdrop.classList.remove('hidden');
  } else {
    drawer.classList.add('translate-x-full');
    backdrop.classList.add('hidden');
  }
}

function updateCartUI() {
  const countBadge = document.getElementById('cart-badge');
  const itemsContainer = document.getElementById('cart-items-list');
  const emptyView = document.getElementById('empty-cart-view');
  const cartFooter = document.getElementById('cart-footer');

  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
  if (countBadge) {
    countBadge.innerText = totalItems;
    if (totalItems > 0) {
      countBadge.classList.remove('hidden');
    } else {
      countBadge.classList.add('hidden');
    }
  }

  if (cart.length === 0) {
    if (emptyView) emptyView.classList.remove('hidden');
    if (itemsContainer) itemsContainer.innerHTML = '';
    if (cartFooter) cartFooter.classList.add('hidden');
    return;
  }

  if (emptyView) emptyView.classList.add('hidden');
  if (cartFooter) cartFooter.classList.remove('hidden');

  // Populate Items
  if (itemsContainer) {
    itemsContainer.innerHTML = cart.map(item => `
      <div class="flex items-center gap-3 p-3 bg-white dark:bg-[#1E140C] rounded-xl border border-parchment-300 dark:border-saffron-900/40 shadow-sm">
        <img src="${item.image}" alt="${item.name}" class="w-14 h-14 rounded-lg object-cover border border-parchment-200 dark:border-saffron-900/40">
        
        <div class="flex-grow space-y-1">
          <h4 class="font-bold text-xs text-clove-900 dark:text-parchment-50 line-clamp-1">${item.name}</h4>
          <span class="text-[10px] text-clove-800/60 dark:text-parchment-400 block">${item.weight}</span>
          <span class="font-display font-bold text-xs text-saffron-800 dark:text-saffron-400">₹${item.price * item.qty}</span>
        </div>

        <div class="flex items-center gap-2 bg-parchment-100 dark:bg-parchment-900/60 rounded-lg p-1 border border-parchment-300 dark:border-saffron-900/40">
          <button onclick="updateCartQty('${item.id}', -1)" class="w-6 h-6 rounded bg-white dark:bg-[#2A190E] text-clove-900 dark:text-parchment-100 hover:bg-saffron-100 dark:hover:bg-saffron-900/60 font-bold text-xs flex items-center justify-center">-</button>
          <span class="text-xs font-bold w-4 text-center text-clove-900 dark:text-parchment-50">${item.qty}</span>
          <button onclick="updateCartQty('${item.id}', 1)" class="w-6 h-6 rounded bg-white dark:bg-[#2A190E] text-clove-900 dark:text-parchment-100 hover:bg-saffron-100 dark:hover:bg-saffron-900/60 font-bold text-xs flex items-center justify-center">+</button>
        </div>

        <button onclick="removeCartItem('${item.id}')" class="text-clove-800/40 dark:text-parchment-400 hover:text-terracotta-600 dark:hover:text-terracotta-400 p-1">
          <i class="fa-solid fa-trash text-xs"></i>
        </button>
      </div>
    `).join('');
  }

  // Calculate Totals & Discounts
  const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
  let discount = 0;
  let giftNotice = "";

  if (activeCoupon === 'HERITAGE10') discount = subtotal * 0.10;
  else if (activeCoupon === 'SPICEMASTER') {
    if (subtotal >= 1200) discount = subtotal * 0.15;
    else showToast("Code SPICEMASTER requires a minimum cart value of ₹1,200.", "error");
  } else if (activeCoupon === 'FESTIVE20') {
    if (subtotal >= 1000) discount = 200;
    else showToast("Code FESTIVE20 requires a minimum cart value of ₹1,000.", "error");
  } else if (activeCoupon === 'BRASSFREE') {
    giftNotice = "Free 100g Antique Brass Tin Jar Added";
  }

  const grandTotal = Math.max(0, subtotal - discount);

  document.getElementById('cart-subtotal').innerText = `₹${subtotal.toLocaleString('en-IN')}`;
  
  const couponRow = document.getElementById('coupon-row');
  if (discount > 0 || giftNotice) {
    couponRow.classList.remove('hidden');
    couponRow.classList.add('flex');
    document.getElementById('cart-discount').innerText = discount > 0 
      ? `- ₹${Math.round(discount).toLocaleString('en-IN')} (${activeCoupon})`
      : `🎁 ${giftNotice}`;
  } else {
    couponRow.classList.add('hidden');
    couponRow.classList.remove('flex');
  }

  document.getElementById('cart-grand-total').innerText = `₹${Math.round(grandTotal).toLocaleString('en-IN')}`;

  // Shipping Progress
  const threshold = SPICE_DATA.storeInfo.freeShippingThreshold;
  const progressPct = Math.min(100, Math.round((subtotal / threshold) * 100));
  const progressText = document.getElementById('shipping-progress-text');
  const progressBar = document.getElementById('shipping-progress-bar');
  const progressPctEl = document.getElementById('shipping-progress-pct');

  if (progressPct >= 100) {
    progressText.innerHTML = `<i class="fa-solid fa-circle-check text-cardamom-600"></i> Free Express Heritage Dispatch Unlocked!`;
    progressBar.style.width = '100%';
    progressPctEl.innerText = '100%';
  } else {
    const diff = threshold - subtotal;
    progressText.innerText = `Add ₹${diff} more for Free Express Dispatch`;
    progressBar.style.width = `${progressPct}%`;
    progressPctEl.innerText = `${progressPct}%`;
  }
}

function applyCoupon() {
  const code = (document.getElementById('coupon-input')?.value || '').toUpperCase().trim();
  applyCouponCode(code);
}

function applyCouponCode(code) {
  if (['HERITAGE10', 'SPICEMASTER', 'FESTIVE20', 'BRASSFREE'].includes(code)) {
    activeCoupon = code;
    localStorage.setItem('suryaveda_active_coupon', code);
    const inp = document.getElementById('coupon-input');
    if (inp) inp.value = code;
    showToast(`Harvest Offer code ${code} applied successfully!`, "success");
    updateCartUI();
  } else {
    showToast("Invalid promo code. Click on any of the offers above!", "error");
  }
}

// --- CHECKOUT REDIRECT TO CONTACT PAGE WITH PRE-FILLED CART SUMMARY ---
function triggerCheckoutRedirect() {
  if (cart.length === 0) {
    showToast("Your spice basket is empty. Please add some spices first.", "error");
    return;
  }

  // Build structured order summary
  const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
  let discount = 0;
  if (activeCoupon === 'HERITAGE10') discount = subtotal * 0.10;
  else if (activeCoupon === 'SPICEMASTER' && subtotal >= 1200) discount = subtotal * 0.15;
  else if (activeCoupon === 'FESTIVE20' && subtotal >= 1000) discount = 200;

  const grandTotal = Math.max(0, subtotal - discount);

  const itemsListText = cart.map((item, idx) => `  ${idx + 1}. ${item.name} (${item.weight}) x ${item.qty} = ₹${item.price * item.qty}`).join('\n');

  const orderSummaryText = `👑 HERITAGE CONCIERGE CHECKOUT REQUEST
=========================================
Selected Spices & Masalas:
${itemsListText}

Subtotal: ₹${subtotal.toLocaleString('en-IN')}
Promo Code: ${activeCoupon || 'None'} ${discount > 0 ? `(- ₹${Math.round(discount).toLocaleString('en-IN')})` : ''}
Estimated Grand Total: ₹${Math.round(grandTotal).toLocaleString('en-IN')}
Delivery Type: Insured Express Dispatch

-----------------------------------------
Shipping Address & Delivery Notes:
[Please confirm your full delivery street address, city, pincode, and any custom grinding coarseness instructions here]`;

  // 1. Close cart drawer
  toggleCartDrawer(false);

  // 2. Navigate to Contact page
  navigateTo('contact');

  // 3. Pre-fill contact form
  setTimeout(() => {
    const purposeSelect = document.getElementById('contact-purpose');
    const messageTextarea = document.getElementById('contact-message');

    if (purposeSelect) purposeSelect.value = 'checkout';
    if (messageTextarea) {
      messageTextarea.value = orderSummaryText;
      messageTextarea.focus();
    }

    const formEl = document.getElementById('main-contact-form');
    if (formEl) formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 200);

  showToast("Basket transferred to Concierge Desk! Please confirm your contact details below.", "success");
}

// --- TOAST NOTIFICATIONS ---
function showToast(message, type = "info") {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const isSuccess = type === "success";
  
  toast.className = `toast-item p-4 rounded-xl shadow-xl border text-xs flex items-center gap-3 backdrop-blur-md ${
    isSuccess 
      ? 'bg-cardamom-900/95 text-parchment-50 border-cardamom-600' 
      : 'bg-terracotta-900/95 text-parchment-50 border-terracotta-600'
  }`;

  toast.innerHTML = `
    <i class="fa-solid ${isSuccess ? 'fa-circle-check text-cardamom-400' : 'fa-triangle-exclamation text-terracotta-400'} text-base"></i>
    <span class="flex-grow font-medium leading-snug">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// --- BESPOKE ROYAL GIFT CRATE STUDIO ---
let currentCrateBox = {
  id: 'teakwood',
  name: 'Malabar Teakwood Chest with Brass Latches',
  price: 1850
};

function initGiftingStudio() {
  updateCrateCalculation();
}

function selectCrateBox(boxId, price, name) {
  currentCrateBox = { id: boxId, price: price, name: name };
  
  // Highlight active box
  document.querySelectorAll('.crate-box-card').forEach(card => {
    card.classList.remove('border-2', 'border-saffron-600', 'bg-saffron-50/50', 'dark:bg-saffron-950/40');
    card.classList.add('border', 'border-parchment-300', 'dark:border-parchment-700', 'bg-white', 'dark:bg-[#150D06]');
  });
  
  const activeCard = document.getElementById(`crate-opt-${boxId}`);
  if (activeCard) {
    activeCard.classList.remove('border-parchment-300', 'dark:border-parchment-700', 'bg-white', 'dark:bg-[#150D06]');
    activeCard.classList.add('border-2', 'border-saffron-600', 'bg-saffron-50/50', 'dark:bg-saffron-950/40');
  }

  updateCrateCalculation();
}

function updateEngravingPreview(val) {
  const preview = document.getElementById('live-engraving-preview');
  if (preview) {
    preview.innerText = (val && val.trim().length > 0) ? val.toUpperCase() : 'CURATED FOR CHEF VIKRAM SINGHANIA';
  }
}

function updateCrateCalculation() {
  const spice1Select = document.getElementById('crate-spice-1');
  const spice2Select = document.getElementById('crate-spice-2');
  const spice3Select = document.getElementById('crate-spice-3');

  if (!spice1Select || !spice2Select || !spice3Select) return;

  const [id1, name1, price1] = spice1Select.value.split('|');
  const [id2, name2, price2] = spice2Select.value.split('|');
  const [id3, name3, price3] = spice3Select.value.split('|');

  const p1 = parseInt(price1) || 450;
  const p2 = parseInt(price2) || 380;
  const p3 = parseInt(price3) || 480;
  const boxPrice = currentCrateBox.price || 1850;

  // Update Slot Labels
  const slot1El = document.getElementById('slot-1-price');
  const slot2El = document.getElementById('slot-2-price');
  const slot3El = document.getElementById('slot-3-price');
  if (slot1El) slot1El.innerText = `₹${p1}`;
  if (slot2El) slot2El.innerText = `₹${p2}`;
  if (slot3El) slot3El.innerText = `₹${p3}`;

  // Update Summary Card
  const sumCrateName = document.getElementById('summary-crate-name');
  const sumCratePrice = document.getElementById('summary-crate-price');
  const sumSpice1Name = document.getElementById('summary-spice-1-name');
  const sumSpice1Price = document.getElementById('summary-spice-1-price');
  const sumSpice2Name = document.getElementById('summary-spice-2-name');
  const sumSpice2Price = document.getElementById('summary-spice-2-price');
  const sumSpice3Name = document.getElementById('summary-spice-3-name');
  const sumSpice3Price = document.getElementById('summary-spice-3-price');
  const sumTotal = document.getElementById('summary-crate-total');

  if (sumCrateName) sumCrateName.innerText = currentCrateBox.name;
  if (sumCratePrice) sumCratePrice.innerText = `₹${boxPrice}`;
  if (sumSpice1Name) sumSpice1Name.innerText = name1;
  if (sumSpice1Price) sumSpice1Price.innerText = `₹${p1}`;
  if (sumSpice2Name) sumSpice2Name.innerText = name2;
  if (sumSpice2Price) sumSpice2Price.innerText = `₹${p2}`;
  if (sumSpice3Name) sumSpice3Name.innerText = name3;
  if (sumSpice3Price) sumSpice3Price.innerText = `₹${p3}`;

  const grandTotal = boxPrice + p1 + p2 + p3;
  if (sumTotal) sumTotal.innerText = `₹${grandTotal.toLocaleString('en-IN')}`;
}

function addCustomCrateToCart() {
  const spice1Select = document.getElementById('crate-spice-1');
  const spice2Select = document.getElementById('crate-spice-2');
  const spice3Select = document.getElementById('crate-spice-3');
  const engravingInput = document.getElementById('engraving-text-input');
  const giftMsgInput = document.getElementById('gift-card-message');

  const [id1, name1, price1] = (spice1Select?.value || 'ws-01|Tellicherry TGSEB Black Pepper|450').split('|');
  const [id2, name2, price2] = (spice2Select?.value || 'pw-01|Lakadong High-Curcumin Turmeric|380').split('|');
  const [id3, name3, price3] = (spice3Select?.value || 'ms-01|Imperial Lucknowi Garam Masala|480').split('|');

  const engraving = engravingInput?.value.trim() || 'Curated for Esteemed Patron';
  const giftMsg = giftMsgInput?.value.trim() || '';

  const grandTotal = currentCrateBox.price + parseInt(price1) + parseInt(price2) + parseInt(price3);

  const customCrateItem = {
    id: `custom-crate-${Date.now()}`,
    name: `Bespoke Crate: ${currentCrateBox.name}`,
    price: grandTotal,
    quantity: 1,
    weight: '3 x 150g Harvest Trio',
    customNotes: `Engraving: "${engraving}" | Trio: [${name1}, ${name2}, ${name3}]${giftMsg ? ` | Card: "${giftMsg}"` : ''}`,
    image: 'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?auto=format&fit=crop&w=600&q=80'
  };

  cart.push(customCrateItem);
  saveCart();
  updateCartUI();
  toggleCartDrawer(true);
  showToast(`Added Bespoke "${currentCrateBox.name}" with personalized brass seal to basket!`, "success");
}

// --- NABL LAB PURITY CERTIFICATE VERIFICATION DATABASE & CONTROLLER ---
const purityBatchDatabase = {
  'SV-2025-LK08': {
    batchNumber: 'SV-2025-LK08',
    productName: 'Lakadong High-Curcumin Turmeric Powder',
    estate: 'Jaintia Hills Organic Co-op, Meghalaya',
    coordinates: '25.5788° N, 92.2033° E',
    elevation: '1,450 meters ASL',
    harvestDate: 'December 2024 / Sun-Cured Jan 2025',
    millingDate: 'February 2025 (< 34°C Cold Stone Pounded)',
    nablReportId: 'NABL/CHEM/2025/SV-89240-B',
    testedLab: 'Export Inspection Council & NABL Apex Agro Lab (Kochi, KL)',
    purityScore: '100.0% Pure / Grade 1 Imperial',
    bioactives: [
      { name: 'Active Curcuminoid Assay (HPLC)', value: '8.42%', benchmark: 'Industry Standard: 2.0% – 3.0%', status: 'Exceptional (3.8x Potency)' },
      { name: 'Volatile Essential Oil Fraction', value: '6.85% v/w', benchmark: 'Standard: 3.5%', status: 'Ultra High Terroir Volatiles' },
      { name: 'Moisture Content', value: '7.8% (Target < 10%)', benchmark: 'Safe Limit: < 12%', status: 'Optimum Preservation' }
    ],
    safetyScreens: [
      { test: 'Lead (Pb) & Heavy Metals', result: '0.00 ppm (Not Detected)', threshold: 'Permitted: < 2.5 ppm', status: 'CLEARED' },
      { test: 'Sudan Dye I, II, III, IV', result: 'Zero / Not Detected', threshold: 'Zero Tolerance (0.00%)', status: 'PASSED' },
      { test: 'Metanil Yellow & Chromate', result: 'Negative (100% Free)', threshold: 'Zero Tolerance', status: 'PASSED' },
      { test: 'Synthetic Pesticide Residues (280+ Screen)', result: 'Below Quantification Limit (BQL)', threshold: 'APEDA Organic Norm', status: '100% ORGANIC' }
    ]
  },
  'SV-2025-KP01': {
    batchNumber: 'SV-2025-KP01',
    productName: 'Tellicherry Garbled Extra Bold (TGSEB) Black Pepper',
    estate: 'Palaniswamy Family Terroir, Wayanad Foothills',
    coordinates: '11.8745° N, 75.8456° E',
    elevation: '1,120 meters ASL',
    harvestDate: 'January 2025 / Vine-Ripened',
    millingDate: 'Whole Berry Sun-Garbled / Hand-Sorted',
    nablReportId: 'NABL/AGRI/2025/SV-77192-A',
    testedLab: 'Spices Board India Quality Evaluation Centre, Kochi',
    purityScore: '100.0% Pure / TGSEB 4.75mm Grade',
    bioactives: [
      { name: 'Active Piperine Alkaloid Level', value: '7.15%', benchmark: 'Industry Standard: 3.5% – 4.5%', status: 'Top 1% Global Harvest' },
      { name: 'Steam Volatile Pepper Essential Oil', value: '4.80% v/w', benchmark: 'Standard: 2.5%', status: 'Rich Citrus-Pine Bouquet' },
      { name: 'Bulk Density', value: '585 g/L', benchmark: 'Grade A Norm: > 550 g/L', status: 'Super Heavy Extra Bold' }
    ],
    safetyScreens: [
      { test: 'Papaya Seed / Adulterant Scan', result: 'Zero (Microscopy Negative)', threshold: 'Zero Tolerance', status: 'PASSED' },
      { test: 'Aflatoxin B1, B2, G1, G2', result: 'Below 0.5 ppb', threshold: 'Permitted: < 10 ppb', status: 'CLEARED' },
      { test: 'Mineral Oil Glazing', result: 'Zero / Natural Sun Luster', threshold: 'Zero Tolerance', status: 'PASSED' },
      { test: 'Pesticide & Synthetic Chemical Residues', result: 'Zero Detected', threshold: 'EU / USDA Bio Norms', status: '100% PURE' }
    ]
  },
  'SV-2025-WP04': {
    batchNumber: 'SV-2025-WP04',
    productName: 'Wayanad High-Elevation Green Cardamom',
    estate: 'Meppadi High Range Estate, Wayanad, Kerala',
    coordinates: '11.5512° N, 76.1264° E',
    elevation: '1,380 meters ASL',
    harvestDate: 'November 2024 / Hand Plucked at Peak Sap',
    millingDate: 'Slow Wood-Fired Flue Cured (42°C)',
    nablReportId: 'NABL/HERB/2025/SV-61029-C',
    testedLab: 'Cardamom Research Station & Spices Board Analytical Lab',
    purityScore: '100.0% Pure / 8mm Jumbo Pods',
    bioactives: [
      { name: '1,8-Cineole & Terpinyl Acetate Ratio', value: '8.92% Total Oil', benchmark: 'Standard: 5.0% – 6.5%', status: 'Pungent Sweet Floral Balance' },
      { name: 'Pod Diameter', value: '8.4 mm Average', benchmark: 'Jumbo Class: > 8.0 mm', status: 'Super Extra Bold' },
      { name: 'Chlorophyll Retention Index', value: '94.2% Vivid Emerald', benchmark: 'No Artificial Dyes', status: 'Natural Flue Green' }
    ],
    safetyScreens: [
      { test: 'Malachite Green / Artificial Tinting', result: 'Not Detected (Negative)', threshold: 'Zero Tolerance', status: 'PASSED' },
      { test: 'Heavy Metal Profile', result: 'Undetectable (<0.01 ppm)', threshold: 'Permitted: < 2.0 ppm', status: 'CLEARED' },
      { test: 'Sulfur Dioxide Bleaching Scan', result: '0.00 ppm (Unbleached)', threshold: 'Zero Permitted', status: 'PASSED' },
      { test: 'Microbial & Salmonella Screen', result: 'Negative / Sterility Pass', threshold: 'FSSAI Strict Protocol', status: 'PASSED' }
    ]
  },
  'SV-2025-KS02': {
    batchNumber: 'SV-2025-KS02',
    productName: 'Grand Imperial Kashmiri Mongra Saffron Ingot',
    estate: 'Pampore Karewa Plateaus, Kashmir Valley',
    coordinates: '34.0182° N, 74.9310° E',
    elevation: '1,650 meters ASL',
    harvestDate: 'October 2024 / Autumn Crocus Dawn Harvest',
    millingDate: 'Pure Red Stigma Garbled (Zero Style/Yellow Waste)',
    nablReportId: 'NABL/SAFF/2025/SV-99411-K',
    testedLab: 'Kashmir Saffron Park Quality Assessment Lab & CSIR-IIIM',
    purityScore: '100.0% Pure / ISO 3632 Category I Super Grade',
    bioactives: [
      { name: 'Crocin (Coloring Potency Strength)', value: '268.4 pts', benchmark: 'ISO Cat I Standard: > 190 pts', status: 'World-Leading Vivid Crimson' },
      { name: 'Safranal (Aroma Potency)', value: '48.6 pts', benchmark: 'ISO Cat I Standard: 20 – 50 pts', status: 'Rich Honey-Hay Notes' },
      { name: 'Picrocrocin (Bitterness Index)', value: '96.2 pts', benchmark: 'ISO Cat I Standard: > 70 pts', status: 'Authentic Medicinal Grade' }
    ],
    safetyScreens: [
      { test: 'Safflower / Beetroot / Tartrazine Adulteration', result: 'Zero Detected (100% Pure Stigmas)', threshold: 'Zero Tolerance', status: 'PASSED' },
      { test: 'Glycerine & Weight-Loading Oils', result: 'Zero / Completely Dry & Crisp', threshold: 'Zero Tolerance', status: 'PASSED' },
      { test: 'Moisture Volatile Assay', result: '6.4% (Optimum Curing)', threshold: 'Max Permitted: 10%', status: 'PASSED' },
      { test: 'DNA Barcode Terroir Verification', result: 'Crocus Sativus L. Confirmed', threshold: '100% Genetic Match', status: 'AUTHENTICATED' }
    ]
  }
};

function quickTestBatch(code) {
  const input = document.getElementById('purity-batch-input');
  if (input) input.value = code;
  verifyBatchLot(code);
}

function verifyBatchLot(batchCode) {
  const code = (batchCode || 'SV-2025-LK08').trim().toUpperCase();
  const report = purityBatchDatabase[code] || generateFallbackBatch(code);
  const container = document.getElementById('purity-result-card');
  if (!container) return;

  container.innerHTML = `
    <!-- Top Verified Banner -->
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-parchment-300 dark:border-saffron-900/40">
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full bg-cardamom-100 dark:bg-cardamom-900/60 text-cardamom-800 dark:text-cardamom-200 text-[10px] font-black uppercase tracking-wider border border-cardamom-300">
            <i class="fa-solid fa-circle-check text-cardamom-600 mr-1"></i> Certified NABL Lab Authenticated
          </span>
          <span class="font-mono text-xs font-bold text-saffron-800 dark:text-saffron-400">LOT: ${report.batchNumber}</span>
        </div>
        <h3 class="font-display font-black text-2xl sm:text-3xl text-clove-900 dark:text-parchment-50">${report.productName}</h3>
        <p class="text-xs text-clove-800/70 dark:text-parchment-300 flex items-center gap-1.5 pt-0.5">
          <i class="fa-solid fa-location-dot text-saffron-600"></i> ${report.estate} (${report.coordinates}) • Elev: ${report.elevation}
        </p>
      </div>

      <div class="flex items-center gap-3">
        <div class="text-right">
          <span class="text-[10px] font-bold text-clove-800/60 dark:text-parchment-400 block uppercase">Purity Score</span>
          <span class="text-lg font-black text-cardamom-700 dark:text-cardamom-400 font-display">${report.purityScore}</span>
        </div>
        <button onclick="downloadCertificate('${report.batchNumber}')" class="px-4 py-2.5 rounded-xl bg-parchment-200 hover:bg-saffron-100 text-clove-900 border border-parchment-300 text-xs font-bold flex items-center gap-1.5 transition">
          <i class="fa-solid fa-file-pdf text-terracotta-600"></i>
          <span>Download COA</span>
        </button>
      </div>
    </div>

    <!-- 2 COLUMN TEST METRICS -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      <!-- COLUMN 1: BIOACTIVE POTENCY ASSAY -->
      <div class="space-y-4">
        <h4 class="font-heading font-black text-sm text-clove-900 dark:text-parchment-100 uppercase tracking-wider flex items-center gap-2">
          <i class="fa-solid fa-atom text-saffron-600"></i>
          Bioactive Compounds & Terroir Potency
        </h4>

        <div class="space-y-3">
          ${report.bioactives.map(b => `
            <div class="p-4 rounded-2xl bg-parchment-50 dark:bg-[#150D06] border border-parchment-300 dark:border-parchment-700 space-y-1.5">
              <div class="flex justify-between items-center text-xs font-bold">
                <span class="text-clove-900 dark:text-parchment-50">${b.name}</span>
                <span class="text-saffron-800 dark:text-saffron-400 font-display text-sm font-black">${b.value}</span>
              </div>
              <div class="flex justify-between items-center text-[10px] text-clove-800/60 dark:text-parchment-400">
                <span>${b.benchmark}</span>
                <span class="text-cardamom-700 dark:text-cardamom-400 font-bold">${b.status}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- COLUMN 2: SAFETY & CONTAMINANT SCREENS -->
      <div class="space-y-4">
        <h4 class="font-heading font-black text-sm text-clove-900 dark:text-parchment-100 uppercase tracking-wider flex items-center gap-2">
          <i class="fa-solid fa-shield-virus text-cardamom-600"></i>
          Chemical & Contaminant Safety Screen
        </h4>

        <div class="space-y-3">
          ${report.safetyScreens.map(s => `
            <div class="p-4 rounded-2xl bg-parchment-50 dark:bg-[#150D06] border border-parchment-300 dark:border-parchment-700 flex items-center justify-between">
              <div>
                <span class="text-xs font-bold text-clove-900 dark:text-parchment-50 block">${s.test}</span>
                <span class="text-[10px] text-clove-800/60 dark:text-parchment-400">${s.result} • ${s.threshold}</span>
              </div>
              <span class="px-2.5 py-1 rounded-full bg-cardamom-100 dark:bg-cardamom-950/60 text-cardamom-800 dark:text-cardamom-300 text-[10px] font-black tracking-wider border border-cardamom-400">
                ${s.status}
              </span>
            </div>
          `).join('')}
        </div>
      </div>

    </div>

    <!-- HARVEST & CUSTODY FOOTER -->
    <div class="p-4 sm:p-6 rounded-2xl bg-saffron-50 dark:bg-saffron-950/40 border border-saffron-300 dark:border-saffron-800 text-xs grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div>
        <span class="text-[10px] uppercase font-bold text-saffron-800 dark:text-saffron-400 block">Harvest Period</span>
        <span class="font-semibold text-clove-900 dark:text-parchment-100">${report.harvestDate}</span>
      </div>
      <div>
        <span class="text-[10px] uppercase font-bold text-saffron-800 dark:text-saffron-400 block">Processing Method</span>
        <span class="font-semibold text-clove-900 dark:text-parchment-100">${report.millingDate}</span>
      </div>
      <div>
        <span class="text-[10px] uppercase font-bold text-saffron-800 dark:text-saffron-400 block">Audited NABL Lab</span>
        <span class="font-semibold text-clove-900 dark:text-parchment-100">${report.testedLab}</span>
      </div>
    </div>
  `;
}

function generateFallbackBatch(batchCode) {
  return {
    batchNumber: batchCode,
    productName: 'SuryaVeda Single-Estate Artisan Lot',
    estate: 'Mattancherry Spice Reserve Partner Farm',
    coordinates: '09.9572° N, 76.2577° E',
    elevation: '920 meters ASL',
    harvestDate: 'Winter Harvest 2024-2025',
    millingDate: 'Cold Pounded Stone Milling (<35°C)',
    nablReportId: `NABL/GEN/2025/${batchCode}`,
    testedLab: 'Spices Board India Quality Evaluation Centre, Kochi',
    purityScore: '100.0% Pure / Single Estate Certified',
    bioactives: [
      { name: 'Essential Oil Potency Index', value: '5.62%', benchmark: 'Standard: 3.0%', status: 'High Terroir Assay' },
      { name: 'Moisture Volatiles Assay', value: '7.2%', benchmark: 'Max: 10.0%', status: 'Optimal Crispness' }
    ],
    safetyScreens: [
      { test: 'Synthetic Dyes & Adulterants', result: 'Zero Detected', threshold: 'Zero Tolerance', status: 'PASSED' },
      { test: 'Heavy Metal ICP-MS Profile', result: '0.00 ppm (Clean)', threshold: 'Below Limits', status: 'CLEARED' }
    ]
  };
}

function downloadCertificate(batchNumber) {
  showToast(`Generating and downloading cryptographic NABL Certificate of Analysis for Lot ${batchNumber}...`, "success");
}

// =========================================================================
// DEDICATED PRODUCT DETAIL VIEW SYSTEM (STICKY HEADER GUARANTEED)
// =========================================================================

let currentDetailQuantity = 1;

function getBotanicalMetadata(p) {
  const map = {
    'ws-01': { latin: 'Piper nigrum', grade: 'Tellicherry Garbled Special Extra Bold (TGSEB > 4.75mm)', active: 'Piperine 5.8% (Benchmark > 4.0%)', moisture: '8.4% Volatiles Intact', shelfLife: '24 Months (Aroma-Lock Glass)' },
    'ws-02': { latin: 'Elettaria cardamomum', grade: 'Alleppey Green Supreme Extra Bold (8.0mm+)', active: '1,8-Cineole & Terpinyl Acetate 8.4%', moisture: '7.9% Sun Dried', shelfLife: '24 Months (Aroma Tin)' },
    'ws-03': { latin: 'Crocus sativus', grade: 'Kashmiri Mongra ISO 3632 Category I', active: 'Crocin 265 / Safranal 42 / Picrocrocin 98', moisture: '6.2% Shade Cured', shelfLife: '36 Months (Velvet Ingot)' },
    'ws-04': { latin: 'Cinnamomum verum', grade: 'Alba Supreme Quills (Pencil Thin < 6mm)', active: 'Cinnamaldehyde 74% / Eugenol 11%', moisture: '9.1% Low Humidity', shelfLife: '36 Months (Aroma Tin)' },
    'ws-05': { latin: 'Cuminum cyminum', grade: 'Nagaur Unpolished Sortex Bold', active: 'Cuminaldehyde 3.8% Essential Oils', moisture: '6.8% Desert Sun Matured', shelfLife: '18 Months' },
    'ws-06': { latin: 'Illicium verum', grade: 'Arunachal Forest Whole 8-Point Star', active: 'Anethole 88% Pure Volatiles', moisture: '8.2% Mountain Cured', shelfLife: '24 Months' },
    'pw-01': { latin: 'Curcuma longa (Lakadong)', grade: 'Cold Pounded Rhizome Micron (<150μm)', active: 'Curcumin 7.8% (Standard commercial 2%)', moisture: '7.1% Lab Verified', shelfLife: '24 Months' },
    'pw-02': { latin: 'Capsicum annuum (Byadagi)', grade: 'Sun-Drenched Stemless Wrinkled Deep Pod', active: 'Capsanthin Colour Index 150+ ASTA / Low Heat', moisture: '8.0% Stone Ground', shelfLife: '18 Months' },
    'pw-03': { latin: 'Coriandrum sativum', grade: 'Ramganj Mandi Eagle Bold Whole Ground', active: 'Linalool 68% Sweet Floral Essential Oil', moisture: '7.5% Cold Milled', shelfLife: '18 Months' },
    'pw-04': { latin: 'Zingiber officinale', grade: 'Wayanad Riverbed Low-Fibre Sun Rhizome', active: 'Gingerols & Shogaols 4.2%', moisture: '7.8% Crisp Stone Powder', shelfLife: '24 Months' },
    'pw-05': { latin: 'Trachyspermum ammi', grade: 'Desert Winter Harvest Sortex Pods', active: 'Thymol 48% Antiseptic Carminative Assay', moisture: '6.5% Crisp Seed', shelfLife: '24 Months' },
    'ms-01': { latin: 'Heritage 21-Botanical Compounding', grade: 'Royal Awadhi Court Formulation (1924)', active: 'Cold-packed within 48h / Zero aroma decay', moisture: '6.9% Stone Pounded', shelfLife: '12 Months' },
    'ms-02': { latin: 'Heritage Nizami 18-Spice Blend', grade: 'Hyderabad Deg Royal Formulation', active: 'Star Anise, Shahi Jeera, Mace, Ceylon Cinn.', moisture: '7.2% Cold Roasted', shelfLife: '12 Months' },
    'ms-03': { latin: 'Heritage Chettinad 16-Spice Blend', grade: 'Karaikudi Stone Mortar Roasted', active: 'Kalpasi (Stone Flower), Marathi Moggu, Peppercorn', moisture: '7.0% Hand Roasted', shelfLife: '12 Months' },
    'ms-04': { latin: 'Heritage Kashmiri 12-Spice Blend', grade: 'Srinagar Wazwan Royal Compounding', active: 'Fennel Flower, Kashmiri Chilli, Saffron Threads', moisture: '7.4% Sun Ground', shelfLife: '12 Months' },
    'ms-05': { latin: 'Traditional Madras Golden Curry', grade: 'Tamil Nadu Heritage 14-Spice Blend', active: 'Lakadong Turmeric, Coriander, Tellicherry Pepper', moisture: '7.1% Stone Ground', shelfLife: '18 Months' },
    'bl-01': { latin: 'Chai Masala 7-Botanical Blend', grade: 'Ginger-Cardamom Estate Cold Blend', active: 'Clove, Cinnamon, Black Pepper, Nutmeg', moisture: '6.8% Micro-Crushed', shelfLife: '18 Months' },
    'bl-02': { latin: 'Royal Awadhi Tandoori Tikka Rub', grade: 'Lucknow Barbecue Herb & Seed Marinade', active: 'Smoked Chilli, Coriander, Brown Cardamom, Kasuri Methi', moisture: '7.0% Coarse Grind', shelfLife: '18 Months' },
    'bl-03': { latin: 'Panch Phoran 5-Seed Whole Blend', grade: 'Bengal Traditional Whole Seasoning', active: 'Cumin, Brown Mustard, Fenugreek, Nigella, Fennel', moisture: '6.6% Sun Dried', shelfLife: '24 Months' },
    'pk-01': { latin: 'Mangifera indica with Mustard Oil', grade: 'Avakaya Sun-Matured Cold Pressed', active: 'Guntur Chilli, Fenugreek, Wood-Pressed Mustard Oil', moisture: 'Traditional Salt & Oil Cured', shelfLife: '24 Months (Barni Jar)' },
    'pk-02': { latin: 'Citrus aurantiifolia & Rock Salt', grade: 'Kala Namak & Ajwain Sun-Matured', active: 'Thin Skin Kagzi Lime, Zero Preservatives', moisture: 'Sun-Fermented in Glass', shelfLife: '36 Months' },
    'pk-03': { latin: 'Allium sativum with Red Chilli', grade: 'Lahsun Lahori Mustard Relish', active: 'Whole Mountain Garlic, Kalonji, Methi Seed', moisture: 'Wood-Pressed Mustard Oil Cured', shelfLife: '24 Months' },
    'ch-01': { latin: 'Tamarindus indica & Deglet Dates', grade: 'Slow-Simmered Jaggery Reduction', active: 'Coarse Roasted Cumin, Black Salt, Saunth Ginger', moisture: 'Thick Glossy Chutney', shelfLife: '12 Months (Refrigerate)' },
    'ch-02': { latin: 'Cocos nucifera & Mint-Coriander', grade: 'Fresh Stone Mortar Podi Compound', active: 'Roasted Gram, Green Chilli, Curry Leaf, Asafoetida', moisture: 'Fresh Compounded Powder', shelfLife: '9 Months' },
    'df-01': { latin: 'Prunus dulcis (Mamra)', grade: 'Kashmiri Heritage Wild Orchard Mamra', active: '100% Single-Tree Cold Oil Yield > 50%', moisture: '5.2% Sun Dried in Shell', shelfLife: '18 Months' },
    'df-02': { latin: 'Carum carvi & Nigella sativa', grade: 'Connoisseur Whole Seed Duo', active: 'Thymoquinone & Carvone Potency Assay', moisture: '6.4% Triple Cleaned', shelfLife: '24 Months' },
    'sp-01': { latin: 'Piper nigrum (Ancient Vine 100yr)', grade: 'Single Barrel Reserve Limited Harvest', active: 'Piperine 6.2% High Density Terroir', moisture: '8.1% Hand Sorted', shelfLife: '36 Months' },
    'sp-02': { latin: 'Crocus sativus (Royal Ingot)', grade: 'Grade A1+ Imperial Presentation', active: 'Crocin 280+ Super Mongra Lab Certified', moisture: '5.8% Velvet Case Stored', shelfLife: '36 Months' }
  };

  return map[p.id] || {
    latin: `${p.name} Botanica`,
    grade: 'Single-Estate Hand-Selected Grade A+',
    active: 'Standard Essential Oils & Bioactives Intact',
    moisture: 'Optimal Crispness Lab Tested',
    shelfLife: '24 Months'
  };
}

function openProductDetail(productId) {
  const p = SPICE_DATA.products.find(item => item.id === productId);
  if (!p) {
    showToast("Product not found.", "error");
    return;
  }

  currentDetailQuantity = 1;

  // Navigate to product detail SPA view
  navigateTo('product-detail');
  window.history.replaceState(null, null, `#product?id=${p.id}`);

  const container = document.getElementById('product-detail-container');
  if (!container) return;

  const meta = getBotanicalMetadata(p);
  const aromaPills = p.aromaNotes.map(n => `
    <span class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-saffron-100/80 dark:bg-saffron-950/60 text-saffron-900 dark:text-saffron-300 border border-saffron-300/80 dark:border-saffron-800/60">
      ${n}
    </span>
  `).join('');

  // Complimentary recommendations (other products in same category or popular)
  const related = SPICE_DATA.products
    .filter(item => item.id !== p.id && (item.category === p.category || item.isSignature))
    .slice(0, 4);

  // Sample verified reviews
  const reviews = [
    { author: "Chef Vikramjit R.", role: "Heritage Restaurant Owner", stars: 5, date: "2 weeks ago", text: `Incredible aroma retention. The moment you open the seal, the essential oils fill the kitchen. ${p.name} is unmatched in quality compared to commercial brands.` },
    { author: "Ananya Deshmukh", role: "Culinary Connoisseur", stars: 5, date: "1 month ago", text: `Ordered the harvest lot from ${p.origin}. Clean, vibrant, zero adulteration. The lab certificate QR gives complete peace of mind.` },
    { author: "Dr. K. S. Nair", role: "Ayurvedic Practitioner", stars: 5, date: "Recent Harvest", text: `High bioactive potency verified. You can taste the single-origin terroir immediately. Fast dispatch and excellent packaging.` }
  ];

  container.innerHTML = `
    <!-- BREADCRUMBS & NAVIGATION BAR -->
    <nav class="flex items-center gap-2 text-xs text-clove-800/70 dark:text-parchment-400 mb-6 font-medium" aria-label="Breadcrumb">
      <a href="#home" onclick="navigateTo('home'); return false;" class="hover:text-saffron-700 dark:hover:text-saffron-400 transition flex items-center gap-1">
        <i class="fa-solid fa-house text-[10px]"></i> Home
      </a>
      <span>/</span>
      <a href="#products" onclick="navigateTo('products'); return false;" class="hover:text-saffron-700 dark:hover:text-saffron-400 transition">
        Spice Pantry
      </a>
      <span>/</span>
      <button onclick="setCategoryAndNavigate('${p.category}')" class="hover:text-saffron-700 dark:hover:text-saffron-400 transition underline underline-offset-2">
        ${p.categoryName}
      </button>
      <span>/</span>
      <span class="text-clove-900 dark:text-parchment-100 font-bold truncate max-w-[200px] sm:max-w-none">${p.name}</span>
    </nav>

    <!-- MAIN PRODUCT SHOWCASE (STICKY HEADER VISIBLE ABOVE THIS) -->
    <div class="bg-white dark:bg-[#1E140C] rounded-3xl border border-parchment-300 dark:border-saffron-900/40 p-6 sm:p-8 lg:p-10 shadow-lg mb-12">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

        <!-- LEFT: HD PRODUCT IMAGE & SEALS (COL 5) -->
        <div class="lg:col-span-5 space-y-4">
          <div class="relative rounded-2xl overflow-hidden bg-parchment-100 dark:bg-parchment-900 border border-parchment-300 dark:border-saffron-900/50 shadow-md group">
            <img id="detail-main-img" src="${p.image}" alt="${p.name}" class="w-full h-80 sm:h-96 lg:h-[420px] object-cover group-hover:scale-105 transition-transform duration-700">
            
            <div class="absolute top-4 left-4 flex flex-col gap-2">
              <span class="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-clove-900/90 text-saffron-300 backdrop-blur-md border border-saffron-500/40 shadow-sm">
                ${p.categoryName}
              </span>
              ${p.isSignature ? `
                <span class="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500 text-clove-950 shadow-md flex items-center gap-1.5">
                  <i class="fa-solid fa-crown text-[10px]"></i> Signature Reserve
                </span>
              ` : ''}
            </div>

            <button onclick="toggleWishlist('${p.id}', event)" class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 dark:bg-clove-900/90 hover:bg-white text-clove-800 dark:text-parchment-100 hover:text-red-500 shadow-md flex items-center justify-center transition">
              <i class="fa-regular fa-heart text-base"></i>
            </button>

            <div class="absolute bottom-4 left-4 right-4 bg-clove-950/85 backdrop-blur-md rounded-xl p-3 border border-saffron-500/30 text-white text-xs flex items-center justify-between">
              <span class="flex items-center gap-2 text-cardamom-300 font-bold">
                <i class="fa-solid fa-certificate"></i> NABL Tested Lot
              </span>
              <span class="text-saffron-300 font-semibold text-[11px]">Zero Radiation / No Fillers</span>
            </div>
          </div>

          <!-- TRUST BADGES BAR -->
          <div class="grid grid-cols-3 gap-2 text-center">
            <div class="p-2.5 rounded-xl bg-parchment-100 dark:bg-parchment-900/50 border border-parchment-200 dark:border-saffron-900/30">
              <i class="fa-solid fa-seedling text-cardamom-600 dark:text-cardamom-400 text-sm block mb-1"></i>
              <span class="text-[10px] font-bold text-clove-900 dark:text-parchment-100 block">Single-Origin</span>
              <span class="text-[9px] text-clove-800/60 dark:text-parchment-400">100% Traceable</span>
            </div>
            <div class="p-2.5 rounded-xl bg-parchment-100 dark:bg-parchment-900/50 border border-parchment-200 dark:border-saffron-900/30">
              <i class="fa-solid fa-shield-halved text-saffron-600 dark:text-saffron-400 text-sm block mb-1"></i>
              <span class="text-[10px] font-bold text-clove-900 dark:text-parchment-100 block">NABL Certified</span>
              <span class="text-[9px] text-clove-800/60 dark:text-parchment-400">Aroma-Locked</span>
            </div>
            <div class="p-2.5 rounded-xl bg-parchment-100 dark:bg-parchment-900/50 border border-parchment-200 dark:border-saffron-900/30">
              <i class="fa-solid fa-truck-fast text-terracotta-600 dark:text-terracotta-400 text-sm block mb-1"></i>
              <span class="text-[10px] font-bold text-clove-900 dark:text-parchment-100 block">Express Dispatch</span>
              <span class="text-[9px] text-clove-800/60 dark:text-parchment-400">Within 24 Hours</span>
            </div>
          </div>
        </div>

        <!-- RIGHT: PRODUCT DETAILS & PURCHASE CONTROLS (COL 7) -->
        <div class="lg:col-span-7 space-y-6">
          
          <!-- Origin & Ratings Bar -->
          <div class="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-parchment-200 dark:border-saffron-900/30 pb-3">
            <span class="flex items-center gap-1.5 font-bold text-saffron-800 dark:text-saffron-400 bg-saffron-50 dark:bg-saffron-950/60 px-3 py-1 rounded-full border border-saffron-200 dark:border-saffron-800">
              <i class="fa-solid fa-location-dot text-terracotta-600 dark:text-terracotta-400"></i>
              ${p.origin} • ${p.harvest}
            </span>
            <div class="flex items-center gap-2">
              <div class="flex text-amber-500 text-xs">
                ${'<i class="fa-solid fa-star"></i>'.repeat(Math.round(p.rating))}
              </div>
              <span class="font-bold text-clove-900 dark:text-parchment-100">${p.rating.toFixed(1)}</span>
              <span class="text-clove-800/60 dark:text-parchment-400">(${p.reviewsCount} verified reviews)</span>
            </div>
          </div>

          <!-- Product Title & Botanical Subtitle -->
          <div class="space-y-1">
            <h1 class="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-clove-900 dark:text-parchment-50 leading-tight">
              ${p.name}
            </h1>
            <p class="text-xs sm:text-sm font-serif italic text-cardamom-800 dark:text-cardamom-300">
              ${meta.latin} • Authentic Single-Estate Botanical Integrity
            </p>
          </div>

          <!-- Price & Savings -->
          <div class="flex items-baseline gap-4 p-4 rounded-2xl bg-parchment-50 dark:bg-parchment-900/40 border border-parchment-200 dark:border-saffron-900/30">
            <div>
              <span class="text-xs text-clove-800/60 dark:text-parchment-400 block font-medium">Estate Direct Price</span>
              <div class="flex items-baseline gap-3">
                <span class="font-display font-black text-3xl sm:text-4xl text-saffron-800 dark:text-saffron-400">₹${p.price}</span>
                ${p.originalPrice ? `
                  <span class="text-base text-clove-800/40 dark:text-parchment-500 line-through">₹${p.originalPrice}</span>
                  <span class="text-xs font-bold text-cardamom-700 dark:text-cardamom-400 bg-cardamom-100 dark:bg-cardamom-950 px-2 py-0.5 rounded-full border border-cardamom-300">
                    Save ₹${p.originalPrice - p.price}
                  </span>
                ` : ''}
              </div>
            </div>
            <div class="ml-auto text-right text-xs">
              <span class="text-clove-800/60 dark:text-parchment-400 block">Presentation</span>
              <span class="font-bold text-clove-900 dark:text-parchment-100">${p.weight}</span>
            </div>
          </div>

          <!-- Description -->
          <p class="text-sm text-clove-800/80 dark:text-parchment-200 font-light leading-relaxed">
            ${p.description}
          </p>

          <!-- Aroma Palette -->
          <div class="space-y-2">
            <span class="text-xs font-bold uppercase tracking-wider text-clove-900 dark:text-parchment-100 block">
              <i class="fa-solid fa-wind text-saffron-600 mr-1.5"></i> Aroma Palette & Terroir Notes:
            </span>
            <div class="flex flex-wrap gap-2">
              ${aromaPills}
            </div>
          </div>

          <!-- Heat Index & Processing Info -->
          <div class="grid grid-cols-2 gap-3 pt-1">
            <div class="p-3 rounded-xl bg-parchment-100 dark:bg-parchment-900/60 border border-parchment-200 dark:border-saffron-900/40 text-xs">
              <span class="font-bold text-clove-900 dark:text-parchment-100 block text-[11px]">Heat Profile:</span>
              <span class="font-semibold text-terracotta-600 dark:text-terracotta-400">${p.heatLevel}</span>
            </div>
            <div class="p-3 rounded-xl bg-parchment-100 dark:bg-parchment-900/60 border border-parchment-200 dark:border-saffron-900/40 text-xs">
              <span class="font-bold text-clove-900 dark:text-parchment-100 block text-[11px]">Milling & Craft:</span>
              <span class="font-semibold text-saffron-800 dark:text-saffron-400">${p.category === 'whole' ? 'Sun-Drenched Pod' : (p.category === 'pickles' ? 'Clay Pot Matured' : 'Cold Stone Pounded')}</span>
            </div>
          </div>

          <!-- QUANTITY SELECTOR & PRIMARY ACTION BUTTONS -->
          <div class="pt-4 border-t border-parchment-200 dark:border-saffron-900/40 space-y-4">
            
            <div class="flex flex-wrap items-center gap-4">
              <!-- Quantity selector -->
              <div class="flex items-center rounded-xl border-2 border-parchment-300 dark:border-saffron-900/60 bg-parchment-50 dark:bg-parchment-900/80 p-1">
                <button onclick="changeDetailQty(-1)" class="w-9 h-9 rounded-lg hover:bg-parchment-200 dark:hover:bg-parchment-800 text-clove-900 dark:text-parchment-100 font-black text-sm flex items-center justify-center transition" aria-label="Decrease quantity">
                  <i class="fa-solid fa-minus text-xs"></i>
                </button>
                <span id="detail-qty-val" class="w-12 text-center font-display font-black text-base text-clove-900 dark:text-parchment-50">1</span>
                <button onclick="changeDetailQty(1)" class="w-9 h-9 rounded-lg hover:bg-parchment-200 dark:hover:bg-parchment-800 text-clove-900 dark:text-parchment-100 font-black text-sm flex items-center justify-center transition" aria-label="Increase quantity">
                  <i class="fa-solid fa-plus text-xs"></i>
                </button>
              </div>

              <!-- Add to Basket Button -->
              <button onclick="addDetailToBasket('${p.id}')" class="flex-grow py-3.5 px-6 rounded-xl bg-clove-900 hover:bg-clove-800 dark:bg-saffron-700 dark:hover:bg-saffron-600 text-white font-bold text-sm shadow-md hover:scale-[1.01] transition flex items-center justify-center gap-2.5">
                <i class="fa-solid fa-basket-shopping"></i>
                <span>Add to Basket</span>
              </button>

              <!-- Order Now (Direct Checkout) -->
              <button onclick="orderNowDetailProduct('${p.id}')" class="flex-grow py-3.5 px-6 rounded-xl gold-gradient-bg text-white font-bold text-sm shadow-md hover:scale-[1.01] transition flex items-center justify-center gap-2.5">
                <i class="fa-solid fa-bolt"></i>
                <span>Order Now</span>
              </button>
            </div>

            <!-- SECONDARY ACTION BUTTONS -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button onclick="enquireAboutProduct('${p.id}')" class="py-2.5 px-4 rounded-xl border border-saffron-600/40 bg-saffron-50/50 dark:bg-saffron-950/40 hover:bg-saffron-100 dark:hover:bg-saffron-900/60 text-saffron-900 dark:text-saffron-300 font-bold text-xs transition flex items-center justify-center gap-2">
                <i class="fa-regular fa-comment-dots text-saffron-700 dark:text-saffron-400"></i>
                <span>Enquire About This Spice</span>
              </button>
              <button onclick="bulkEnquireProduct('${p.id}')" class="py-2.5 px-4 rounded-xl border border-parchment-300 dark:border-saffron-900/50 bg-parchment-100 dark:bg-parchment-900/60 hover:bg-parchment-200 dark:hover:bg-parchment-800 text-clove-800 dark:text-parchment-300 font-bold text-xs transition flex items-center justify-center gap-2">
                <i class="fa-solid fa-boxes-stacked text-terracotta-600 dark:text-terracotta-400"></i>
                <span>Request Wholesale / Bulk</span>
              </button>
            </div>

            <!-- PINCODE DELIVERY ESTIMATOR -->
            <div class="p-3.5 rounded-xl bg-parchment-100 dark:bg-parchment-900/50 border border-parchment-300 dark:border-saffron-900/30 text-xs flex flex-wrap items-center justify-between gap-3">
              <div class="flex items-center gap-2">
                <i class="fa-solid fa-location-crosshairs text-saffron-700 dark:text-saffron-400"></i>
                <span class="font-bold text-clove-900 dark:text-parchment-100">Delivery Availability:</span>
              </div>
              <div class="flex items-center gap-2 flex-grow sm:flex-grow-0">
                <input id="detail-pincode-input" type="text" maxlength="6" placeholder="Enter 6-digit Pincode" class="w-36 px-2.5 py-1 rounded-lg border border-parchment-300 dark:border-saffron-800 bg-white dark:bg-[#120B07] text-clove-900 dark:text-parchment-100 text-xs text-center focus:ring-1 focus:ring-saffron-500 outline-none">
                <button onclick="checkPincodeDelivery()" class="px-3 py-1 bg-clove-900 dark:bg-saffron-700 text-white font-bold rounded-lg text-xs hover:bg-saffron-700 transition">
                  Check
                </button>
              </div>
              <div id="detail-pincode-result" class="w-full text-[11px] text-cardamom-700 dark:text-cardamom-400 font-semibold hidden">
                <i class="fa-solid fa-circle-check mr-1"></i> Express delivery available within 48-72 hours.
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>

    <!-- TECHNICAL SPECIFICATIONS & QUALITY ASSURANCE -->
    <div class="bg-white dark:bg-[#1E140C] rounded-3xl border border-parchment-300 dark:border-saffron-900/40 p-6 sm:p-8 lg:p-10 shadow-lg mb-12">
      <div class="border-b border-parchment-200 dark:border-saffron-900/30 pb-4 mb-6 flex items-center justify-between">
        <div>
          <span class="text-xs uppercase font-extrabold tracking-wider text-saffron-700 dark:text-saffron-400 block">NABL Accredited Quality Dossier</span>
          <h2 class="font-heading font-black text-xl sm:text-2xl text-clove-900 dark:text-parchment-50">Technical Botanical Specifications</h2>
        </div>
        <button onclick="navigateTo('purity'); verifyBatchLot('SV-2025-LK08');" class="text-xs font-bold text-saffron-800 dark:text-saffron-400 hover:underline flex items-center gap-1.5">
          <span>View Public Lab Registry</span>
          <i class="fa-solid fa-arrow-right text-[10px]"></i>
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div class="p-4 rounded-2xl bg-parchment-50 dark:bg-parchment-900/40 border border-parchment-200 dark:border-saffron-900/30 flex justify-between items-center">
          <span class="text-clove-800/70 dark:text-parchment-400 font-medium">Botanical Classification</span>
          <span class="font-serif italic font-bold text-clove-900 dark:text-parchment-100 text-sm">${meta.latin}</span>
        </div>
        <div class="p-4 rounded-2xl bg-parchment-50 dark:bg-parchment-900/40 border border-parchment-200 dark:border-saffron-900/30 flex justify-between items-center">
          <span class="text-clove-800/70 dark:text-parchment-400 font-medium">Grading Standard</span>
          <span class="font-bold text-clove-900 dark:text-parchment-100">${meta.grade}</span>
        </div>
        <div class="p-4 rounded-2xl bg-parchment-50 dark:bg-parchment-900/40 border border-parchment-200 dark:border-saffron-900/30 flex justify-between items-center">
          <span class="text-clove-800/70 dark:text-parchment-400 font-medium">Active Bioactive Assay</span>
          <span class="font-bold text-saffron-800 dark:text-saffron-400">${meta.active}</span>
        </div>
        <div class="p-4 rounded-2xl bg-parchment-50 dark:bg-parchment-900/40 border border-parchment-200 dark:border-saffron-900/30 flex justify-between items-center">
          <span class="text-clove-800/70 dark:text-parchment-400 font-medium">Moisture & Volatiles</span>
          <span class="font-bold text-cardamom-700 dark:text-cardamom-400">${meta.moisture}</span>
        </div>
        <div class="p-4 rounded-2xl bg-parchment-50 dark:bg-parchment-900/40 border border-parchment-200 dark:border-saffron-900/30 flex justify-between items-center">
          <span class="text-clove-800/70 dark:text-parchment-400 font-medium">Terroir Origin</span>
          <span class="font-bold text-clove-900 dark:text-parchment-100">${p.origin} (${p.harvest})</span>
        </div>
        <div class="p-4 rounded-2xl bg-parchment-50 dark:bg-parchment-900/40 border border-parchment-200 dark:border-saffron-900/30 flex justify-between items-center">
          <span class="text-clove-800/70 dark:text-parchment-400 font-medium">Optimal Shelf Life</span>
          <span class="font-bold text-clove-900 dark:text-parchment-100">${meta.shelfLife}</span>
        </div>
      </div>
    </div>

    <!-- VERIFIED CUSTOMER REVIEWS -->
    <div class="bg-white dark:bg-[#1E140C] rounded-3xl border border-parchment-300 dark:border-saffron-900/40 p-6 sm:p-8 lg:p-10 shadow-lg mb-12">
      <div class="border-b border-parchment-200 dark:border-saffron-900/30 pb-4 mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span class="text-xs uppercase font-extrabold tracking-wider text-saffron-700 dark:text-saffron-400 block">Connoisseur Feedback</span>
          <h2 class="font-heading font-black text-xl sm:text-2xl text-clove-900 dark:text-parchment-50">Verified Terroir Reviews (${p.reviewsCount})</h2>
        </div>
        <div class="flex items-center gap-2">
          <span class="font-display font-black text-2xl text-saffron-800 dark:text-saffron-400">${p.rating.toFixed(1)}</span>
          <div class="text-amber-500 text-sm">
            ${'<i class="fa-solid fa-star"></i>'.repeat(Math.round(p.rating))}
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        ${reviews.map(r => `
          <div class="p-6 rounded-2xl bg-parchment-50 dark:bg-parchment-900/40 border border-parchment-200 dark:border-saffron-900/30 flex flex-col justify-between space-y-3">
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <div class="flex text-amber-500 text-xs">
                  ${'<i class="fa-solid fa-star"></i>'.repeat(r.stars)}
                </div>
                <span class="text-[10px] text-clove-800/60 dark:text-parchment-400">${r.date}</span>
              </div>
              <p class="text-xs text-clove-800/80 dark:text-parchment-200 italic leading-relaxed">"${r.text}"</p>
            </div>
            <div class="pt-2 border-t border-parchment-200 dark:border-saffron-900/30">
              <span class="font-bold text-xs text-clove-900 dark:text-parchment-100 block">${r.author}</span>
              <span class="text-[10px] text-cardamom-700 dark:text-cardamom-400 font-medium">${r.role}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- RECOMMENDED COMPLEMENTARY SPICES -->
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <span class="text-xs uppercase font-extrabold tracking-wider text-saffron-700 dark:text-saffron-400 block">Harmonious Botanical Combinations</span>
          <h2 class="font-heading font-black text-2xl text-clove-900 dark:text-parchment-50">Pairs Wonderfully With</h2>
        </div>
        <button onclick="navigateTo('products')" class="text-xs font-bold text-saffron-800 dark:text-saffron-400 hover:underline flex items-center gap-1.5">
          <span>Explore All Spices</span>
          <i class="fa-solid fa-arrow-right text-[10px]"></i>
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        ${related.map(item => renderSpiceCardHTML(item)).join('')}
      </div>
    </div>
  `;
}

function changeDetailQty(delta) {
  currentDetailQuantity = Math.max(1, currentDetailQuantity + delta);
  const qtyEl = document.getElementById('detail-qty-val');
  if (qtyEl) qtyEl.innerText = currentDetailQuantity;
}

function addDetailToBasket(productId) {
  for (let i = 0; i < currentDetailQuantity; i++) {
    quickAddToCart(productId);
  }
  showToast(`Added ${currentDetailQuantity}x allocation to your basket!`, "success");
}

function orderNowDetailProduct(productId) {
  addDetailToBasket(productId);
  toggleCartDrawer(true);
}

function checkPincodeDelivery() {
  const inp = document.getElementById('detail-pincode-input');
  const res = document.getElementById('detail-pincode-result');
  if (!inp || !res) return;

  const val = inp.value.trim();
  if (val.length === 6 && /^\d+$/.test(val)) {
    res.classList.remove('hidden');
    res.innerHTML = `<i class="fa-solid fa-circle-check mr-1 text-cardamom-600"></i> Delivery to pincode ${val} available in 48-72h via Cold-Chain Express.`;
  } else {
    showToast("Please enter a valid 6-digit postal pincode.", "error");
  }
}

