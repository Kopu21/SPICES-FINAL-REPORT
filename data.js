// SuryaVeda Spices & Condiments - Master Data Source
// Curated High-Definition, Natural, Ultra-Clear Food & Spice Photography

const SPICE_DATA = {
  storeInfo: {
    name: "SuryaVeda Spices & Condiments",
    tagline: "Pure Terroir • Single-Estate • Hand-Pounded Heritage",
    est: "1924",
    phone: "+91 (800) 555-SPICE",
    whatsapp: "+91 98470 19240",
    email: "concierge@suryavedaspices.com",
    freeShippingThreshold: 999,
    locations: [
      {
        city: "Kochi Flagship Cellar",
        state: "Kerala",
        address: "48 Heritage Spice Row, Jew Town, Mattancherry, Kochi, Kerala 682002",
        timing: "Monday – Sunday: 9:30 AM – 8:00 PM IST",
        phone: "+91 (484) 222-1924",
        email: "kochi.cellar@suryavedaspices.com",
        features: ["Live Aroma Cupping Room", "Rare Whole Spice Cellar", "Custom Brass Tin Engraving"]
      },
      {
        city: "Old Delhi Heritage House",
        state: "Delhi NCR",
        address: "12 Khari Baoli Spice Bazaar, Chandni Chowk, Old Delhi 110006",
        timing: "Monday – Saturday: 10:00 AM – 8:30 PM IST (Sunday Closed)",
        phone: "+91 (11) 2394-5500",
        email: "delhi.bazaar@suryavedaspices.com",
        features: ["Stone Pounding Workshop", "Awadhi Masala Compounding", "Wholesale Bulk Dispatch Desk"]
      },
      {
        city: "Mumbai Sensory Boutique",
        state: "Maharashtra",
        address: "Ground Floor, Heritage Villa, Kala Ghoda Arts District, Fort, Mumbai 400001",
        timing: "Tuesday – Sunday: 11:00 AM – 9:00 PM IST",
        phone: "+91 (22) 6745-8820",
        email: "mumbai.sommelier@suryavedaspices.com",
        features: ["Spice Sommelier Tasting Sessions", "Curated Gift Crate Studio", "Chef Masterclasses"]
      }
    ],
    offers: [
      {
        code: "HERITAGE10",
        title: "10% Off Single-Estate Harvest",
        desc: "Valid on all unadulterated whole pods and stone powders.",
        minOrder: 0,
        type: "percent",
        value: 10
      },
      {
        code: "SPICEMASTER",
        title: "15% Off Connoisseur Order",
        desc: "Valid on orders above ₹1,200 across all royal blends.",
        minOrder: 1200,
        type: "percent",
        value: 15
      },
      {
        code: "FESTIVE20",
        title: "Flat ₹200 Festive Off",
        desc: "Instant ₹200 discount on orders above ₹1,000.",
        minOrder: 1000,
        type: "flat",
        value: 200
      },
      {
        code: "BRASSFREE",
        title: "Free Antique Brass Spice Tin",
        desc: "Complimentary 100g engraved brass tin jar on ₹1,499+ orders.",
        minOrder: 1499,
        type: "gift",
        value: "Free Brass Masaledani Tin"
      }
    ]
  },

  categories: [
    { id: "all", name: "All Spices & Blends", icon: "fa-solid fa-sparkles", count: 20 },
    { id: "whole", name: "Whole Spices", icon: "fa-solid fa-sun", count: 6, desc: "Sun-dried, unadulterated whole pods, seeds, and bark directly from heritage estates." },
    { id: "powders", name: "Hand-ground Powders", icon: "fa-solid fa-fire", count: 5, desc: "Stone-ground at low RPM to retain volatile essential oils and rich medicinal qualities." },
    { id: "pickles", name: "Pickles & Chutneys", icon: "fa-solid fa-jar", count: 4, desc: "Aged in clay barnis under desert sunshine with cold-pressed mustard & sesame oils." },
    { id: "masalas", name: "Signature Masalas", icon: "fa-solid fa-crown", count: 5, desc: "Secret royal recipes balancing all six ayurvedic tastes (Shad Rasa)." }
  ],

  products: [
    // WHOLE SPICES
    {
      id: "ws-01",
      name: "Malabar Tellicherry Extra Bold Black Pepper (TGSEB)",
      category: "whole",
      categoryName: "Whole Spices",
      price: 420,
      originalPrice: 490,
      rating: 4.9,
      reviewsCount: 142,
      origin: "Wayanad, Kerala",
      harvest: "Winter 2025 Hand-picked",
      weight: "200g Glass Jar",
      image: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=1200&q=90",
      description: "Known globally as the 'King of Spices', our Tellicherry Extra Bold peppercorns are left on the vine until the utmost ripeness, delivering intense woody citrus notes and deep warming heat.",
      aromaNotes: ["Citrus Blossom", "Pungent Wood", "Smoky Cedar"],
      heatLevel: "Medium-Hot (6/10)",
      isSignature: true,
      inStock: true,
      tags: ["Bestseller", "Single-Estate", "Fair Trade"]
    },
    {
      id: "ws-02",
      name: "Alleppey Green Cardamom (8mm Supreme Extra Bold)",
      category: "whole",
      categoryName: "Whole Spices",
      price: 780,
      originalPrice: 890,
      rating: 5.0,
      reviewsCount: 98,
      origin: "Idukki Hills, Kerala",
      harvest: "Autumn Harvest",
      weight: "100g Vintage Brass Tin",
      image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=90",
      description: "Lush, fragrant green pods sorted for massive 8mm diameter. Bursting with sweet camphoraceous resin and eucalyptus aroma. Perfect for festive biryanis, desserts, and chai.",
      aromaNotes: ["Sweet Camphor", "Eucalyptus", "Floral Mint"],
      heatLevel: "Mild (2/10)",
      isSignature: true,
      inStock: true,
      tags: ["GI Tagged", "Heritage Rare", "Organic"]
    },
    {
      id: "ws-03",
      name: "Kashmiri Mongra Saffron (Grade A1+)",
      category: "whole",
      categoryName: "Whole Spices",
      price: 1350,
      originalPrice: 1550,
      rating: 5.0,
      reviewsCount: 215,
      origin: "Pampore, Kashmir",
      harvest: "November Fresh Crop",
      weight: "2g Hand-sealed Jar with Golden Tweezer",
      image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1200&q=90",
      description: "Authentic deep crimson stigmas without any yellow styles. Sourced from high-altitude saffron plateau of Pampore. Unmatched golden release and intoxicating floral honey scent.",
      aromaNotes: ["Wild Honey", "Earthy Hay", "Violet Flora"],
      heatLevel: "Delicate (1/10)",
      isSignature: true,
      inStock: true,
      tags: ["GI Tagged", "Lab Certified Crocin 240+", "Luxury"]
    },
    {
      id: "ws-04",
      name: "True Ceylon Cinnamon Quills (Alba Grade)",
      category: "whole",
      categoryName: "Whole Spices",
      price: 360,
      originalPrice: 420,
      rating: 4.8,
      reviewsCount: 76,
      origin: "Southern Coastal Sri Lanka / Kerala Border",
      harvest: "Fresh Shaved Bark",
      weight: "150g Kraft Box",
      image: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1200&q=90",
      description: "Paper-thin, multi-layered soft quills of authentic Cinnamomum verum (low coumarin). Delivers subtle sweet warmth unlike coarse cassia bark.",
      aromaNotes: ["Sweet Amber", "Warm Clove", "Vanilla Spice"],
      heatLevel: "Mild (1/10)",
      isSignature: false,
      inStock: true,
      tags: ["Low Coumarin", "Heart Friendly"]
    },
    {
      id: "ws-05",
      name: "Nagaland Star Anise (Eight-Pointed Intact Pods)",
      category: "whole",
      categoryName: "Whole Spices",
      price: 290,
      originalPrice: 340,
      rating: 4.7,
      reviewsCount: 64,
      origin: "Kohima Foothills, Nagaland",
      harvest: "Winter Sun-Cured",
      weight: "100g Sealed Pouch",
      image: "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=1200&q=90",
      description: "Intact, sun-dried star anise rich in anethole essential oil. Provides rich licorice depth to slow-braised curries, broths, and spiced mulled drinks.",
      aromaNotes: ["Sweet Licorice", "Aniseed", "Warm Herbal"],
      heatLevel: "Mild (2/10)",
      isSignature: false,
      inStock: true,
      tags: ["Whole Star", "High Essential Oil"]
    },
    {
      id: "ws-06",
      name: "Tuticorin Fragrant Whole Cloves (Laung)",
      category: "whole",
      categoryName: "Whole Spices",
      price: 310,
      originalPrice: 360,
      rating: 4.9,
      reviewsCount: 88,
      origin: "Tuticorin / Kanyakumari, Tamil Nadu",
      harvest: "Hand-culled Buds",
      weight: "100g Glass Jar",
      image: "https://images.unsplash.com/photo-1607672632458-9eb56696346b?auto=format&fit=crop&w=1200&q=90",
      description: "Plump, oil-rich flower buds with intact heads that leave an oily sheen when pressed. Powerful eugenol note that warms from the inside.",
      aromaNotes: ["Intense Eugenol", "Sweet Spice", "Balsamic"],
      heatLevel: "Pungent Warm (5/10)",
      isSignature: false,
      inStock: true,
      tags: ["Oil Rich", "Dental Friendly"]
    },

    // POWDERS
    {
      id: "pw-01",
      name: "Lakadong Organic Turmeric Powder (8.2% Curcumin)",
      category: "powders",
      categoryName: "Hand-ground Powders",
      price: 340,
      originalPrice: 399,
      rating: 5.0,
      reviewsCount: 310,
      origin: "Jaintia Hills, Meghalaya",
      harvest: "Stone-Ground Single Cultivar",
      weight: "250g Jar",
      image: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=1200&q=90",
      description: "Grown in the virgin soil of Meghalaya, containing over 8% natural Curcumin (3x standard turmeric). Deep golden saffron hue with an earthy, peppery therapeutic fragrance.",
      aromaNotes: ["Rich Earth", "Mustard Pepper", "Sunbaked Clay"],
      heatLevel: "Mild (1/10)",
      isSignature: true,
      inStock: true,
      tags: ["Superfood", "8%+ Curcumin", "Ayurvedic Grade"]
    },
    {
      id: "pw-02",
      name: "Guntur Sannam Stemless Red Chilli Powder",
      category: "powders",
      categoryName: "Hand-ground Powders",
      price: 240,
      originalPrice: 280,
      rating: 4.8,
      reviewsCount: 178,
      origin: "Guntur, Andhra Pradesh",
      harvest: "Sun-Dried Pods, Deseeded Partially",
      weight: "250g Pouch",
      image: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=1200&q=90",
      description: "Vibrant fire-red with an unmistakable fiery bite and natural smoked fruitiness. Pounded in traditional wooden pestles without artificial dyes or oil treatments.",
      aromaNotes: ["Sun-Dried Fruit", "Smoked Paprika", "Fiery Pepper"],
      heatLevel: "Very Hot (8.5/10)",
      isSignature: true,
      inStock: true,
      tags: ["Pure Heat", "Unpolished", "No Added Colour"]
    },
    {
      id: "pw-03",
      name: "Coorg Stone-Pounded Coriander Powder (Dhaniya)",
      category: "powders",
      categoryName: "Hand-ground Powders",
      price: 195,
      originalPrice: 230,
      rating: 4.7,
      reviewsCount: 94,
      origin: "Ramnad / Coorg Border",
      harvest: "Slow Roasted Seeds",
      weight: "250g Air-tight Pack",
      image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=1200&q=90",
      description: "Made from small-seeded desi coriander, dry roasted gently on clay griddles before slow pulverizing. Distinct lemony herb freshness that thickens gravy sauces.",
      aromaNotes: ["Lemon Zest", "Pine Needle", "Toasted Nut"],
      heatLevel: "Mild (1/10)",
      isSignature: false,
      inStock: true,
      tags: ["Slow Roasted", "Coarse Grind"]
    },
    {
      id: "pw-04",
      name: "Himalayan Mountain Ginger Powder (Sonth)",
      category: "powders",
      categoryName: "Hand-ground Powders",
      price: 260,
      originalPrice: 300,
      rating: 4.9,
      reviewsCount: 82,
      origin: "Sirmaur, Himachal Pradesh",
      harvest: "Shade Dried Rhizomes",
      weight: "150g Jar",
      image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=1200&q=90",
      description: "Sweet, pungent, and highly digestive mountain ginger root. Excellent for winter teas, gingerbread, traditional laddus, and tangy tamarind sonth chutneys.",
      aromaNotes: ["Zesty Pungency", "Warm Citron", "Spicy Sweet"],
      heatLevel: "Warm Zest (5/10)",
      isSignature: false,
      inStock: true,
      tags: ["Mountain Grown", "Digestive"]
    },
    {
      id: "pw-05",
      name: "Slow-Roasted Shahi Jeera Powder (Imperial Cumin)",
      category: "powders",
      categoryName: "Hand-ground Powders",
      price: 280,
      originalPrice: 320,
      rating: 4.8,
      reviewsCount: 110,
      origin: "Jodhpur, Rajasthan",
      harvest: "Charcoal Clay-Toasted",
      weight: "200g Jar",
      image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=90",
      description: "Blend of Royal Imperial Black Cumin and golden seeds toasted over slow coal fire. Releases a nutty, appetizing scent that elevates raitas and lentils.",
      aromaNotes: ["Charred Walnut", "Earthy Grass", "Toasted Cumin"],
      heatLevel: "Mild (2/10)",
      isSignature: false,
      inStock: true,
      tags: ["Clay Toasted", "Digestive"]
    },

    // PICKLES & CHUTNEYS
    {
      id: "pk-01",
      name: "Grandmother's Vintage Cut Mango Pickle (Amba Achar)",
      category: "pickles",
      categoryName: "Pickles & Chutneys",
      price: 380,
      originalPrice: 440,
      rating: 5.0,
      reviewsCount: 265,
      origin: "Varanasi, Uttar Pradesh",
      harvest: "Aged 90 Days in Ceramic Barnis",
      weight: "400g Glazed Ceramic Jar",
      image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1200&q=90",
      description: "Crispy green Ramkela raw mangoes seasoned with wild fenugreek, nigella, fennel seeds, and submerged in wood-pressed cold mustard oil. Matured slowly under sunbeams.",
      aromaNotes: ["Pungent Mustard Oil", "Sour Raw Mango", "Fennel Anise"],
      heatLevel: "Spicy & Tangy (7/10)",
      isSignature: true,
      inStock: true,
      tags: ["Sun Matured", "Cold-Pressed Mustard Oil", "Preservative Free"]
    },
    {
      id: "pk-02",
      name: "Banarasi Stuffed Red Chilli Pickle (Bharwa Lal Mirch)",
      category: "pickles",
      categoryName: "Pickles & Chutneys",
      price: 450,
      originalPrice: 520,
      rating: 4.9,
      reviewsCount: 194,
      origin: "Chandauli / Varanasi",
      harvest: "Winter Red Peppers",
      weight: "350g Glass Jar",
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1200&q=90",
      description: "Jumbo sun-ripened red chillies hand-stuffed with an artisanal masala of amchoor, roasted mustard, hing, and ajwain. A royal accompaniment to hot parathas.",
      aromaNotes: ["Tangy Mango Powder", "Asafoetida", "Robust Mustard"],
      heatLevel: "Medium Hot (6/10)",
      isSignature: true,
      inStock: true,
      tags: ["Hand Stuffed", "Heritage Recipe", "Artisanal"]
    },
    {
      id: "pk-03",
      name: "Kathiawadi Sun-Baked Sweet & Sour Lime Pickle",
      category: "pickles",
      categoryName: "Pickles & Chutneys",
      price: 320,
      originalPrice: 370,
      rating: 4.8,
      reviewsCount: 88,
      origin: "Junagadh, Gujarat",
      harvest: "Seedless Kagzi Limes",
      weight: "350g Jar",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=90",
      description: "Oil-free traditional pickle cured with organic jaggery, rock salt, and roasted cumin. The lime skins turn tender and melt like marmalade with a savory kick.",
      aromaNotes: ["Candied Citrus", "Jaggery Caramel", "Rock Salt"],
      heatLevel: "Sweet-Sour Mild (3/10)",
      isSignature: false,
      inStock: true,
      tags: ["Zero Oil", "Jaggery Sweetened", "Aged 1 Year"]
    },
    {
      id: "pk-04",
      name: "Kolhapuri Fiery Garlic & Crushed Peanut Thecha",
      category: "pickles",
      categoryName: "Pickles & Chutneys",
      price: 290,
      originalPrice: 340,
      rating: 4.9,
      reviewsCount: 153,
      origin: "Kolhapur, Maharashtra",
      harvest: "Stone Mortar Crushed",
      weight: "200g Jar",
      image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1200&q=90",
      description: "Coarsely pounded roasted green chillies, mountain garlic cloves, and toasted peanuts drizzled with smoking peanut oil. Legendary rustic condiment.",
      aromaNotes: ["Roasted Garlic", "Nutty Peanut", "Crisp Green Chilli"],
      heatLevel: "Fiery Explosive (9/10)",
      isSignature: false,
      inStock: true,
      tags: ["Mortar Pounded", "Rustic Village Condiment"]
    },

    // SIGNATURE MASALAS
    {
      id: "ms-01",
      name: "SuryaVeda Royal Shahi Garam Masala (21-Spice Blend)",
      category: "masalas",
      categoryName: "Signature Masalas",
      price: 490,
      originalPrice: 560,
      rating: 5.0,
      reviewsCount: 420,
      origin: "Mughlai Heritage Kitchens, Delhi & Awadh",
      harvest: "Batch Roasted Weekly",
      weight: "150g Antique Brass Finished Tin",
      image: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=1200&q=90",
      description: "Our crowning jewel crafted from 21 royal aromatics including dagad phool (stone flower), mace, green cardamom, star anise, and roasted saffron. Just a pinch at the end of cooking transforms any dish.",
      aromaNotes: ["Nutmeg Mace", "Cardamom Floral", "Toasted Forest Moss"],
      heatLevel: "Warm Complex (4/10)",
      isSignature: true,
      inStock: true,
      tags: ["21 Heritage Spices", "Master Chef Blend", "Flagship"]
    },
    {
      id: "ms-02",
      name: "Hyderabadi Dum Biryani Potli Masala",
      category: "masalas",
      categoryName: "Signature Masalas",
      price: 410,
      originalPrice: 480,
      rating: 4.9,
      reviewsCount: 310,
      origin: "Old City, Hyderabad",
      harvest: "Slow-Toasted Whole & Crushed",
      weight: "200g Gift Box with Muslin Potlis",
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=90",
      description: "The secret behind the legendary Nizami layered rice. Infused with wild rose petals, kewra essence bark, shahi jeera, and Tellicherry pepper. Comes with reusable organic muslin brewing potlis.",
      aromaNotes: ["Wild Damascus Rose", "Green Cardamom", "Kewra Wood"],
      heatLevel: "Medium (5/10)",
      isSignature: true,
      inStock: true,
      tags: ["Includes Muslin Sachet", "Nizami Recipe"]
    },
    {
      id: "ms-03",
      name: "Chettinad Black Pepper Roast Masala",
      category: "masalas",
      categoryName: "Signature Masalas",
      price: 360,
      originalPrice: 410,
      rating: 4.9,
      reviewsCount: 165,
      origin: "Karaikudi, Chettinad, Tamil Nadu",
      harvest: "Clay Skillet Roasted",
      weight: "200g Jar",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=90",
      description: "Distinctly dark and intense, featuring Marathi Moggu (kapok buds), stone flower, whole peppercorns, and roasted coconut flakes. The hallmark of Chettinad non-veg and mushroom delicacies.",
      aromaNotes: ["Kapok Blossom", "Roasted Coconut", "Cracked Pepper"],
      heatLevel: "Bold & Peppery (8/10)",
      isSignature: true,
      inStock: true,
      tags: ["Spicy Roast", "Chettinad Signature"]
    },
    {
      id: "ms-04",
      name: "Vedic Chai Masala with Wild Rose Petals & Saffron",
      category: "masalas",
      categoryName: "Signature Masalas",
      price: 390,
      originalPrice: 450,
      rating: 5.0,
      reviewsCount: 512,
      origin: "Pushkar & Idukki",
      harvest: "Winter Fragrance Blend",
      weight: "150g Airtight Glass Canister",
      image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=90",
      description: "Elevate your morning brew with hand-crushed green cardamom, dry mountain ginger, black pepper, Ceylon cinnamon, and fragrant dried rose petals. Warming, rejuvenating, and deeply soothing.",
      aromaNotes: ["Rose Infusion", "Ginger Warmth", "Sweet Cardamom"],
      heatLevel: "Gentle Warmth (2/10)",
      isSignature: true,
      inStock: true,
      tags: ["Chai Lover's Choice", "Ayurvedic Immuno Blend"]
    },
    {
      id: "ms-05",
      name: "Madras Heritage Golden Curry Powder",
      category: "masalas",
      categoryName: "Signature Masalas",
      price: 310,
      originalPrice: 360,
      rating: 4.8,
      reviewsCount: 140,
      origin: "Fort St. George / Chennai Tradition",
      harvest: "Stone Ground Blend",
      weight: "250g Tin",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=90",
      description: "A balanced, fragrant curry powder combining aromatic Lakadong turmeric, coriander, roasted fenugreek, curry leaf flakes, and mild chilies. Ideal for stews, lentil soups, and roasted vegetables.",
      aromaNotes: ["Crisp Curry Leaves", "Toasted Fenugreek", "Golden Turmeric"],
      heatLevel: "Medium (4/10)",
      isSignature: false,
      inStock: true,
      tags: ["Versatile Staple", "Curry Classic"]
    }
  ],

  // ESTATE CELLAR & MASTER RESERVE SERIES
  estateReserves: [
    {
      id: "res-01",
      name: "100-Year Ancient Vine Tellicherry Black Peppercorn (Single Barrel)",
      origin: "Vythiri Rainforest Estate, Wayanad (Altitude 1,200m)",
      harvest: "December Hand-plucked, aged in Rosewood Cask for 6 Months",
      price: 1850,
      weight: "250g Handcrafted Rosewood Box & Brass Spoon",
      rating: 5.0,
      image: "https://images.unsplash.com/photo-1506368249639-73a05d6f6488?auto=format&fit=crop&w=1200&q=90",
      badge: "Limited Batch (Only 150 Casks)",
      curatorNote: "Harvested strictly from vines exceeding one century in age. The peppercorns have double the piperine density, leaving a velvety citrus finish that coats the palate for minutes."
    },
    {
      id: "res-02",
      name: "Grand Imperial Kashmiri Saffron Ingot (Crocin Value 265+)",
      origin: "Karewa Terraces, Pampore, Jammu & Kashmir",
      harvest: "First Dawn November Bloom, Sun-cured on silk sheets",
      price: 3200,
      weight: "5g Sealed Velvet Box with Certified NABL Purity Card",
      rating: 5.0,
      image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=90",
      badge: "Master Reserve Gold Seal",
      curatorNote: "The highest grade of Mongra saffron available on earth. Deep blood-red stigma heads releasing an electric sunrise gold within seconds of touching warm cream or milk."
    },
    {
      id: "res-03",
      name: "Sun-Smoked Bhut Jolokia & Himalayan Pink Salt Mill",
      origin: "Dima Hasao Hills, Assam",
      harvest: "Slow Smoked over Wild Betel Nut Wood for 72 Hours",
      price: 890,
      weight: "180g Heavy Crystal Grinder with Adjustable Ceramic Burr",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=1200&q=90",
      badge: "Artisanal Smoked Reserve",
      curatorNote: "Combines the terrifying, sweet fruity aroma of ghost peppers with ancient rock crystals. Perfect for finishing ribeyes, charred portobellos, and spicy cocktails."
    }
  ],

  // RECIPES WITH VISUAL STEP-BY-STEP EXPLANATIONS
  recipes: [
    {
      id: "rc-01",
      title: "Royal Awadhi Dum Biryani with Golden Saffron & Shahi Potli",
      category: "Signature Main",
      prepTime: "45 mins",
      cookTime: "50 mins",
      difficulty: "Master Level",
      servings: 4,
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=90",
      imageExplanation: "Authentic Awadhi Dum Biryani: Long aged basmati grains infused with steeped saffron milk, fried barista onions, and tender cuts slow-steamed under dough seal.",
      overview: "A timeless masterpiece of long-grain aged Basmati rice layered with aromatic marinated cuts or charred paneer, sealed under whole-wheat dough to trap the fragrant vapor.",
      keySpices: ["ws-03", "ms-02", "ws-02", "ws-01"],
      ingredients: [
        "500g Aged Basmati Rice (soaked for 45 mins)",
        "600g Protein (Chicken / Lamb / Spiced Pressed Paneer cubes)",
        "1 sachet SuryaVeda Hyderabadi Dum Biryani Potli Masala",
        "0.5g SuryaVeda Kashmiri Mongra Saffron (steeped in 4 tbsp warm milk)",
        "4 pods SuryaVeda Alleppey Green Cardamom (lightly crushed)",
        "1 tsp SuryaVeda Tellicherry Black Pepper",
        "1.5 cups Thick Curd / Greek Yogurt",
        "3 large Onions, sliced paper-thin and deep fried to golden barista",
        "1/2 cup Fresh Mint & Coriander leaves",
        "4 tbsp Pure Desi A2 Ghee"
      ],
      steps: [
        {
          stepNumber: 1,
          title: "Marination & Potli Infusion",
          instruction: "Whisk curd with half the fried barista onions, ginger-garlic paste, 2 tablespoons of Hyderabadi Potli Masala, and salt. Coat your protein and allow to marinate for at least 2 hours to let the tenderizing enzymes and spices penetrate.",
          stepImage: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=85",
          stepCaption: "Visual Guide: Coating cuts in aromatic spiced yogurt and hand-crushed whole cardamom pods."
        },
        {
          stepNumber: 2,
          title: "Parboiling Basmati with Whole Terroir Spices",
          instruction: "In a heavy copper handi, boil 3 liters of water with whole green cardamom, cloves, cinnamon, and 2 tablespoons of salt. Add soaked rice and cook until 70% parboiled (approx 6-7 minutes). Drain immediately.",
          stepImage: "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?auto=format&fit=crop&w=800&q=85",
          stepCaption: "Visual Guide: Boiling aged basmati with whole quills and cloves to impart aromatic oil into every grain."
        },
        {
          stepNumber: 3,
          title: "Layering Saffron Milk, Barista & Ghee",
          instruction: "Layer the marinated protein at the bottom of the handi. Top with a layer of hot rice, drizzle generous spoons of saffron milk, ghee, mint leaves, and remaining barista onions.",
          stepImage: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=85",
          stepCaption: "Visual Guide: Pouring steeped golden Kashmiri saffron milk across hot steam layers."
        },
        {
          stepNumber: 4,
          title: "Wheat Dough Dum Steam Sealing",
          instruction: "Seal the rim with wheat flour dough and top with a tight lid. Place over high heat for 5 minutes, then transfer onto a flat iron tawa on low flame for 40 minutes of gentle 'Dum' slow steam.",
          stepImage: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=85",
          stepCaption: "Visual Guide: Breaking open the baked aromatic dough seal to unleash trapped fragrant vapor."
        }
      ],
      pairingTip: "Pair with Grandma's Vintage Mango Achar and chilled cumin lassi."
    },
    {
      id: "rc-02",
      title: "Chettinad Black Pepper Roast (Kozhi / Wild Mushroom)",
      category: "Rustic Main",
      prepTime: "20 mins",
      cookTime: "30 mins",
      difficulty: "Intermediate",
      servings: 3,
      image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1200&q=90",
      imageExplanation: "Dark, aromatic Chettinad Pepper Roast: Caramelized shallots, toasted kapok buds, curry leaves, and freshly crushed Tellicherry black pepper.",
      overview: "Dark, unctuous, and delightfully spicy dry roast bursting with the punch of freshly pounded Tellicherry peppercorns and curry leaves.",
      keySpices: ["ms-03", "ws-01", "pw-01"],
      ingredients: [
        "500g Boneless Cuts or King Oyster Mushrooms",
        "2.5 tbsp SuryaVeda Chettinad Pepper Roast Masala",
        "1 tbsp SuryaVeda Tellicherry Black Pepper (freshly crushed)",
        "1/2 tsp Lakadong Turmeric Powder",
        "2 sprigs Fresh Curry Leaves",
        "15 Shallots (Sambhar Onions), peeled and halved",
        "3 tbsp Cold-Pressed Sesame / Gingelly Oil",
        "1 tbsp Ginger Garlic Paste"
      ],
      steps: [
        {
          stepNumber: 1,
          title: "Tempering Whole Spices in Cold-Pressed Oil",
          instruction: "Heat gingelly oil in a cast-iron skillet until fragrant. Splutter mustard seeds, then toss in fresh curry leaves and whole shallots until browned and sweet.",
          stepImage: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=85",
          stepCaption: "Visual Guide: Sizzling fresh curry leaves and shallots in dark unrefined gingelly oil."
        },
        {
          stepNumber: 2,
          title: "High-Heat Searing with Chettinad Masala",
          instruction: "Add the marinated protein and sear on high heat for 4 minutes to seal juices. Stir in the remaining Chettinad roast masala and splash 1/4 cup hot water.",
          stepImage: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=85",
          stepCaption: "Visual Guide: Pounding toasted roasted spices in stone mortar before searing."
        },
        {
          stepNumber: 3,
          title: "Finishing with Coarse Tellicherry Peppercorn Dust",
          instruction: "Cover and simmer until tender and sauce clings heavily to each piece. Finish with a generous scatter of freshly crushed Tellicherry peppercorns and fresh coriander.",
          stepImage: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=85",
          stepCaption: "Visual Guide: Final dry glaze clinging to succulent caramelized pieces."
        }
      ],
      pairingTip: "Best enjoyed with flaky Malabar parottas or steaming hot ghee rice."
    },
    {
      id: "rc-03",
      title: "Golden Immunity Moon Milk with Lakadong & Wild Rose",
      category: "Wellness & Elixir",
      prepTime: "5 mins",
      cookTime: "10 mins",
      difficulty: "Easy",
      servings: 2,
      image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=90",
      imageExplanation: "Ayurvedic Restorative Moon Milk: Frothy golden brew of high-curcumin Meghalaya turmeric, crushed green cardamom, and fragrant dried rose petals.",
      overview: "An ancient restorative bedtime Ayurvedic drink formulated to soothe the nervous system, reduce inflammation, and induce deep restful sleep.",
      keySpices: ["pw-01", "ms-04", "ws-04"],
      ingredients: [
        "2 cups A2 Whole Milk or Creamy Oat/Almond Milk",
        "1 tsp SuryaVeda Lakadong Turmeric (8.2% Curcumin)",
        "1/2 tsp SuryaVeda Chai Masala with Wild Rose",
        "1 small stick Ceylon Cinnamon",
        "Pinch of crushed Tellicherry Black Pepper (activates curcumin bioavailability by 2000%)",
        "1.5 tsp Raw Forest Honey or Jaggery Syrup",
        "1/2 tsp Grass-Fed Ghee or Cold-pressed Virgin Coconut Oil"
      ],
      steps: [
        {
          stepNumber: 1,
          title: "Infusing Bio-Active Spices in Simmering Milk",
          instruction: "Pour milk into a heavy-bottomed brass or steel pot over medium heat. Whisk in Lakadong turmeric powder, Chai Masala, cinnamon quill, and black pepper.",
          stepImage: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=85",
          stepCaption: "Visual Guide: Whisking brilliant golden Lakadong powder into warm milk."
        },
        {
          stepNumber: 2,
          title: "Essential Fat Emulsification & Honey Sweetening",
          instruction: "Bring to a gentle frothy simmer, stirring continuously for 4 minutes. Stir in ghee or virgin coconut oil. Cool slightly before blending raw honey to preserve live enzymes.",
          stepImage: "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=800&q=85",
          stepCaption: "Visual Guide: Frothing the elixir and garnishing with dried Pushkar rose petals."
        }
      ],
      pairingTip: "Sip 30 minutes before sleep as a calming bedtime ritual."
    },
    {
      id: "rc-04",
      title: "Royal Awadhi Paneer Tikka with Bharwa Mirch Crust",
      category: "Appetizer & Grill",
      prepTime: "25 mins",
      cookTime: "15 mins",
      difficulty: "Intermediate",
      servings: 4,
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1200&q=90",
      imageExplanation: "Tandoor Charred Paneer Skewers: Marinated in hung curd, roasted gram flour, and pungent mustard oil from vintage Banarasi Bharwa Lal Mirch.",
      overview: "Smoky tandoor-style cottage cheese steaks marinated in strained yogurt and rubbed with the tangy, spicy oil of Banarasi Bharwa Lal Mirch.",
      keySpices: ["pk-02", "ms-01", "pw-02"],
      ingredients: [
        "400g Malai Paneer, cut into 1.5-inch thick squares",
        "2 tbsp Oil and Masala from SuryaVeda Banarasi Stuffed Red Chilli Pickle",
        "1 tbsp SuryaVeda Royal Shahi Garam Masala",
        "1 tsp Guntur Red Chilli Powder",
        "3/4 cup Hung Curd",
        "1 tbsp Roasted Gram Flour (Besan)",
        "1 tsp Kasuri Methi (crushed)",
        "Bell peppers and red onions cubed"
      ],
      steps: [
        {
          stepNumber: 1,
          title: "Pickle Oil Marinade Emulsion",
          instruction: "In a bowl, mix hung curd with roasted besan, Royal Shahi Garam Masala, chilli powder, and the spicy oil from Banarasi Stuffed Chilli jar.",
          stepImage: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=85",
          stepCaption: "Visual Guide: Scooping pungent mustard pickling oil rich in amchoor and ajwain."
        },
        {
          stepNumber: 2,
          title: "Charcoal Grilling to Smoked Edges",
          instruction: "Thread onto skewers and roast over an open grill, oven at 220°C, or cast iron grill pan with butter until charred edges form. Sprinkle with chaat masala and lemon.",
          stepImage: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=85",
          stepCaption: "Visual Guide: Blistering skewers over open coals for signature Awadhi smokiness."
        }
      ],
      pairingTip: "Serve with pickled onion rings and mint coriander chutney."
    }
  ],

  terroirMap: [
    { region: "Kashmir Valley", lat: "34.08", lng: "74.79", spice: "Kashmiri Mongra Saffron", note: "High altitude (1,600m), glacier water irrigation, unique violet purple crocus blossoms." },
    { region: "Meghalaya Hills", lat: "25.57", lng: "91.89", spice: "Lakadong Turmeric", note: "Pristine coal-free hills yielding 8.2%+ therapeutic curcumin content." },
    { region: "Wayanad & Idukki, Kerala", lat: "10.85", lng: "76.27", spice: "Tellicherry Pepper & Cardamom", note: "Ancient spice coast with misty rainforest canopy and rich volcanic soil." },
    { region: "Guntur, Andhra Pradesh", lat: "16.30", lng: "80.43", spice: "Sannam Red Chilli", note: "Black cotton soil and intense tropical sun producing bright color and fiery capsaicin." },
    { region: "Varanasi, Uttar Pradesh", lat: "25.31", lng: "82.97", spice: "Sun-Matured Barni Pickles", note: "Centuries-old pickling masters using cold-pressed mustard oils and clay vessels." }
  ],

  bulkTiers: [
    { minKg: 5, maxKg: 20, discount: 15, label: "Artisanal Cafe / Boutique Kitchen", badge: "15% Off" },
    { minKg: 21, maxKg: 50, discount: 25, label: "Fine Dining & Hotels", badge: "25% Off" },
    { minKg: 51, maxKg: 200, discount: 35, label: "Export & Gourmet Food Manufacturers", badge: "35% Off" },
    { minKg: 201, maxKg: 1000, discount: 45, label: "Wholesale Commodity & Private Label", badge: "45% Off + Custom Brass/Jute Branding" }
  ],

  testimonials: [
    {
      name: "Chef Ranveer Brar",
      role: "Celebrity Master Chef & Culinary Historian",
      comment: "The Tellicherry TGSEB peppercorns and Royal Shahi Garam Masala from SuryaVeda carry that elusive vintage aroma you only read about in ancient Awadhi court recipes.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=300&q=85"
    },
    {
      name: "Radhika Kulkarni",
      role: "Home Baker & Chai Enthusiast, Mumbai",
      comment: "Their Chai Masala with Damascus rose petals transformed our home's morning routine. You can immediately tell there are zero fillers or stale dust.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=85"
    },
    {
      name: "Vikramjit Singhania",
      role: "Procurement Director, Heritage Resorts",
      comment: "We source our bulk spices directly in custom embossed jute bags. The consistency across seasons and lab certificates for zero adulteration are impeccable.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=85"
    }
  ]
};
