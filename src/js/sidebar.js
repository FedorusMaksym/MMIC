const searchApi = {
  endpoint: "/api/search",

  async options(field) {
    const options = {
      destination: [
        { value: "morocco", label: "Marocco" },
        { value: "senegal", label: "Senegal" },
        { value: "south-africa", label: "Sudafrica" },
      ],
      type: [
        { value: "resort", label: "Resort" },
        { value: "camp", label: "Camp" },
      ],
      level: [
        { value: "beginner", label: "Principiante" },
        { value: "intermediate", label: "Intermedio" },
        { value: "advanced", label: "Avanzato" },
      ],
      holiday: [
        { value: "surf-camp", label: "Surf Camp" },
        { value: "adventure", label: "Adventure", checked: true },
        { value: "junior", label: "Junior" },
        { value: "resort", label: "Resort", checked: true },
        { value: "surf-lodge", label: "Surf Lodge" },
        { value: "surf-yoga", label: "Surf & Yoga" },
        { value: "boat-trip", label: "Boat Trip" },
        { value: "surf-resort", label: "Surf Resort" },
        { value: "group", label: "Viaggio di Gruppo" },
      ],
      accommodation: [
        { value: "hotel", label: "Hotel" },
        { value: "apartment", label: "Appartamento" },
        { value: "hostel", label: "Ostello" },
      ],
      extras: [
        { value: "yoga", label: "Yoga" },
        { value: "snorkeling", label: "Snorkeling" },
        { value: "diving", label: "Immersioni" },
      ],
    };

    return options[field];
  },

  async search(params) {
    const response = await fetch(`${this.endpoint}?${params}`);

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return response.json();
  },
};

const initSearch = (form, api) => {
  const template = document.querySelector("[data-filter-template]");

  const fillSelect = async (select) => {
    const items = await api.options(select.dataset.field);
    items.forEach(({ value, label }) =>
      select.append(new Option(label, value)),
    );
  };

  const fillList = async (list) => {
    const name = list.dataset.filterList;
    const items = await api.options(name);

    items.forEach(({ value, label, checked }) => {
      const item = template.content.cloneNode(true);
      const input = item.querySelector("input");
      input.name = name;
      input.value = value;
      input.checked = Boolean(checked);
      item
        .querySelector(".filters__option")
        .classList.toggle("is-checked", input.checked);
      item.querySelector(".filters__label").textContent = label;
      list.append(item);
    });
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const params = new URLSearchParams(
      [...new FormData(form)].filter(([, value]) => value),
    );

    try {
      const results = await api.search(params);
      form.dispatchEvent(
        new CustomEvent("search:results", { bubbles: true, detail: results }),
      );
    } catch (error) {
      form.dispatchEvent(
        new CustomEvent("search:error", { bubbles: true, detail: error }),
      );
    }
  });

  return Promise.all(
    [
      ...form.querySelectorAll("select[data-field]"),
      ...document.querySelectorAll("[data-filter-list]"),
    ].map((element) =>
      element.matches("select") ? fillSelect(element) : fillList(element),
    ),
  );
};

const initFilters = (root) => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const toggleGroup = (group) => {
    const list = group.querySelector(".filters__list");
    const opening = !group.classList.contains("is-open");

    group.animation?.cancel();
    group.classList.toggle("is-open", opening);

    if (reduceMotion.matches) {
      group.open = opening;
      return;
    }

    if (opening) {
      group.open = true;
    }

    const height = list.offsetHeight;
    const frames = opening
      ? { height: ["0px", `${height}px`], opacity: [0, 1] }
      : { height: [`${height}px`, "0px"], opacity: [1, 0] };

    group.animation = list.animate(frames, {
      duration: 280,
      easing: "ease-out",
      fill: "both",
    });
    group.animation.onfinish = () => {
      group.open = opening;
      group.animation.cancel();
      group.animation = null;
    };
  };

  root.querySelectorAll(".filters__group").forEach((group) => {
    group.classList.toggle("is-open", group.open);
  });

  root.addEventListener("click", (event) => {
    const summary = event.target.closest(".filters__summary");

    if (summary) {
      event.preventDefault();
      toggleGroup(summary.parentElement);
    }
  });

  root.addEventListener("change", (event) => {
    const input = event.target.closest(".filters__input");

    if (input) {
      input
        .closest(".filters__option")
        .classList.toggle("is-checked", input.checked);
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#search-form");
  const filters = document.querySelector(".filters");

  if (form) {
    initSearch(form, searchApi);
  }

  if (filters) {
    initFilters(filters);
  }
});
