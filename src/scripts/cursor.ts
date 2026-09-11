import anime from 'animejs';

/**
 * Dual-layer cursor:
 * - Inner blob (.cursor-dot): snappy, precise indicator positioned right under pointer.
 * - Outer follower ring (.cursor-ring): lerps with smooth inertia, morphs onto [data-hover] targets.
 * - Magnetic dynamics on buttons with [data-magnetic].
 */
export function initCursor(): void {
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!isFinePointer) return;

  const dot = document.getElementById('cursor-dot') as HTMLElement | null;
  const ring = document.getElementById('cursor-ring') as HTMLElement | null;
  if (!dot || !ring) return;

  const state = {
    mouseX: window.innerWidth / 2,
    mouseY: window.innerHeight / 2,
    ringX: window.innerWidth / 2,
    ringY: window.innerHeight / 2,
    snapped: false,
    activeTarget: null as HTMLElement | null,
  };

  const baseSize = 28;

  window.addEventListener('mousemove', (e) => {
    state.mouseX = e.clientX;
    state.mouseY = e.clientY;

    dot.style.left = `${state.mouseX}px`;
    dot.style.top = `${state.mouseY}px`;
  });

  window.addEventListener('mousedown', () => {
    anime({
      targets: dot,
      scale: [1, 1.6],
      duration: 160,
      easing: 'easeOutQuad',
    });
    if (!state.snapped) {
      anime({
        targets: ring,
        scale: 0.85,
        duration: 140,
        easing: 'easeOutQuad',
      });
    }
  });

  window.addEventListener('mouseup', () => {
    anime({
      targets: dot,
      scale: 1,
      duration: 180,
      easing: 'easeOutQuad',
    });
    if (!state.snapped) {
      anime({
        targets: ring,
        scale: 1,
        duration: 200,
        easing: 'easeOutQuad',
      });
    }
  });

  function tick() {
    const lerp = state.snapped ? 0.24 : 0.16;
    state.ringX += (state.mouseX - state.ringX) * lerp;
    state.ringY += (state.mouseY - state.ringY) * lerp;

    if (!state.snapped) {
      ring.style.left = `${state.ringX - baseSize / 2}px`;
      ring.style.top = `${state.ringY - baseSize / 2}px`;
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  ring.style.width = `${baseSize}px`;
  ring.style.height = `${baseSize}px`;

  const targets = document.querySelectorAll<HTMLElement>('[data-hover]');

  targets.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      state.snapped = true;
      state.activeTarget = el;
      dot.classList.add('is-active');

      const rect = el.getBoundingClientRect();
      const padding = Number(el.dataset.cursorPad ?? 6);
      const radius = el.dataset.cursorShape === 'square' ? 8 : rect.height / 2 + padding;

      anime({
        targets: ring,
        left: rect.left - padding,
        top: rect.top - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
        borderRadius: radius,
        duration: 340,
        easing: 'easeOutExpo',
      });
      ring.classList.add('is-snapped');
    });

    el.addEventListener('mouseleave', () => {
      state.snapped = false;
      state.activeTarget = null;
      dot.classList.remove('is-active');

      anime({
        targets: ring,
        left: state.ringX - baseSize / 2,
        top: state.ringY - baseSize / 2,
        width: baseSize,
        height: baseSize,
        borderRadius: 50,
        duration: 280,
        easing: 'easeOutExpo',
      });
      ring.classList.remove('is-snapped');
    });
  });

  // Magnetic button dynamics
  const magnetics = document.querySelectorAll<HTMLElement>('[data-magnetic]');
  magnetics.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      const strength = Number(btn.dataset.magneticStrength || 0.35);

      anime({
        targets: btn,
        translateX: relX * strength,
        translateY: relY * strength,
        duration: 180,
        easing: 'easeOutQuad',
      });
    });

    btn.addEventListener('mouseleave', () => {
      anime({
        targets: btn,
        translateX: 0,
        translateY: 0,
        duration: 450,
        easing: 'easeOutElastic(1, .5)',
      });
    });
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    anime({ targets: [dot, ring], opacity: 0, duration: 150, easing: 'linear' });
  });
  document.addEventListener('mouseenter', () => {
    anime({ targets: [dot, ring], opacity: 1, duration: 150, easing: 'linear' });
  });
}
