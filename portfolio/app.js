/* ==========================================================================
   CREATIVE & PLAYFUL PORTFOLIO JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. CURSOR GLOW TRAIL
  // ==========================================
  const cursorGlow = document.getElementById('cursor-glow');
  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth glow transition using linear interpolation (LERP)
  function updateGlow() {
    if (cursorGlow) {
      glowX += (mouseX - glowX) * 0.1;
      glowY += (mouseY - glowY) * 0.1;
      cursorGlow.style.left = `${glowX}px`;
      cursorGlow.style.top = `${glowY}px`;
    }
    requestAnimationFrame(updateGlow);
  }
  updateGlow();

  // Expand glow when hovering over buttons/interactive items
  const interactiveElements = document.querySelectorAll('a, button, .skill-pill, .project-link, .social-circle');
  if (cursorGlow) {
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorGlow.style.width = '400px';
        cursorGlow.style.height = '400px';
        cursorGlow.style.background = 'radial-gradient(circle, rgba(56, 189, 248, 0.18) 0%, rgba(0, 0, 0, 0) 70%)';
      });
      el.addEventListener('mouseleave', () => {
        cursorGlow.style.width = '300px';
        cursorGlow.style.height = '300px';
        cursorGlow.style.background = 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, rgba(0, 0, 0, 0) 70%)';
      });
    });
  }


  // ==========================================
  // 2. HERO PARTICLES BACKGROUND CANVAS
  // ==========================================
  const heroCanvas = document.getElementById('hero-canvas');
  if (heroCanvas) {
    const heroCtx = heroCanvas.getContext('2d');
    let heroWidth = heroCanvas.width = heroCanvas.offsetWidth;
    let heroHeight = heroCanvas.height = heroCanvas.offsetHeight;

    let particlesArray = [];
    const numberOfParticles = 75;
    const connectionDistance = 110;
    const cursorRepelRadius = 140;

    // Track mouse coordinate offsets relative to canvas to handle scroll correctly
    let canvasMouseX = -1000;
    let canvasMouseY = -1000;

    window.addEventListener('mousemove', (e) => {
      const rect = heroCanvas.getBoundingClientRect();
      canvasMouseX = e.clientX - rect.left;
      canvasMouseY = e.clientY - rect.top;
    });

    window.addEventListener('mouseleave', () => {
      canvasMouseX = -1000;
      canvasMouseY = -1000;
    });

    // Track resizing
    window.addEventListener('resize', () => {
      if (heroCanvas.offsetWidth && heroCanvas.offsetHeight) {
        heroWidth = heroCanvas.width = heroCanvas.offsetWidth;
        heroHeight = heroCanvas.height = heroCanvas.offsetHeight;
      }
    });

    // Particle Class
    class Particle {
      constructor() {
        this.x = Math.random() * heroWidth;
        this.y = Math.random() * heroHeight;
        this.radius = Math.random() * 2.5 + 1.5;
        this.speedX = (Math.random() - 0.5) * 0.7;
        this.speedY = (Math.random() - 0.5) * 0.7;
        // Premium tech theme colors
        const colors = ['rgba(99, 102, 241, 0.75)', 'rgba(14, 165, 233, 0.75)', 'rgba(20, 184, 166, 0.7)', 'rgba(139, 92, 246, 0.75)'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off screen boundaries
        if (this.x < 0 || this.x > heroWidth) this.speedX *= -1;
        if (this.y < 0 || this.y > heroHeight) this.speedY *= -1;

        // Cursor magnetic repel check
        if (canvasMouseX > -500 && canvasMouseY > -500) {
          const dx = canvasMouseX - this.x;
          const dy = canvasMouseY - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < cursorRepelRadius) {
            const forceDirectionX = dx / dist;
            const forceDirectionY = dy / dist;
            const force = (cursorRepelRadius - dist) / cursorRepelRadius; // Strength based on proximity
            this.x -= forceDirectionX * force * 1.8;
            this.y -= forceDirectionY * force * 1.8;
          }
        }
      }

      draw() {
        heroCtx.fillStyle = this.color;
        // Premium soft halo glow around particle nodes
        heroCtx.shadowBlur = this.radius * 3.5;
        heroCtx.shadowColor = this.color;
        heroCtx.beginPath();
        heroCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        heroCtx.fill();
        heroCtx.shadowBlur = 0; // Reset shadow for performance
      }
    }

    // Initialize Particles
    function initParticles() {
      particlesArray = [];
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    }
    initParticles();

    // Draw Connections (Spiderweb effect with interactive cursor ties)
    function connectParticles() {
      for (let a = 0; a < particlesArray.length; a++) {
        // Connect to neighboring particles
        for (let b = a + 1; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const opacity = (1 - (distance / connectionDistance)) * 0.16;
            heroCtx.strokeStyle = `rgba(14, 165, 233, ${opacity})`;
            heroCtx.lineWidth = 0.75;
            heroCtx.beginPath();
            heroCtx.moveTo(particlesArray[a].x, particlesArray[a].y);
            heroCtx.lineTo(particlesArray[b].x, particlesArray[b].y);
            heroCtx.stroke();
          }
        }

        // Connect particles dynamically to the moving cursor
        if (canvasMouseX > -500 && canvasMouseY > -500) {
          const dxMouse = canvasMouseX - particlesArray[a].x;
          const dyMouse = canvasMouseY - particlesArray[a].y;
          const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

          if (distMouse < cursorRepelRadius + 30) {
            const opacity = (1 - (distMouse / (cursorRepelRadius + 30))) * 0.22;
            heroCtx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
            heroCtx.lineWidth = 0.95;
            heroCtx.beginPath();
            heroCtx.moveTo(particlesArray[a].x, particlesArray[a].y);
            heroCtx.lineTo(canvasMouseX, canvasMouseY);
            heroCtx.stroke();
          }
        }
      }
    }

    // Animation Loop
    function animateHeroParticles() {
      heroCtx.clearRect(0, 0, heroWidth, heroHeight);
      
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      connectParticles();
      requestAnimationFrame(animateHeroParticles);
    }
    animateHeroParticles();
  }


  // ==========================================
  // 3. DYNAMIC TYPING INTRODUCTION
  // ==========================================
  const typingText = document.getElementById('typing-text');
  const roles = [
    "AI & Machine Learning Engineer",
    "Full-Stack Software Developer",
    "Data & Analytics Engineer",
    "Computer Science Researcher"
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeRole() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typingText.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // Erase faster
    } else {
      typingText.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100; // Type standard speed
    }

    // Checking states
    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typingSpeed = 2000; // Pause at full word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500; // Short pause before typing next
    }

    setTimeout(typeRole, typingSpeed);
  }
  
  if (typingText) {
    typeRole();
  }


  // ==========================================
  // 4. ABOUT ME TAB TOGGLE
  // ==========================================
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Deactivate all
      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      // Activate clicked
      btn.classList.add('active');
      const targetTab = btn.getAttribute('data-tab');
      document.getElementById(`tab-${targetTab}`).classList.add('active');
    });
  });


  // ==========================================
  // 5. PROJECTS FILTER & DETAIL MODAL
  // ==========================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  // Filtering
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || 
           (filter === 'ai' && category === 'ai') || 
           (filter === 'web' && category === 'web')) {
          card.style.display = 'flex';
          card.style.animation = 'fade-in 0.5s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Modal Project Database
  const projectData = {
    'hiresense-ai': {
      title: "HireSense AI",
      meta: "Completed: 2026 | Category: AI Applications",
      desc: "An AI-powered hiring assistant that evaluates candidates like an experienced recruiter by understanding skills, experience, achievements, and potential instead of relying only on keyword matching.",
      features: [
        "Semantic search evaluation analyzing overall candidate potential",
        "Context-aware resume parser mapping complex job requirement matrices",
        "Intelligent candidate profiling utilizing top-tier AI LLMs",
        "Direct connection portal matching profiles to team culture and job specs"
      ],
      svg: `<svg viewBox="0 0 300 200" width="100%" height="100%" style="background:#0c0b1e">
              <circle cx="150" cy="95" r="22" fill="none" stroke="rgba(139, 92, 246, 0.4)" stroke-width="3" />
              <circle cx="150" cy="95" r="8" fill="#8b5cf6"/>
              <line x1="80" y1="65" x2="150" y2="95" stroke="#10b981" stroke-width="2"/>
              <line x1="220" y1="65" x2="150" y2="95" stroke="#0ea5e9" stroke-width="2"/>
              <line x1="80" y1="125" x2="150" y2="95" stroke="#f59e0b" stroke-width="2"/>
              <line x1="220" y1="125" x2="150" y2="95" stroke="#ec4899" stroke-width="2"/>
              <circle cx="80" cy="65" r="5" fill="#10b981"/>
              <circle cx="220" cy="65" r="5" fill="#0ea5e9"/>
              <circle cx="80" cy="125" r="5" fill="#f59e0b"/>
              <circle cx="220" cy="125" r="5" fill="#ec4899"/>
            </svg>`
    },
    'voice-translation': {
      title: "Voice-to-Voice Translation in Real Time",
      meta: "Completed: 2025 | Category: AI Applications",
      desc: "An AI-powered communication platform that translates spoken conversations in real time and delivers the translated output as natural-sounding speech. Designed to break language barriers and enable seamless multilingual communication.",
      features: [
        "Real-time audio speech-to-text capturing API integrations",
        "High-speed translation streams between multiple global language sets",
        "Voice synthesis yielding natural, clean vocal output (using ElevenLabs)",
        "Gradio-based interactive web UI dashboard supporting microphone streaming"
      ],
      svg: `<svg viewBox="0 0 300 200" width="100%" height="100%" style="background:#0c0b1e">
              <circle cx="100" cy="100" r="30" fill="none" stroke="#ff5da2" stroke-width="2"/>
              <rect x="94" y="82" width="12" height="24" rx="6" fill="#ff5da2"/>
              <path d="M 88 94 Q 100 114 112 94" fill="none" stroke="#ff5da2" stroke-width="2"/>
              <line x1="100" y1="108" x2="100" y2="120" stroke="#ff5da2" stroke-width="2"/>
              <path d="M 135 90 L 165 90 M 160 85 L 165 90 L 160 95" fill="none" stroke="#00f0ff" stroke-width="2"/>
              <path d="M 165 110 L 135 110 M 140 105 L 135 110 L 140 115" fill="none" stroke="#00f0ff" stroke-width="2"/>
              <circle cx="200" cy="100" r="30" fill="none" stroke="#05ffa1" stroke-width="2"/>
              <path d="M 190 95 L 196 95 L 204 88 L 204 112 L 196 105 L 190 105 Z" fill="#05ffa1"/>
              <path d="M 210 90 Q 218 100 210 110" fill="none" stroke="#05ffa1" stroke-width="2"/>
            </svg>`
    },
    'bidu-ai': {
      title: "Bidu AI",
      meta: "Completed: 2025 | Category: AI Applications",
      desc: "A smart AI assistant designed to provide intelligent responses, assist users with tasks, and enhance productivity through conversational AI capabilities.",
      features: [
        "Advanced conversational LLM prompting configurations",
        "Custom workflow tasks execution helper APIs",
        "Streamlit user dashboard displaying performance metrics",
        "API integration providing live response rendering streams"
      ],
      svg: `<svg viewBox="0 0 300 200" width="100%" height="100%" style="background:#0c0b1e">
              <circle cx="150" cy="95" r="24" fill="rgba(0, 240, 255, 0.1)" stroke="#00f0ff" stroke-width="3"/>
              <circle cx="150" cy="95" r="8" fill="#ff5da2"/>
              <circle cx="90" cy="65" r="8" fill="none" stroke="#ffd000" stroke-width="2"/>
              <line x1="140" y1="80" x2="98" y2="69" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1.5"/>
              <circle cx="210" cy="65" r="8" fill="none" stroke="#05ffa1" stroke-width="2"/>
              <line x1="160" y1="80" x2="202" y2="69" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1.5"/>
              <circle cx="150" cy="150" r="10" fill="none" stroke="#9b51e0" stroke-width="2"/>
              <line x1="150" y1="119" x2="150" y2="140" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1.5"/>
            </svg>`
    },
    'career-chatbot': {
      title: "AI Career Guidance Chatbot",
      meta: "Completed: 2024 | Category: AI Applications",
      desc: "An intelligent career recommendation system that analyzes user interests, skills, and preferences to suggest suitable career paths and professional opportunities.",
      features: [
        "Assessment algorithms matching users' traits with occupational categories",
        "Interactive chatbot interface designed with custom streamlit layouts",
        "Natural language processing parsing user chat streams",
        "Personalized suggestions dashboard mapping resources and skill plans"
      ],
      svg: `<svg viewBox="0 0 300 200" width="100%" height="100%" style="background:#0c0b1e">
              <circle cx="150" cy="80" r="30" fill="none" stroke="#ffd000" stroke-width="2"/>
              <ellipse cx="140" cy="80" rx="4" fill="#00f0ff" />
              <ellipse cx="160" cy="80" rx="4" fill="#00f0ff" />
              <path d="M 170 50 Q 210 35 240 50 Q 250 65 230 75 L 235 90 L 215 80 Q 180 85 170 50" fill="rgba(155, 81, 224, 0.2)" stroke="#9b51e0" stroke-width="2" />
            </svg>`
    },
    'task-automation': {
      title: "Smart Employee Task Automation & Assignment System",
      meta: "Completed: 2024 | Category: Web & Systems",
      desc: "A workflow automation platform that streamlines task assignment, tracks employee progress, monitors completion status, and improves organizational productivity through automated management processes.",
      features: [
        "Automated task prioritization and routing schedulers",
        "Dashboard metrics tracking employee project statuses",
        "Flask-based admin portal coordinating employee logs",
        "SQL databases recording and updating task changes"
      ],
      svg: `<svg viewBox="0 0 300 200" width="100%" height="100%" style="background:#0c0b1e">
              <circle cx="80" cy="70" r="16" fill="none" stroke="#00f0ff" stroke-width="2"/>
              <circle cx="150" cy="70" r="16" fill="none" stroke="#ff5da2" stroke-width="2"/>
              <circle cx="220" cy="70" r="16" fill="none" stroke="#05ffa1" stroke-width="2"/>
              <line x1="96" y1="70" x2="134" y2="70" stroke="rgba(255,255,255,0.2)" stroke-width="2" stroke-dasharray="4 4"/>
              <line x1="166" y1="70" x2="204" y2="70" stroke="rgba(255,255,255,0.2)" stroke-width="2" stroke-dasharray="4 4"/>
            </svg>`
    },
    'portfolio-site': {
      title: "Personal Portfolio Website (In Progress)",
      meta: "Completed: 2026 | Category: Web & Systems",
      desc: "A modern and interactive portfolio website built to showcase my projects, technical skills, achievements, and professional journey with a responsive and visually appealing design.",
      features: [
        "Interactive physics engine play zone spawning emoji canvas items",
        "Drifting background particle connections avoiding the mouse cursor",
        "Smooth scroll tracking updating the active header links",
        "Beautiful glassmorphism styling utilizing vibrant CSS parameters"
      ],
      svg: `<svg viewBox="0 0 300 200" width="100%" height="100%" style="background:#0c0b1e">
              <circle cx="150" cy="90" r="50" fill="none" stroke="#9b51e0" stroke-width="2" stroke-dasharray="10 5"/>
              <text x="150" y="95" font-family="Outfit" font-size="20" font-weight="900" fill="#fff" text-anchor="middle">PORTFOLIO</text>
              <line x1="80" y1="140" x2="120" y2="100" stroke="#00f0ff" stroke-width="4" stroke-linecap="round"/>
              <circle cx="120" cy="100" r="4" fill="#ff5da2"/>
              <circle cx="130" cy="90" r="2" fill="#ffd000"/>
              <path d="M 190 90 A 40 40 0 0 1 180 120" fill="none" stroke="#05ffa1" stroke-width="3"/>
            </svg>`
    }
  };

  // Modal Functionality
  const modal = document.getElementById('project-modal');
  const modalImg = document.getElementById('modal-project-img');
  const modalTitle = document.getElementById('modal-project-title');
  const modalMeta = document.getElementById('modal-project-meta');
  const modalDesc = document.getElementById('modal-project-desc');
  const modalFeatures = document.getElementById('modal-project-features');
  const modalClose = document.getElementById('modal-close-trigger');

  if (modal && modalClose) {
    document.querySelectorAll('.project-link').forEach(link => {
      link.addEventListener('click', (e) => {
        const pId = link.getAttribute('data-project-id');
        const data = projectData[pId];

        if (data) {
          if (modalImg) modalImg.innerHTML = data.svg;
          if (modalTitle) modalTitle.textContent = data.title;
          if (modalMeta) {
            modalMeta.innerHTML = `<span><i class="fa-solid fa-calendar-days"></i> ${data.meta.split('|')[0]}</span>
                                  <span><i class="fa-solid fa-tag"></i> ${data.meta.split('|')[1]}</span>`;
          }
          if (modalDesc) modalDesc.textContent = data.desc;

          // Features list
          if (modalFeatures) {
            modalFeatures.innerHTML = '';
            data.features.forEach(f => {
              const li = document.createElement('li');
              li.textContent = f;
              modalFeatures.appendChild(li);
            });
          }

          modal.classList.add('active');
          document.body.style.overflow = 'hidden'; // Lock scrolling
        }
      });
    });

    // Close triggers
    function closeModal() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }

  // Modal action button click handler
  const modalActionBtn = document.getElementById('modal-action-btn');
  if (modalActionBtn) {
    modalActionBtn.addEventListener('click', () => {
      alert("🚀 Redirecting to project repository/live deployment prototype link!");
    });
  }


  // ==========================================
  // 6. PLAY ZONE SANDBOX (PHYSICS ENGINE)
  // ==========================================
  const sandbox = document.getElementById('sandbox-area');
  const sbCanvas = document.getElementById('sandbox-canvas');
  if (sandbox && sbCanvas) {
    const sbCtx = sbCanvas.getContext('2d');
    const sbHint = document.getElementById('sandbox-hint');

    let sbWidth = sbCanvas.width = sandbox.offsetWidth;
    let sbHeight = sbCanvas.height = sandbox.offsetHeight;

    let physicsItems = [];
    let spawnType = 'emoji'; // 'emoji' or 'bubble'
    let gravityEnabled = true;
    const gravity = 0.35;
    const friction = 0.985;
    const bounceRestitution = 0.75; // Bounciness

    // Resize canvas when container size changes
    window.addEventListener('resize', () => {
      if (sandbox.offsetWidth && sandbox.offsetHeight) {
        sbWidth = sbCanvas.width = sandbox.offsetWidth;
        sbHeight = sbCanvas.height = sandbox.offsetHeight;
      }
    });

    // Click Spawn triggers
    const emojis = ['🎈', '⭐', '🍕', '🎮', '💡', '🎨', '🚀', '🐱', '🍩', '🥑', '👾', '🌈', '🍭', '🧸'];

    // Physics Item class
    class PhysicsItem {
      constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.radius = type === 'emoji' ? 24 : Math.random() * 20 + 15;
        
        // Random starting velocity
        this.vx = (Math.random() - 0.5) * 10;
        this.vy = (Math.random() - 2) * 5; // Launch slightly upwards on creation
        
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.1;

        // Select randomized emoji or gradient
        if (type === 'emoji') {
          this.char = emojis[Math.floor(Math.random() * emojis.length)];
        } else {
          const colors = [
            ['#00f0ff', '#05ffa1'],
            ['#ff5da2', '#9b51e0'],
            ['#ffd000', '#ff763b'],
            ['#9b51e0', '#ff5da2']
          ];
          this.colorGrad = colors[Math.floor(Math.random() * colors.length)];
        }
      }

      update() {
        // Apply gravity
        if (gravityEnabled) {
          this.vy += gravity;
        }

        // Apply drag friction
        this.vx *= friction;
        this.vy *= friction;

        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;

        // Edge Collisions (Wall checks)
        // Bottom border
        if (this.y + this.radius > sbHeight) {
          this.y = sbHeight - this.radius;
          this.vy = -this.vy * bounceRestitution;
          this.rotationSpeed *= 0.8;
        }
        // Top border
        if (this.y - this.radius < 0) {
          this.y = this.radius;
          this.vy = -this.vy * bounceRestitution;
        }
        // Right border
        if (this.x + this.radius > sbWidth) {
          this.x = sbWidth - this.radius;
          this.vx = -this.vx * bounceRestitution;
        }
        // Left border
        if (this.x - this.radius < 0) {
          this.x = this.radius;
          this.vx = -this.vx * bounceRestitution;
        }
      }

      draw() {
        sbCtx.save();
        sbCtx.translate(this.x, this.y);
        sbCtx.rotate(this.rotation);

        if (this.type === 'emoji') {
          sbCtx.font = `${this.radius * 1.5}px Arial`;
          sbCtx.textAlign = 'center';
          sbCtx.textBaseline = 'middle';
          sbCtx.fillText(this.char, 0, 0);
        } else {
          const gradient = sbCtx.createLinearGradient(-this.radius, -this.radius, this.radius, this.radius);
          gradient.addColorStop(0, this.colorGrad[0]);
          gradient.addColorStop(1, this.colorGrad[1]);

          sbCtx.strokeStyle = gradient;
          sbCtx.lineWidth = 4;
          sbCtx.beginPath();
          sbCtx.arc(0, 0, this.radius - 2, 0, Math.PI * 2);
          sbCtx.stroke();

          sbCtx.fillStyle = 'rgba(255, 255, 255, 0.05)';
          sbCtx.beginPath();
          sbCtx.arc(0, 0, this.radius - 6, 0, Math.PI * 2);
          sbCtx.fill();
        }

        sbCtx.restore();
      }
    }

    // Handle Collisions between items (Circle vs Circle Elastic Collisions)
    function resolveItemCollisions() {
      for (let i = 0; i < physicsItems.length; i++) {
        for (let j = i + 1; j < physicsItems.length; j++) {
          const itemA = physicsItems[i];
          const itemB = physicsItems[j];

          const dx = itemB.x - itemA.x;
          const dy = itemB.y - itemA.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance = itemA.radius + itemB.radius;

          if (distance < minDistance) {
            const overlap = minDistance - distance;
            const normalX = dx / distance;
            const normalY = dy / distance;

            itemA.x -= normalX * overlap * 0.5;
            itemA.y -= normalY * overlap * 0.5;
            itemB.x += normalX * overlap * 0.5;
            itemB.y += normalY * overlap * 0.5;

            const kx = itemA.vx - itemB.vx;
            const ky = itemA.vy - itemB.vy;
            const p = 2 * (normalX * kx + normalY * ky) / 2;

            itemA.vx -= p * normalX * bounceRestitution;
            itemA.vy -= p * normalY * bounceRestitution;
            itemB.vx += p * normalX * bounceRestitution;
            itemB.vy += p * normalY * bounceRestitution;
          }
        }
      }
    }

    // Click handler on Sandbox
    sandbox.addEventListener('click', (e) => {
      if (e.target.closest('.sandbox-controls')) return;

      if (sbHint && sbHint.style.display !== 'none') {
        sbHint.style.display = 'none';
      }

      const rect = sbCanvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      physicsItems.push(new PhysicsItem(clickX, clickY, spawnType));
      
      if (physicsItems.length > 50) {
        physicsItems.shift();
      }
    });

    // Sandbox Controls Handlers
    const btnEmoji = document.getElementById('btn-spawn-emoji');
    const btnBubble = document.getElementById('btn-spawn-bubble');
    const btnGravity = document.getElementById('btn-toggle-gravity');
    const btnClear = document.getElementById('btn-clear-sandbox');

    if (btnEmoji) {
      btnEmoji.addEventListener('click', () => {
        spawnType = 'emoji';
        btnEmoji.classList.add('active');
        if (btnBubble) btnBubble.classList.remove('active');
      });
    }

    if (btnBubble) {
      btnBubble.addEventListener('click', () => {
        spawnType = 'bubble';
        btnBubble.classList.add('active');
        if (btnEmoji) btnEmoji.classList.remove('active');
      });
    }

    if (btnGravity) {
      btnGravity.addEventListener('click', () => {
        gravityEnabled = !gravityEnabled;
        btnGravity.textContent = gravityEnabled ? "Gravity: ON" : "Gravity: OFF";
        if (gravityEnabled) {
          btnGravity.classList.remove('active');
        } else {
          btnGravity.classList.add('active');
        }
      });
    }

    if (btnClear) {
      btnClear.addEventListener('click', () => {
        physicsItems = [];
        if (sbHint) sbHint.style.display = 'block';
      });
    }

    // Physics animation loop
    function animateSandbox() {
      sbCtx.clearRect(0, 0, sbWidth, sbHeight);

      resolveItemCollisions();

      physicsItems.forEach(item => {
        item.update();
        item.draw();
      });

      requestAnimationFrame(animateSandbox);
    }
    animateSandbox();
  }


  // ==========================================
  // 7. CONFETTI ENGINE (RAIN SUCCESS SPLASH)
  // ==========================================
  const confettiCanvas = document.getElementById('confetti-canvas');
  let startConfetti = () => {}; // Fallback if no canvas exists

  if (confettiCanvas) {
    const confCtx = confettiCanvas.getContext('2d');
    let confWidth = confettiCanvas.width = window.innerWidth;
    let confHeight = confettiCanvas.height = window.innerHeight;

    let confettiParticles = [];
    let isRainingConfetti = false;

    window.addEventListener('resize', () => {
      confWidth = confettiCanvas.width = window.innerWidth;
      confHeight = confettiCanvas.height = window.innerHeight;
    });

    class ConfettiParticle {
      constructor() {
        this.x = Math.random() * confWidth;
        this.y = Math.random() * -50 - 20;
        this.radius = Math.random() * 6 + 4;
        this.sizeX = Math.random() * 12 + 8;
        this.sizeY = Math.random() * 16 + 10;
        this.speedY = Math.random() * 3 + 4;
        this.speedX = (Math.random() - 0.5) * 3;
        this.rotation = Math.random() * Math.PI;
        this.rotationSpeed = (Math.random() - 0.5) * 0.1;
        
        const colors = ['#ff5da2', '#00f0ff', '#ffd000', '#9b51e0', '#05ffa1', '#ff763b'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;

        if (this.y > confHeight + 20) {
          this.y = -30;
          this.x = Math.random() * confWidth;
        }
      }

      draw() {
        confCtx.save();
        confCtx.translate(this.x, this.y);
        confCtx.rotate(this.rotation);
        confCtx.fillStyle = this.color;
        confCtx.fillRect(-this.sizeX / 2, -this.sizeY / 2, this.sizeX, this.sizeY);
        confCtx.restore();
      }
    }

    startConfetti = function() {
      confettiParticles = [];
      for (let i = 0; i < 150; i++) {
        confettiParticles.push(new ConfettiParticle());
      }
      isRainingConfetti = true;
      
      setTimeout(() => {
        isRainingConfetti = false;
      }, 6000);
    };

    function animateConfetti() {
      confCtx.clearRect(0, 0, confWidth, confHeight);
      
      if (isRainingConfetti || confettiParticles.length > 0) {
        for (let i = 0; i < confettiParticles.length; i++) {
          confettiParticles[i].update();
          confettiParticles[i].draw();
        }

        if (!isRainingConfetti) {
          confettiParticles = confettiParticles.filter(p => p.y < confHeight);
        }
      }
      requestAnimationFrame(animateConfetti);
    }
    animateConfetti();
  }


  // ==========================================
  // 8. CONTACT FORM SUBMISSION
  // ==========================================
  const contactForm = document.getElementById('contact-form');
  const statusMsg = document.getElementById('form-status-msg');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const accessKeyInput = document.getElementById('form-access-key');
      const submitBtn = document.getElementById('form-submit-btn');
      const name = document.getElementById('form-name').value;
      const email = document.getElementById('form-email').value;
      const message = document.getElementById('form-msg').value;

      if (!name || !email || !message) return;

      // Check if they haven't set their Web3Forms key yet
      if (accessKeyInput.value === 'YOUR_ACCESS_KEY_HERE') {
        console.warn("⚠️ Web3Forms Access Key is set to the default placeholder. Simulating successful form submission locally!");
        
        // Local simulation fallback
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
          statusMsg.style.display = 'block';
          statusMsg.classList.add('success');
          statusMsg.innerHTML = '<i class="fa-solid fa-circle-check" style="color:var(--color-mint);"></i> <strong>Success:</strong> Your message has been submitted successfully (Simulation Mode). To receive real emails, set up your access key at <a href="https://web3forms.com" target="_blank" style="color:var(--color-cyan); text-decoration: underline;">Web3Forms</a>.';
          
          startConfetti();
          contactForm.reset();
          submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
          submitBtn.disabled = false;
        }, 1200);
        return;
      }

      // If they have set a key, run the real Web3Forms AJAX call!
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;

      const formData = {
        access_key: accessKeyInput.value,
        name: name,
        email: email,
        message: message
      };

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(async (response) => {
        let json = await response.json();
        if (response.status == 200) {
          statusMsg.style.display = 'block';
          statusMsg.classList.add('success');
          statusMsg.innerHTML = '<i class="fa-solid fa-circle-check"></i> Your message has been sent successfully. I will get back to you shortly.';
          
          startConfetti();
          contactForm.reset();
        } else {
          console.error(json);
          alert("Something went wrong: " + json.message);
        }
      })
      .catch(error => {
        console.error(error);
        alert("Server communication error. Please try again later!");
      })
      .then(() => {
        submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
        submitBtn.disabled = false;
        
        // Hide status message after 10 seconds
        setTimeout(() => {
          statusMsg.style.display = 'none';
        }, 10000);
      });
    });
  }


  // ==========================================
  // 9. ACTIVE LINK VISUAL CORRECTION (SCROLL SPY)
  // ==========================================
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-links a');
  const navHeader = document.querySelector('.nav-header');

  window.addEventListener('scroll', () => {
    let current = '';

    // Toggle header scrolled state dynamically
    if (navHeader) {
      if (window.scrollY > 40) {
        navHeader.classList.add('scrolled');
      } else {
        navHeader.classList.remove('scrolled');
      }
    }

    sections.forEach(sec => {
      const sectionTop = sec.offsetTop;
      const sectionHeight = sec.clientHeight;
      if (window.scrollY >= (sectionTop - 150)) {
        current = sec.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href').slice(1) === current) {
        item.classList.add('active');
      }
    });
  });


  // ==========================================
  // 10. MOBILE HAMBURGER TOGGLE
  // ==========================================
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinksList = document.querySelector('.nav-links');

  if (menuToggle && navLinksList) {
    menuToggle.addEventListener('click', () => {
      navLinksList.classList.toggle('active');
      if (navLinksList.classList.contains('active')) {
        menuToggle.innerHTML = '<i class="fa-solid fa-xmark"></i>';
      } else {
        menuToggle.innerHTML = '<i class="fa-solid fa-bars-staggered"></i>';
      }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          navLinksList.classList.remove('active');
          menuToggle.innerHTML = '<i class="fa-solid fa-bars-staggered"></i>';
        }
      });
    });
  }

  // ==========================================
  // 11. INTERACTIVE 3D GLASS TILT EFFECT
  // ==========================================
  const cards = document.querySelectorAll('.glass-card');
  
  if (window.innerWidth > 768 && window.matchMedia('(pointer: fine)').matches) {
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const percentX = (x / rect.width) * 100;
        const percentY = (y / rect.height) * 100;
        
        // Tilt settings
        const maxTilt = 10; // Max tilt rotation in degrees
        const rotateX = ((rect.height / 2 - y) / (rect.height / 2) * maxTilt).toFixed(2);
        const rotateY = ((x - rect.width / 2) / (rect.width / 2) * maxTilt).toFixed(2);
        
        card.style.setProperty('--mouse-x', `${percentX}%`);
        card.style.setProperty('--mouse-y', `${percentY}%`);
        card.style.setProperty('--glare-opacity', '1');
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      });
      
      card.addEventListener('mouseenter', () => {
        card.style.setProperty('--glare-opacity', '1');
        card.style.transition = 'transform 0.1s ease-out, border-color 0.3s ease, box-shadow 0.3s ease';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--glare-opacity', '0');
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        card.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.3s ease, box-shadow 0.3s ease';
      });
    });
  }

});
