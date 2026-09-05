/**
 * RAHUL KUMAR JHA — MINIMALIST PORTFOLIO LOGIC
 * Clean column navigation, keyboard controls, and copy email interaction.
 */

document.addEventListener('DOMContentLoaded', () => {
  const deck = document.getElementById('deckContainer');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const copyBtn = document.getElementById('copyEmailBtn');
  const copyLabel = document.getElementById('copyBtnLabel');

  if (!deck) return;

  const columns = Array.from(deck.querySelectorAll('.deck-column'));

  // Calculate scroll step dynamically based on column width + gap
  function getScrollStep() {
    if (columns.length > 0) {
      const colWidth = columns[0].offsetWidth;
      return colWidth + 20; // column width + gap
    }
    return 460;
  }

  function updateButtonStates() {
    if (!prevBtn || !nextBtn) return;
    const maxScroll = deck.scrollWidth - deck.clientWidth;
    prevBtn.disabled = deck.scrollLeft <= 10;
    nextBtn.disabled = deck.scrollLeft >= maxScroll - 10;
  }

  // Next / Prev button click
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      deck.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      deck.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
    });
  }

  // Keyboard navigation (Arrow keys)
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.key === 'ArrowRight') {
      deck.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
    } else if (e.key === 'ArrowLeft') {
      deck.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
    }
  });

  // Track scroll for button disable state
  let scrollTimeout;
  deck.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateButtonStates, 50);
  }, { passive: true });

  // Initial state check and scroll reset
  document.querySelectorAll('.column-body').forEach(c => { c.scrollTop = 0; });
  deck.scrollLeft = 0;
  updateButtonStates();

  // Copy Email interaction
  if (copyBtn && copyLabel) {
    copyBtn.addEventListener('click', async () => {
      const email = copyBtn.getAttribute('data-email') || 'rahulkumarjha26@gmail.com';
      try {
        await navigator.clipboard.writeText(email);
        copyLabel.textContent = 'Copied!';
        copyBtn.style.borderColor = '#52525b';
        setTimeout(() => {
          copyLabel.textContent = 'Copy email';
          copyBtn.style.borderColor = '';
        }, 2000);
      } catch (err) {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = email;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        copyLabel.textContent = 'Copied!';
        setTimeout(() => {
          copyLabel.textContent = 'Copy email';
        }, 2000);
      }
    });
  }
});
