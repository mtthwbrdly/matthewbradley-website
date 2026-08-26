document.addEventListener("DOMContentLoaded", () => {
  const switcher = document.querySelector(".view-switcher");
  const filterNav = document.querySelector(".work-filters");
  if (!switcher) return;

  const lists = document.querySelectorAll(".work-list");
  const viewButtons = switcher.querySelectorAll("button");
  const filterButtons = filterNav?.querySelectorAll("[data-filter]") || [];
  const filters = Array.from(filterButtons).map(button => button.dataset.filter);
  const safeGet = (key, fallback = null) => {
    try {
      return localStorage.getItem(key) || fallback;
    } catch (e) {
      return fallback;
    }
  };

  const safeSet = (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      // ignore
    }
  };

  const initialView =
    document.documentElement.dataset.workView ||
    safeGet("view", "list") ||
    "list";

  const initialFilter = filters.includes(window.location.hash.slice(1))
    ? window.location.hash.slice(1)
    : "all";

  let currentView = initialView;
  let currentFilter = initialFilter;

  function shouldShowItem(item) {
    const hasPullquote = item.dataset.hasPullquote !== "false";
    const itemCategories = (item.dataset.categories || "").split(" ").filter(Boolean);
    const matchesFilter =
      currentFilter === "all" || itemCategories.includes(currentFilter);

    return matchesFilter && (currentView !== "list" || hasPullquote);
  }

  function applyView(view) {
    currentView = view;
    document.documentElement.dataset.workView = currentView;
    lists.forEach(list => {
      list.dataset.view = currentView;
      list.querySelectorAll(".work-link").forEach(item => {
        item.style.display = shouldShowItem(item) ? "" : "none";
      });
    });
  }

  function applyFilter(filter) {
    currentFilter = filter;
    filterButtons.forEach(btn => {
      btn.classList.toggle("is-active", btn.dataset.filter === currentFilter);
      btn.setAttribute("aria-pressed", String(btn.dataset.filter === currentFilter));
    });

    if (currentFilter === "all") {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    } else {
      history.replaceState(null, "", `#${currentFilter}`);
    }

    applyView(currentView);
  }

  // Reset button states
  viewButtons.forEach(btn => btn.classList.remove("is-active"));

  // Update button states
  viewButtons.forEach(btn => {
    if (btn.dataset.view === initialView) btn.classList.add("is-active");
  });

  // Handle button clicks
  viewButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      viewButtons.forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      // Update all lists on switch
      applyView(btn.dataset.view);

      safeSet("view", btn.dataset.view);
      
      document.documentElement.classList.remove("is-loading");
    });
  });

  filterButtons.forEach(btn => {
    btn.setAttribute("aria-pressed", String(btn.dataset.filter === currentFilter));
    btn.addEventListener("click", () => {
      applyFilter(btn.dataset.filter);
      document.documentElement.classList.remove("is-loading");
    });
  });

  applyFilter(initialFilter);
});
