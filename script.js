const missionItems = [
  {
    icon: "icon-plastic.svg",
    title: "Plastic Reduction",
    text: "Reducing the impact of plastics in the marine environments that surround us."
  },
  {
    icon: "icon-ocean.svg",
    title: "Ocean Protection",
    text: "Defending our ocean from challenges threatening the vitality of the ecosystem."
  },
  {
    icon: "icon-beach.svg",
    title: "Beach Access",
    text: "Working with decision-makers to ensure full and fair beach access for all to enjoy."
  },
  {
    icon: "icon-climate.svg",
    title: "Coasts &amp; Climate",
    text: "Taking on issues that threaten our beaches and natural shorelines."
  },
  {
    icon: "icon-water.svg",
    title: "Clean Water",
    text: "Protecting the health and sustainability of our planet's most precious resource."
  }
];

document.querySelector("#missionGrid").innerHTML = missionItems
  .map((item) => `
    <article class="mission-card">
      <img src="images/${item.icon}" alt="">
      <h3>${item.title}</h3>
      <p>${item.text}</p>
      <a class="link-plain" href="https://www.surfrider.org/programs">
        Learn More
      </a>
    </article>
  `)
  .join("");

const footerColumns = [
  {
    title: "About Us",
    links: [
      ["#mission", "Mission"],
      ["#model", "Model"],
      ["#team", "Team"],
      ["#board", "Board"],
      ["#commitment", "Justice, Equity, Diversity & Inclusion"],
      ["#history", "History"],
      ["#ambassadors", "Ambassadors"],
      ["#media", "Media"],
      ["#policies", "Environmental Policies"]
    ]
  },
  {
    title: "Give",
    links: [
      ["#donate", "Donate"],
      ["#membership", "Membership"],
      ["#faq", "FAQ"],
      ["#partners", "Partnerships"]
    ]
  },
  {
    title: "Get Involved",
    links: [
      ["#volunteer", "Volunteer"],
      ["#events", "Events"],
      ["#fundraise", "Fundraise"],
      ["#news", "News"],
      ["#programs", "Programs"],
      ["#campaigns", "Campaigns"],
      ["#careers", "Careers"]
    ]
  }
];

document.querySelector("#footerNav").innerHTML = footerColumns
  .map((column) => `
    <div class="footer-column">
      <h3>${column.title}</h3>
      <ul>
        ${column.links
          .map(([href, label]) => `
            <li>
              <a class="link-plain" href="${href}">${label}</a>
            </li>
          `)
          .join("")}
      </ul>
    </div>
  `)
  .join("");

const legalLinks = [
  ["#legal", "Legal"],
  ["#financials", "Financials"],
  ["#contact", "Contact Us"],
  ["#social-policy", "Social Comment Policy"],
  ["#terms", "Terms of Use"],
  ["#privacy", "Privacy Policy"],
  ["#compliance", "501(c)(3) Compliance"]
];

document.querySelector("#footerLegal").innerHTML = legalLinks
  .map(([href, label]) => `
    <a class="link-plain" href="${href}">${label}</a>
  `)
  .join("");

const newsletterForm = document.querySelector(".newsletter-form");
const formMessage = newsletterForm.querySelector(".form-message");

newsletterForm.addEventListener("submit", (event) => {
  event.preventDefault();

  formMessage.textContent =
    "Demo form: no data was sent. Subscriptions are not connected yet.";
});

const dropdowns = [...document.querySelectorAll(".nav-dropdown")];

function setMenuOpen(dropdown, isOpen) {
  const panel = dropdown.querySelector(".nav-panel");
  const button = dropdown.querySelector(".nav-toggle");

  panel.hidden = !isOpen;
  button.setAttribute("aria-expanded", String(isOpen));
}

function closeMenus() {
  dropdowns.forEach((dropdown) => setMenuOpen(dropdown, false));
}

dropdowns.forEach((dropdown) => {
  const button = dropdown.querySelector(".nav-toggle");
  const panel = dropdown.querySelector(".nav-panel");

  button.addEventListener("click", () => {
    const willOpen = panel.hidden;

    closeMenus();
    closeSearch();
    setMenuOpen(dropdown, willOpen);
  });

  panel.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      closeMenus();
    }
  });

  dropdown.addEventListener("focusout", () => {
    setTimeout(() => {
      if (!dropdown.contains(document.activeElement)) {
        setMenuOpen(dropdown, false);
      }
    }, 0);
  });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".nav-dropdown")) {
    closeMenus();
  }
});

const searchButton = document.querySelector(".search-button");
const searchPanel = document.querySelector("#site-search");
const searchInput = document.querySelector("#search-query");
const searchForm = document.querySelector(".site-search-form");
const searchClose = document.querySelector(".search-close");
const searchResults = document.querySelector("#search-results");
const searchStatus = document.querySelector("#search-status");

function closeSearch() {
  searchPanel.hidden = true;
  searchButton?.setAttribute("aria-expanded", "false");
}

searchButton?.addEventListener("click", () => {
  closeMenus();

  const willOpen = searchPanel.hidden;

  searchPanel.hidden = !willOpen;
  searchButton?.setAttribute("aria-expanded", String(willOpen));

  if (willOpen) {
    searchInput.focus();
  }
});

searchClose.addEventListener("click", () => {
  closeSearch();
  searchButton?.focus();
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  const openDropdown = dropdowns.find((dropdown) => {
    return !dropdown.querySelector(".nav-panel").hidden;
  });

  if (openDropdown) {
    closeMenus();
    openDropdown.querySelector(".nav-toggle").focus();
  } else if (!searchPanel.hidden) {
    closeSearch();
    searchButton?.focus();
  }
});

const searchableSections = [
  ...document.querySelectorAll("main > section[id]")
];

function getReadableText(element) {
  const copy = element.cloneNode(true);

  copy.querySelectorAll("br").forEach((br) => {
    br.replaceWith(" ");
  });

  return copy.textContent.replace(/\s+/g, " ").trim();
}

function normalizeText(text) {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

const searchIndex = searchableSections.map((section) => ({
  section,
  text: normalizeText(getReadableText(section))
}));

function searchPage() {
  const query = normalizeText(searchInput.value);

  searchResults.replaceChildren();

  if (!query) {
    searchStatus.textContent = "Enter a word to search this page.";
    return;
  }

  const matches = searchIndex
    .filter((item) => item.text.includes(query))
    .map((item) => item.section);

  searchStatus.textContent = matches.length
    ? `${matches.length} section(s) found.`
    : "No results. Try ocean, climate or donate.";

  matches.forEach((section) => {
    const listItem = document.createElement("li");
    const link = document.createElement("a");
    const heading = section.querySelector("h1, h2");

    link.href = `#${section.id}`;
    link.textContent = heading
      ? getReadableText(heading)
      : section.getAttribute("aria-label") || section.id;

    link.addEventListener("click", (event) => {
      event.preventDefault();
      closeSearch();

      const focusTarget = heading || section;

      focusTarget.setAttribute("tabindex", "-1");
      focusTarget.focus({ preventScroll: true });

      section.scrollIntoView({ block: "start" });
      history.replaceState(null, "", `#${section.id}`);
    });

    listItem.append(link);
    searchResults.append(listItem);
  });
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  searchPage();
});

searchInput.addEventListener("input", searchPage);

const stateSelect = document.querySelector("#network-state");
const networkMessage = document.querySelector("#network-message");

stateSelect.addEventListener("change", () => {
  const state = stateSelect.selectedOptions[0].textContent;

  networkMessage.textContent = stateSelect.value
    ? `${state} selected. Demo: the local chapter directory is not connected yet.`
    : "Demo: select a state to see its availability.";
});

const demoDialog = document.querySelector("#demo-dialog");
const demoMessage = document.querySelector("#demo-message");

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  const targetId = link.getAttribute("href").slice(1);

  if (!document.getElementById(targetId)) {
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

  demoMessage.textContent =
    `${link.getAttribute("aria-label")}: this feature is not connected ` +
    "in this demo. No data or payment has been sent.";

  demoDialog.showModal();
});

// Donation demo: only amount and option selections are read.
// Personal and card input values are never read, transmitted or stored.
(() => {
  const form = document.querySelector("#donation-form");
  if (!form) return;

  const amounts = [...form.querySelectorAll("[data-donation-amount]")];
  const other = form.querySelector("#donation-other");
  const total = form.querySelector("#donation-total");
  const donate = form.querySelector("#donation-submit");
  const error = form.querySelector("#donation-amount-error");
  const message = form.querySelector("#donation-message");
  const cardFields = form.querySelector("#donation-card-fields");
  const paypalNote = form.querySelector("#donation-paypal-note");
  let selectedAmount = 10;

  const money = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });

  function updateDonation() {
    const monthly = form.querySelector(
      '[name="donation-frequency"]:checked'
    ).value === "monthly";

    const card = form.querySelector(
      '[name="donation-payment"]:checked'
    ).value === "card";

    const amount = selectedAmount === null
      ? other.valueAsNumber
      : selectedAmount;

    const valid =
      Number.isFinite(amount) &&
      amount >= 1 &&
      amount <= 1000000 &&
      (selectedAmount !== null || other.validity.valid);

    amounts.forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        String(selectedAmount === Number(button.dataset.donationAmount))
      );
    });

    other.setAttribute("aria-invalid", String(!valid));

    error.textContent = valid
      ? ""
      : "Enter $1 to $1,000,000, with up to two decimal places.";

    total.textContent = valid
      ? `${money.format(amount)}${monthly ? " / month" : " one-time"}`
      : "Choose an amount";

    donate.textContent = valid
      ? `Donate ${money.format(amount)}${monthly ? " monthly" : " once"}`
      : "Try donation demo";

    cardFields.hidden = !card;

    cardFields.querySelectorAll("input").forEach((input) => {
      input.disabled = !card;
    });

    paypalNote.hidden = card;
    message.textContent = "";

    return valid;
  }

  amounts.forEach((button) => {
    button.addEventListener("click", () => {
      selectedAmount = Number(button.dataset.donationAmount);
      other.value = "";
      updateDonation();
    });
  });

  other.addEventListener("input", () => {
    selectedAmount = null;
    updateDonation();
  });

  form.querySelectorAll('input[type="radio"]').forEach((input) => {
    input.addEventListener("change", updateDonation);
  });

  function showDonationDemo() {
    const valid = updateDonation();

    message.textContent =
      "School project demo — no payment will be processed. " +
      "No donation was made. Your details were not sent or saved." +
      (valid ? "" : " Choose a valid amount to preview the total.");

    message.focus();
  }

  donate.addEventListener("click", showDonationDemo);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    showDonationDemo();
  });

  form.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && event.target.matches("input")) {
      event.preventDefault();
      showDonationDemo();
    }
  });

  updateDonation();
  donate.disabled = false;
})();