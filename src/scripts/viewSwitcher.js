document.addEventListener("DOMContentLoaded", () => {
  const switcher = document.querySelector(".view-switcher");
  if (!switcher) return;

  const lists = document.querySelectorAll(".work-list");
  const buttons = switcher.querySelectorAll("button");
  const initialView =
    document.documentElement.dataset.workView ||
    localStorage.getItem("view") ||
    "list";

  function applyView(view) {
    document.documentElement.dataset.workView = view;
    lists.forEach(list => {
      list.dataset.view = view;
      list.querySelectorAll(".work-link").forEach(item => {
        if (view === "list" && item.dataset.hasPullquote === "false") {
          item.style.display = "none";
        } else {
          item.style.display = "";
        }
      });
    });
  }

  // Apply saved view to all lists
  applyView(initialView);

  // Reset button states
  buttons.forEach(btn => btn.classList.remove("is-active"));

  // Update button states
  buttons.forEach(btn => {
    if (btn.dataset.view === initialView) btn.classList.add("is-active");
  });

  // Handle button clicks
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      // Update all lists on switch
      applyView(btn.dataset.view);

      localStorage.setItem("view", btn.dataset.view);
      
      document.documentElement.classList.remove("is-loading");
    });
  });
});
