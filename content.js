(function () {
  const STYLE_ID = "jira-code-color-style";
  const DEFAULTS = {
    textColor: "#ed8515",
    backgroundColor: "#3b3a3a"
  };

  const SELECTORS = [
    "span.code",
    'code[data-renderer-mark="true"]'
  ];

  function buildCSS({ textColor, backgroundColor }) {
    return `${SELECTORS.join(",\n")} {
  color: ${textColor} !important;
  background-color: ${backgroundColor} !important;
}`;
  }

  function applyStyles(settings) {
    let styleEl = document.getElementById(STYLE_ID);
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = STYLE_ID;
      (document.head || document.documentElement).appendChild(styleEl);
    }
    styleEl.textContent = buildCSS(settings);
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
