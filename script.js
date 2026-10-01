"use strict";

// Native dialogs handle Escape, focus trapping and focus restoration.
document.querySelectorAll("dialog").forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right ||
        event.clientY < rect.top || event.clientY > rect.bottom) {
      dialog.close();
    }
  });
});

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

document.addEventListener("click", (event) => {
  const link = event.target.closest("a[data-demo]");

  if (!link) return;

  event.preventDefault();
  openDemoDialog(link);
});

const newsletterForm = document.querySelector(".newsletter-form");
const newsletterStatus = newsletterForm?.querySelector("[role='status']");

if (newsletterForm) {
  newsletterForm.querySelector("button[type=submit]").disabled = false;
  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();

    newsletterForm.querySelectorAll("input").forEach((input) => {
      input.value = input.value.trim();
    });

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

// Mobile navigation
(() => {
  const toggle = document.querySelector(".menu-toggle");
  const links = document.querySelector("#header-links");
  const mobile = window.matchMedia("(max-width: 900px)");

  if (!toggle || !links) return;

  toggle.hidden = false;

  function setMenu(open) {
    links.classList.toggle("is-collapsed", !open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "Close menu" : "Menu";
  }

  function syncMenu() {
    setMenu(!mobile.matches);
  }

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    setMenu(!open);
  });

  links.addEventListener("click", (event) => {
    if (!mobile.matches || !event.target.closest("a")) return;

    setMenu(false);
    toggle.focus();
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      mobile.matches &&
      toggle.getAttribute("aria-expanded") === "true"
    ) {
      setMenu(false);
      toggle.focus();
    }
  });

  mobile.addEventListener("change", syncMenu);
  syncMenu();
})();

// Topic articles
(() => {
  const articles = {
    plastic: {
      title: "Less Plastic, Cleaner Coasts",
      image: "images/volunteers.jpg",
      alt: "Volunteers collecting litter on the coast",
      paragraphs: [
        "Plastic reduction starts before a beach cleanup. Think about the disposable items you use regularly and which ones you could avoid or replace.",
        "A cleanup is also a chance to observe what washes ashore. Recording the types of litter you find can help your group choose a practical next project."
      ],
      tip: "For your next beach visit, bring a reusable bottle and take all your litter home.",
      action: "Find volunteer opportunities",
      target: "#volunteer"
    },

    ocean: {
      title: "Protect Our Ocean",
      image: "images/news-ocean.jpg",
      alt: "Swimmer above a coral reef",
      paragraphs: [
        "Ocean protection connects everyday choices with decisions about how we use our coastlines. Learn about the issues affecting a place you care about.",
        "Explore a campaign, read its background, and find out what action its organisers are asking people to take."
      ],
      tip: "Choose one coastal campaign and read about its goals before getting involved.",
      action: "Explore the featured campaign",
      target: "#campaigns"
    },

    beach: {
      title: "Beaches for Everyone",
      image: "images/shop-collection.jpg",
      alt: "Woman holding a surfboard",
      paragraphs: [
        "Planning a beach visit involves more than finding a stretch of sand. Clear access information helps people understand how to reach and enjoy the coast.",
        "Look for marked public entrances, transport options, accessible routes, and local visitor information. Respect signs and the surrounding community."
      ],
      tip: "Before your next visit, check the beach's official access and accessibility information.",
      action: "Connect with the volunteer network",
      target: "#volunteer"
    },

    coasts: {
      title: "Care for Our Coastlines",
      image: "images/climate.jpg",
      alt: "Adult and child planting along the coast",
      paragraphs: [
        "Coastal restoration projects give volunteers a way to care for the places they visit. Activities may include planting, site maintenance, and observing changes over time.",
        "Join an organised project and follow its guidance. Each location has its own needs, and restoration work should suit the site."
      ],
      tip: "Look for an organised restoration day and ask what equipment and preparation you need.",
      action: "Explore the climate program",
      target: "#programs"
    },

    water: {
      title: "Get Involved in Clean Water",
      image: "images/news-ocean.jpg",
      alt: "Ocean swimmer above a reef",
      paragraphs: [
        "Water quality is part of caring for a coastline. Learning where local information comes from is a useful first step toward getting involved.",
        "Ask local volunteer groups whether they run water monitoring or education activities, and what training participants need."
      ],
      tip: "Find your local authority's beach water information page and save it for future visits.",
      action: "Find a volunteer group",
      target: "#volunteer"
    },

    "beach-day": {
      title: "Plan a Thoughtful Beach Day",
      image: "images/news-ocean.jpg",
      alt: "Swimmer exploring the ocean above a coral reef",
      paragraphs: [
        "A thoughtful beach day starts with preparation. Bring what you need, read visitor guidance, and plan how you will take packaging and litter home.",
        "Use a reusable bag for your belongings, avoid disposable packaging where possible, and leave the beach as clean as you found it."
      ],
      tip: "Make a reusable beach checklist: water bottle, sun protection, belongings, and a bag for your litter.",
      action: "Explore plastic reduction",
      article: "plastic"
    },

    drilling: {
      title: "Understand the Drilling Campaign",
      image: "images/campaign.jpg",
      alt: "Crossed-out offshore oil platform",
      paragraphs: [
        "The featured campaign focuses on opposition to new offshore drilling. This project introduces the topic and points visitors toward the organisation's campaign information.",
        "Before taking action, read the current campaign details, check which areas are involved, and review the specific request being made."
      ],
      tip: "Read a campaign's background and current call to action before sharing it.",
      action: "Visit Surfrider campaigns",
      target: "https://www.surfrider.org/campaigns"
    },

    climate: {
      title: "Join Coastal Restoration",
      image: "images/climate.jpg",
      alt: "Adult and child working on a coastal planting project",
      paragraphs: [
        "The Climate Action Program section introduces volunteering through coastal restoration. Taking part can also be a way to learn about the landscape from project organisers.",
        "Before joining, check the meeting point, activity requirements, equipment list, and whether registration is needed."
      ],
      tip: "Choose a volunteer activity that fits your availability and ask the organiser how to prepare.",
      action: "Find volunteer opportunities",
      target: "#volunteer"
    }
  };

  const dialog = document.querySelector("#article-dialog");
  if (!dialog) return;

  const title = dialog.querySelector("#article-title");
  const image = dialog.querySelector("#article-image");
  const body = dialog.querySelector("#article-body");
  const tip = dialog.querySelector("#article-tip");
  const action = dialog.querySelector("#article-action");
  const close = dialog.querySelector(".article-close");

  let opener = null;
  let currentArticle = null;
  let nextSection = null;

  function showArticle(key, trigger) {
    const article = articles[key];
    if (!article) return;

    if (!dialog.open) {
      opener = trigger;
    }

    currentArticle = article;
    title.textContent = article.title;
    image.src = article.image;
    image.alt = article.alt;
    tip.textContent = article.tip;

    body.replaceChildren();

    article.paragraphs.forEach((text) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = text;
      body.append(paragraph);
    });

    action.textContent = article.action;
    action.href = article.article
      ? "#article-dialog"
      : article.target;

    if (article.target?.startsWith("https://")) {
      action.target = "_blank";
      action.rel = "noopener noreferrer";
      action.setAttribute(
        "aria-label",
        `${article.action} (opens in a new tab)`
      );
    } else {
      action.removeAttribute("target");
      action.removeAttribute("rel");
      action.removeAttribute("aria-label");
    }

    if (!dialog.open) {
      dialog.showModal();
    }

    dialog.scrollTop = 0;
    close.focus();
  }

  document.querySelectorAll("[data-article]").forEach((link) => {
    link.setAttribute("aria-haspopup", "dialog");
    link.setAttribute("aria-controls", "article-dialog");

    link.addEventListener("click", (event) => {
      event.preventDefault();
      showArticle(link.dataset.article, link);
    });
  });

  close.addEventListener("click", () => dialog.close());


  action.addEventListener("click", (event) => {
    if (currentArticle?.article) {
      event.preventDefault();
      showArticle(currentArticle.article);
      return;
    }

    if (currentArticle?.target?.startsWith("#")) {
      event.preventDefault();
      nextSection = document.querySelector(currentArticle.target);
      dialog.close();
    }
  });

  dialog.addEventListener("close", () => {
    if (nextSection) {
      const section = nextSection;
      nextSection = null;

      const hadTabindex = section.hasAttribute("tabindex");
      if (!hadTabindex) section.setAttribute("tabindex", "-1");

      section.focus({ preventScroll: true });
      section.scrollIntoView({ block: "start" });

      if (!hadTabindex) {
        section.addEventListener(
          "blur",
          () => section.removeAttribute("tabindex"),
          { once: true }
        );
      }
    } else {
      opener?.focus({ preventScroll: true });
    }
  });
})();

(() => {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  const slides = [...hero.querySelectorAll(".hero-slide")];
  const controls = hero.querySelector(".hero-carousel-controls");
  const previous = hero.querySelector(".hero-prev");
  const next = hero.querySelector(".hero-next");
  const counter = hero.querySelector(".hero-counter");

  if (
    slides.length < 2 ||
    !controls ||
    !previous ||
    !next ||
    !counter
  ) {
    return;
  }

  let current = 0;

  function showSlide(index) {
    current = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === current);
    });

    counter.textContent = `${current + 1} / ${slides.length}`;
  }

  previous.addEventListener("click", () => {
    showSlide(current - 1);
  });

  next.addEventListener("click", () => {
    showSlide(current + 1);
  });

  controls.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showSlide(current - 1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      showSlide(current + 1);
    }
  });

  showSlide(0);
  controls.hidden = false;
})();