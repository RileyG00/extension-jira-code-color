(function () {
  const STYLE_ID = "jira-code-color-style";
  const DEFAULTS = {
    textColor: "#ffc896",
    backgroundColor: "#433831"
  };

  function applyStyles({ textColor, backgroundColor }) {
    let styleEl = document.getElementById(STYLE_ID);
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = STYLE_ID;
      (document.head || document.documentElement).appendChild(styleEl);
    }
    styleEl.textContent = `:root { --jcc-text: ${textColor}; --jcc-bg: ${backgroundColor}; }`;
  }

  function loadAndApply() {
    chrome.storage.sync.get(DEFAULTS, applyStyles);
  }

  loadAndApply();

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync") {
      loadAndApply();
    }
  });
})();
