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

  // Contact form handling with FormSubmit.co integration & Active Product Sync
  const contactForm = document.getElementById('contactForm');
  const contactNameInput = document.getElementById('contactName');
  const contactEmailInput = document.getElementById('contactEmail');
  const contactProductSelect = document.getElementById('contactProduct');
  const contactMessageInput = document.getElementById('contactMessage');
  const formSubjectHidden = document.getElementById('formSubjectHidden');
  const formCommodityHidden = document.getElementById('formCommodityHidden');
  const formProductInterestHidden = document.getElementById('formProductInterestHidden');
  const successMsg = document.getElementById('formSuccessMessage');
  const errorMsg = document.getElementById('formErrorMessage');
  const formSuccessText = document.getElementById('formSuccessText');
  const formErrorText = document.getElementById('formErrorText');

  // FormSubmit.co Configuration
  // Primary recipient: tsoanelomodise@gmail.com
  // CC recipient: krubashni@bakis.co.za
  const FORMSUBMIT_PRIMARY = 'tsoanelomodise@gmail.com';
  const FORMSUBMIT_CC = 'krubashni@bakis.co.za';
  const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${FORMSUBMIT_PRIMARY}`;

  // Real-time synchronization of selected product & subject line across all fields
  const syncContactProductState = () => {
    if (!contactProductSelect) return;
    const selectedOption = contactProductSelect.options[contactProductSelect.selectedIndex];
    const selectedVal = (contactProductSelect.value || selectedOption?.text || 'General Enquiry').trim();
    const customerName = (contactNameInput?.value || 'Website Customer').trim();

    if (formCommodityHidden) formCommodityHidden.value = selectedVal;
    if (formProductInterestHidden) formProductInterestHidden.value = selectedVal;
    if (formSubjectHidden) {
      formSubjectHidden.value = (selectedVal && selectedVal !== 'General Enquiry')
        ? `New Inquiry / RFQ: ${customerName} [${selectedVal}]`
        : `New General Inquiry: ${customerName}`;
    }
  };

  if (contactProductSelect) {
    contactProductSelect.addEventListener('change', syncContactProductState);
  }
  if (contactNameInput) {
    contactNameInput.addEventListener('input', syncContactProductState);
  }

  // Pre-sync state immediately
  syncContactProductState();

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalHtml = submitBtn.innerHTML;

      // Ensure latest product sync is active
      syncContactProductState();

      // Extract form fields
      const name = (contactNameInput?.value || '').trim();
      const email = (contactEmailInput?.value || '').trim();
      
      const selectedOption = contactProductSelect?.options[contactProductSelect?.selectedIndex];
      let product = (contactProductSelect?.value || selectedOption?.text || '').trim();
      if (!product || product === '') product = 'General Enquiry';

      const message = (contactMessageInput?.value || '').trim();

      if (!name || !email || !message) {
        if (errorMsg) {
          formErrorText.innerText = 'Please complete all required fields.';
          errorMsg.style.display = 'block';
        }
        return;
      }

      // Hide prior alerts
      if (successMsg) successMsg.style.display = 'none';
      if (errorMsg) errorMsg.style.display = 'none';

      submitBtn.innerHTML = `
        <span>Sending Message...</span>
        <svg class="bk-icon spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10"></path>
        </svg>
      `;
      submitBtn.disabled = true;

      // Update the subject line right on the DOM form element before any dispatch
      const dynamicSubject = (product && product !== 'General Enquiry')
        ? `New Inquiry / RFQ: ${name} [${product}]`
        : `New General Inquiry: ${name}`;

      if (formSubjectHidden) formSubjectHidden.value = dynamicSubject;
      if (formCommodityHidden) formCommodityHidden.value = product;
      if (formProductInterestHidden) formProductInterestHidden.value = product;

      const payload = {
        name,
        email,
        Product: product,
        Commodity: product,
        product_interest: product,
        message,
        _cc: FORMSUBMIT_CC,
        _subject: dynamicSubject,
        _template: 'table',
        _captcha: 'false'
      };

      try {
        let sentSuccessfully = false;

        // 1. Submit asynchronously via FormSubmit AJAX endpoint
        try {
          const response = await fetch(FORMSUBMIT_ENDPOINT, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
          });

          if (response.ok) {
            const data = await response.json();
            if (data && (data.success === 'true' || data.success === true || response.status === 200)) {
              sentSuccessfully = true;
            }
          }
        } catch (fetchErr) {
          console.warn('FormSubmit AJAX fetch failed, attempting standard form fallback:', fetchErr);
        }

        // 2. Backup lead record in localStorage vault so no quotation request or chosen product is ever lost
        try {
          const log = JSON.parse(localStorage.getItem('bakis_inquiry_leads') || '[]');
          log.unshift({
            id: 'lead_' + Date.now(),
            name,
            email,
            product,
            message,
            recipients: [FORMSUBMIT_PRIMARY, FORMSUBMIT_CC],
            submittedAt: new Date().toISOString()
          });
          localStorage.setItem('bakis_inquiry_leads', JSON.stringify(log.slice(0, 100)));
          if (typeof renderAdminEnquiries === 'function') {
            renderAdminEnquiries();
          }
        } catch (e) {
          console.error('Failed to log lead:', e);
        }

        // If AJAX request wasn't acknowledged (e.g. offline or strict browser CORS), submit standard form to FormSubmit
        if (!sentSuccessfully) {
          // As standard HTML form POST to ensure delivery with full product & dynamic subject intact
          contactForm.submit();
          return;
        }

        // Reset form and reset button
        contactForm.reset();
        syncContactProductState();
        submitBtn.innerHTML = originalHtml;
        submitBtn.disabled = false;

        if (successMsg) {
          if (formSuccessText) {
            formSuccessText.innerText = `Thank you ${name}. Your inquiry for "${product}" has been sent to our engineering team (${FORMSUBMIT_PRIMARY} & ${FORMSUBMIT_CC}). We will respond promptly.`;
          }
          successMsg.style.display = 'block';
          setTimeout(() => {
            successMsg.style.display = 'none';
          }, 9000);
        }
      } catch (err) {
        console.error('Submission handling error:', err);
        submitBtn.innerHTML = originalHtml;
        submitBtn.disabled = false;
        if (errorMsg) {
          if (formErrorText) {
            formErrorText.innerText = `Unable to send message automatically. Please email us directly at ${FORMSUBMIT_PRIMARY} or ${FORMSUBMIT_CC}.`;
          }
          errorMsg.style.display = 'block';
        }
      }
    });
  }

  // Commodities & Products search dataset
  const catalogItems = [
    { title: 'Full Tension Joints', category: 'Product Range', hash: '#products' },
    { title: 'Circuit Breakers', category: 'Product Range', hash: '#products' },
    { title: 'Seals Tool-less (All Colours)', category: 'Product Range', hash: '#products' },
    { title: 'Surge Arrestors', category: 'Product Range', hash: '#products' },
    { title: 'HRC Fuse Links', category: 'Product Range', hash: '#products' },
    { title: 'Cables', category: 'Product Range', hash: '#products' },
    { title: 'Insulators & Sub Station Equipment', category: 'Product Range', hash: '#products' },
    { title: 'Bi Metal Lugs & Connectors', category: 'Product Range', hash: '#products' },
    { title: 'Aerial bundled conductor accessories', category: 'Product Range', hash: '#products' },
    { title: 'Insulation Piercing Connectors (IPC)', category: 'Product Range', hash: '#products' },
    { title: 'Aerial Bundled Cables (ABC)', category: 'Product Range', hash: '#products' },
    { title: 'Distribution boards', category: 'Product Range', hash: '#products' },
    { title: 'Switchgear', category: 'Product Range', hash: '#products' },
    { title: 'Solar Solutions', category: 'Product Range', hash: '#products' },
    { title: 'Street Lighting', category: 'Product Range', hash: '#products' },
    { title: 'Electrical Cables, Switches, Fuses, Meters, Hardware and Accessories', category: 'Commodities', hash: '#products' },
    { title: 'Clamps, Ferrules, Terminal Blocks, lugs, Joints, tapes, Locks, Pole Top Boxes', category: 'Commodities', hash: '#products' },
    { title: 'Copper Rods, busbars, strips, Fuses,', category: 'Commodities', hash: '#products' },
    { title: 'Batteries, Relay, Street Lighting, Lamps', category: 'Commodities', hash: '#products' },
    { title: 'Joint Kits, Term Kits, Circuit Breakers', category: 'Commodities', hash: '#products' },
    { title: 'Enclosures', category: 'Commodities', hash: '#products' },
    { title: 'Cable, Tie Sides', category: 'Commodities', hash: '#products' },
    { title: 'Buckle Straps, Bird Divertors', category: 'Commodities', hash: '#products' },
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
    'distribution-boards': {
      title: 'Full Tension Joints',
      category: 'Automatic Line Splices',
      bgColor: '#1d483f',
      image: 'assets/images/product-full-tension-joints-trans.png',
      modalImage: 'assets/images/product-full-tension-joints-trans.png',
      tagline: 'Exclusive Distribution Product Range: Automatic line splices for full tension overhead compression connections.',
      spanClass: 'tile-span-large',
      specs: [
        { label: 'Installation', value: 'Simple & Fast (No Crimping)' },
        { label: 'Connection Type', value: 'Full Tension Compression' },
        { label: 'Conductor Sizes', value: 'Fox / Mink / Pine / Hare / Oak' },
        { label: 'Utility Standards', value: 'Eskom & SANS Applicable' }
      ],
      description: `
        <div style="margin-bottom: 1.25rem;">
          <h4 style="font-size: 0.95rem; font-weight: 700; color: #166534; margin-bottom: 0.6rem; text-transform: uppercase; letter-spacing: 0.05em;">Exclusive Distribution Range &bull; Conductor Sizes</h4>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem; margin-bottom: 1rem;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.75rem;">
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.6rem 0.75rem; text-align: center;">
                <div style="font-size: 0.7rem; font-weight: 700; color: #dc2626; text-transform: uppercase;">Red End Cap</div>
                <div style="font-size: 0.95rem; font-weight: 800; color: #0f172a; margin-top: 2px;">FOX</div>
              </div>
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.6rem 0.75rem; text-align: center;">
                <div style="font-size: 0.7rem; font-weight: 700; color: #ca8a04; text-transform: uppercase;">Yellow End Cap</div>
                <div style="font-size: 0.95rem; font-weight: 800; color: #0f172a; margin-top: 2px;">MINK / PINE</div>
              </div>
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.6rem 0.75rem; text-align: center;">
                <div style="font-size: 0.7rem; font-weight: 700; color: #db2777; text-transform: uppercase;">Pink End Cap</div>
                <div style="font-size: 0.95rem; font-weight: 800; color: #0f172a; margin-top: 2px;">HARE / OAK</div>
              </div>
            </div>
          </div>
        </div>

        <h4 style="font-size: 0.95rem; font-weight: 700; color: #166534; margin-bottom: 0.6rem; text-transform: uppercase; letter-spacing: 0.05em;">Features &amp; Benefits</h4>
        <ul>
          <li><strong>Full Tension Compression Line Splices:</strong> Engineered for overhead power lines requiring maximum tensile strength and uninterrupted electrical conductivity.</li>
          <li><strong>Simple and Fast Installation:</strong> Saves substantial line crew installation time during reticulation builds and emergency repairs.</li>
          <li><strong>No Crimping Tools Required:</strong> Positive automatic self-locking internal jaw mechanism locks the conductor securely upon insertion.</li>
          <li><strong>Accommodates Various Conductor Sizes:</strong> Color-coded end caps for immediate on-site identification across transmission spans.</li>
          <li><strong>Aluminium Body Construction:</strong> High-purity, corrosion-resistant alloy provides high mechanical integrity and excellent conductivity.</li>
          <li><strong>Suitable for Overhead Line Applications:</strong> Rigorously tested and fully compliant for utility networks, Eskom, and municipal power grids.</li>
        </ul>

        <div style="margin-top: 1.25rem; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
          <img src="assets/images/product-full-tension-joints-modal.jpg" alt="Bakis Automatic Line Splices Full Range - Fox, Mink/Pine, Hare/Oak" style="width: 100%; height: auto; display: block;">
        </div>
      `
    },
    'circuit-breakers': {
      title: 'Circuit Breakers',
      category: 'Electrical Protection',
      bgColor: '#253b58',
      image: 'assets/images/product-circuit-breakers-new.png',
      tagline: 'High-performance trip mechanisms engineered for medium and low-voltage industrial distribution networks.',
      spanClass: '',
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
    'seals-tool-less': {
      title: 'Seals Tool-less (All Colours)',
      category: 'Tamper-Evident Security',
      bgColor: '#1a365d',
      image: 'assets/images/product-seals-tool-less.png',
      tagline: 'High-security tamper-evident polycarbonate meter and infrastructure seals (All Colours) engineered for Eskom, municipal utility metering, and substation distribution panels.',
      spanClass: '',
      specs: [
        { label: 'Available Colours', value: 'Red, Blue, Green, Yellow, Orange' },
        { label: 'Installation', value: 'Tool-Less Manual Twist / Snap' },
        { label: 'Body Material', value: 'UV Polycarbonate (Clear Body)' },
        { label: 'Utility Approval', value: 'Eskom & Municipal Approved' }
      ],
      description: `
        <div style="margin-bottom: 1.25rem;">
          <h4 style="font-size: 0.95rem; font-weight: 700; color: #166534; margin-bottom: 0.6rem; text-transform: uppercase; letter-spacing: 0.05em;">Securing Critical Infrastructure &bull; Colour Coding</h4>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem; margin-bottom: 1rem;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.75rem;">
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.6rem 0.75rem; text-align: center;">
                <div style="font-size: 0.7rem; font-weight: 700; color: #dc2626; text-transform: uppercase;">Red Core</div>
                <div style="font-size: 0.85rem; font-weight: 800; color: #0f172a; margin-top: 2px;">Feeder Isolations</div>
              </div>
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.6frem 0.75rem; text-align: center;">
                <div style="font-size: 0.7rem; font-weight: 700; color: #2563eb; text-transform: uppercase;">Blue Core</div>
                <div style="font-size: 0.85rem; font-weight: 800; color: #0f172a; margin-top: 2px;">Tariff &amp; CT Meters</div>
              </div>
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.6rem 0.75rem; text-align: center;">
                <div style="font-size: 0.7rem; font-weight: 700; color: #059669; text-transform: uppercase;">Green Core</div>
                <div style="font-size: 0.85rem; font-weight: 800; color: #0f172a; margin-top: 2px;">Substation Enclosures</div>
              </div>
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.6rem 0.75rem; text-align: center;">
                <div style="font-size: 0.7rem; font-weight: 700; color: #ca8a04; text-transform: uppercase;">Yellow Core</div>
                <div style="font-size: 0.85rem; font-weight: 800; color: #0f172a; margin-top: 2px;">Revenue Protection</div>
              </div>
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.6rem 0.75rem; text-align: center;">
                <div style="font-size: 0.7rem; font-weight: 700; color: #ea580c; text-transform: uppercase;">Orange Core</div>
                <div style="font-size: 0.85rem; font-weight: 800; color: #0f172a; margin-top: 2px;">Emergency Locking</div>
              </div>
            </div>
          </div>
        </div>

        <h4 style="font-size: 0.95rem; font-weight: 700; color: #166534; margin-bottom: 0.6rem; text-transform: uppercase; letter-spacing: 0.05em;">Security &amp; Engineering Specifications</h4>
        <ul>
          <li><strong>100% Tool-less Hand Application:</strong> Smooth wire threading and manual twisting wing mechanism allows fast, reliable sealing without costly crimping tools.</li>
          <li><strong>Tamper-Evident Polycarbonate Body:</strong> Transparent outer casing provides instant visual inspection of internal locking core mechanism and wire engagement.</li>
          <li><strong>Galvanized / Stainless Steel Sealing Wire:</strong> High-tensile stranded multi-core wire resists cutting, atmospheric corrosion, and mechanical tampering.</li>
          <li><strong>Unique Laser Marking &amp; Numbering:</strong> Permanent laser-marked sequential numbering, company logo (Eskom / Municipal), and barcode options prevent fraudulent replica substitution.</li>
          <li><strong>Non-Reversible One-Way Ratchet:</strong> Locking rotor cannot be wound backwards without permanently fracturing the body, guaranteeing indisputable evidence of tamper attempts.</li>
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
      spanClass: '',
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
      spanClass: '',
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
      modalImage: 'assets/images/product-insulator-bushing-main-trans.png',
      secondaryImage: 'assets/images/product-substation-clamp.png',
      secondaryImageAlt: 'Substation Busbar & Terminal Connector Clamp',
      tagline: 'High-voltage composite silicone and glazed porcelain disc insulators, post insulators, substation busbar clamps, and connecting hardware.',
      spanClass: '',
      specs: [
        { label: 'Creepage Distance', value: '25mm/kV – 31mm/kV Heavy' },
        { label: 'Mechanical Strength', value: '70kN – 300kN Cantilever' },
        { label: 'Voltage Rating', value: '11kV up to 400kV' },
        { label: 'Equipment Range', value: 'Insulators, Busbar Clamps & Fittings' }
      ],
      description: `
        <p>Engineered substation and overhead line insulators designed to withstand mechanical cantilever loads, high pollution levels, and severe environmental lightning impulses.</p>
        <ul>
          <li>Pin, post, strain, and suspension configurations with galvanized end fittings.</li>
          <li>High-conductivity substation busbar terminal clamps and 4-bolt connector hardware.</li>
          <li>High thermal-shock resistance with superior puncture withstand capabilities.</li>
          <li>Supplied with clamps, terminal blocks, disconnectors, and earthing assemblies.</li>
        </ul>
      `
    },
    'bimetal-lugs': {
      title: 'Bi Metal Lugs & Connectors',
      category: 'Cable Termination & Jointing',
      bgColor: '#1e3352',
      image: 'assets/images/product-bimetal-lugs-connectors.png',
      tagline: 'Friction-welded bi-metallic cable lugs, pin terminals, and connecting ferrules engineered for seamless aluminum-to-copper cable transitions and terminations.',
      spanClass: 'tile-span-medium',
      specs: [
        { label: 'Conductor Sizes', value: '16mm² – 630mm² (Al to Cu)' },
        { label: 'Manufacturing Process', value: 'Friction Welding (Solid Bond)' },
        { label: 'Voltage Application', value: '1kV – 36kV (LV & MV)' },
        { label: 'Standards', value: 'IEC 61238-1 / SANS / Eskom' }
      ],
      description: `
        <div style="margin-bottom: 1.25rem;">
          <h4 style="font-size: 0.95rem; font-weight: 700; color: #166534; margin-bottom: 0.6rem; text-transform: uppercase; letter-spacing: 0.05em;">Available Range &amp; Terminal Configurations</h4>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem; margin-bottom: 1rem;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 0.75rem;">
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.65rem 0.75rem; text-align: center;">
                <div style="font-size: 0.7rem; font-weight: 700; color: #b45309; text-transform: uppercase;">Bi-Metal Cable Lugs</div>
                <div style="font-size: 0.85rem; font-weight: 800; color: #0f172a; margin-top: 2px;">16mm² to 630mm²</div>
                <div style="font-size: 0.8rem; font-weight: 600; color: #475569;">Stud Sizes: M8 to M20</div>
              </div>
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.65rem 0.75rem; text-align: center;">
                <div style="font-size: 0.7rem; font-weight: 700; color: #2563eb; text-transform: uppercase;">Bi-Metal Ferrules</div>
                <div style="font-size: 0.85rem; font-weight: 800; color: #0f172a; margin-top: 2px;">Through Connectors</div>
                <div style="font-size: 0.8rem; font-weight: 600; color: #475569;">Al-Cable to Cu-Cable</div>
              </div>
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.65rem 0.75rem; text-align: center;">
                <div style="font-size: 0.7rem; font-weight: 700; color: #059669; text-transform: uppercase;">Bi-Metal Pin Terminals</div>
                <div style="font-size: 0.85rem; font-weight: 800; color: #0f172a; margin-top: 2px;">Circuit Breakers / Isolators</div>
                <div style="font-size: 0.8rem; font-weight: 600; color: #475569;">Direct Tunnel Insertion</div>
              </div>
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.65rem 0.75rem; text-align: center;">
                <div style="font-size: 0.7rem; font-weight: 700; color: #7c3aed; text-transform: uppercase;">Compound Pre-Filled</div>
                <div style="font-size: 0.85rem; font-weight: 800; color: #0f172a; margin-top: 2px;">Anti-Oxide Grease</div>
                <div style="font-size: 0.8rem; font-weight: 600; color: #475569;">Sealed Capped Barrels</div>
              </div>
            </div>
          </div>
        </div>

        <h4 style="font-size: 0.95rem; font-weight: 700; color: #166534; margin-bottom: 0.6rem; text-transform: uppercase; letter-spacing: 0.05em;">Key Engineering Advantages</h4>
        <ul>
          <li><strong>Eliminates Galvanic Corrosion:</strong> Friction-welded transition joint prevents electrochemical galvanic reaction between electrolytic copper palm and high-purity aluminium barrel.</li>
          <li><strong>Pre-Filled with Neutral Contact Grease:</strong> Aluminium barrel interior is factory pre-filled with high-grade anti-oxidation paste and capped to avoid ambient oxidation prior to crimping.</li>
          <li><strong>High Electrical Conductivity:</strong> 99.9% pure forged electrolytic copper palm combined with 99.5% electrical grade aluminium barrel ensures minimal contact resistance and optimal thermal cycling.</li>
          <li><strong>Robust Mechanical Tensile Strength:</strong> Friction-welded interface exceeds tensile strength requirements of IEC 61238-1 Class A and Eskom distribution specifications.</li>
          <li><strong>Clear Crimp Markings:</strong> Laser etched or stamped with cable conductor cross-section (mm²), crimp die index, and insertion depth indicators.</li>
        </ul>
      `
    },
    'ipc-connectors': {
      title: 'Aerial bundled conductor accessories',
      category: 'Aerial Bundled Cables (ABC)',
      bgColor: '#1d483f',
      image: 'assets/images/product-abc-accessories-trans.png',
      modalImage: 'assets/images/product-abc-accessories-trans.png',
      tagline: 'Comprehensive range of low and medium voltage Aerial Bundled Conductor (ABC) hardware, suspension assemblies, anchoring clamps, and connection accessories.',
      spanClass: 'tile-span-medium',
      specs: [],
      description: `
        <div class="abc-tabs-container">
          <!-- Interactive Sub-Products Tabs Navigation -->
          <div class="abc-tabs-nav-wrapper">
            <div class="abc-tabs-nav" role="tablist" aria-label="Aerial Bundled Conductor Sub-Products">
              <button type="button" class="abc-tab-btn active" role="tab" aria-selected="true" aria-controls="subtab-1" data-tab="subtab-1">
                <span class="abc-tab-num">01</span>
                <span>Suspension Clamp</span>
              </button>
              <button type="button" class="abc-tab-btn" role="tab" aria-selected="false" aria-controls="subtab-2" data-tab="subtab-2">
                <span class="abc-tab-num">02</span>
                <span>Anchoring / Dead-End</span>
              </button>
              <button type="button" class="abc-tab-btn" role="tab" aria-selected="false" aria-controls="subtab-3" data-tab="subtab-3">
                <span class="abc-tab-num">03</span>
                <span>IPC Connector</span>
              </button>
              <button type="button" class="abc-tab-btn" role="tab" aria-selected="false" aria-controls="subtab-4" data-tab="subtab-4">
                <span class="abc-tab-num">04</span>
                <span>Service Clamp</span>
              </button>
              <button type="button" class="abc-tab-btn" role="tab" aria-selected="false" aria-controls="subtab-5" data-tab="subtab-5">
                <span class="abc-tab-num">05</span>
                <span>Pre-Insulated Lug</span>
              </button>
              <button type="button" class="abc-tab-btn" role="tab" aria-selected="false" aria-controls="subtab-6" data-tab="subtab-6">
                <span class="abc-tab-num">06</span>
                <span>Pre-Insulated Ferrule</span>
              </button>
              <button type="button" class="abc-tab-btn" role="tab" aria-selected="false" aria-controls="subtab-7" data-tab="subtab-7">
                <span class="abc-tab-num">07</span>
                <span>Cable Spacer</span>
              </button>
              <button type="button" class="abc-tab-btn" role="tab" aria-selected="false" aria-controls="subtab-8" data-tab="subtab-8">
                <span class="abc-tab-num">08</span>
                <span>Cable Tie / Strap</span>
              </button>
              <button type="button" class="abc-tab-btn" role="tab" aria-selected="false" aria-controls="subtab-9" data-tab="subtab-9">
                <span class="abc-tab-num">09</span>
                <span>Pole Bracket</span>
              </button>
              <button type="button" class="abc-tab-btn" role="tab" aria-selected="false" aria-controls="subtab-10" data-tab="subtab-10">
                <span class="abc-tab-num">10</span>
                <span>Protective End Cap</span>
              </button>
            </div>
          </div>

          <!-- Tab Panels -->
          <!-- 1. Suspension Clamp -->
          <div class="abc-tab-panel active" id="subtab-1" role="tabpanel" aria-labelledby="subtab-1">
            <div class="abc-panel-card">
              <div class="abc-panel-top">
                <span class="abc-panel-badge">Sub-Product 01 of 10</span>
                <span style="font-size: 0.78rem; color: #64748b; font-weight: 600;">Suspension Assembly</span>
              </div>
              <h5 class="abc-panel-title">Suspension Clamp</h5>
              <p class="abc-panel-desc">Designed to securely support aerial bundled conductors on poles while allowing the cable to withstand mechanical loads and movement.</p>
              <div class="abc-panel-specs-box">
                <div class="abc-panel-specs-label">Available Sizes</div>
                <div class="abc-panel-chips">
                  <span class="abc-size-chip">16–35 mm²</span>
                  <span class="abc-size-chip">35–70 mm²</span>
                  <span class="abc-size-chip">70–120 mm²</span>
                  <span class="abc-size-chip">120–150 mm²</span>
                </div>
              </div>
              <div class="abc-panel-footer-nav">
                <button type="button" class="abc-panel-nav-btn" disabled>&larr; Previous</button>
                <span style="font-size: 0.78rem; color: #64748b; font-weight: 600;">1 / 10</span>
                <button type="button" class="abc-panel-nav-btn" data-target-tab="subtab-2">Next: Anchoring / Dead-End &rarr;</button>
              </div>
            </div>
          </div>

          <!-- 2. Anchoring / Dead-End Clamp -->
          <div class="abc-tab-panel" id="subtab-2" role="tabpanel" aria-labelledby="subtab-2">
            <div class="abc-panel-card">
              <div class="abc-panel-top">
                <span class="abc-panel-badge">Sub-Product 02 of 10</span>
                <span style="font-size: 0.78rem; color: #64748b; font-weight: 600;">Line Termination</span>
              </div>
              <h5 class="abc-panel-title">Anchoring / Dead-End Clamp</h5>
              <p class="abc-panel-desc">Used to terminate and mechanically anchor ABC cables at the end of a line, corners, and poles. Provides a secure grip without damaging the insulation.</p>
              <div class="abc-panel-specs-box">
                <div class="abc-panel-specs-label">Available Sizes</div>
                <div class="abc-panel-chips">
                  <span class="abc-size-chip">16–35 mm²</span>
                  <span class="abc-size-chip">35–70 mm²</span>
                  <span class="abc-size-chip">70–120 mm²</span>
                  <span class="abc-size-chip">120–150 mm²</span>
                </div>
              </div>
              <div class="abc-panel-footer-nav">
                <button type="button" class="abc-panel-nav-btn" data-target-tab="subtab-1">&larr; Prev: Suspension</button>
                <span style="font-size: 0.78rem; color: #64748b; font-weight: 600;">2 / 10</span>
                <button type="button" class="abc-panel-nav-btn" data-target-tab="subtab-3">Next: IPC Connector &rarr;</button>
              </div>
            </div>
          </div>

          <!-- 3. Insulation Piercing Connector (IPC) -->
          <div class="abc-tab-panel" id="subtab-3" role="tabpanel" aria-labelledby="subtab-3">
            <div class="abc-panel-card">
              <div class="abc-panel-top">
                <span class="abc-panel-badge">Sub-Product 03 of 10</span>
                <span style="font-size: 0.78rem; color: #64748b; font-weight: 600;">Live-Line Branching</span>
              </div>
              <h5 class="abc-panel-title">Insulation Piercing Connector (IPC)</h5>
              <p class="abc-panel-desc">Provides an electrical connection to insulated aerial bundled conductors without removing the insulation. Suitable for service connections and network branching.</p>
              <div class="abc-panel-specs-box">
                <div class="abc-panel-specs-label">Available Sizes</div>
                <div class="abc-panel-chips">
                  <span class="abc-size-chip">Main cable: 16–150 mm²</span>
                  <span class="abc-size-chip">Branch cable: 1.5–35 mm²</span>
                </div>
              </div>
              <div class="abc-panel-footer-nav">
                <button type="button" class="abc-panel-nav-btn" data-target-tab="subtab-2">&larr; Prev: Anchoring Clamp</button>
                <span style="font-size: 0.78rem; color: #64748b; font-weight: 600;">3 / 10</span>
                <button type="button" class="abc-panel-nav-btn" data-target-tab="subtab-4">Next: Service Clamp &rarr;</button>
              </div>
            </div>
          </div>

          <!-- 4. Service Connection Clamp -->
          <div class="abc-tab-panel" id="subtab-4" role="tabpanel" aria-labelledby="subtab-4">
            <div class="abc-panel-card">
              <div class="abc-panel-top">
                <span class="abc-panel-badge">Sub-Product 04 of 10</span>
                <span style="font-size: 0.78rem; color: #64748b; font-weight: 600;">Service Drop</span>
              </div>
              <h5 class="abc-panel-title">Service Connection Clamp</h5>
              <p class="abc-panel-desc">Used to connect service cables to the main ABC network, providing a reliable electrical and mechanical connection.</p>
              <div class="abc-panel-specs-box">
                <div class="abc-panel-specs-label">Available Sizes</div>
                <div class="abc-panel-chips">
                  <span class="abc-size-chip">Main: 16–95 mm²</span>
                  <span class="abc-size-chip">Service: 2.5–35 mm²</span>
                </div>
              </div>
              <div class="abc-panel-footer-nav">
                <button type="button" class="abc-panel-nav-btn" data-target-tab="subtab-3">&larr; Prev: IPC Connector</button>
                <span style="font-size: 0.78rem; color: #64748b; font-weight: 600;">4 / 10</span>
                <button type="button" class="abc-panel-nav-btn" data-target-tab="subtab-5">Next: Pre-Insulated Lug &rarr;</button>
              </div>
            </div>
          </div>

          <!-- 5. Pre-Insulated Lug -->
          <div class="abc-tab-panel" id="subtab-5" role="tabpanel" aria-labelledby="subtab-5">
            <div class="abc-panel-card">
              <div class="abc-panel-top">
                <span class="abc-panel-badge">Sub-Product 05 of 10</span>
                <span style="font-size: 0.78rem; color: #64748b; font-weight: 600;">Equipment Termination</span>
              </div>
              <h5 class="abc-panel-title">Pre-Insulated Lug</h5>
              <p class="abc-panel-desc">Designed for terminating insulated aerial bundled conductors onto equipment, switchgear, and distribution boards.</p>
              <div class="abc-panel-specs-box">
                <div class="abc-panel-specs-label">Available Sizes</div>
                <div class="abc-panel-chips">
                  <span class="abc-size-chip">16–35 mm²</span>
                  <span class="abc-size-chip">35–70 mm²</span>
                  <span class="abc-size-chip">70–120 mm²</span>
                  <span class="abc-size-chip">120–150 mm²</span>
                </div>
              </div>
              <div class="abc-panel-footer-nav">
                <button type="button" class="abc-panel-nav-btn" data-target-tab="subtab-4">&larr; Prev: Service Clamp</button>
                <span style="font-size: 0.78rem; color: #64748b; font-weight: 600;">5 / 10</span>
                <button type="button" class="abc-panel-nav-btn" data-target-tab="subtab-6">Next: Pre-Insulated Ferrule &rarr;</button>
              </div>
            </div>
          </div>

          <!-- 6. Pre-Insulated Ferrule -->
          <div class="abc-tab-panel" id="subtab-6" role="tabpanel" aria-labelledby="subtab-6">
            <div class="abc-panel-card">
              <div class="abc-panel-top">
                <span class="abc-panel-badge">Sub-Product 06 of 10</span>
                <span style="font-size: 0.78rem; color: #64748b; font-weight: 600;">Conductor Splice / Joint</span>
              </div>
              <h5 class="abc-panel-title">Pre-Insulated Ferrule</h5>
              <p class="abc-panel-desc">Provides a reliable termination for ABC conductors while maintaining insulation and mechanical protection.</p>
              <div class="abc-panel-specs-box">
                <div class="abc-panel-specs-label">Available Sizes</div>
                <div class="abc-panel-chips">
                  <span class="abc-size-chip">16–35 mm²</span>
                  <span class="abc-size-chip">35–70 mm²</span>
                  <span class="abc-size-chip">70–120 mm²</span>
                  <span class="abc-size-chip">120–150 mm²</span>
                </div>
              </div>
              <div class="abc-panel-footer-nav">
                <button type="button" class="abc-panel-nav-btn" data-target-tab="subtab-5">&larr; Prev: Pre-Insulated Lug</button>
                <span style="font-size: 0.78rem; color: #64748b; font-weight: 600;">6 / 10</span>
                <button type="button" class="abc-panel-nav-btn" data-target-tab="subtab-7">Next: Cable Spacer &rarr;</button>
              </div>
            </div>
          </div>

          <!-- 7. Cable Spacer / Spacer Clamp -->
          <div class="abc-tab-panel" id="subtab-7" role="tabpanel" aria-labelledby="subtab-7">
            <div class="abc-panel-card">
              <div class="abc-panel-top">
                <span class="abc-panel-badge">Sub-Product 07 of 10</span>
                <span style="font-size: 0.78rem; color: #64748b; font-weight: 600;">Bundle Stability</span>
              </div>
              <h5 class="abc-panel-title">Cable Spacer / Spacer Clamp</h5>
              <p class="abc-panel-desc">Maintains separation and positioning of bundled conductors, helping prevent contact and improving line stability.</p>
              <div class="abc-panel-specs-box">
                <div class="abc-panel-specs-label">Available Sizes</div>
                <div class="abc-panel-chips">
                  <span class="abc-size-chip">Suitable for common LV ABC configurations</span>
                </div>
              </div>
              <div class="abc-panel-footer-nav">
                <button type="button" class="abc-panel-nav-btn" data-target-tab="subtab-6">&larr; Prev: Ferrule</button>
                <span style="font-size: 0.78rem; color: #64748b; font-weight: 600;">7 / 10</span>
                <button type="button" class="abc-panel-nav-btn" data-target-tab="subtab-8">Next: Cable Tie / Strap &rarr;</button>
              </div>
            </div>
          </div>

          <!-- 8. Cable Tie / Binding Strap -->
          <div class="abc-tab-panel" id="subtab-8" role="tabpanel" aria-labelledby="subtab-8">
            <div class="abc-panel-card">
              <div class="abc-panel-top">
                <span class="abc-panel-badge">Sub-Product 08 of 10</span>
                <span style="font-size: 0.78rem; color: #64748b; font-weight: 600;">Fastening &amp; Securing</span>
              </div>
              <h5 class="abc-panel-title">Cable Tie / Binding Strap</h5>
              <p class="abc-panel-desc">UV-resistant fastening solution for securing ABC cables to poles and supporting hardware.</p>
              <div class="abc-panel-specs-box">
                <div class="abc-panel-specs-label">Available Sizes</div>
                <div class="abc-panel-chips">
                  <span class="abc-size-chip">Available in various lengths &amp; tensile strengths</span>
                </div>
              </div>
              <div class="abc-panel-footer-nav">
                <button type="button" class="abc-panel-nav-btn" data-target-tab="subtab-7">&larr; Prev: Cable Spacer</button>
                <span style="font-size: 0.78rem; color: #64748b; font-weight: 600;">8 / 10</span>
                <button type="button" class="abc-panel-nav-btn" data-target-tab="subtab-9">Next: Pole Bracket &rarr;</button>
              </div>
            </div>
          </div>

          <!-- 9. Pole Bracket -->
          <div class="abc-tab-panel" id="subtab-9" role="tabpanel" aria-labelledby="subtab-9">
            <div class="abc-panel-card">
              <div class="abc-panel-top">
                <span class="abc-panel-badge">Sub-Product 09 of 10</span>
                <span style="font-size: 0.78rem; color: #64748b; font-weight: 600;">Pole Hardware</span>
              </div>
              <h5 class="abc-panel-title">Pole Bracket</h5>
              <p class="abc-panel-desc">Heavy-duty bracket used to mount suspension and anchoring accessories securely to distribution poles.</p>
              <div class="abc-panel-specs-box">
                <div class="abc-panel-specs-label">Available Sizes</div>
                <div class="abc-panel-chips">
                  <span class="abc-size-chip">Available for standard ABC pole configurations</span>
                </div>
              </div>
              <div class="abc-panel-footer-nav">
                <button type="button" class="abc-panel-nav-btn" data-target-tab="subtab-8">&larr; Prev: Cable Tie</button>
                <span style="font-size: 0.78rem; color: #64748b; font-weight: 600;">9 / 10</span>
                <button type="button" class="abc-panel-nav-btn" data-target-tab="subtab-10">Next: End Cap &rarr;</button>
              </div>
            </div>
          </div>

          <!-- 10. Protective End Cap -->
          <div class="abc-tab-panel" id="subtab-10" role="tabpanel" aria-labelledby="subtab-10">
            <div class="abc-panel-card">
              <div class="abc-panel-top">
                <span class="abc-panel-badge">Sub-Product 10 of 10</span>
                <span style="font-size: 0.78rem; color: #64748b; font-weight: 600;">Environmental Protection</span>
              </div>
              <h5 class="abc-panel-title">Protective End Cap</h5>
              <p class="abc-panel-desc">Seals the end of an ABC cable to protect conductors and insulation from moisture, contamination, and environmental exposure.</p>
              <div class="abc-panel-specs-box">
                <div class="abc-panel-specs-label">Available Sizes</div>
                <div class="abc-panel-chips">
                  <span class="abc-size-chip">Available to suit standard ABC cable configurations</span>
                </div>
              </div>
              <div class="abc-panel-footer-nav">
                <button type="button" class="abc-panel-nav-btn" data-target-tab="subtab-9">&larr; Prev: Pole Bracket</button>
                <span style="font-size: 0.78rem; color: #64748b; font-weight: 600;">10 / 10</span>
                <button type="button" class="abc-panel-nav-btn" disabled>Next &rarr;</button>
              </div>
            </div>
          </div>
        </div>

        <h4 style="font-size: 0.95rem; font-weight: 700; color: #166534; margin-bottom: 0.6rem; text-transform: uppercase; letter-spacing: 0.05em;">Engineering Features &amp; Standards Compliance</h4>
        <ul>
          <li><strong>Utility Tested &amp; Approved:</strong> Meets and exceeds NFC 33-020, EN 50483-4, and Eskom distribution specifications.</li>
          <li><strong>UV &amp; Weatherproof Integrity:</strong> High-grade carbon-black loaded polymeric housings resist intense African solar radiation and ozone weathering.</li>
          <li><strong>Live-Line Installation Safety:</strong> Fully insulated components permit safe, efficient installation on energized low-voltage networks.</li>
          <li><strong>Corrosion-Resistant Hardware:</strong> Hot-dip galvanized and high-tensile aluminium alloy fittings provide extended service life.</li>
        </ul>
      `
    }
  };

  const STORAGE_KEY = 'bakis_product_catalog_v20';
  let productCatalog = {};

  const loadCatalog = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        productCatalog = JSON.parse(stored);
        // Ensure new default catalog products exist
        Object.keys(defaultProductCatalog).forEach(key => {
          if (!productCatalog[key]) {
            productCatalog[key] = defaultProductCatalog[key];
          }
        });
      } else {
        // Migrate or initialize with default catalog
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
        <div class="mosaic-product-tile ${spanClass}" data-product="${key}" role="button" tabindex="0" aria-label="View details for ${item.title}">
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

  const selectProductInContactForm = (productTitle, productCategory) => {
    if (!contactProductSelect) return;
    const cleanTitle = (productTitle || '').trim();
    const cleanCat = (productCategory || '').trim();
    const lower = cleanTitle.toLowerCase();
    let matchedIndex = -1;

    for (let i = 0; i < contactProductSelect.options.length; i++) {
      const opt = contactProductSelect.options[i];
      const optVal = (opt.value || '').toLowerCase();
      const optText = (opt.text || '').toLowerCase();

      if (optVal === lower || optText === lower) {
        matchedIndex = i;
        break;
      }
      if (lower.includes('circuit breaker') && (optVal.includes('circuit breaker') || optText.includes('circuit breaker'))) {
        matchedIndex = i;
        break;
      }
      if ((lower.includes('bimetal') || lower.includes('bi metal') || lower.includes('bi-metal')) &&
          (optVal.includes('metal') || optText.includes('metal'))) {
        matchedIndex = i;
        break;
      }
      if ((lower.includes('piercing') || lower.includes('ipc') || lower.includes('aerial bundled') || lower.includes('conductor accessories')) &&
          (optVal.includes('piercing') || optVal.includes('ipc') || optVal.includes('aerial') || optText.includes('piercing') || optText.includes('ipc') || optText.includes('aerial'))) {
        matchedIndex = i;
        break;
      }
      if ((lower.includes('tension joint') || lower.includes('splice')) &&
          (optVal.includes('tension') || optText.includes('tension'))) {
        matchedIndex = i;
        break;
      }
      if (lower.includes('seal') && (optVal.includes('seal') || optText.includes('seal'))) {
        matchedIndex = i;
        break;
      }
      if (lower.includes('surge') && (optVal.includes('surge') || optText.includes('surge'))) {
        matchedIndex = i;
        break;
      }
      if (lower.includes('fuse') && (optVal.includes('fuse') || optText.includes('fuse'))) {
        matchedIndex = i;
        break;
      }
      if (lower.includes('cable') && (optVal.includes('cable') || optText.includes('cable'))) {
        matchedIndex = i;
        break;
      }
      if (lower.includes('solar') && (optVal.includes('solar') || optText.includes('solar'))) {
        matchedIndex = i;
        break;
      }
      if (lower.includes('insulator') && (optVal.includes('insulator') || optText.includes('insulator'))) {
        matchedIndex = i;
        break;
      }
    }

    if (matchedIndex >= 0) {
      contactProductSelect.selectedIndex = matchedIndex;
    } else if (cleanTitle) {
      const opt = document.createElement('option');
      opt.value = cleanTitle;
      opt.text = cleanTitle + (cleanCat ? ` (${cleanCat})` : '');
      opt.selected = true;
      contactProductSelect.appendChild(opt);
      contactProductSelect.selectedIndex = contactProductSelect.options.length - 1;
    }

    syncContactProductState();

    contactProductSelect.style.transition = 'all 0.3s ease';
    contactProductSelect.style.borderColor = '#00bf63';
    contactProductSelect.style.boxShadow = '0 0 0 3px rgba(0, 191, 99, 0.3)';
    setTimeout(() => {
      contactProductSelect.style.borderColor = '';
      contactProductSelect.style.boxShadow = '';
    }, 2500);
  };

  const openProductModal = (productId) => {
    const data = productCatalog[productId];
    if (!data || !productModal) return;

    // Apply subtle grey background to visual banner stage and color-code the category badge
    productModalVisual.style.backgroundColor = '';
    productModalBadge.innerText = data.category || 'Product';
    if (data.bgColor) {
      productModalBadge.style.borderColor = data.bgColor;
      productModalBadge.style.color = data.bgColor;
    }

    const imageWrap = productModalVisual ? productModalVisual.querySelector('.product-modal-image-wrap') : null;
    if (imageWrap) {
      if (data.secondaryImage) {
        imageWrap.classList.add('has-multiple-images');
        imageWrap.innerHTML = `
          <img src="${data.modalImage || data.image}" alt="${data.title}" id="productModalImage" class="modal-primary-img">
          <img src="${data.secondaryImage}" alt="${data.secondaryImageAlt || 'Substation Equipment'}" class="modal-secondary-img">
        `;
      } else {
        imageWrap.classList.remove('has-multiple-images');
        imageWrap.innerHTML = `
          <img src="${data.modalImage || data.image}" alt="${data.title}" id="productModalImage">
        `;
      }
    } else if (productModalImage) {
      productModalImage.src = data.modalImage || data.image;
      productModalImage.alt = data.title;
    }

    productModalTitle.innerText = data.title;
    productModalTagline.innerText = data.tagline;
    productModalDescription.innerHTML = data.description;

    if (productModalSpecs) {
      if (data.specs && data.specs.length > 0) {
        productModalSpecs.style.display = 'grid';
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
      } else {
        productModalSpecs.style.display = 'none';
        productModalSpecs.innerHTML = '';
      }
    }

    if (productModalRfqBtn) {
      productModalRfqBtn.onclick = () => {
        closeProductModal();
        selectProductInContactForm(data.title, data.category);

        if (contactMessageInput) {
          contactMessageInput.value = `Hi Bakis Engineering,\n\nI would like to request an RFQ / technical quotation for: ${data.title} (${data.category}).\n\nPlease provide specifications, volume pricing, and delivery timeline.`;
        }

        const contactSec = document.getElementById('contact');
        if (contactSec) {
          contactSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        setTimeout(() => {
          if (contactNameInput) contactNameInput.focus();
        }, 500);
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

  // Expose on window for programmatic access and external controls
  window.openProductModal = openProductModal;
  window.closeProductModal = closeProductModal;

  // ==========================================================================
  // Sub-Products Interactive Tabs Controller (Event Delegation)
  // ==========================================================================
  document.addEventListener('click', (e) => {
    // 1. Direct Tab Button Click
    const tabBtn = e.target.closest('.abc-tab-btn');
    if (tabBtn) {
      const container = tabBtn.closest('.abc-tabs-container');
      const targetId = tabBtn.getAttribute('data-tab');
      if (container && targetId) {
        // Toggle buttons
        const allBtns = container.querySelectorAll('.abc-tab-btn');
        allBtns.forEach(btn => {
          const isActive = btn === tabBtn;
          btn.classList.toggle('active', isActive);
          btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        // Toggle panels
        const allPanels = container.querySelectorAll('.abc-tab-panel');
        allPanels.forEach(panel => {
          const isTarget = panel.id === targetId;
          panel.classList.toggle('active', isTarget);
        });

        // Smooth horizontal centering of active tab button
        tabBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
      return;
    }

    // 2. Next / Previous Navigation Button inside Panel
    const navBtn = e.target.closest('.abc-panel-nav-btn');
    if (navBtn && navBtn.getAttribute('data-target-tab')) {
      const targetId = navBtn.getAttribute('data-target-tab');
      const container = navBtn.closest('.abc-tabs-container');
      if (container && targetId) {
        const targetBtn = container.querySelector(`.abc-tab-btn[data-tab="${targetId}"]`);
        if (targetBtn) {
          targetBtn.click();
        }
      }
      return;
    }
  });

  // Keyboard navigation for sub-product tabs (ArrowLeft / ArrowRight)
  document.addEventListener('keydown', (e) => {
    const activeTab = document.activeElement ? document.activeElement.closest('.abc-tab-btn') : null;
    if (!activeTab) return;

    const container = activeTab.closest('.abc-tabs-container');
    if (!container) return;

    const tabBtns = Array.from(container.querySelectorAll('.abc-tab-btn'));
    const currentIndex = tabBtns.indexOf(activeTab);
    if (currentIndex === -1) return;

    let targetIndex = -1;
    if (e.key === 'ArrowRight') {
      targetIndex = (currentIndex + 1) % tabBtns.length;
    } else if (e.key === 'ArrowLeft') {
      targetIndex = (currentIndex - 1 + tabBtns.length) % tabBtns.length;
    }

    if (targetIndex >= 0) {
      e.preventDefault();
      tabBtns[targetIndex].focus();
      tabBtns[targetIndex].click();
    }
  });

  // ==========================================================================
  // Product Management / Admin Area Controller
  // ==========================================================================
  const adminModal = document.getElementById('adminModal');
  const openAdminBtn = document.getElementById('openAdminBtn');
  const adminModalClose = document.getElementById('adminModalClose');
  const adminLoginModal = document.getElementById('adminLoginModal');
  const adminLoginClose = document.getElementById('adminLoginClose');
  const adminLoginForm = document.getElementById('adminLoginForm');
  const adminLoginEmail = document.getElementById('adminLoginEmail');
  const adminLoginPassword = document.getElementById('adminLoginPassword');
  const adminLoginError = document.getElementById('adminLoginError');
  const adminLoginErrorText = document.getElementById('adminLoginErrorText');
  const btnAdminLogout = document.getElementById('btnAdminLogout');
  const adminUserEmailLabel = document.getElementById('adminUserEmailLabel');

  const tabCatalogList = document.getElementById('tabCatalogList');
  const tabAddProduct = document.getElementById('tabAddProduct');
  const tabMobileConnect = document.getElementById('tabMobileConnect');
  const tabEnquiries = document.getElementById('tabEnquiries');
  const paneCatalogList = document.getElementById('paneCatalogList');
  const paneAddProduct = document.getElementById('paneAddProduct');
  const paneMobileConnect = document.getElementById('paneMobileConnect');
  const paneEnquiries = document.getElementById('paneEnquiries');
  const adminEnquiriesCount = document.getElementById('adminEnquiriesCount');
  const adminEnquiriesTableBody = document.getElementById('adminEnquiriesTableBody');
  const adminEnquiriesSearchInput = document.getElementById('adminEnquiriesSearchInput');
  const btnExportEnquiries = document.getElementById('btnExportEnquiries');
  const btnClearEnquiries = document.getElementById('btnClearEnquiries');
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

  const ADMIN_EMAIL = 'tsoanelomodise@gmail.com';
  const ADMIN_PASS = 'qwe123';
  const AUTH_STORAGE_KEY = 'bakis_admin_auth_v1';

  const isUserAdmin = () => {
    return sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true';
  };

  const openAdminLoginModal = () => {
    if (!adminLoginModal) return;
    if (adminLoginError) adminLoginError.style.display = 'none';
    if (adminLoginPassword) adminLoginPassword.value = '';
    if (adminLoginEmail) adminLoginEmail.value = ADMIN_EMAIL;
    adminLoginModal.classList.add('active');
    adminLoginModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      if (adminLoginPassword) adminLoginPassword.focus();
    }, 150);
  };

  const closeAdminLoginModal = () => {
    if (!adminLoginModal) return;
    adminLoginModal.classList.remove('active');
    adminLoginModal.setAttribute('aria-hidden', 'true');
    if (!adminModal || !adminModal.classList.contains('active')) {
      document.body.style.overflow = '';
    }
  };

  const openAdminModal = () => {
    if (!adminModal) return;
    // Authentication Check: only allow login for authorized admin
    if (!isUserAdmin()) {
      openAdminLoginModal();
      return;
    }
    if (adminUserEmailLabel) {
      adminUserEmailLabel.innerText = sessionStorage.getItem('bakis_admin_user') || ADMIN_EMAIL;
    }
    renderAdminTable();
    renderAdminEnquiries();
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
    [tabCatalogList, tabAddProduct, tabMobileConnect, tabEnquiries].forEach(btn => {
      if (btn) btn.classList.remove('active');
    });
    [paneCatalogList, paneAddProduct, paneMobileConnect, paneEnquiries].forEach(pane => {
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
    } else if (tab === 'enquiries') {
      if (tabEnquiries) tabEnquiries.classList.add('active');
      if (paneEnquiries) paneEnquiries.classList.add('active');
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
  if (adminLoginClose) adminLoginClose.addEventListener('click', closeAdminLoginModal);

  // Admin Login Submission
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = adminLoginEmail ? adminLoginEmail.value.trim() : '';
      const pass = adminLoginPassword ? adminLoginPassword.value : '';

      if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && pass === ADMIN_PASS) {
        if (adminLoginError) adminLoginError.style.display = 'none';
        sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
        sessionStorage.setItem('bakis_admin_user', ADMIN_EMAIL);
        closeAdminLoginModal();
        openAdminModal();
      } else {
        if (adminLoginError) {
          adminLoginError.style.display = 'flex';
          if (adminLoginErrorText) {
            adminLoginErrorText.innerText = 'Invalid email or password. Access restricted to Bakis administrators.';
          }
        }
        if (adminLoginPassword) {
          adminLoginPassword.value = '';
          adminLoginPassword.focus();
        }
      }
    });
  }

  // Admin Logout
  if (btnAdminLogout) {
    btnAdminLogout.addEventListener('click', () => {
      if (confirm('Log out from Administrator Suite?')) {
        sessionStorage.removeItem(AUTH_STORAGE_KEY);
        sessionStorage.removeItem('bakis_admin_user');
        closeAdminModal();
      }
    });
  }

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

  // ==========================================================================
  // Customer Enquiries Management Controller
  // ==========================================================================
  const escapeHtml = (str) => {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const getSavedEnquiries = () => {
    try {
      return JSON.parse(localStorage.getItem('bakis_inquiry_leads') || '[]');
    } catch (e) {
      console.error('Failed to parse bakis_inquiry_leads:', e);
      return [];
    }
  };

  const saveEnquiries = (list) => {
    try {
      localStorage.setItem('bakis_inquiry_leads', JSON.stringify(list));
    } catch (e) {
      console.error('Failed to save bakis_inquiry_leads:', e);
    }
  };

  const deleteEnquiry = (id) => {
    if (confirm('Delete this customer inquiry record?')) {
      const list = getSavedEnquiries().filter(item => item.id !== id);
      saveEnquiries(list);
      renderAdminEnquiries(adminEnquiriesSearchInput ? adminEnquiriesSearchInput.value : '');
    }
  };

  const renderAdminEnquiries = (filterQuery = '') => {
    const list = getSavedEnquiries();
    if (adminEnquiriesCount) {
      adminEnquiriesCount.innerText = list.length;
    }
    if (!adminEnquiriesTableBody) return;

    const q = filterQuery.trim().toLowerCase();
    const filtered = list.filter(item => {
      if (!q) return true;
      return (
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.email && item.email.toLowerCase().includes(q)) ||
        (item.product && item.product.toLowerCase().includes(q)) ||
        (item.message && item.message.toLowerCase().includes(q))
      );
    });

    if (filtered.length === 0) {
      adminEnquiriesTableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 2.5rem; color: #64748b;">
            ${q ? 'No enquiries match your search query.' : 'No customer enquiries or RFQs saved yet.'}
          </td>
        </tr>
      `;
      return;
    }

    adminEnquiriesTableBody.innerHTML = filtered.map(item => {
      const dateStr = item.submittedAt ? new Date(item.submittedAt).toLocaleString('en-ZA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) : 'Recent';

      const isGeneral = !item.product || item.product.toLowerCase() === 'general enquiry';
      const badgeHtml = isGeneral
        ? `<span class="enquiry-badge-general">General Enquiry</span>`
        : `<span class="enquiry-badge-product">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            ${escapeHtml(item.product)}
          </span>`;

      return `
        <tr>
          <td class="enquiry-date">${dateStr}</td>
          <td>
            <div class="enquiry-user-name">${escapeHtml(item.name || 'Website Customer')}</div>
          </td>
          <td>
            <a href="mailto:${escapeHtml(item.email)}?subject=Re:%20Bakis%20Engineering%20Inquiry%20-%20${encodeURIComponent(item.product || 'Quotation')}" class="enquiry-user-email">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              <span>${escapeHtml(item.email)}</span>
            </a>
          </td>
          <td>${badgeHtml}</td>
          <td>
            <div class="enquiry-message-cell">${escapeHtml(item.message)}</div>
          </td>
          <td style="text-align: right;">
            <button type="button" class="btn-table-action delete" data-delete-id="${item.id}" title="Delete enquiry">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </td>
        </tr>
      `;
    }).join('');

    adminEnquiriesTableBody.querySelectorAll('.btn-table-action.delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-delete-id');
        if (id) deleteEnquiry(id);
      });
    });
  };

  const exportEnquiriesCsv = () => {
    const list = getSavedEnquiries();
    if (list.length === 0) {
      alert('No enquiries to export.');
      return;
    }

    const headers = ['Date Submitted', 'Customer / Organization', 'Email', 'Product / Commodity', 'Message / Specs', 'Recipients'];
    const rows = list.map(item => [
      item.submittedAt || '',
      item.name || '',
      item.email || '',
      item.product || 'General Enquiry',
      (item.message || '').replace(/"/g, '""'),
      (item.recipients || []).join('; ')
    ]);

    let csvContent = '\uFEFF';
    csvContent += headers.map(h => `"${h}"`).join(',') + '\r\n';
    rows.forEach(row => {
      csvContent += row.map(col => `"${String(col).replace(/"/g, '""')}"`).join(',') + '\r\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `bakis_customer_enquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const clearAllEnquiries = () => {
    const list = getSavedEnquiries();
    if (list.length === 0) {
      alert('Enquiry vault is already empty.');
      return;
    }
    if (confirm(`Are you sure you want to permanently clear all ${list.length} saved customer enquiries?`)) {
      localStorage.removeItem('bakis_inquiry_leads');
      renderAdminEnquiries();
    }
  };

  if (tabEnquiries) tabEnquiries.addEventListener('click', () => { renderAdminEnquiries(); switchAdminTab('enquiries'); });
  if (adminEnquiriesSearchInput) {
    adminEnquiriesSearchInput.addEventListener('input', (e) => {
      renderAdminEnquiries(e.target.value);
    });
  }
  if (btnExportEnquiries) btnExportEnquiries.addEventListener('click', exportEnquiriesCsv);
  if (btnClearEnquiries) btnClearEnquiries.addEventListener('click', clearAllEnquiries);

  // Initialize enquiry badge count on load
  renderAdminEnquiries();

  if (adminModal) {
    adminModal.addEventListener('click', (e) => {
      if (e.target === adminModal) closeAdminModal();
    });
  }

  if (adminLoginModal) {
    adminLoginModal.addEventListener('click', (e) => {
      if (e.target === adminLoginModal) closeAdminLoginModal();
    });
  }

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (adminLoginModal && adminLoginModal.classList.contains('active')) closeAdminLoginModal();
      if (adminModal && adminModal.classList.contains('active')) closeAdminModal();
      if (productModal && productModal.classList.contains('active')) closeProductModal();
    }
  });
});

