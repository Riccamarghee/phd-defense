Reveal.initialize({
  hash: true,
  slideNumber: false,
  controls: true,
  progress: false,
  center: false,
  transition: 'slide',

  width: 1920,
  height: 1080,
  margin: 0.03,
  minScale: 0.6,
  maxScale: 1.0,

  plugins: [ RevealMath.KaTeX, RevealNotes, RevealHighlight ]
});

const toolbarDate = document.getElementById('toolbar-date');
const toolbarTitle = document.getElementById('toolbar-title');
const toolbarSlide = document.getElementById('toolbar-slide');
const toolbarProgressTotal = document.getElementById('toolbar-progress-total');
const toolbarProgressSection = document.getElementById('toolbar-progress-section');
const fixedSectionTitle = document.getElementById('fixed-section-title');
let previousFixedTitleStack = null;
let previousSectionSlideIndex = 0;
let previousSectionSlides = 1;

function getSectionSlides(indices) {
  const horizontalSlides = Array.from(document.querySelectorAll('.reveal .slides > section'));
  const currentHorizontalSlide = horizontalSlides[indices.h];
  const verticalSlides = currentHorizontalSlide?.classList.contains('stack')
    ? Array.from(currentHorizontalSlide.querySelectorAll(':scope > section'))
    : [];

  return verticalSlides.length || 1;
}

function getSectionProgress(indices) {
  const sectionSlides = getSectionSlides(indices);

  if (sectionSlides <= 1) {
    return 100;
  }

  return ((indices.v + 1) / sectionSlides) * 100;
}

function updateToolbar(event = {}) {
  const currentSlide = Reveal.getCurrentSlide();
  const indices = Reveal.getIndices();
  const slideTitle = currentSlide?.querySelector('h1, h2, h3')?.textContent?.trim();
  const fixedTitleStack = currentSlide?.parentElement?.dataset.fixedTitle
    ? currentSlide.parentElement
    : null;
  const currentSlideIndex = Array.from(
    document.querySelectorAll('.reveal .slides section:not(.stack)')
  ).indexOf(currentSlide) + 1;
  const totalSlides = Reveal.getTotalSlides();
  const isTitleSlide = currentSlide?.classList.contains('title-slide');
  const totalProgress = (currentSlideIndex / totalSlides) * 100;
  const sectionSlides = getSectionSlides(indices);
  const sectionProgress = getSectionProgress(indices);
  const isLeavingEdgeFixedSlide = previousFixedTitleStack
    && !fixedTitleStack
    && (
      previousSectionSlideIndex === 0
      || previousSectionSlideIndex === previousSectionSlides - 1
    );

  document.body.classList.toggle('hide-deck-toolbar', isTitleSlide);
  document.body.classList.toggle('fixed-section-title-out', Boolean(isLeavingEdgeFixedSlide));
  document.body.classList.toggle(
    'show-fixed-section-title',
    Boolean(fixedTitleStack || isLeavingEdgeFixedSlide)
  );
  fixedSectionTitle.textContent = fixedTitleStack?.dataset.fixedTitle || '';
  if (isLeavingEdgeFixedSlide) {
    fixedSectionTitle.textContent = previousFixedTitleStack.dataset.fixedTitle || '';
    window.setTimeout(() => {
      const liveIndices = Reveal.getIndices();
      if (liveIndices.h === event.indexh && liveIndices.v === event.indexv) {
        document.body.classList.remove('show-fixed-section-title', 'fixed-section-title-out');
        fixedSectionTitle.textContent = '';
      }
    }, 380);
  }
  toolbarDate.textContent = new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date());
  toolbarTitle.textContent = slideTitle || 'PhD Thesis Presentation';
  toolbarSlide.textContent = `${currentSlideIndex}/${totalSlides}`;
  toolbarProgressTotal.style.width = `${totalProgress}%`;
  toolbarProgressSection.style.width = `${sectionProgress}%`;

  previousFixedTitleStack = fixedTitleStack;
  previousSectionSlideIndex = indices.v || 0;
  previousSectionSlides = sectionSlides;
}

Reveal.on('ready', updateToolbar);
Reveal.on('slidechanged', updateToolbar);

const themeToggle = document.getElementById('theme-toggle');
const revealTheme = document.getElementById('reveal-theme');

function applyMode(isLight) {
  if (isLight) {
    document.body.classList.add('light-mode');
    revealTheme.setAttribute(
      'href',
      'https://cdn.jsdelivr.net/npm/reveal.js@5/dist/theme/white.css'
    );
    localStorage.setItem('presentation-mode', 'light');
  } else {
    document.body.classList.remove('light-mode');
    revealTheme.setAttribute(
      'href',
      'https://cdn.jsdelivr.net/npm/reveal.js@5/dist/theme/black.css'
    );
    localStorage.setItem('presentation-mode', 'dark');
  }
}

const savedMode = localStorage.getItem('presentation-mode');
applyMode(savedMode === 'light');

themeToggle.addEventListener('click', () => {
  const isCurrentlyLight = document.body.classList.contains('light-mode');
  applyMode(!isCurrentlyLight);
});
