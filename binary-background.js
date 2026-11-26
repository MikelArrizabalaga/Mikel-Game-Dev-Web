const background = document.querySelector('.binary-background');
const pattern = background.querySelector('pre');
const rotation = 16 * Math.PI / 180;
const signature = '01101101 01101001 01101011 01100101 01101100 00100000 01100001 01110010 01110010 01101001 01111010 01100001 01100010 01100001 01101100 01100001 01100111 01100001 ';
const loopRows = 6;
pattern.style.setProperty('--binary-half-shift', loopRows / 2 + 'lh');

function renderPattern() {
  const { clientWidth: width, clientHeight: height } = background;
  const { fontSize, lineHeight } = getComputedStyle(pattern);
  const rowWidth = width * Math.cos(rotation) + height * Math.sin(rotation);
  const patternHeight = height * Math.cos(rotation) + width * Math.sin(rotation);
  const columns = Math.ceil(rowWidth / (parseFloat(fontSize) * 0.57)) + 12;
  const rows = Math.ceil(patternHeight / parseFloat(lineHeight)) + loopRows + 4;
  const repeated = signature.repeat(Math.ceil((columns + signature.length) / signature.length));

  const lines = Array.from({ length: rows }, (_, row) => {
    const offset = (row % loopRows) * (signature.length / loopRows);
    return repeated.slice(offset, offset + columns);
  });
  pattern.textContent = lines.join('\n');
}

new ResizeObserver(renderPattern).observe(background);

const motionToggle = document.querySelector('#toggle-background');
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');

function updateMotionControl() {
  motionToggle.hidden = motionPreference.matches;
}

motionToggle.addEventListener('click', () => {
  const paused = background.classList.toggle('is-paused');
  motionToggle.textContent = paused ? 'Reanudar fondo' : 'Pausar fondo';
});
motionPreference.addEventListener('change', updateMotionControl);
updateMotionControl();
