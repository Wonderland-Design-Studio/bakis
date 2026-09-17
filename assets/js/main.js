document.addEventListener('DOMContentLoaded', () => {
  // Ensure the brand logo is ALWAYS set as the favicon across all conditions
  const enforceFavicon = () => {
    let iconLink = document.querySelector("link[rel*='icon']");
    if (!iconLink) {
      iconLink = document.createElement('link');
      iconLink.rel = 'icon';
      document.head.appendChild(iconLink);
    }
    if (!iconLink.href.includes('favicon-32x32.png') && !iconLink.href.includes('favicon.ico')) {
      iconLink.type = 'image/png';
      iconLink.href = 'favicon-32x32.png';
    }
  };
  enforceFavicon();
  // Mobile drawer toggle
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isActive = mobileDrawer.classList.toggle('active');
      mobileToggle.classList.toggle('active', isActive);
      document.body.style.overflow = isActive ? 'hidden' : '';
    });

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('active');
        mobileToggle.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // Sticky header background and shadow on scroll
  const siteHeader = document.getElementById('siteHeader');
  const handleScroll = () => {
    if (window.scrollY > 20) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Back to top smooth scroll handler
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Contact form handling
  const contactForm = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccessMessage');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerText;
      submitBtn.innerText = 'Submitting...';
      submitBtn.disabled = true;

      setTimeout(() => {
        contactForm.reset();
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
        if (successMsg) {
          successMsg.style.display = 'block';
          setTimeout(() => {
            successMsg.style.display = 'none';
          }, 6000);
        }
      }, 700);
    });
  }

  // Commodities & Products search dataset
  const catalogItems = [
    { title: 'Circuit Breakers', category: 'Product Range', hash: '#products' },
    { title: 'Distribution boards', category: 'Product Range', hash: '#products' },
    { title: 'Switchgear', category: 'Product Range', hash: '#products' },
    { title: 'Surge Arrestors', category: 'Product Range', hash: '#products' },
    { title: 'Solar Solutions', category: 'Product Range', hash: '#products' },
    { title: 'Cables', category: 'Product Range', hash: '#products' },
    { title: 'Sub Station Equipment', category: 'Product Range', hash: '#products' },
    { title: 'Street Lighting', category: 'Product Range', hash: '#products' },
    { title: 'Electrical Cables, Switches, Fuses, Meters, Hardware and Accessories', category: 'Commodities', hash: '#products' },
    { title: 'Clamps, Ferrules, Terminal Blocks, lugs, Joints, tapes, Locks, Pole Top Boxes', category: 'Commodities', hash: '#products' },
    { title: 'Copper Rods, busbars, strips, Fuses,', category: 'Commodities', hash: '#products' },
    { title: 'Batteries, Relay, Street Lighting, Lamps', category: 'Commodities', hash: '#products' },
    { title: 'Joint Kits, Term Kits, Circuit Breakers', category: 'Commodities', hash: '#products' },
    { title: 'Enclosures', category: 'Commodities', hash: '#products' },
    { title: 'Cable, Tie Sides', category: 'Commodities', hash: '#products' },
    { title: 'Buckle Straps, Bird Divertors', category: 'Commodities', hash: '#products' },
    { title: 'Surge Arrestors', category: 'Commodities', hash: '#products' },
    { title: 'Bearings', category: 'Commodities', hash: '#products' },
    { title: 'Anti-theft conductor', category: 'Commodities', hash: '#products' },
    { title: '100% Black Women Owned (BWO)', category: 'About Bakis', hash: '#about' },
    { title: 'Level 1 BBBEE Engineering Company', category: 'About Bakis', hash: '#about' }
  ];

  // Search Modal
  const searchBtn = document.getElementById('searchBtn');
  const searchModal = document.getElementById('searchModal');
  const searchClose = document.getElementById('searchClose');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');

  function renderResults(query = '') {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? catalogItems.filter(item => item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q))
      : catalogItems.slice(0, 8);

    if (filtered.length === 0) {
      searchResults.innerHTML = '<div style="padding: 1rem; color: #738a7e; text-align: center;">No commodities matched your query. Contact us for custom sourcing.</div>';
      return;
    }

    searchResults.innerHTML = filtered.map(item => `
      <div class="search-result-item" onclick="location.href='${item.hash}'; document.getElementById('searchModal').classList.remove('active');">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 32px; height: 32px; border-radius: 6px; background: #eff4f1; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <svg class="bk-icon bk-icon-light primary" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
              <circle cx="12" cy="12" r="8"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          </div>
          <div>
            <div style="font-weight: 600; color: #111b15; font-size: 0.95rem;">${item.title}</div>
            <div style="font-size: 0.72rem; color: #0a4d29; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em; margin-top: 2px;">${item.category}</div>
          </div>
        </div>
        <svg class="bk-icon bk-icon-light" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="13 6 19 12 13 18"></polyline>
        </svg>
      </div>
    `).join('');
  }

  if (searchBtn && searchModal && searchClose && searchInput) {
    searchBtn.addEventListener('click', () => {
      searchModal.classList.add('active');
      searchInput.value = '';
      renderResults();
      setTimeout(() => searchInput.focus(), 100);
    });

    searchClose.addEventListener('click', () => {
      searchModal.classList.remove('active');
    });

    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) {
        searchModal.classList.remove('active');
      }
    });

    searchInput.addEventListener('input', (e) => {
      renderResults(e.target.value);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && searchModal.classList.contains('active')) {
        searchModal.classList.remove('active');
      }
    });
  }

  // Hero Featured Commodities Rotating Carousel
  const heroCarousel = document.getElementById('heroProductCarousel');
  if (heroCarousel) {
    const slides = heroCarousel.querySelectorAll('.carousel-slide');
    const indicators = heroCarousel.querySelectorAll('.carousel-indicators .indicator');
    let currentIndex = 0;
    let timer = null;
    const intervalTime = 3200; // 3.2 seconds rotation

    const showSlide = (index) => {
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });
      indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === index);
      });
      currentIndex = index;
    };

    const nextSlide = () => {
      const nextIndex = (currentIndex + 1) % slides.length;
      showSlide(nextIndex);
    };

    const startRotation = () => {
      if (!timer) {
        timer = setInterval(nextSlide, intervalTime);
      }
    };

    const stopRotation = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    // Indicators click
    indicators.forEach((indicator) => {
      indicator.addEventListener('click', (e) => {
        const slideIndex = parseInt(e.target.getAttribute('data-slide'), 10);
        if (!isNaN(slideIndex)) {
          showSlide(slideIndex);
          stopRotation();
          startRotation();
        }
      });
    });

    // Pause on hover
    heroCarousel.addEventListener('mouseenter', stopRotation);
    heroCarousel.addEventListener('mouseleave', startRotation);
    heroCarousel.addEventListener('touchstart', stopRotation, { passive: true });
    heroCarousel.addEventListener('touchend', startRotation, { passive: true });

    startRotation();
  }

  // ==========================================================================
  // Product Catalog Dataset with LocalStorage Persistence & Dynamic Grid Sync
  // ==========================================================================
  const defaultProductCatalog = {
    'circuit-breakers': {
      title: 'Circuit Breakers',
      category: 'Electrical Protection',
      bgColor: '#253b58',
      image: 'assets/images/product-circuit-breakers-trans.png',
      tagline: 'High-performance trip mechanisms engineered for medium and low-voltage industrial distribution networks.',
      spanClass: 'tile-span-large',
      specs: [
        { label: 'Voltage Range', value: '400V – 36kV' },
        { label: 'Breaking Capacity', value: 'Up to 50kA / 65kA' },
        { label: 'Standards', value: 'IEC 60947-2 / SANS' },
        { label: 'Mounting Type', value: 'Fixed & Withdrawable' }
      ],
      description: `
        <p>Bakis Engineering delivers robust, precision-calibrated circuit breakers designed to safeguard transformers, distribution feeders, and high-load industrial machinery from overloads, short-circuits, and earth faults.</p>
        <ul>
          <li>Thermal-magnetic and microprocessor-based electronic trip units.</li>
          <li>High fault withstand capabilities with rapid arc quenching chambers.</li>
          <li>Seamless integration into motor control centers (MCC) and main distribution boards.</li>
        </ul>
      `
    },
    'distribution-boards': {
      title: 'Distribution Boards',
      category: 'Power Enclosures',
      bgColor: '#265953',
      image: 'assets/images/product-distribution-boards-trans.png',
      tagline: 'Precision-fabricated power enclosures, switchboards, and motor control centers engineered to client specifications.',
      spanClass: '',
      specs: [
        { label: 'Ingress Protection', value: 'IP54 / IP65 Rated' },
        { label: 'Enclosure Material', value: '3CR12 / Mild / Stainless' },
        { label: 'Rated Current', value: '100A – 4000A Busbars' },
        { label: 'Compliance', value: 'SANS 10142 / IEC 61439' }
      ],
      description: `
        <p>Custom-built low voltage and medium voltage distribution boards engineered for mining, commercial utilities, and municipal power distribution infrastructure.</p>
        <ul>
          <li>Modular compartmentalized designs with Form 1 through Form 4 segregation.</li>
          <li>Electrostatic powder-coated finishes for extreme ambient and outdoor durability.</li>
          <li>Pre-wired with certified metering, surge suppressors, and isolators.</li>
        </ul>
      `
    },
    'switchgear': {
      title: 'Switchgear',
      category: 'Medium & High Voltage',
      bgColor: '#398896',
      image: 'assets/images/product-switchgear-trans.png',
      tagline: 'State-of-the-art gas-insulated (GIS) and air-insulated (AIS) switchgear systems ensuring continuous grid reliability.',
      spanClass: '',
      specs: [
        { label: 'Nominal Voltage', value: '11kV / 22kV / 33kV' },
        { label: 'Busbar Rating', value: '630A – 3150A' },
        { label: 'Short-Time Current', value: '25kA / 31.5kA (3s)' },
        { label: 'Arc Classification', value: 'IAC AFLR Certified' }
      ],
      description: `
        <p>Advanced primary and secondary distribution switchgear engineered for utility substations, renewable energy farms, and critical industrial processing plants.</p>
        <ul>
          <li>Internal arc-classified architecture protecting personnel and surrounding infrastructure.</li>
          <li>Vacuum circuit breaker (VCB) technology offering maintenance-free contact cycles.</li>
          <li>SCADA-ready protection relays with comprehensive remote telecontrol capabilities.</li>
        </ul>
      `
    },
    'surge-arrestors': {
      title: 'Surge Arrestors',
      category: 'Overvoltage Defense',
      bgColor: '#2e4d68',
      image: 'assets/images/product-surge-arrestors-trans.png',
      tagline: 'Heavy-duty metal-oxide polymer and porcelain surge arrestors defending transmission lines against lightning and switching surges.',
      spanClass: '',
      specs: [
        { label: 'System Voltage', value: '1kV – 132kV' },
        { label: 'Discharge Current', value: '10kA / 20kA Nominal' },
        { label: 'Housing Material', value: 'Hydrophobic Silicone' },
        { label: 'Classification', value: 'Class 1 / Class 2 Station' }
      ],
      description: `
        <p>Engineered gapless metal-oxide varistor (MOV) surge arrestors providing non-linear volt-ampere protection for power lines, distribution transformers, and substation equipment.</p>
        <ul>
          <li>Outstanding hydrophobic polymer weather sheds preventing surface flashovers.</li>
          <li>High energy absorption capacity with seismic and mechanical shock resistance.</li>
          <li>Equipped with surge counters and disconnectors for rapid diagnostic monitoring.</li>
        </ul>
      `
    },
    'fuse-links': {
      title: 'HRC Fuse Links',
      category: 'HRC Protection',
      bgColor: '#4792a5',
      image: 'assets/images/product-fuse-link-trans.png',
      tagline: 'High Breaking Capacity (HRC) knife-blade and bolted fuse links engineered for selective low and medium voltage fault clearing.',
      spanClass: 'tile-span-medium',
      specs: [
        { label: 'Current Ratings', value: '16A – 630A (NH00 to NH3)' },
        { label: 'Breaking Capacity', value: '120kA at 500VAC' },
        { label: 'Utilization Class', value: 'gG / gL / aM' },
        { label: 'Standard', value: 'IEC 60269-2 / DIN 43620' }
      ],
      description: `
        <p>Bakis Engineering genuine industrial HRC fuse links feature high-purity ceramic bodies filled with quartz sand for instant arc suppression and heat dissipation.</p>
        <ul>
          <li>Visual red top-indicator window for rapid blown-fuse identification.</li>
          <li>Corrosion-resistant silver-plated copper contact blades ensuring minimal power loss.</li>
          <li>Precision-matched current-limiting characteristics protecting downstream conductors.</li>
        </ul>
      `
    },
    'cables': {
      title: 'Electrical Cables',
      category: 'Transmission & Reticulation',
      bgColor: '#8e393b',
      image: 'assets/images/product-cables-trans.png',
      tagline: 'Comprehensive LV, MV, and HV copper and aluminum conductors engineered for underground reticulation and overhead power lines.',
      spanClass: 'tile-span-medium',
      specs: [
        { label: 'Voltage Classes', value: '600/1000V up to 33kV' },
        { label: 'Conductor Types', value: 'Stranded Copper / Aluminum' },
        { label: 'Armoring', value: 'SWA / AWA / Unarmored' },
        { label: 'Insulation', value: 'XLPE / PVC / Low Smoke Zero Halogen' }
      ],
      description: `
        <p>Certified energy reticulation cabling compliant with Eskom, SANS 1507, and international standards, supplying industrial mining, commercial estates, and municipal grids.</p>
        <ul>
          <li>Armored steel-wire (SWA) cables engineered for direct buried installations.</li>
          <li>Anti-theft conductors, specialized flexible trailing cables, and control multi-cores.</li>
          <li>UV-stabilized, flame-retardant outer sheathing built for harsh African terrain.</li>
        </ul>
      `
    },
    'insulators-substation': {
      title: 'Insulators & Substation Equipment',
      category: 'Grid Infrastructure',
      bgColor: '#1e4a3b',
      image: 'assets/images/product-insulators-trans.png',
      tagline: 'High-voltage composite silicone and glazed porcelain disc insulators, post insulators, and substation busbar hardware.',
      spanClass: '',
      specs: [
        { label: 'Creepage Distance', value: '25mm/kV – 31mm/kV Heavy' },
        { label: 'Mechanical Strength', value: '70kN – 300kN Cantilever' },
        { label: 'Voltage Rating', value: '11kV up to 400kV' },
        { label: 'Insulator Material', value: 'High-Strength Glazed Porcelain / Polymeric' }
      ],
      description: `
        <p>Engineered substation and overhead line insulators designed to withstand mechanical cantilever loads, high pollution levels, and severe environmental lightning impulses.</p>
        <ul>
          <li>Pin, post, strain, and suspension configurations with galvanized end fittings.</li>
          <li>High thermal-shock resistance with superior puncture withstand capabilities.</li>
          <li>Supplied with clamps, terminal blocks, disconnectors, and earthing assemblies.</li>
        </ul>
      `
    },
    'street-lighting': {
      title: 'Street Lighting & Luminaires',
      category: 'Municipal & Industrial',
      bgColor: '#1e3352',
      image: 'assets/images/product-streetlighting-trans.png',
      tagline: 'High-efficiency LED luminaires, solar street poles, and floodlighting systems built for road networks and industrial perimeters.',
      spanClass: '',
      specs: [
        { label: 'Power Output', value: '50W – 300W High Flux' },
        { label: 'Luminous Efficacy', value: '140+ Lumens/Watt' },
        { label: 'Surge Protection', value: '10kV / 20kV SPD Integrated' },
        { label: 'IP & IK Rating', value: 'IP66 / IK09 Ruggedized' }
      ],
      description: `
        <p>Rugged, energy-saving public and industrial illumination solutions engineered for municipal roads, mining compounds, substations, and commercial parks.</p>
        <ul>
          <li>Die-cast corrosion-resistant aluminum housing with tempered glass optical lens.</li>
          <li>Intelligent photocell twilight switching and optional solar battery reticulation.</li>
          <li>Optically optimized light distribution angles ensuring uniform road illumination.</li>
        </ul>
      `
    }
  };

  const STORAGE_KEY = 'bakis_product_catalog_v1';
  let productCatalog = {};

  const loadCatalog = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        productCatalog = JSON.parse(stored);
      } else {
        productCatalog = JSON.parse(JSON.stringify(defaultProductCatalog));
        saveCatalog();
      }
    } catch (e) {
      productCatalog = JSON.parse(JSON.stringify(defaultProductCatalog));
    }
  };

  const saveCatalog = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(productCatalog));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  };

  loadCatalog();

  // Render Front-End Mosaic Bento Grid from catalog
  const mosaicGrid = document.querySelector('.products-mosaic-grid');
  const renderMosaicGrid = () => {
    if (!mosaicGrid) return;
    const keys = Object.keys(productCatalog);
    mosaicGrid.innerHTML = keys
      .map((key, index) => {
        const item = productCatalog[key];
        const spanClass = item.spanClass || (index === 0 ? 'tile-span-large' : '');
        return `
        <div class="mosaic-product-tile ${spanClass}" data-product="${key}" role="button" tabindex="0" aria-label="View details for ${item.title}" style="background-color: ${item.bgColor || '#253b58'};">
          <div class="mosaic-tile-top">
            <span class="mosaic-tile-category">${item.category}</span>
            <h3 class="mosaic-tile-title">${item.title}</h3>
          </div>
          <div class="mosaic-tile-media">
            <img src="${item.image}" alt="${item.title}" loading="lazy">
          </div>
          <div class="mosaic-tile-action">
            <span class="mosaic-btn-circle" aria-label="Enquire ${item.title}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="13 6 19 12 13 18"></polyline>
              </svg>
            </span>
          </div>
        </div>
      `;
      })
      .join('');

    // Rebind click & keyboard handlers to new mosaic tiles
    mosaicGrid.querySelectorAll('.mosaic-product-tile[data-product]').forEach(tile => {
      const productId = tile.getAttribute('data-product');

      tile.addEventListener('click', (e) => {
        e.preventDefault();
        openProductModal(productId);
      });

      tile.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openProductModal(productId);
        }
      });
    });
  };

  renderMosaicGrid();

  // Detail Modal Elements
  const productModal = document.getElementById('productModal');
  const productModalClose = document.getElementById('productModalClose');
  const productModalDismissBtn = document.getElementById('productModalDismissBtn');
  const productModalVisual = document.getElementById('productModalVisual');
  const productModalBadge = document.getElementById('productModalCategory');
  const productModalImage = document.getElementById('productModalImage');
  const productModalTitle = document.getElementById('productModalTitle');
  const productModalTagline = document.getElementById('productModalTagline');
  const productModalSpecs = document.getElementById('productModalSpecs');
  const productModalDescription = document.getElementById('productModalDescription');
  const productModalRfqBtn = document.getElementById('productModalRfqBtn');

  const openProductModal = (productId) => {
    const data = productCatalog[productId];
    if (!data || !productModal) return;

    productModalVisual.style.backgroundColor = data.bgColor || '#253b58';
    productModalBadge.innerText = data.category || 'Product';
    productModalImage.src = data.image;
    productModalImage.alt = data.title;
    productModalTitle.innerText = data.title;
    productModalTagline.innerText = data.tagline;
    productModalDescription.innerHTML = data.description;

    if (productModalSpecs) {
      productModalSpecs.innerHTML = (data.specs || [])
        .map(
          spec => `
          <div class="spec-badge">
            <span class="spec-label">${spec.label}</span>
            <span class="spec-value">${spec.value}</span>
          </div>
        `
        )
        .join('');
    }

    if (productModalRfqBtn) {
      productModalRfqBtn.onclick = () => {
        closeProductModal();
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
          const messageField = contactForm.querySelector('textarea[name="message"], textarea');
          if (messageField) {
            messageField.value = `Hi Bakis Engineering, I would like to request an RFQ / technical quotation for: ${data.title} (${data.category}).`;
          }
        }
      };
    }

    productModal.classList.add('active');
    productModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeProductModal = () => {
    if (!productModal) return;
    productModal.classList.remove('active');
    productModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (productModalClose) productModalClose.addEventListener('click', closeProductModal);
  if (productModalDismissBtn) productModalDismissBtn.addEventListener('click', closeProductModal);
  if (productModal) {
    productModal.addEventListener('click', (e) => {
      if (e.target === productModal) closeProductModal();
    });
  }

  // ==========================================================================
  // Product Management / Admin Area Controller
  // ==========================================================================
  const adminModal = document.getElementById('adminModal');
  const openAdminBtn = document.getElementById('openAdminBtn');
  const adminModalClose = document.getElementById('adminModalClose');
  const tabCatalogList = document.getElementById('tabCatalogList');
  const tabAddProduct = document.getElementById('tabAddProduct');
  const tabMobileConnect = document.getElementById('tabMobileConnect');
  const paneCatalogList = document.getElementById('paneCatalogList');
  const paneAddProduct = document.getElementById('paneAddProduct');
  const paneMobileConnect = document.getElementById('paneMobileConnect');
  const btnCopyMobileLink = document.getElementById('btnCopyMobileLink');
  const copyLinkText = document.getElementById('copyLinkText');
  const mobileAccessUrlInput = document.getElementById('mobileAccessUrlInput');
  const adminProductTableBody = document.getElementById('adminProductTableBody');
  const adminProductCount = document.getElementById('adminProductCount');
  const adminSearchInput = document.getElementById('adminSearchInput');
  const btnUploadProductShortcut = document.getElementById('btnUploadProductShortcut');
  const btnCancelProduct = document.getElementById('btnCancelProduct');
  const btnResetCatalog = document.getElementById('btnResetCatalog');
  const adminProductForm = document.getElementById('adminProductForm');

  // Form Fields
  const editProductId = document.getElementById('editProductId');
  const prodTitle = document.getElementById('prodTitle');
  const prodCategory = document.getElementById('prodCategory');
  const prodTagline = document.getElementById('prodTagline');
  const prodTheme = document.getElementById('prodTheme');
  const prodDescription = document.getElementById('prodDescription');
  const prodImageData = document.getElementById('prodImageData');
  const prodImageFile = document.getElementById('prodImageFile');
  const adminDropzone = document.getElementById('adminDropzone');
  const dropzonePrompt = document.getElementById('dropzonePrompt');
  const dropzonePreview = document.getElementById('dropzonePreview');
  const previewImage = document.getElementById('previewImage');
  const btnRemovePreview = document.getElementById('btnRemovePreview');
  const btnSaveText = document.getElementById('btnSaveText');

  const specLabel1 = document.getElementById('specLabel1');
  const specVal1 = document.getElementById('specVal1');
  const specLabel2 = document.getElementById('specLabel2');
  const specVal2 = document.getElementById('specVal2');
  const specLabel3 = document.getElementById('specLabel3');
  const specVal3 = document.getElementById('specVal3');
  const specLabel4 = document.getElementById('specLabel4');
  const specVal4 = document.getElementById('specVal4');

  const openAdminModal = () => {
    if (!adminModal) return;
    renderAdminTable();
    switchAdminTab('list');
    adminModal.classList.add('active');
    adminModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeAdminModal = () => {
    if (!adminModal) return;
    adminModal.classList.remove('active');
    adminModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const switchAdminTab = (tab) => {
    [tabCatalogList, tabAddProduct, tabMobileConnect].forEach(btn => {
      if (btn) btn.classList.remove('active');
    });
    [paneCatalogList, paneAddProduct, paneMobileConnect].forEach(pane => {
      if (pane) pane.classList.remove('active');
    });

    if (tab === 'list') {
      if (tabCatalogList) tabCatalogList.classList.add('active');
      if (paneCatalogList) paneCatalogList.classList.add('active');
    } else if (tab === 'form') {
      if (tabAddProduct) tabAddProduct.classList.add('active');
      if (paneAddProduct) paneAddProduct.classList.add('active');
    } else if (tab === 'mobile') {
      if (tabMobileConnect) tabMobileConnect.classList.add('active');
      if (paneMobileConnect) paneMobileConnect.classList.add('active');
    }
  };

  const renderAdminTable = (filterQuery = '') => {
    if (!adminProductTableBody) return;
    const q = filterQuery.trim().toLowerCase();
    const keys = Object.keys(productCatalog);
    if (adminProductCount) adminProductCount.innerText = keys.length;

    const filteredKeys = keys.filter(key => {
      const item = productCatalog[key];
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.tagline && item.tagline.toLowerCase().includes(q))
      );
    });

    if (filteredKeys.length === 0) {
      adminProductTableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; padding: 2.5rem; color: #64748b;">
            No matching products found. Click <strong>Upload New Product</strong> to add one.
          </td>
        </tr>
      `;
      return;
    }

    adminProductTableBody.innerHTML = filteredKeys
      .map(key => {
        const item = productCatalog[key];
        const specSummary = (item.specs || [])
          .slice(0, 2)
          .map(s => `<span>&bull; ${s.label}: <strong>${s.value}</strong></span>`)
          .join('');

        return `
        <tr>
          <td>
            <div class="table-visual-thumb" style="background: ${item.bgColor || '#253b58'};">
              <img src="${item.image}" alt="${item.title}">
            </div>
          </td>
          <td>
            <div class="table-title">${item.title}</div>
            <div class="table-cat">${item.category}</div>
          </td>
          <td>
            <div class="color-swatch-pill">
              <span class="color-swatch-dot" style="background: ${item.bgColor || '#253b58'};"></span>
              <span>${item.bgColor || '#253b58'}</span>
            </div>
          </td>
          <td>
            <div class="specs-mini-list">
              ${specSummary || '<span>Custom specifications</span>'}
            </div>
          </td>
          <td style="text-align: right;">
            <div class="table-action-btns">
              <button type="button" class="btn-table-action edit" data-action="edit" data-id="${key}" title="Edit product details">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button type="button" class="btn-table-action delete" data-action="delete" data-id="${key}" title="Delete product">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </td>
        </tr>
      `;
      })
      .join('');

    // Bind edit/delete table actions
    adminProductTableBody.querySelectorAll('.btn-table-action[data-action]').forEach(btn => {
      const action = btn.getAttribute('data-action');
      const id = btn.getAttribute('data-id');

      btn.addEventListener('click', () => {
        if (action === 'edit') editProduct(id);
        else if (action === 'delete') deleteProduct(id);
      });
    });
  };

  const resetForm = () => {
    if (!adminProductForm) return;
    adminProductForm.reset();
    editProductId.value = '';
    prodImageData.value = '';
    dropzonePreview.style.display = 'none';
    dropzonePrompt.style.display = 'block';
    previewImage.src = '';
    btnSaveText.innerText = 'Save & Publish Product';
    tabAddProduct.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
      Upload New Product
    `;
  };

  const editProduct = (id) => {
    const item = productCatalog[id];
    if (!item) return;

    resetForm();
    editProductId.value = id;
    prodTitle.value = item.title;
    prodCategory.value = item.category;
    prodTagline.value = item.tagline || '';
    prodTheme.value = item.bgColor || '#253b58';
    prodDescription.value = (item.description || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    prodImageData.value = item.image;

    previewImage.src = item.image;
    dropzonePreview.style.display = 'block';
    dropzonePrompt.style.display = 'none';

    if (item.specs && item.specs.length > 0) {
      if (item.specs[0]) { specLabel1.value = item.specs[0].label; specVal1.value = item.specs[0].value; }
      if (item.specs[1]) { specLabel2.value = item.specs[1].label; specVal2.value = item.specs[1].value; }
      if (item.specs[2]) { specLabel3.value = item.specs[2].label; specVal3.value = item.specs[2].value; }
      if (item.specs[3]) { specLabel4.value = item.specs[3].label; specVal4.value = item.specs[3].value; }
    }

    btnSaveText.innerText = 'Update Product';
    tabAddProduct.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      </svg>
      Edit Product
    `;
    switchAdminTab('form');
  };

  const deleteProduct = (id) => {
    const item = productCatalog[id];
    if (!item) return;
    if (confirm(`Are you sure you want to remove "${item.title}" from the active product range?`)) {
      delete productCatalog[id];
      saveCatalog();
      renderAdminTable();
      renderMosaicGrid();
    }
  };

  // Image Upload File Handling with Instant Data-URI preview
  if (prodImageFile) {
    prodImageFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Data = event.target.result;
        prodImageData.value = base64Data;
        previewImage.src = base64Data;
        dropzonePreview.style.display = 'block';
        dropzonePrompt.style.display = 'none';
      };
      reader.readAsDataURL(file);
    });
  }

  if (btnRemovePreview) {
    btnRemovePreview.addEventListener('click', (e) => {
      e.stopPropagation();
      prodImageData.value = '';
      if (prodImageFile) prodImageFile.value = '';
      dropzonePreview.style.display = 'none';
      dropzonePrompt.style.display = 'block';
      previewImage.src = '';
    });
  }

  // Admin Form Submit (Save / Update)
  if (adminProductForm) {
    adminProductForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const id = editProductId.value || prodTitle.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const existing = productCatalog[id] || {};

      const specs = [
        { label: specLabel1.value.trim() || 'Voltage Range', value: specVal1.value.trim() || 'Industrial Grade' },
        { label: specLabel2.value.trim() || 'Breaking Capacity', value: specVal2.value.trim() || 'Standard' },
        { label: specLabel3.value.trim() || 'Standards', value: specVal3.value.trim() || 'SANS / IEC Compliant' },
        { label: specLabel4.value.trim() || 'Mounting Type', value: specVal4.value.trim() || 'Modular' }
      ];

      const descText = prodDescription.value.trim();
      const formattedDesc = descText.includes('<p>') ? descText : `<p>${descText}</p>`;

      const imageSrc = prodImageData.value || existing.image || 'assets/images/product-circuit-breakers-trans.png';

      productCatalog[id] = {
        title: prodTitle.value.trim(),
        category: prodCategory.value.trim(),
        bgColor: prodTheme.value,
        image: imageSrc,
        tagline: prodTagline.value.trim(),
        spanClass: existing.spanClass || '',
        specs: specs,
        description: formattedDesc
      };

      saveCatalog();
      renderMosaicGrid();
      renderAdminTable();
      resetForm();
      switchAdminTab('list');
    });
  }

  // Tabs & Triggers
  if (openAdminBtn) openAdminBtn.addEventListener('click', openAdminModal);
  if (adminModalClose) adminModalClose.addEventListener('click', closeAdminModal);
  if (tabCatalogList) tabCatalogList.addEventListener('click', () => switchAdminTab('list'));
  if (tabAddProduct) tabAddProduct.addEventListener('click', () => { resetForm(); switchAdminTab('form'); });
  if (tabMobileConnect) tabMobileConnect.addEventListener('click', () => switchAdminTab('mobile'));
  if (btnUploadProductShortcut) btnUploadProductShortcut.addEventListener('click', () => { resetForm(); switchAdminTab('form'); });
  if (btnCancelProduct) btnCancelProduct.addEventListener('click', () => switchAdminTab('list'));

  if (btnCopyMobileLink) {
    btnCopyMobileLink.addEventListener('click', () => {
      const url = mobileAccessUrlInput ? mobileAccessUrlInput.value : 'http://192.168.0.153:8080/';
      navigator.clipboard.writeText(url).then(() => {
        if (copyLinkText) copyLinkText.innerText = 'Copied!';
        btnCopyMobileLink.style.background = '#00bf63';
        btnCopyMobileLink.style.color = '#032010';
        setTimeout(() => {
          if (copyLinkText) copyLinkText.innerText = 'Copy Link';
          btnCopyMobileLink.style.background = '';
          btnCopyMobileLink.style.color = '';
        }, 2500);
      }).catch(() => {
        if (mobileAccessUrlInput) {
          mobileAccessUrlInput.select();
          document.execCommand('copy');
          if (copyLinkText) copyLinkText.innerText = 'Copied!';
        }
      });
    });
  }

  if (btnResetCatalog) {
    btnResetCatalog.addEventListener('click', () => {
      if (confirm('Restore factory catalog? This will reset all products back to default.')) {
        localStorage.removeItem(STORAGE_KEY);
        loadCatalog();
        renderAdminTable();
        renderMosaicGrid();
        switchAdminTab('list');
      }
    });
  }

  if (adminSearchInput) {
    adminSearchInput.addEventListener('input', (e) => {
      renderAdminTable(e.target.value);
    });
  }

  if (adminModal) {
    adminModal.addEventListener('click', (e) => {
      if (e.target === adminModal) closeAdminModal();
    });
  }

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (adminModal && adminModal.classList.contains('active')) closeAdminModal();
      if (productModal && productModal.classList.contains('active')) closeProductModal();
    }
  });
});

