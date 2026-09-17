document.addEventListener('DOMContentLoaded', () => {
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
  // Product Detail Modal Controller & Catalog Dataset
  // ==========================================================================
  const productCatalog = {
    'circuit-breakers': {
      title: 'Circuit Breakers',
      category: 'Electrical Protection',
      bgColor: '#253b58',
      image: 'assets/images/product-circuit-breakers-trans.png',
      tagline: 'High-performance trip mechanisms engineered for medium and low-voltage industrial distribution networks.',
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

    // Render specs
    if (productModalSpecs) {
      productModalSpecs.innerHTML = data.specs
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

    // Set RFQ button context
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

  // Bind click & keyboard handlers to mosaic product tiles
  document.querySelectorAll('.mosaic-product-tile[data-product]').forEach(tile => {
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

  if (productModalClose) {
    productModalClose.addEventListener('click', closeProductModal);
  }
  if (productModalDismissBtn) {
    productModalDismissBtn.addEventListener('click', closeProductModal);
  }

  // Close modal when clicking backdrop
  if (productModal) {
    productModal.addEventListener('click', (e) => {
      if (e.target === productModal) {
        closeProductModal();
      }
    });
  }

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && productModal && productModal.classList.contains('active')) {
      closeProductModal();
    }
  });
});

