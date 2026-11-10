const quotes = [
  { text: "It always seems impossible until it's done.", author: 'Nelson Mandela', category: 'Courage' },
  { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain', category: 'Growth' },
  { text: 'Great things are done by a series of small things brought together.', author: 'Vincent van Gogh', category: 'Growth' },
  { text: 'It is never too late to be what you might have been.', author: 'George Eliot', category: 'Life' },
  { text: 'Nothing will work unless you do.', author: 'Maya Angelou', category: 'Courage' },
  { text: 'The best way out is always through.', author: 'Robert Frost', category: 'Courage' },
  { text: 'You do not have to see the whole staircase, just take the first step.', author: 'Martin Luther King Jr.', category: 'Growth' },
  { text: 'Act as if what you do makes a difference. It does.', author: 'William James', category: 'Life' },
  { text: 'Turn your wounds into wisdom.', author: 'Oprah Winfrey', category: 'Wisdom' },
  { text: 'What we think, we become.', author: 'Buddha', category: 'Wisdom' }
];

const textEl = document.querySelector('#quoteText');
const authorEl = document.querySelector('#quoteAuthor');
const categoryEl = document.querySelector('#quoteCategory');
const cardEl = document.querySelector('#quoteCard');
const saveButton = document.querySelector('#saveQuote');
let lastIndex = -1;
let currentIndex = -1;
let activeCategory = 'All';
let searchTerm = '';
let savedQuotes = loadSaved();
let isFlipping = false;

function loadSaved() {
  try {
    const saved = JSON.parse(localStorage.getItem('daily-quotes-saved') || '[]');
    return Array.isArray(saved) ? saved.filter(item => item && typeof item.text === 'string' && typeof item.author === 'string') : [];
  } catch {
    return [];
  }
}

function eligibleQuotes() {
  const term = searchTerm.trim().toLowerCase();
  return quotes.map((quote, index) => ({ quote, index })).filter(({ quote }) =>
    (activeCategory === 'All' || quote.category === activeCategory) &&
    (!term || `${quote.text} ${quote.author} ${quote.category}`.toLowerCase().includes(term))
  );
}

function chooseIndex() {
  const options = eligibleQuotes().map(item => item.index);
  if (!options.length) return -1;
  const otherOptions = options.filter(index => index !== lastIndex);
  const pool = otherOptions.length ? otherOptions : options;
  return pool[Math.floor(Math.random() * pool.length)];
}

function renderQuote() {
  if (currentIndex < 0) return;
  const quote = quotes[currentIndex];
  textEl.textContent = quote.text;
  authorEl.textContent = quote.author;
  categoryEl.textContent = quote.category;
  const saved = savedQuotes.some(item => item.text === quote.text && item.author === quote.author);
  saveButton.classList.toggle('saved', saved);
  saveButton.setAttribute('aria-label', saved ? 'Remove saved quote' : 'Save quote');
  saveButton.setAttribute('aria-pressed', String(saved));
}

function showRandomQuote(animate = true) {
  if (isFlipping) return;
  const nextIndex = chooseIndex();
  if (nextIndex < 0) {
    document.querySelector('#quoteCount').textContent = 'No matches';
    return;
  }
  if (!animate || currentIndex < 0 || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    currentIndex = nextIndex;
    lastIndex = nextIndex;
    renderQuote();
    return;
  }
  isFlipping = true;
  document.querySelector('#newQuote').disabled = true;
  cardEl.classList.add('flipped');
  window.setTimeout(() => {
    currentIndex = nextIndex;
    lastIndex = nextIndex;
    renderQuote();
    cardEl.classList.remove('flipped');
    window.setTimeout(() => {
      isFlipping = false;
      document.querySelector('#newQuote').disabled = false;
    }, 640);
  }, 320);
}

function renderQuoteList(container, items, emptyText) {
  container.replaceChildren();
  if (!items.length) {
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.textContent = emptyText;
    container.appendChild(empty);
    return;
  }
  items.forEach(({ quote, index }) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'quote-row';
    const quoteText = document.createElement('p');
    quoteText.textContent = `“${quote.text}”`;
    const author = document.createElement('span');
    author.textContent = `${quote.author} · ${quote.category}`;
    button.append(quoteText, author);
    button.addEventListener('click', () => {
      currentIndex = index;
      lastIndex = index;
      renderQuote();
      setView('home');
    });
    container.appendChild(button);
  });
}

function renderBrowse() {
  const results = eligibleQuotes();
  document.querySelector('#browseCount').textContent = `${results.length} quotes`;
  renderQuoteList(document.querySelector('#browseList'), results, 'No quotes match your search.');
}

function renderSaved() {
  document.querySelector('#savedCount').textContent = `${savedQuotes.length} saved`;
  const items = savedQuotes.map(saved => ({ quote: saved, index: quotes.findIndex(q => q.text === saved.text && q.author === saved.author) }));
  renderQuoteList(document.querySelector('#savedList'), items, 'Your saved quotes will appear here.');
}

function setView(name) {
  document.querySelectorAll('.view').forEach(view => view.classList.toggle('active', view.id === `${name}View`));
  document.querySelectorAll('.nav').forEach(button => button.classList.toggle('active', button.dataset.view === name));
  if (name === 'browse') renderBrowse();
  if (name === 'saved') renderSaved();
}

function toggleSaved() {
  if (currentIndex < 0) return;
  const quote = quotes[currentIndex];
  const existing = savedQuotes.findIndex(item => item.text === quote.text && item.author === quote.author);
  if (existing >= 0) savedQuotes.splice(existing, 1);
  else savedQuotes.unshift({ ...quote });
  try { localStorage.setItem('daily-quotes-saved', JSON.stringify(savedQuotes)); } catch {}
  renderQuote();
  if (document.querySelector('#savedView').classList.contains('active')) renderSaved();
}

document.querySelector('#newQuote').addEventListener('click', () => showRandomQuote(true));
saveButton.addEventListener('click', toggleSaved);
document.querySelectorAll('.nav').forEach(button => button.addEventListener('click', () => setView(button.dataset.view)));
document.querySelector('#profileButton').addEventListener('click', () => setView('about'));
document.querySelector('#searchInput').addEventListener('input', event => {
  searchTerm = event.target.value;
  setView('browse');
  document.querySelectorAll('.nav').forEach(button => button.classList.toggle('active', button.dataset.view === 'browse'));
});
document.querySelectorAll('.chip').forEach(button => button.addEventListener('click', () => {
  activeCategory = button.dataset.category;
  document.querySelectorAll('.chip').forEach(chip => chip.classList.toggle('active', chip === button));
  setView('browse');
  document.querySelectorAll('.nav').forEach(nav => nav.classList.toggle('active', nav.dataset.view === 'browse'));
}));

showRandomQuote(false);
