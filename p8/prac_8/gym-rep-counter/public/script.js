// Get stored count or default to 0
let count = localStorage.getItem('repCount') ? parseInt(localStorage.getItem('repCount')) : 0;
const counter = document.getElementById('counter');
counter.textContent = count;

function changeCount(delta) {
  count += delta;
  if (count < 0) count = 0;
  counter.textContent = count;
  localStorage.setItem('repCount', count);
}

function resetCount() {
  count = 0;
  counter.textContent = count;
  localStorage.setItem('repCount', count);
}
