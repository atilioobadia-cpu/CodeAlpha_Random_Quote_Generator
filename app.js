const quotes = [
  { text: "It always seems impossible until it's done.", author: 'Nelson Mandela' },
  { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
  { text: 'Great things are done by a series of small things brought together.', author: 'Vincent van Gogh' },
  { text: 'It is never too late to be what you might have been.', author: 'George Eliot' },
  { text: 'Nothing will work unless you do.', author: 'Maya Angelou' },
  { text: 'The best way out is always through.', author: 'Robert Frost' },
  { text: 'You do not have to see the whole staircase, just take the first step.', author: 'Martin Luther King Jr.' },
  { text: 'Act as if what you do makes a difference. It does.', author: 'William James' },
  { text: 'Turn your wounds into wisdom.', author: 'Oprah Winfrey' },
  { text: 'What we think, we become.', author: 'Buddha' }
];

const quoteText = document.querySelector('#quoteText');
const quoteAuthor = document.querySelector('#quoteAuthor');
let lastIndex = -1;

function showRandomQuote() {
  let index;
  do { index = Math.floor(Math.random() * quotes.length); } while (quotes.length > 1 && index === lastIndex);
  lastIndex = index;
  quoteText.textContent = quotes[index].text;
  quoteAuthor.textContent = quotes[index].author;
}

document.querySelector('#newQuote').addEventListener('click', showRandomQuote);
showRandomQuote();
