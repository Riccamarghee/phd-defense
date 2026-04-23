Reveal.initialize({
  hash: true,
  slideNumber: true,
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