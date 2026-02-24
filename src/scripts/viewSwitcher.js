document.addEventListener("DOMContentLoaded", () => {
  const switcher = document.querySelector(".view-switcher");
  const lists = document.querySelectorAll(".work-list");
  const buttons = switcher.querySelectorAll("button");

  const savedView = localStorage.getItem("view") || "list";

  // Apply saved view to all lists
  lists.forEach(list => {
    list.dataset.view = savedView;
  });

  // Reset button states
  buttons.forEach(btn => btn.classList.remove("is-active"));

  // Update button states
  buttons.forEach(btn => {
    if (btn.dataset.view === savedView) btn.classList.add("is-active");
  });

  // Handle button clicks
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      // Update all lists on switch
      lists.forEach(list => {
        list.dataset.view = btn.dataset.view;
      });

      localStorage.setItem("view", btn.dataset.view);
      
      document.documentElement.classList.remove("is-loading");
    });
  });
});