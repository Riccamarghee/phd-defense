Reveal.initialize({
  hash: true,
  slideNumber: false,
  controls: true,
  progress: true,
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

function updateToolbar() {
  const currentSlide = Reveal.getCurrentSlide();
  const slideTitle = currentSlide?.querySelector('h1, h2, h3')?.textContent?.trim();
  const currentSlideIndex = Array.from(
    document.querySelectorAll('.reveal .slides section:not(.stack)')
  ).indexOf(currentSlide) + 1;
  const totalSlides = Reveal.getTotalSlides();
  const isTitleSlide = currentSlide?.classList.contains('title-slide');

  document.body.classList.toggle('hide-deck-toolbar', isTitleSlide);
  toolbarDate.textContent = new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date());
  toolbarTitle.textContent = slideTitle || 'PhD Thesis Presentation';
  toolbarSlide.textContent = `${currentSlideIndex}/${totalSlides}`;
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
