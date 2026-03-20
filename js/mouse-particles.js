/**
 * Mouse Particle Effect - Snowflakes and Sakura
 * Creates snowflake and sakura petal particles that follow mouse movement
 */
(function() {
  'use strict';

  const config = {
    // Particle generation settings
    particleCount: 3,        // Particles per mouse move event
    throttleMs: 30,          // Throttle time between particle generation

    // Snowflake settings
    snowflake: {
      chars: ['*', '+', '.'],  // Snowflake characters
      colors: ['#ffffff', '#e0f7fa', '#b3e5fc', '#e1f5fe'],
      minSize: 10,
      maxSize: 18,
      minLife: 10000,
      maxLife: 20000
    },

    // Sakura settings
    sakura: {
      colors: [
        'rgba(255, 183, 197, 0.9)',
        'rgba(255, 197, 208, 0.9)',
        'rgba(255, 166, 183, 0.9)',
        'rgba(255, 218, 225, 0.9)'
      ],
      minSize: 6,
      maxSize: 12,
      minLife: 1200,
      maxLife: 2500
    }
  };

  let lastTime = 0;
  let container = null;

  // Initialize container
  function init() {
    container = document.createElement('div');
    container.id = 'mouse-particles-container';
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
      overflow: hidden;
    `;
    document.body.appendChild(container);

    // Add styles for particles
    const style = document.createElement('style');
    style.textContent = `
      .mouse-particle {
        position: absolute;
        pointer-events: none;
        will-change: transform, opacity;
      }
      .mouse-particle-snowflake {
        text-shadow: 0 0 3px rgba(255,255,255,0.8);
        font-weight: bold;
      }
      .mouse-particle-sakura {
        border-radius: 50% 0 50% 50%;
        transform-origin: center center;
      }
      @keyframes particle-fall {
        0% {
          opacity: 1;
          transform: translateY(0) rotate(0deg) scale(1);
        }
        100% {
          opacity: 0;
          transform: translateY(80px) rotate(360deg) scale(0.3);
        }
      }
      @keyframes particle-sakura-fall {
        0% {
          opacity: 1;
          transform: translateY(0) rotate(0deg) scale(1);
        }
        50% {
          transform: translateY(40px) rotate(180deg) scale(0.8) translateX(20px);
        }
        100% {
          opacity: 0;
          transform: translateY(100px) rotate(360deg) scale(0.2) translateX(-10px);
        }
      }
    `;
    document.head.appendChild(style);

    // Listen for mouse movement
    document.addEventListener('mousemove', handleMouseMove);
  }

  // Get random value between min and max
  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  // Get random item from array
  function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // Create snowflake particle
  function createSnowflake(x, y) {
    const particle = document.createElement('span');
    particle.className = 'mouse-particle mouse-particle-snowflake';

    const size = random(config.snowflake.minSize, config.snowflake.maxSize);
    const life = random(config.snowflake.minLife, config.snowflake.maxLife);
    const offsetX = random(-15, 15);
    const offsetY = random(-15, 15);

    particle.textContent = randomItem(config.snowflake.chars);
    particle.style.cssText = `
      left: ${x + offsetX}px;
      top: ${y + offsetY}px;
      font-size: ${size}px;
      color: ${randomItem(config.snowflake.colors)};
      animation: particle-fall ${life}ms ease-out forwards;
    `;

    container.appendChild(particle);

    setTimeout(() => {
      if (particle.parentNode) {
        particle.remove();
      }
    }, life);
  }

  // Create sakura petal particle
  function createSakura(x, y) {
    const particle = document.createElement('div');
    particle.className = 'mouse-particle mouse-particle-sakura';

    const size = random(config.sakura.minSize, config.sakura.maxSize);
    const life = random(config.sakura.minLife, config.sakura.maxLife);
    const offsetX = random(-15, 15);
    const offsetY = random(-15, 15);

    particle.style.cssText = `
      left: ${x + offsetX}px;
      top: ${y + offsetY}px;
      width: ${size}px;
      height: ${size * 0.6}px;
      background: ${randomItem(config.sakura.colors)};
      animation: particle-sakura-fall ${life}ms ease-out forwards;
    `;

    container.appendChild(particle);

    setTimeout(() => {
      if (particle.parentNode) {
        particle.remove();
      }
    }, life);
  }

  // Handle mouse movement
  function handleMouseMove(e) {
    const now = Date.now();

    // Throttle particle generation
    if (now - lastTime < config.throttleMs) {
      return;
    }
    lastTime = now;

    const x = e.clientX;
    const y = e.clientY;

    // Create mixed particles
    for (let i = 0; i < config.particleCount; i++) {
      // 50% chance for snowflake or sakura
      if (Math.random() > 0.5) {
        createSnowflake(x, y);
      } else {
        createSakura(x, y);
      }
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
