import anime from 'animejs';

/**
 * One subtle treatment, applied uniformly: sections fade to full opacity
 * as they enter the viewport. No slide, no stagger explosion — the load
 * sequence in the hero is where this page spends its motion budget.
 */
export function initReveal(): void {
  const sections = document.querySelectorAll<HTMLElement>('[data-reveal]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        anime({
          targets: entry.target,
          opacity: [0, 1],
          duration: 520,
          easing: 'easeOutQuad',
        });
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -80px 0px' }
  );

  sections.forEach((el) => observer.observe(el));
}
