function getReadableText(element) {
  const copy = element.cloneNode(true);

  copy.querySelectorAll("br").forEach((br) => {
    br.replaceWith(" ");
  });

  return copy.textContent.replace(/\s+/g, " ").trim();
}

const demoDialog = document.querySelector("#demo-dialog");
const demoMessage = document.querySelector("#demo-message");

function openDemoDialog(link) {
  if (!demoDialog || !demoMessage) return;

  const label = link.getAttribute("aria-label") || getReadableText(link);
  demoMessage.textContent =
    `${label}: this feature is not connected in this demo. ` +
    "No data or payment has been sent.";

  if (typeof demoDialog.showModal === "function") {
    demoDialog.showModal();
    demoMessage.focus?.();
  }
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  const href = link.getAttribute("href");
  const targetId = href.slice(1);

  if (!targetId) return;

  if (targetId !== "demo-dialog" && !document.getElementById(targetId)) {
    link.href = "#demo-dialog";
    link.dataset.demo = "true";
    link.title = "Demo: this feature is not connected";
  }

  if (link.dataset.demo) {
    const label = link.getAttribute("aria-label") || getReadableText(link);
    link.setAttribute("aria-label", `${label} (demo)`);
  }
});

document.addEventListener("click", (event) => {
  const link = event.target.closest("a[data-demo]");

  if (!link) return;

  event.preventDefault();
  openDemoDialog(link);
});

const newsletterForm = document.querySelector(".newsletter-form");
const newsletterStatus = newsletterForm?.querySelector("[role='status']");

if (newsletterForm) {
  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!newsletterForm.checkValidity()) {
      newsletterForm.reportValidity();
      return;
    }

    if (newsletterStatus) {
      newsletterStatus.textContent =
        "Demo form: no data was sent. Subscriptions are not connected yet.";
    }
  });
}

const stateSelect = document.querySelector("#network-state");
const networkMessage = document.querySelector("#network-message");

stateSelect?.addEventListener("change", () => {
  if (!networkMessage) return;

  const state = stateSelect.selectedOptions[0]?.textContent || "your state";

  networkMessage.textContent = stateSelect.value
    ? `${state} selected. Demo: the local chapter directory is not connected yet.`
    : "Demo: select a state to see its availability.";
});

(() => {
  const dialog = document.querySelector("#donate");

  if (
    !dialog ||
    dialog.tagName !== "DIALOG" ||
    typeof dialog.showModal !== "function"
  ) {
    return;
  }

  const amount = dialog.querySelector("#giving-amount");
  const presets = [...dialog.querySelectorAll("[data-giving-amount]")];
  const summary = dialog.querySelector("#giving-summary");
  const error = dialog.querySelector("#giving-error");
  const message = dialog.querySelector("#giving-message");
  const commentToggle = dialog.querySelector(".giving-comment-toggle");
  const commentBox = dialog.querySelector("#giving-comment-box");
  const comment = dialog.querySelector("#giving-comment");
  const closeButton = dialog.querySelector(".giving-close");
  const frequencyInputs = [
    ...dialog.querySelectorAll('[name="giving-frequency"]')
  ];

  if (
    !amount ||
    !summary ||
    !error ||
    !message ||
    !commentToggle ||
    !commentBox ||
    !comment ||
    !closeButton
  ) {
    return;
  }

  let opener = null;

  function update() {
    const value = amount.valueAsNumber;
    const valid =
      Number.isFinite(value) && amount.validity.valid && value >= 1;
    const monthly =
      dialog.querySelector('[name="giving-frequency"]:checked')?.value ===
      "monthly";

    presets.forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        String(valid && Number(button.dataset.givingAmount) === value)
      );
    });

    amount.setAttribute("aria-invalid", String(!valid));
    error.textContent = valid
      ? ""
      : "Enter €1 to €1,000,000, with up to two decimal places.";
    summary.textContent = valid
      ? `€${value.toLocaleString("en-IE", {
          maximumFractionDigits: 2
        })} ${monthly ? "monthly" : "one-time"}`
      : "Choose a valid donation amount.";
    message.textContent = "";

    return valid;
  }

  document.querySelectorAll('a[href="#donate"]').forEach((link) => {
    link.setAttribute("aria-haspopup", "dialog");

    link.addEventListener("click", (event) => {
      event.preventDefault();
      opener = link;
      update();
      dialog.showModal();
    });
  });

  closeButton.addEventListener("click", () => dialog.close());

  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;

    const rect = dialog.getBoundingClientRect();
    const outside =
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom;

    if (outside) dialog.close();
  });

  dialog.addEventListener("close", () => {
    comment.value = "";
    commentBox.hidden = true;
    commentToggle.setAttribute("aria-expanded", "false");
    opener?.focus();
  });

  presets.forEach((button) => {
    button.addEventListener("click", () => {
      amount.value = button.dataset.givingAmount;
      amount.focus();
      update();
    });
  });

  amount.addEventListener("input", update);
  frequencyInputs.forEach((input) => input.addEventListener("change", update));

  commentToggle.addEventListener("click", () => {
    commentBox.hidden = !commentBox.hidden;
    commentToggle.setAttribute(
      "aria-expanded",
      String(!commentBox.hidden)
    );

    if (!commentBox.hidden) comment.focus();
  });

  dialog.querySelectorAll("[data-giving-method]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!update()) {
        amount.focus();
        return;
      }

      const hasComment = comment.value.trim().length > 0;
      const commentStatus = hasComment
        ? " Your demo comment was not sent or saved."
        : " No comment was provided.";

      message.textContent =
        `${button.dataset.givingMethod}: school project demo — ` +
        "no payment will be processed. No data was sent or saved." +
        commentStatus;
      message.focus();
    });
  });

  update();

  if (location.hash === "#donate") dialog.showModal();
})();
