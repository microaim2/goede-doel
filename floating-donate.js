(() => {
  const header = document.querySelector(".header");
  const button = header?.querySelector(".donate-button");

  if (!header || !button) return;

  let slot = button.closest(".donate-slot");

  if (!slot) {
    slot = document.createElement("span");
    slot.className = "donate-slot";
    button.before(slot);
    slot.append(button);
  }

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  let floating = button.classList.contains("is-floating");
  let animation = null;

  function update(animate = true) {
    const shouldFloat = header.getBoundingClientRect().bottom <= 0;

    if (shouldFloat === floating) return;

    // zapominaet polozhenie ot kuda buuton prigaet
    const before = button.getBoundingClientRect();

    animation?.cancel();
    animation = null;

    button.classList.toggle("is-floating", shouldFloat);
    floating = shouldFloat;

    const after = button.getBoundingClientRect();

    if (!animate || reducedMotion.matches) return;

    // Плавно перемещаем кнопку от старого положения к новому.
    const currentAnimation = button.animate(
      [
        {
          transform: `translate(
            ${before.left - after.left}px,
            ${before.top - after.top}px
          )`
        },
        {
          transform: "translate(0, 0)"
        }
      ],
      {
        duration: 650,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)"
      }
    );

    animation = currentAnimation;

    currentAnimation.onfinish = () => {
      if (animation === currentAnimation) {
        animation = null;
      }
    };
  }

  const observer = new IntersectionObserver(
    () => update(),
    { threshold: 0 }
  );

  update(false);
  observer.observe(header);

  window.addEventListener("resize", () => {
    animation?.cancel();
    animation = null;
    update(false);
  });

  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) {
      animation?.cancel();
      animation = null;
    }
  });
})();