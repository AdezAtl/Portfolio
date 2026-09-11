import anime from 'animejs';

export function initHeroIntro(): void {
  const tl = anime.timeline({
    easing: 'easeOutExpo',
  });

  tl.add({
    targets: '[data-hero-label]',
    opacity: [0, 1],
    translateY: [10, 0],
    duration: 500,
  })
    .add(
      {
        targets: '[data-hero-line]',
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 650,
        delay: anime.stagger(80),
      },
      '-=300'
    )
    .add(
      {
        targets: '[data-hero-sub]',
        opacity: [0, 1],
        translateY: [12, 0],
        duration: 550,
      },
      '-=380'
    )
    .add(
      {
        targets: '[data-hero-actions] > *',
        opacity: [0, 1],
        translateY: [10, 0],
        duration: 500,
        delay: anime.stagger(70),
      },
      '-=360'
    )
    .add(
      {
        targets: '#hero-terminal',
        opacity: [0, 1],
        translateY: [16, 0],
        duration: 600,
      },
      '-=400'
    )
    .add(
      {
        targets: '.terminal__entry',
        opacity: [0, 1],
        translateX: [-10, 0],
        delay: anime.stagger(60),
        duration: 450,
      },
      '-=300'
    )
    .add(
      {
        targets: '[data-hero-meta]',
        opacity: [0, 1],
        duration: 500,
      },
      '-=250'
    );
}
