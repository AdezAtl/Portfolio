import anime from 'animejs';

export function initInteractive(): void {
  initProjectFilter();
  initTerminalInteractions();
  initStackManifest();
  initStatCounters();
}

/**
 * Filter projects with anime.js staggered entry animations.
 */
function initProjectFilter(): void {
  const tabs = document.querySelectorAll<HTMLButtonElement>('.filter-tab');
  const cards = document.querySelectorAll<HTMLElement>('.project-card');

  if (!tabs.length || !cards.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const filter = tab.dataset.filter || 'all';

      tabs.forEach((t) => t.classList.remove('is-active'));
      tab.classList.add('is-active');

      const toShow: HTMLElement[] = [];
      const toHide: HTMLElement[] = [];

      cards.forEach((card) => {
        const category = card.dataset.category;
        if (filter === 'all' || category === filter) {
          toShow.push(card);
        } else {
          toHide.push(card);
        }
      });

      // Animate out non-matching cards
      if (toHide.length > 0) {
        anime({
          targets: toHide,
          opacity: 0,
          scale: 0.96,
          duration: 180,
          easing: 'easeOutQuad',
          complete: () => {
            toHide.forEach((el) => (el.style.display = 'none'));
          },
        });
      }

      // Animate in matching cards
      toShow.forEach((el) => {
        el.style.display = 'flex';
      });

      anime({
        targets: toShow,
        opacity: [0, 1],
        scale: [0.96, 1],
        translateY: [10, 0],
        delay: anime.stagger(50),
        duration: 320,
        easing: 'easeOutQuad',
      });
    });
  });
}

/**
 * Terminal git log interaction.
 */
function initTerminalInteractions(): void {
  const toggleBtn = document.getElementById('terminal-toggle-btn') as HTMLButtonElement | null;
  const entries = document.getElementById('terminal-entries');
  const cmd = document.getElementById('terminal-cmd');

  if (!toggleBtn || !entries || !cmd) return;

  let expanded = false;

  const extraEntries = [
    { hash: '2026.05', desc: 'arklo brand philosophy & typography prototype finalized' },
    { hash: '2026.04', desc: 'lola-hub: custom cart state & localStorage mock-API wired' },
  ];

  toggleBtn.addEventListener('click', () => {
    expanded = !expanded;

    if (expanded) {
      toggleBtn.textContent = 'show less';
      cmd.textContent = 'git log --oneline -6';

      extraEntries.forEach((item) => {
        const div = document.createElement('div');
        div.className = 'terminal__entry terminal__entry--extra';
        div.innerHTML = `<span class="terminal__hash">${item.hash}</span><span class="terminal__desc">${item.desc}</span>`;
        entries.appendChild(div);
      });

      anime({
        targets: '.terminal__entry--extra',
        opacity: [0, 1],
        translateX: [-10, 0],
        delay: anime.stagger(70),
        duration: 350,
        easing: 'easeOutQuad',
      });
    } else {
      toggleBtn.textContent = 'toggle details';
      cmd.textContent = 'git log --oneline -4';

      anime({
        targets: '.terminal__entry--extra',
        opacity: 0,
        duration: 180,
        easing: 'easeOutQuad',
        complete: () => {
          document.querySelectorAll('.terminal__entry--extra').forEach((el) => el.remove());
        },
      });
    }
  });
}

/**
 * Stack manifest interactive package inspector.
 */
function initStackManifest(): void {
  const tabs = document.querySelectorAll<HTMLButtonElement>('.manifest__tab');
  const panelPackage = document.getElementById('manifest-panel-package');
  const panelArch = document.getElementById('manifest-panel-architecture');
  const statusText = document.getElementById('manifest-inspector-text');
  const rows = document.querySelectorAll<HTMLElement>('.manifest-row');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach((t) => t.classList.remove('is-active'));
      tab.classList.add('is-active');

      if (target === 'package') {
        if (panelArch) panelArch.classList.add('is-hidden');
        if (panelPackage) {
          panelPackage.classList.remove('is-hidden');
          anime({
            targets: panelPackage,
            opacity: [0, 1],
            duration: 250,
            easing: 'easeOutQuad',
          });
        }
      } else {
        if (panelPackage) panelPackage.classList.add('is-hidden');
        if (panelArch) {
          panelArch.classList.remove('is-hidden');
          anime({
            targets: panelArch,
            opacity: [0, 1],
            duration: 250,
            easing: 'easeOutQuad',
          });
        }
      }
    });
  });

  if (statusText) {
    rows.forEach((row) => {
      row.addEventListener('mouseenter', () => {
        const dep = row.dataset.dep;
        const role = row.dataset.role;
        if (dep && role) {
          statusText.textContent = `${dep}: ${role}`;
          anime({
            targets: statusText,
            color: ['#4fb8c9', '#7cd6e3'],
            duration: 200,
            easing: 'easeOutQuad',
          });
        }
      });
    });
  }
}

/**
 * Animated stat count numbers using anime.js.
 */
function initStatCounters(): void {
  const counterEls = document.querySelectorAll<HTMLElement>('.stat-card__number');
  if (!counterEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        counterEls.forEach((el) => {
          const target = Number(el.dataset.count || 0);
          const obj = { val: 0 };

          anime({
            targets: obj,
            val: target,
            round: 1,
            duration: 1100,
            easing: 'easeOutExpo',
            update: () => {
              el.textContent = String(obj.val);
            },
          });
        });

        observer.disconnect();
      });
    },
    { threshold: 0.25 }
  );

  const container = document.getElementById('stats-counter-strip');
  if (container) {
    observer.observe(container);
  }
}
