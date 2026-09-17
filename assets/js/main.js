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
});
