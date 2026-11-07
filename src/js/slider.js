const t = document.getElementById('track');
const step = () => t.querySelector('.card').offsetWidth + 5;
document.querySelector('.prev').onclick = () => t.scrollBy({ left: -step() });
document.querySelector('.next').onclick = () => t.scrollBy({ left: step() });