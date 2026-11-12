const cards = document.querySelector('.surf-packages__list');

if (cards) {
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  cards.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX;
    scrollLeft = cards.scrollLeft;
  });

  cards.addEventListener('mouseup', () => {
    isDown = false;
  });

  cards.addEventListener('mouseleave', () => {
    isDown = false;
  });

  cards.addEventListener('mousemove', (e) => {
    if (!isDown) return;

    e.preventDefault();

    const move = e.pageX - startX;
    cards.scrollLeft = scrollLeft - move;
  });

  cards.querySelectorAll('img').forEach((img) => {
    img.addEventListener('dragstart', (e) => {
      e.preventDefault();
    });
  });
}