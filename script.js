(() => {
  const canvas = document.getElementById('particleCanvas');
  const messageInput = document.getElementById('messageInput');
  const gapInput = document.getElementById('gapInput');
  const densityLabel = document.getElementById('densityLabel');

  if (!canvas || !messageInput || !gapInput || !densityLabel) return;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return;

  class PointerField {
    constructor() {
      this.x = Number.NaN;
      this.y = Number.NaN;
      this.radius = 105;
      this.active = false;
      this.lastMove = 0;
    }

    set(x, y) {
      this.x = x;
      this.y = y;
      this.active = true;
      this.lastMove = performance.now();
    }

    decay(now) {
      if (this.active && now - this.lastMove > 900) {
        this.active = false;
        this.x = Number.NaN;
        this.y = Number.NaN;
      }
    }
  }

  class Particle {
    constructor(x, y, color, effect) {
      this.effect = effect;
      this.originX = x;
      this.originY = y;
      this.x = Math.random() * effect.logicalWidth;
      this.y = Math.random() * effect.logicalHeight;
      this.vx = 0;
      this.vy = 0;
      this.size = effect.particleSize;
      this.color = color;
      this.ease = effect.reducedMotion ? 0.08 : 0.12 + Math.random() * 0.06;
      this.friction = effect.reducedMotion ? 0.87 : 0.9;
      this.repulse = effect.reducedMotion ? 0.16 : 0.25;
    }

    update(pointer) {
      const dx = pointer.x - this.x;
      const dy = pointer.y - this.y;
      const distSq = dx * dx + dy * dy;

      if (pointer.active && distSq < pointer.radius * pointer.radius) {
        const dist = Math.sqrt(distSq) || 1;
        const force = (pointer.radius - dist) / pointer.radius;
        const ux = dx / dist;
        const uy = dy / dist;
        this.vx -= ux * force * this.repulse * 6;
        this.vy -= uy * force * this.repulse * 6;
      }

      this.vx += (this.originX - this.x) * this.ease;
      this.vy += (this.originY - this.y) * this.ease;
      this.vx *= this.friction;
      this.vy *= this.friction;
      this.x += this.vx;
      this.y += this.vy;
    }

    draw(ctxRef) {
      ctxRef.fillStyle = this.color;
      ctxRef.fillRect(this.x, this.y, this.size, this.size);
    }
  }

  class ParticleTextEffect {
    constructor(canvasRef, contextRef, pointerRef) {
      this.canvas = canvasRef;
      this.ctx = contextRef;
      this.pointer = pointerRef;
      this.particles = [];
      this.logicalWidth = 0;
      this.logicalHeight = 0;
      this.fontSize = 80;
      this.lineHeight = 1.2;
      this.padding = 24;
      this.maxTextWidthRatio = 0.8;
      this.particleSize = 2;
      this.baseGap = this.getAdaptiveGap(Number(gapInput.value));
      this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.dpr = 1;
      this.text = messageInput.value.trim() || "It's never just black or white.";
      this.needsRebuild = true;
      this.initResizeObserver();
    }

    getAdaptiveGap(rawGap) {
      const width = window.innerWidth;
      const cores = navigator.hardwareConcurrency || 4;
      let adjusted = rawGap;
      if (width < 420) adjusted += 3;
      else if (width < 760) adjusted += 1;
      if (cores <= 4) adjusted += 1;
      if (this.reducedMotion) adjusted += 1;
      return Math.max(3, Math.min(18, adjusted));
    }

    setText(nextText) {
      this.text = nextText.trim() || "It's never just black or white.";
      this.needsRebuild = true;
    }

    setGap(nextGap) {
      this.baseGap = this.getAdaptiveGap(nextGap);
      this.needsRebuild = true;
    }

    initResizeObserver() {
      const resizeHandler = () => {
        this.resize();
        this.needsRebuild = true;
      };
      window.addEventListener('resize', resizeHandler, { passive: true });
      this.resize();
    }

    resize() {
      const bounds = this.canvas.getBoundingClientRect();
      this.logicalWidth = Math.max(320, Math.floor(bounds.width));
      this.logicalHeight = Math.max(320, Math.floor(bounds.height));
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);

      this.canvas.width = Math.floor(this.logicalWidth * this.dpr);
      this.canvas.height = Math.floor(this.logicalHeight * this.dpr);
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      this.ctx.imageSmoothingEnabled = true;

      this.fontSize = Math.max(28, Math.min(96, this.logicalWidth * 0.1));
      this.lineHeight = this.fontSize * 1.24;
      this.particleSize = Math.max(1.5, Math.min(3.2, this.baseGap * 0.32));
      this.pointer.radius = Math.max(72, Math.min(145, this.logicalWidth * 0.12));
    }

    wrapText(rawText) {
      const normalized = rawText.replace(/\s+/g, ' ').trim();
      if (!normalized) return [' '];

      const words = normalized.split(' ');
      const lines = [];
      const maxTextWidth = this.logicalWidth * this.maxTextWidthRatio;
      let current = '';

      for (const word of words) {
        const testLine = current ? `${current} ${word}` : word;
        const testWidth = this.ctx.measureText(testLine).width;

        if (testWidth > maxTextWidth && current) {
          lines.push(current);
          current = word;
        } else {
          current = testLine;
        }
      }

      if (current) lines.push(current);
      return lines.slice(0, 6);
    }

    rebuildParticles() {
      this.ctx.clearRect(0, 0, this.logicalWidth, this.logicalHeight);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'top';
      this.ctx.font = `700 ${this.fontSize}px Inter, system-ui, sans-serif`;

      const lines = this.wrapText(this.text);
      const blockHeight = lines.length * this.lineHeight;
      const startY = (this.logicalHeight - blockHeight) / 2;

      lines.forEach((line, index) => {
        const y = startY + index * this.lineHeight;
        this.ctx.fillText(line, this.logicalWidth / 2, y);
      });

      const pixels = this.ctx.getImageData(0, 0, this.logicalWidth, this.logicalHeight).data;
      this.ctx.clearRect(0, 0, this.logicalWidth, this.logicalHeight);
      this.particles = [];

      const color = '#ffffff';
      const gap = this.baseGap;

      for (let y = 0; y < this.logicalHeight; y += gap) {
        for (let x = 0; x < this.logicalWidth; x += gap) {
          const idx = (y * this.logicalWidth + x) * 4;
          const alpha = pixels[idx + 3];
          if (alpha > 120) {
            this.particles.push(new Particle(x, y, color, this));
          }
        }
      }

      this.needsRebuild = false;
    }

    render(now) {
      if (this.needsRebuild) {
        this.resize();
        this.rebuildParticles();
      }

      this.pointer.decay(now);
      this.ctx.clearRect(0, 0, this.logicalWidth, this.logicalHeight);

      for (const particle of this.particles) {
        particle.update(this.pointer);
        particle.draw(this.ctx);
      }
    }
  }

  const pointer = new PointerField();
  const effect = new ParticleTextEffect(canvas, ctx, pointer);

  const setPointerFromEvent = (clientX, clientY) => {
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    if (x >= 0 && y >= 0 && x <= rect.width && y <= rect.height) {
      pointer.set(x, y);
    }
  };

  canvas.addEventListener('pointermove', (event) => {
    setPointerFromEvent(event.clientX, event.clientY);
  });

  canvas.addEventListener('pointerdown', (event) => {
    setPointerFromEvent(event.clientX, event.clientY);
  });

  canvas.addEventListener('pointerleave', () => {
    pointer.active = false;
  });

  canvas.addEventListener(
    'touchmove',
    (event) => {
      const touch = event.touches[0];
      if (touch) setPointerFromEvent(touch.clientX, touch.clientY);
    },
    { passive: true }
  );

  messageInput.addEventListener('input', () => {
    effect.setText(messageInput.value);
  });

  gapInput.addEventListener('input', () => {
    densityLabel.textContent = gapInput.value;
    effect.setGap(Number(gapInput.value));
  });

  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  media.addEventListener('change', () => {
    effect.reducedMotion = media.matches;
    effect.setGap(Number(gapInput.value));
    effect.needsRebuild = true;
  });

  densityLabel.textContent = gapInput.value;

  const animate = (time) => {
    effect.render(time);
    requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);
})();
