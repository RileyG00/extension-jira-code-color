(function () {
  const STYLE_ID = "jira-code-color-style";
  const DEFAULTS = {
    textColor: "#ffc896",
    backgroundColor: "#433831"
  };

  const SELECTORS = [
    'span.code',
    'code[data-renderer-mark="true"]',
    'span.date-node'
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
    chrome.storage.sync.get(DEFAULTS, (settings) => {
      applyStyles(settings);
    });
  }

  loadAndApply();

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync") {
      loadAndApply();
    }
  });
})();
