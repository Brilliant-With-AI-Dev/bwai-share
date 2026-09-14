'use strict';
const slides = Array.from(document.querySelectorAll('.slide'));
const dots = document.querySelector('#dots');
const prev = document.querySelector('#prev');
const next = document.querySelector('#next');
let i = 0;

dots.innerHTML = slides.map(() => '<i></i>').join('');
const pips = Array.from(dots.children);

function show(n, push) {
  i = Math.max(0, Math.min(slides.length - 1, n));
  slides.forEach((s, k) => { s.hidden = k !== i; });
  pips.forEach((p, k) => { p.className = k === i ? 'on' : ''; });
  prev.disabled = i === 0;
  next.disabled = i === slides.length - 1;
  document.title = slides[i].dataset.title + ' · Stratford Mirror proposal';
  if (push) history.replaceState(null, '', '#slide-' + (i + 1));
  window.scrollTo(0, 0);
}

function fromHash() {
  const m = /^#slide-(\d+)$/.exec(location.hash);
  return m ? parseInt(m[1], 10) - 1 : 0;
}

prev.addEventListener('click', () => show(i - 1, true));
next.addEventListener('click', () => show(i + 1, true));
window.addEventListener('hashchange', () => show(fromHash(), false));
document.addEventListener('keydown', e => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.key === 'ArrowRight' || e.key === 'PageDown') { show(i + 1, true); e.preventDefault(); }
  else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { show(i - 1, true); e.preventDefault(); }
  else if (e.key === 'Home') { show(0, true); e.preventDefault(); }
  else if (e.key === 'End') { show(slides.length - 1, true); e.preventDefault(); }
});
show(fromHash(), false);
