(() => {
  const header = document.querySelector(".header");
  const button = header?.querySelector(".donate-button");

  if (!button || button.closest(".donate-slot")) return;

  const slot = document.createElement("span");
  slot.className = "donate-slot";

  button.before(slot);
  slot.append(button);

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  let floating = false;
  let animation = null;

  function update(animate = true) {
    const shouldFloat = header.getBoundingClientRect().bottom <= 0;

    if (shouldFloat === floating) return;

    const before = button.getBoundingClientRect();
    animation?.cancel();

    if (shouldFloat) {
      // Сохраняем место кнопки, чтобы шапка не меняла размер.
      const size = button.getBoundingClientRect();

      slot.style.width = `${size.width}px`;
      slot.style.height = `${size.height}px`;
    }

    button.classList.toggle("is-floating", shouldFloat);
    floating = shouldFloat;

    if (!shouldFloat) {
      slot.style.width = "";
      slot.style.height = "";
    }

    if (!animate || reducedMotion.matches) return;

    const after = button.getBoundingClientRect();

    const startTop = Math.max(
      12,
      Math.min(
        before.top,
        window.innerHeight - before.height - 12
      )
    );

    const startLeft = Math.max(
      12,
      Math.min(
        before.left,
        window.innerWidth - before.width - 12
      )
    );

    animation = button.animate(
      [
        {
          transform: `translate(
            ${startLeft - after.left}px,
            ${startTop - after.top}px
          )`
        },
        {
          transform: "translate(0, 0)"
        }
      ],
      {
        duration: 450,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)"
      }
    );
  }

  update(false);

  const observer = new IntersectionObserver(
    () => update(),
    { threshold: 0 }
  );

  observer.observe(header);

  window.addEventListener("resize", () => {
    animation?.cancel();
    update(false);
  });

  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) {
      animation?.cancel();
    }
  });
})();