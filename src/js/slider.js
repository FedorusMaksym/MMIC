(() => {
  const track = document.getElementById("track");
  const prevBtn = document.querySelector(".activity__btn--prev");
  const nextBtn = document.querySelector(".activity__btn--next");

  if (!track || !prevBtn || !nextBtn) return;

  // Крок прокрутки = ширина однієї картки + gap
  const getStep = () => {
    const item = track.querySelector(".activity__item");
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return item.getBoundingClientRect().width + gap;
  };

  // Блокуємо кнопки на краях (і коли всі картки вміщаються)
  const updateButtons = () => {
    const maxScroll = track.scrollWidth - track.clientWidth;
    prevBtn.disabled = track.scrollLeft <= 1;
    nextBtn.disabled = track.scrollLeft >= maxScroll - 1;
  };

  prevBtn.addEventListener("click", () => {
    track.scrollBy({ left: -getStep(), behavior: "smooth" });
  });

  nextBtn.addEventListener("click", () => {
    track.scrollBy({ left: getStep(), behavior: "smooth" });
  });

  track.addEventListener("scroll", updateButtons, { passive: true });
  window.addEventListener("resize", updateButtons);
  updateButtons();
})();