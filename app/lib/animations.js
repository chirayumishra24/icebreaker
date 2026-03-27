import gsap from 'gsap';

// Create intro phase timeline
export function createIntroTimeline(containerRef) {
  const tl = gsap.timeline({ paused: true });

  tl.fromTo(
    '.phase-title',
    { opacity: 0, scale: 0.5, y: 30 },
    { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'back.out(1.7)' }
  )
  .fromTo(
    '.phase-subtitle',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
    '-=0.3'
  )
  .fromTo(
    '.lyrics-line',
    { opacity: 0, y: 15 },
    { opacity: 1, y: 0, duration: 0.4, stagger: 0.25, ease: 'power2.out' },
    '-=0.2'
  );

  return tl;
}

// Create student spotlight timeline
export function createSpotlightTimeline() {
  const tl = gsap.timeline({ paused: true });

  tl.fromTo(
    '.student-name',
    { opacity: 0, scale: 0.3, rotation: -5 },
    { opacity: 1, scale: 1, rotation: 0, duration: 0.7, ease: 'back.out(2)' }
  )
  .fromTo(
    '.student-action-emoji',
    { opacity: 0, scale: 0, rotation: -180 },
    { opacity: 1, scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(2.5)' },
    '-=0.2'
  )
  .fromTo(
    '.student-action-text',
    { opacity: 0, x: -20 },
    { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' },
    '-=0.2'
  );

  return tl;
}

// Create memory chain replay timeline
export function createChainReplayTimeline(itemCount, onItemHighlight) {
  const tl = gsap.timeline({ paused: true });

  for (let i = 0; i < itemCount; i++) {
    tl.call(() => onItemHighlight(i), null, i * 0.8)
      .fromTo(
        `.chain-item-${i}`,
        { scale: 1, borderColor: 'rgba(255,255,255,0.12)' },
        {
          scale: 1.15,
          borderColor: '#7c3aed',
          duration: 0.3,
          ease: 'power2.out',
          boxShadow: '0 0 30px rgba(124, 58, 237, 0.6)',
        },
        i * 0.8
      )
      .to(
        `.chain-item-${i}`,
        {
          scale: 1,
          borderColor: 'rgba(255,255,255,0.12)',
          duration: 0.3,
          ease: 'power2.in',
          boxShadow: '0 0 0px rgba(124, 58, 237, 0)',
        },
        i * 0.8 + 0.5
      );
  }

  return tl;
}

// Create celebration timeline
export function createCelebrationTimeline() {
  const tl = gsap.timeline({ paused: true });

  tl.fromTo(
    '.celebration-title',
    { opacity: 0, scale: 0.2, rotation: -10 },
    { opacity: 1, scale: 1, rotation: 0, duration: 1, ease: 'elastic.out(1, 0.5)' }
  )
  .fromTo(
    '.celebration-subtitle',
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
    '-=0.4'
  )
  .fromTo(
    '.chain-item',
    { opacity: 0, scale: 0.5 },
    { opacity: 1, scale: 1, duration: 0.3, stagger: 0.1, ease: 'back.out(1.7)' },
    '-=0.3'
  );

  return tl;
}

// Animate a single element with a bounce
export function animateBounceIn(selector) {
  gsap.fromTo(
    selector,
    { opacity: 0, scale: 0.5, y: 20 },
    { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)' }
  );
}

// Animate element exit
export function animateFadeOut(selector, onComplete) {
  gsap.to(selector, {
    opacity: 0,
    scale: 0.9,
    y: -10,
    duration: 0.3,
    ease: 'power2.in',
    onComplete,
  });
}
