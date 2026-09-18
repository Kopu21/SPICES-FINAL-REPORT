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
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
    document.documentElement.classList.add('dark');
    icons.forEach(icon => {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun', 'text-amber-400');
    });
  } else {
    document.body.classList.remove('dark-mode');
    document.documentElement.classList.remove('dark');
    icons.forEach(icon => {
      icon.classList.remove('fa-sun', 'text-amber-400');
      icon.classList.add('fa-moon', 'text-saffron-700');
    });
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
  if (isRtlMode) {
    document.documentElement.setAttribute('dir', 'rtl');
    document.body.setAttribute('dir', 'rtl');
    labels.forEach(label => { label.innerText = 'LTR'; });
  } else {
    document.documentElement.setAttribute('dir', 'ltr');
    document.body.setAttribute('dir', 'ltr');
    labels.forEach(label => { label.innerText = 'RTL'; });
  }
}

// --- NAVIGATION CONTROLLER ---
function navigateTo(viewId) {
  if (!viewId) viewId = 'home';
  const validViews = ['home', 'home-2', 'products', 'recipes', 'story', 'bulk-orders', 'contact', 'login', 'register', 'error', 'gifting', 'purity'];
  
  // If target is an in-page anchor ID, smoothly scroll to it without resetting SPA view
  if (!validViews.includes(viewId)) {
    const anchorElem = document.getElementById(viewId);
    if (anchorElem) {
      anchorElem.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    viewId = 'home';
  }

  const target = viewId;

  // Toggle main site header and footer visibility (No header/footer on Login/Register page)
  const isAuthView = (target === 'login' || target === 'register');
  const mainHeader = document.getElementById('main-site-header');
  const mainFooter = document.getElementById('main-site-footer');
  const topBar = document.getElementById('top-announcement-bar');

  if (mainHeader) mainHeader.classList.toggle('hidden', isAuthView);
  if (mainFooter) mainFooter.classList.toggle('hidden', isAuthView);
  if (topBar) topBar.classList.toggle('hidden', isAuthView);

  // Hide all views
  document.querySelectorAll('.spa-view').forEach(el => {
    el.classList.add('hidden');
  });

  // Show target view
  const targetView = document.getElementById(`view-${target}`);
  if (targetView) {
    targetView.classList.remove('hidden');
  }

  // Update Nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });

  const activeLink = document.getElementById(`nav-${target}`);
  if (activeLink) {
    activeLink.classList.add('active');
  } else if (target === 'home-2') {
    const homeNav = document.getElementById('nav-home');
    if (homeNav) homeNav.classList.add('active');
  }

  // Update URL hash without page reload
  window.history.replaceState(null, null, `#${target}`);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initNavigation() {
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '');
    if (hash) navigateTo(hash);
  });
}

function toggleMobileNav() {
  const nav = document.getElementById('mobile-nav');
  if (nav) nav.classList.toggle('hidden');
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
  const aromaPills = p.aromaNotes.map(n => `<span class="aroma-pill px-2 py-0.5 rounded-md">${n}</span>`).join('');
  const tagBadge = p.tags && p.tags[0] ? `<span class="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-clove-900/85 backdrop-blur-md text-saffron-300 border border-saffron-500/30">${p.tags[0]}</span>` : '';

  return `
    <div class="spice-card bg-white rounded-2xl border border-parchment-300 overflow-hidden shadow-sm flex flex-col justify-between group">
      
      <!-- Image Container -->
      <div class="relative h-56 overflow-hidden bg-parchment-200">
        <img src="${p.image}" alt="${p.name}" class="spice-card-img w-full h-full object-cover">
        ${tagBadge}
        <button onclick="openQuickView('${p.id}')" class="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-parchment-50/90 hover:bg-white text-clove-900 text-xs font-bold shadow backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-1.5">
          <i class="fa-regular fa-eye text-saffron-700"></i>
          <span>Quick View</span>
        </button>
      </div>

      <!-- Content Details -->
      <div class="p-5 flex flex-col flex-grow justify-between space-y-3">
        
        <div>
          <div class="flex items-center justify-between text-[11px] text-clove-800/70 mb-1">
            <span class="flex items-center gap-1 font-semibold text-saffron-800">
              <i class="fa-solid fa-location-dot text-terracotta-600"></i> ${p.origin}
            </span>
            <span class="flex items-center gap-1 text-saffron-700 font-bold">
              <i class="fa-solid fa-star text-amber-500 text-[10px]"></i> ${p.rating.toFixed(1)} (${p.reviewsCount})
            </span>
          </div>

          <h3 class="font-heading font-bold text-base text-clove-900 leading-snug line-clamp-2 hover:text-saffron-800 cursor-pointer" onclick="openQuickView('${p.id}')">
            ${p.name}
          </h3>

          <p class="text-xs text-clove-800/70 mt-1 line-clamp-2 font-light">
            ${p.description}
          </p>
        </div>

        <!-- Aroma Notes -->
        <div>
          <div class="text-[10px] uppercase font-bold text-clove-800/50 mb-1.5">Fragrance Palette:</div>
          <div class="flex flex-wrap gap-1.5">
            ${aromaPills}
          </div>
        </div>

        <!-- Weight and Price Section -->
        <div class="border-t border-parchment-200 pt-3 flex items-center justify-between">
          <div>
            <span class="text-[11px] text-clove-800/60 block font-medium">${p.weight}</span>
            <div class="flex items-baseline gap-1.5">
              <span class="font-display font-bold text-lg text-saffron-800">₹${p.price}</span>
              ${p.originalPrice ? `<span class="text-xs text-clove-800/40 line-through">₹${p.originalPrice}</span>` : ''}
            </div>
          </div>

          <button onclick="quickAddToCart('${p.id}')" class="px-4 py-2.5 rounded-xl bg-clove-900 hover:bg-saffron-700 text-white font-bold text-xs shadow transition-all duration-200 flex items-center gap-1.5 active:scale-95">
            <i class="fa-solid fa-plus text-xs"></i>
            <span>Add</span>
          </button>
        </div>

      </div>

    </div>
  `;
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

// --- HOME 1 RENDERING ---
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
    <div class="p-6 rounded-2xl bg-white border border-parchment-300 shadow-sm flex flex-col justify-between space-y-4">
      <div class="space-y-3">
        <div class="flex text-amber-500 text-xs">
          ${'<i class="fa-solid fa-star"></i>'.repeat(t.rating)}
        </div>
        <p class="text-xs text-clove-800 leading-relaxed italic">"${t.comment}"</p>
      </div>
      <div class="flex items-center gap-3 pt-3 border-t border-parchment-200">
        <img src="${t.avatar}" alt="${t.name}" class="w-10 h-10 rounded-full object-cover border border-saffron-300">
        <div>
          <h4 class="font-bold text-xs text-clove-900">${t.name}</h4>
          <p class="text-[10px] text-clove-800/60">${t.role}</p>
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

  const html = SPICE_DATA.estateReserves.map(r => `
    <div class="bg-white text-clove-900 rounded-2xl border-2 border-amber-600/30 overflow-hidden shadow-lg flex flex-col justify-between group hover:border-amber-500 transition-all duration-300 h-full">
      <div class="relative h-60 bg-parchment-200 overflow-hidden shrink-0">
        <img src="${r.image}" alt="${r.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
        <span class="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-cardamom-900 text-amber-300 border border-amber-400 shadow">
          ${r.badge}
        </span>
      </div>

      <div class="p-6 space-y-4 flex-grow flex flex-col justify-between">
        <div class="space-y-2">
          <div class="text-[11px] text-cardamom-800 font-bold flex items-center gap-1">
            <i class="fa-solid fa-location-dot"></i> ${r.origin}
          </div>
          <h3 class="font-heading font-bold text-lg text-clove-900 leading-snug min-h-[3.25rem] line-clamp-2">${r.name}</h3>
          <p class="text-xs text-clove-800/70 font-light leading-relaxed min-h-[3.5rem] line-clamp-3">${r.curatorNote}</p>
        </div>

        <div class="mt-auto space-y-4 pt-2">
          <div class="p-3.5 rounded-xl bg-parchment-100 border border-parchment-200 text-xs space-y-1.5 min-h-[4.5rem] flex flex-col justify-center">
            <p class="truncate"><strong class="text-clove-900">Harvest & Aging:</strong> ${r.harvest}</p>
            <p class="truncate"><strong class="text-clove-900">Presentation:</strong> ${r.weight}</p>
          </div>

          <div class="border-t border-parchment-200 pt-3 flex items-center justify-between">
            <div>
              <span class="text-[10px] uppercase font-bold text-clove-800/60 block">Cellar Price:</span>
              <span class="font-display font-bold text-xl text-saffron-800">₹${r.price.toLocaleString('en-IN')}</span>
            </div>

            <button onclick="quickAddToCart('${r.id === 'res-01' ? 'ws-01' : (r.id === 'res-02' ? 'ws-03' : 'pw-02')}'); showToast('Added Rare Reserve allocation to basket!', 'success');" class="px-5 py-2.5 rounded-xl gold-gradient-bg text-white font-bold text-xs shadow hover:scale-105 transition flex items-center gap-2 shrink-0">
              <i class="fa-solid fa-crown text-amber-200"></i>
              <span>Reserve Batch</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');

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
      <div class="flex items-center gap-2 text-saffron-800 font-bold text-xs">
        <i class="fa-solid fa-wand-magic-sparkles"></i>
        <span>Sommelier Match: ${p.title}</span>
      </div>
      <h4 class="font-heading font-bold text-sm text-clove-900">${p.blend}</h4>
      <p class="text-xs text-clove-800/80 font-light leading-relaxed">${p.notes}</p>
      
      <div class="p-3 rounded-lg bg-saffron-50 border border-saffron-200 text-xs text-saffron-900 font-medium">
        <i class="fa-solid fa-lightbulb text-saffron-700 mr-1"></i> <strong>Pro Tip:</strong> ${p.sommelierTip}
      </div>

      <div class="pt-2 flex justify-end gap-2">
        <button onclick="quickAddToCart('${p.productIds[0]}'); quickAddToCart('${p.productIds[1]}');" class="px-4 py-2 rounded-lg bg-clove-900 hover:bg-saffron-700 text-white font-bold text-xs transition flex items-center gap-1.5">
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
    <li class="flex items-start gap-2 text-xs text-clove-900">
      <i class="fa-solid fa-check text-cardamom-700 text-xs mt-0.5"></i>
      <span>${ing}</span>
    </li>
  `).join('');

  const stepsListHTML = recipe.steps.map(step => `
    <div class="p-4 bg-white rounded-xl border border-parchment-300 space-y-3">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-saffron-700 text-white font-display font-bold text-xs flex items-center justify-center shrink-0">
          ${step.stepNumber}
        </div>
        <h5 class="font-heading font-bold text-sm text-clove-900">${step.title}</h5>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        <div class="sm:col-span-8">
          <p class="text-xs text-clove-800 leading-relaxed font-light">${step.instruction}</p>
          <div class="mt-2 text-[11px] text-cardamom-900 font-medium bg-cardamom-50 px-2.5 py-1 rounded border border-cardamom-200">
            <i class="fa-regular fa-image mr-1"></i> ${step.stepCaption}
          </div>
        </div>
        <div class="sm:col-span-4 h-28 rounded-lg overflow-hidden border border-parchment-300">
          <img src="${step.stepImage}" alt="${step.title}" class="w-full h-full object-cover">
        </div>
      </div>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="space-y-6">
      
      <div class="flex flex-col md:flex-row gap-6 items-start">
        <div class="w-full md:w-80 h-60 rounded-xl overflow-hidden border border-parchment-300 shrink-0">
          <img src="${recipe.image}" alt="${recipe.title}" class="w-full h-full object-cover">
        </div>
        <div class="space-y-2 flex-grow">
          <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-saffron-100 text-saffron-800 border border-saffron-300">${recipe.category}</span>
          <h2 class="font-heading font-bold text-2xl text-clove-900">${recipe.title}</h2>
          
          <div class="p-3 bg-parchment-100 rounded-lg border border-parchment-200 text-xs text-clove-800 space-y-0.5">
            <span class="font-bold text-saffron-900">Image Description:</span>
            <p class="text-[11px] text-clove-800/80 font-light">${recipe.imageExplanation}</p>
          </div>

          <div class="flex flex-wrap gap-4 text-xs text-clove-800/70 pt-1">
            <span><i class="fa-regular fa-clock text-saffron-700 mr-1"></i>Prep: ${recipe.prepTime}</span>
            <span><i class="fa-solid fa-fire text-terracotta-600 mr-1"></i>Cook: ${recipe.cookTime}</span>
            <span><i class="fa-solid fa-award text-cardamom-700 mr-1"></i>${recipe.difficulty}</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-6 bg-parchment-100 p-6 rounded-xl border border-parchment-300">
        <div class="md:col-span-6 space-y-3">
          <h4 class="font-heading font-bold text-sm text-clove-900 uppercase tracking-wider">Culinary Ingredients</h4>
          <ul class="space-y-2">
            ${ingredientsListHTML}
          </ul>
        </div>

        <div class="md:col-span-6 space-y-3 border-t md:border-t-0 md:border-l border-parchment-300 md:pl-6">
          <h4 class="font-heading font-bold text-sm text-clove-900 uppercase tracking-wider">Required SuryaVeda Spices</h4>
          <p class="text-xs text-clove-800/70">Add to basket to receive single-estate harvest batches:</p>
          <div class="space-y-2">
            ${recipe.keySpices.map(id => {
              const sp = SPICE_DATA.products.find(p => p.id === id);
              if (!sp) return '';
              return `
                <div class="flex items-center justify-between p-2.5 bg-white rounded-lg border border-parchment-300">
                  <div class="flex items-center gap-2.5">
                    <img src="${sp.image}" class="w-9 h-9 rounded object-cover">
                    <div>
                      <h5 class="font-bold text-xs text-clove-900">${sp.name.split('(')[0]}</h5>
                      <span class="text-[10px] text-saffron-800 font-bold">₹${sp.price} (${sp.weight})</span>
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
        <h4 class="font-heading font-bold text-lg text-clove-900">Step-by-Step Cooking Technique & Visual Notes</h4>
        <div class="space-y-3">
          ${stepsListHTML}
        </div>
      </div>

      <div class="p-4 rounded-xl bg-saffron-50 border border-saffron-200 text-xs text-saffron-900 font-semibold flex items-center gap-3">
        <i class="fa-solid fa-crown text-saffron-700 text-lg"></i>
        <span>Master Chef Note: ${recipe.pairingTip}</span>
      </div>

    </div>
  `;

  modal.classList.remove('hidden');
}

function closeRecipeModal() {
  document.getElementById('recipe-modal')?.classList.add('hidden');
}

// --- QUICK VIEW MODAL ---
function openQuickView(productId) {
  const p = SPICE_DATA.products.find(item => item.id === productId);
  if (!p) return;

  const modal = document.getElementById('quick-view-modal');
  const container = document.getElementById('quick-view-content');

  const aromaPills = p.aromaNotes.map(n => `<span class="aroma-pill px-2.5 py-1 rounded-md">${n}</span>`).join('');

  container.innerHTML = `
    <div class="relative h-72 md:h-full bg-parchment-200 overflow-hidden">
      <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover">
      <div class="absolute top-4 left-4">
        <span class="px-3 py-1 rounded-full text-xs font-bold bg-clove-900/80 text-saffron-300 backdrop-blur-sm">${p.categoryName}</span>
      </div>
    </div>

    <div class="p-6 sm:p-8 flex flex-col justify-between space-y-4">
      <div class="space-y-3">
        <div class="flex items-center gap-2 text-xs text-saffron-800 font-semibold">
          <i class="fa-solid fa-location-dot text-terracotta-600"></i> ${p.origin} • <i class="fa-solid fa-calendar text-cardamom-700"></i> ${p.harvest}
        </div>

        <h2 class="font-heading font-bold text-xl text-clove-900">${p.name}</h2>
        
        <div class="flex items-center gap-2 text-xs">
          <span class="text-amber-500 font-bold"><i class="fa-solid fa-star mr-1"></i>${p.rating}</span>
          <span class="text-clove-800/60">(${p.reviewsCount} customer reviews)</span>
        </div>

        <p class="text-xs text-clove-800/80 font-light leading-relaxed">${p.description}</p>

        <div>
          <span class="text-[10px] uppercase font-bold text-clove-800/60 block mb-1">Aroma Profile & Terroir Notes:</span>
          <div class="flex flex-wrap gap-1.5">
            ${aromaPills}
          </div>
        </div>

        <div class="bg-parchment-100 p-3 rounded-xl border border-parchment-300 text-xs flex justify-between items-center">
          <span class="font-semibold text-clove-900">Heat Index:</span>
          <span class="font-bold text-terracotta-600">${p.heatLevel}</span>
        </div>
      </div>

      <div class="border-t border-parchment-300 pt-4 flex items-center justify-between">
        <div>
          <span class="text-xs text-clove-800/60 block">${p.weight}</span>
          <span class="font-display font-bold text-2xl text-saffron-800">₹${p.price}</span>
        </div>

        <button onclick="quickAddToCart('${p.id}'); closeQuickView();" class="px-6 py-3 rounded-xl gold-gradient-bg text-white font-bold text-xs shadow hover:scale-105 transition flex items-center gap-2">
          <i class="fa-solid fa-bag-shopping"></i>
          <span>Add to Basket</span>
        </button>
      </div>

    </div>
  `;

  modal.classList.remove('hidden');
}

function closeQuickView() {
  document.getElementById('quick-view-modal')?.classList.add('hidden');
}

// --- BOUTIQUE LOCATIONS RENDERER ---
function renderContactLocations() {
  const container = document.getElementById('contact-locations-list');
  if (!container || !SPICE_DATA.storeInfo.locations) return;

  container.innerHTML = SPICE_DATA.storeInfo.locations.map(loc => `
    <div class="p-5 rounded-2xl bg-white border border-parchment-300 space-y-3 h-full flex flex-col justify-between">
      <div class="space-y-1.5">
        <div class="flex items-center justify-between">
          <h4 class="font-bold text-sm text-clove-900 flex items-center gap-1.5">
            <i class="fa-solid fa-store text-saffron-700"></i> ${loc.city}
          </h4>
          <span class="text-[10px] bg-cardamom-100 text-cardamom-800 font-bold px-2 py-0.5 rounded">${loc.state}</span>
        </div>
        <p class="text-xs text-clove-800/80 font-light leading-relaxed">${loc.address}</p>
      </div>
      <div class="text-[11px] text-clove-800/70 space-y-1 pt-2 border-t border-parchment-200 mt-auto">
        <p><i class="fa-solid fa-phone mr-1 text-saffron-700"></i> ${loc.phone}</p>
        <p><i class="fa-regular fa-clock mr-1 text-saffron-700"></i> ${loc.timing}</p>
      </div>
      <div class="flex flex-wrap gap-1.5 pt-1">
        ${loc.features.map(f => `<span class="text-[10px] bg-parchment-100 px-2 py-0.5 rounded border border-parchment-200 text-clove-800">${f}</span>`).join('')}
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

// --- AUTH (LOGIN / REGISTER) CONTROLLER ---
function switchAuthTab(tab) {
  const loginForm = document.getElementById('form-login');
  const registerForm = document.getElementById('form-register');
  const loginTab = document.getElementById('auth-tab-login');
  const registerTab = document.getElementById('auth-tab-register');

  if (tab === 'login') {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    loginTab.classList.add('text-saffron-800', 'border-b-2', 'border-saffron-800', 'font-bold');
    loginTab.classList.remove('text-clove-800/50');
    registerTab.classList.remove('text-saffron-800', 'border-b-2', 'border-saffron-800', 'font-bold');
    registerTab.classList.add('text-clove-800/50');
  } else {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    registerTab.classList.add('text-saffron-800', 'border-b-2', 'border-saffron-800', 'font-bold');
    registerTab.classList.remove('text-clove-800/50');
    loginTab.classList.remove('text-saffron-800', 'border-b-2', 'border-saffron-800', 'font-bold');
    loginTab.classList.add('text-clove-800/50');
  }
}

function handleAuthLogin(e) {
  e.preventDefault();
  showToast("Welcome back, Guild Member! Private harvest reserve unlocked.", "success");
  setTimeout(() => navigateTo('home'), 1000);
}

function handleAuthRegister(e) {
  e.preventDefault();
  showToast("Registration successful! 100 Welcome Aroma points credited.", "success");
  setTimeout(() => navigateTo('home'), 1000);
}

function handleSocialAuth(provider) {
  showToast(`Authenticating with ${provider}... Accessing your SuryaVeda Guild Account.`, 'info');
  setTimeout(() => {
    showToast(`Successfully connected via ${provider}! Welcome to the Private Reserve.`, 'success');
    navigateTo('home');
  }, 1000);
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
      <div class="flex items-center gap-3 p-3 bg-white rounded-xl border border-parchment-300 shadow-sm">
        <img src="${item.image}" alt="${item.name}" class="w-14 h-14 rounded-lg object-cover border border-parchment-200">
        
        <div class="flex-grow space-y-1">
          <h4 class="font-bold text-xs text-clove-900 line-clamp-1">${item.name}</h4>
          <span class="text-[10px] text-clove-800/60 block">${item.weight}</span>
          <span class="font-display font-bold text-xs text-saffron-800">₹${item.price * item.qty}</span>
        </div>

        <div class="flex items-center gap-2 bg-parchment-100 rounded-lg p-1 border border-parchment-300">
          <button onclick="updateCartQty('${item.id}', -1)" class="w-6 h-6 rounded bg-white text-clove-900 hover:bg-saffron-100 font-bold text-xs flex items-center justify-center">-</button>
          <span class="text-xs font-bold w-4 text-center">${item.qty}</span>
          <button onclick="updateCartQty('${item.id}', 1)" class="w-6 h-6 rounded bg-white text-clove-900 hover:bg-saffron-100 font-bold text-xs flex items-center justify-center">+</button>
        </div>

        <button onclick="removeCartItem('${item.id}')" class="text-clove-800/40 hover:text-terracotta-600 p-1">
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
