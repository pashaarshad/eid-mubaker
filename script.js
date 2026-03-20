/* ========================================
   EID MUBARAK GREETING WEBSITE
   Core JavaScript — Interactions & Effects
   ======================================== */

// ===========================
// 1. INITIALIZATION
// ===========================
let currentName = '';
let audioPlaying = false;
let audioInitialized = false;

document.addEventListener('DOMContentLoaded', () => {
  initStarCanvas();
  checkURLParams();
  setupInputListeners();
  attemptAutoplay();
  initVisitorCounter();
});

// ===========================
// 2. URL PARAMETER DETECTION
// ===========================
function checkURLParams() {
  const params = new URLSearchParams(window.location.search);
  const name = params.get('name');

  if (name && name.trim()) {
    currentName = decodeURIComponent(name.trim());
    showGreetingView(currentName);
  } else {
    showInputView();
  }
}

// ===========================
// 3. VIEW MANAGEMENT
// ===========================
function showInputView() {
  document.getElementById('inputView').style.display = 'flex';
  document.getElementById('greetingView').style.display = 'none';

  // Auto-focus the input after a short delay (for animation)
  setTimeout(() => {
    const input = document.getElementById('nameInput');
    if (input) input.focus();
  }, 1200);
}

function showGreetingView(name) {
  document.getElementById('inputView').style.display = 'none';
  document.getElementById('greetingView').style.display = 'flex';

  // Populate greeting
  const titleEl = document.getElementById('greetingTitle');
  const fromEl = document.getElementById('greetingFrom');
  const msgEl = document.getElementById('greetingMessage');

  titleEl.textContent = 'Eid Mubarak!';
  fromEl.textContent = `from ${name} 🌙`;

  // Typewriter effect for the message
  const messages = [
    `🕌🌙 Eid Mubarak! ✨ May Allah bless you abundantly 🤲💫, grant you happiness 😊, peace 🕊️, and success 🌟 in every step of your life. 💖`
  ];

  typewriterEffect(msgEl, messages.join(''), 30);

  // Launch confetti after a short delay
  setTimeout(() => {
    launchConfetti();
  }, 800);

  // Update page title
  document.title = `🌙 Eid Mubarak from ${name}!`;

  // Update OG meta
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', `🌙 Eid Mubarak from ${name}!`);

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', `${name} sent you a special Eid Mubarak greeting! Click to view 🕌✨`);
}

// ===========================
// 4. NAME INPUT & GREETING CREATION
// ===========================
function setupInputListeners() {
  const input = document.getElementById('nameInput');
  if (!input) return;

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      createGreeting();
    }
  });
}

function createGreeting() {
  const input = document.getElementById('nameInput');
  const name = input.value.trim();

  if (!name) {
    // Shake animation
    input.classList.add('shake');
    input.style.borderColor = '#ff4444';
    setTimeout(() => {
      input.classList.remove('shake');
      input.style.borderColor = '';
    }, 600);
    return;
  }

  currentName = name;

  // Update URL without reload
  const newURL = `${window.location.origin}${window.location.pathname}?name=${encodeURIComponent(name)}`;
  window.history.pushState({ name }, '', newURL);

  showGreetingView(name);
}

// ===========================
// 5. SHARING FUNCTIONS
// ===========================
function shareWhatsApp() {
  const url = `${window.location.origin}${window.location.pathname}?name=${encodeURIComponent(currentName)}`;
  const message = `🌙✨ *Eid Mubarak!* ✨🌙\n\n${currentName} sent you a special Eid greeting!\n\n🕌 Click to view your greeting:\n${url}\n\n🤲 May this Eid bring joy, peace, and blessings to you and your family!\n\n_Create your own greeting & share!_ 🎉`;

  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
}

function copyLink() {
  const url = `${window.location.origin}${window.location.pathname}?name=${encodeURIComponent(currentName)}`;

  navigator.clipboard.writeText(url).then(() => {
    const copyText = document.getElementById('copyText');
    copyText.textContent = '✅ Link Copied!';
    setTimeout(() => {
      copyText.textContent = '📋 Copy Link';
    }, 2500);
  }).catch(() => {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = url;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    const copyText = document.getElementById('copyText');
    copyText.textContent = '✅ Link Copied!';
    setTimeout(() => {
      copyText.textContent = '📋 Copy Link';
    }, 2500);
  });
}

function createOwn() {
  // Go back to input view
  window.history.pushState({}, '', window.location.pathname);
  currentName = '';
  showInputView();
  document.getElementById('nameInput').value = '';
}

// ===========================
// 6. AUDIO CONTROL (AUTOPLAY)
// ===========================

function attemptAutoplay() {
  const audio = document.getElementById('bgAudio');
  const icon = document.getElementById('audioIcon');

  // Try autoplay immediately
  audio.volume = 0.5;
  const playPromise = audio.play();

  if (playPromise !== undefined) {
    playPromise.then(() => {
      // Autoplay worked!
      icon.textContent = '🔊';
      audioPlaying = true;
      audioInitialized = true;
    }).catch(() => {
      // Autoplay blocked — wait for first user interaction
      console.log('Autoplay blocked. Will start on first user interaction.');
      setupAutoplayOnInteraction();
    });
  }
}

function setupAutoplayOnInteraction() {
  const events = ['click', 'touchstart', 'keydown'];
  
  function startAudioOnInteraction() {
    if (audioInitialized) return;
    audioInitialized = true;

    const audio = document.getElementById('bgAudio');
    const icon = document.getElementById('audioIcon');

    audio.volume = 0.5;
    audio.play().then(() => {
      icon.textContent = '🔊';
      audioPlaying = true;
    }).catch(() => {
      console.log('Audio still cannot play.');
    });

    // Remove all listeners after first successful trigger
    events.forEach(evt => {
      document.removeEventListener(evt, startAudioOnInteraction, true);
    });
  }

  // Attach listeners to capture on the entire document
  events.forEach(evt => {
    document.addEventListener(evt, startAudioOnInteraction, true);
  });
}

function toggleAudio() {
  const audio = document.getElementById('bgAudio');
  const icon = document.getElementById('audioIcon');

  if (audioPlaying) {
    audio.pause();
    icon.textContent = '🔇';
    audioPlaying = false;
  } else {
    audio.volume = 0.5;
    audio.play().then(() => {
      icon.textContent = '🔊';
      audioPlaying = true;
    }).catch(() => {
      console.log('Audio playback failed.');
    });
  }
}

// ===========================
// 7. TYPEWRITER EFFECT
// ===========================
function typewriterEffect(element, text, speed = 30) {
  element.textContent = '';
  let i = 0;

  // Add cursor
  const cursor = document.createElement('span');
  cursor.className = 'typewriter-cursor';
  element.appendChild(cursor);

  function type() {
    if (i < text.length) {
      // Insert text before cursor
      const textNode = document.createTextNode(text.charAt(i));
      element.insertBefore(textNode, cursor);
      i++;
      setTimeout(type, speed);
    } else {
      // Remove cursor after typing is done
      setTimeout(() => {
        if (cursor.parentNode) {
          cursor.remove();
        }
      }, 1500);
    }
  }

  // Start after a slight delay
  setTimeout(type, 600);
}

// ===========================
// 8. STAR CANVAS ANIMATION
// ===========================
function initStarCanvas() {
  const canvas = document.getElementById('starCanvas');
  const ctx = canvas.getContext('2d');

  let stars = [];
  const STAR_COUNT = 120;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2.5 + 0.5,
        opacity: Math.random(),
        speed: Math.random() * 0.02 + 0.005,
        phase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.03 + 0.01
      });
    }
  }

  function drawStars(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {
      star.phase += star.twinkleSpeed;
      const opacity = 0.3 + Math.abs(Math.sin(star.phase)) * 0.7;

      // Star glow
      const gradient = ctx.createRadialGradient(
        star.x, star.y, 0,
        star.x, star.y, star.size * 3
      );
      gradient.addColorStop(0, `rgba(255, 215, 0, ${opacity})`);
      gradient.addColorStop(0.5, `rgba(255, 215, 0, ${opacity * 0.3})`);
      gradient.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Star core
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 240, ${opacity})`;
      ctx.fill();
    });

    requestAnimationFrame(drawStars);
  }

  resize();
  createStars();
  requestAnimationFrame(drawStars);

  window.addEventListener('resize', () => {
    resize();
    createStars();
  });
}

// ===========================
// 9. CONFETTI EFFECT
// ===========================
function launchConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const PARTICLE_COUNT = 150;
  const colors = [
    '#FFD700', '#FFA500', '#FF6347',
    '#00C896', '#FFE4B5', '#FF69B4',
    '#87CEEB', '#FFFFFF', '#FFC947',
    '#B8860B', '#FF4500', '#7CFC00'
  ];

  const shapes = ['circle', 'square', 'triangle', 'star'];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: canvas.width / 2 + (Math.random() - 0.5) * 200,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 15,
      vy: Math.random() * -18 - 5,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      gravity: 0.25 + Math.random() * 0.15,
      opacity: 1,
      fadeSpeed: 0.005 + Math.random() * 0.008
    });
  }

  let animationId;

  function drawParticle(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;

    switch (p.shape) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'square':
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        break;
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(0, -p.size / 2);
        ctx.lineTo(-p.size / 2, p.size / 2);
        ctx.lineTo(p.size / 2, p.size / 2);
        ctx.closePath();
        ctx.fill();
        break;
      case 'star':
        drawStar(ctx, 0, 0, 5, p.size / 2, p.size / 4);
        ctx.fill();
        break;
    }

    ctx.restore();
  }

  function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = (Math.PI / 2) * 3;
    let step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);

    for (let i = 0; i < spikes; i++) {
      ctx.lineTo(
        cx + Math.cos(rot) * outerRadius,
        cy + Math.sin(rot) * outerRadius
      );
      rot += step;
      ctx.lineTo(
        cx + Math.cos(rot) * innerRadius,
        cy + Math.sin(rot) * innerRadius
      );
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let alive = false;
    particles.forEach(p => {
      if (p.opacity <= 0) return;
      alive = true;

      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.99;
      p.rotation += p.rotationSpeed;
      p.opacity -= p.fadeSpeed;

      if (p.opacity > 0) {
        drawParticle(p);
      }
    });

    if (alive) {
      animationId = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animationId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  animate();

  // Second burst after a short delay
  setTimeout(() => {
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -10,
        vx: (Math.random() - 0.5) * 6,
        vy: Math.random() * 3 + 2,
        size: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        gravity: 0.1 + Math.random() * 0.1,
        opacity: 1,
        fadeSpeed: 0.003 + Math.random() * 0.005
      });
    }
  }, 1500);
}

// ===========================
// 10. VISITOR COUNTER
// ===========================
function initVisitorCounter() {
  const counterEl = document.getElementById('visitorCount');
  if (!counterEl) return;

  // Get current count from localStorage
  let count = parseInt(localStorage.getItem('eid_visitor_count') || '0', 10);

  // Check if this is a new unique visitor
  const hasVisited = localStorage.getItem('eid_has_visited');
  if (!hasVisited) {
    count++;
    localStorage.setItem('eid_has_visited', 'true');
    localStorage.setItem('eid_visitor_count', count.toString());
  }

  // Animate the counter number
  animateCounter(counterEl, count);
}

function animateCounter(element, target) {
  let current = 0;
  const duration = 1500;
  const stepTime = Math.max(Math.floor(duration / target), 30);

  const timer = setInterval(() => {
    current++;
    element.textContent = current.toLocaleString();
    if (current >= target) {
      clearInterval(timer);
      element.textContent = target.toLocaleString();
    }
  }, stepTime);
}
